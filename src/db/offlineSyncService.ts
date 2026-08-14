import { db } from './erpDexieDb';
import {
  INITIAL_PERSONAS,
  INITIAL_EMPLOYEES,
  INITIAL_ACCESS_LOGS,
  INITIAL_ATTENDANCE_ROLLUPS,
  INITIAL_PAYROLL_RUNS,
  INITIAL_JOB_OPENINGS,
  INITIAL_APPLICANTS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_ASSETS,
  INITIAL_EXPENSES,
  INITIAL_INVOICES,
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTINGS,
  INITIAL_VENDORS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_MICROSERVICES,
  INITIAL_DEPLOY_PIPELINES,
  INITIAL_CLIENT_ACCOUNTS,
  INITIAL_DEALS,
  INITIAL_NOTES
} from '../data/initialData';

const LOCAL_STORAGE_PREFIX = 'bizflow_erp_';

// Helper to read localStorage fallback
export function getLocalSandbox<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn(`[LocalSandbox] Failed to read ${key} from localStorage:`, e);
    return fallback;
  }
}

// Helper to write localStorage
export function setLocalSandbox<T>(key: string, data: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn(`[LocalSandbox] Failed to write ${key} to localStorage:`, e);
  }
}

/**
 * Loads a collection using offline-first priority:
 * 1. Dexie IndexedDB (browser sandbox store)
 * 2. LocalStorage sandbox
 * 3. Online database endpoint /api/db/:collection (if empty locally and online)
 * 4. Built-in initial enterprise data as pristine baseline
 */
export async function loadCollectionOfflineFirst<T extends { id: string }>(
  collectionName: string,
  dexieTable: any,
  fallbackData: T[]
): Promise<T[]> {
  try {
    // Step 1: Read Dexie IndexedDB
    const count = await dexieTable.count();
    if (count > 0) {
      const records = await dexieTable.toArray();
      // Keep localStorage synchronized as secondary mirror
      setLocalSandbox(collectionName, records);
      return records;
    }

    // Step 2: Check LocalStorage sandbox
    const localStore = getLocalSandbox<T[] | null>(collectionName, null);
    if (localStore && Array.isArray(localStore) && localStore.length > 0) {
      // Hydrate into Dexie IndexedDB
      await dexieTable.bulkPut(localStore);
      return localStore;
    }

    // Step 3: If not in local storage and online, query online database
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      try {
        const response = await fetch(`/api/db/${collectionName}`, {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(3000)
        });
        if (response.ok) {
          const result = await response.json();
          if (Array.isArray(result.data) && result.data.length > 0) {
            await dexieTable.bulkPut(result.data);
            setLocalSandbox(collectionName, result.data);
            return result.data;
          }
        }
      } catch {
        // Fall through to initial fallback
      }
    }

    // Step 4: Baseline seeding into Dexie and LocalStorage
    if (fallbackData && fallbackData.length > 0) {
      await dexieTable.bulkPut(fallbackData);
      setLocalSandbox(collectionName, fallbackData);
    }
    return fallbackData;
  } catch (err) {
    console.warn(`[OfflineSync] Error reading ${collectionName} from Dexie:`, err);
    const localFallback = getLocalSandbox<T[]>(collectionName, fallbackData);
    return localFallback;
  }
}

/**
 * Persists an item or collection to Dexie IndexedDB, LocalStorage, and queues background sync
 */
export async function persistCollectionToStorage<T extends { id: string }>(
  collectionName: string,
  dexieTable: any,
  data: T[]
): Promise<void> {
  try {
    // 1. Write to localStorage immediately
    setLocalSandbox(collectionName, data);

    // 2. Write to Dexie IndexedDB
    await dexieTable.clear();
    if (data.length > 0) {
      await dexieTable.bulkPut(data);
    }

    // 3. Mark sync meta
    await db.syncMeta.put({
      key: collectionName,
      lastSyncedAt: new Date().toISOString(),
      version: 1,
      isDirty: true
    });

    // 4. If online, sync in background non-blockingly
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      syncCollectionToRemote(collectionName, data).catch(() => {
        // Ignored for offline tolerance
      });
    }
  } catch (err) {
    console.warn(`[OfflineSync] Persist error for ${collectionName}:`, err);
  }
}

/**
 * Syncs collection data to backend database if online
 */
export async function syncCollectionToRemote<T>(collectionName: string, data: T[]): Promise<boolean> {
  try {
    const res = await fetch('/api/db/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collection: collectionName, data })
    });
    if (res.ok) {
      await db.syncMeta.put({
        key: collectionName,
        lastSyncedAt: new Date().toISOString(),
        version: 1,
        isDirty: false
      });
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Full sync trigger: Synchronizes all collections with remote or pulls any missing remote data
 */
export async function performFullSync(): Promise<{ success: boolean; syncedCount: number; timestamp: string }> {
  try {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return { success: false, syncedCount: 0, timestamp: new Date().toISOString() };
    }

    const payload = {
      employees: await db.employees.toArray(),
      accessLogs: await db.accessLogs.toArray(),
      attendanceRollups: await db.attendanceRollups.toArray(),
      payrollRuns: await db.payrollRuns.toArray(),
      jobOpenings: await db.jobOpenings.toArray(),
      applicants: await db.applicants.toArray(),
      projects: await db.projects.toArray(),
      tasks: await db.tasks.toArray(),
      assets: await db.assets.toArray(),
      expenses: await db.expenses.toArray(),
      invoices: await db.invoices.toArray(),
      auditLogs: await db.auditLogs.toArray(),
      vendors: await db.vendors.toArray(),
      purchaseOrders: await db.purchaseOrders.toArray(),
      microservices: await db.microservices.toArray(),
      deployPipelines: await db.deployPipelines.toArray(),
      deals: await db.deals.toArray(),
      clientAccounts: await db.clientAccounts.toArray(),
      notes: await db.notes.toArray()
    };

    const res = await fetch('/api/db/sync-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const now = new Date().toISOString();
      return { success: true, syncedCount: Object.keys(payload).length, timestamp: now };
    }
    return { success: false, syncedCount: 0, timestamp: new Date().toISOString() };
  } catch (e) {
    return { success: false, syncedCount: 0, timestamp: new Date().toISOString() };
  }
}
