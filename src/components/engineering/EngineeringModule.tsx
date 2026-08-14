import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Cpu,
  Server,
  GitBranch,
  GitCommit,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Code2,
  Terminal,
  Activity,
  Layers,
  Database,
  Shield,
  Zap,
  RefreshCw,
  Workflow
} from 'lucide-react';
import { Microservice, DeployPipeline } from '../../types/erp';

export const EngineeringModule: React.FC = () => {
  const {
    microservices,
    deployPipelines,
    currentUser,
    settings
  } = useERP();

  const [activeTab, setActiveTab] = useState<'services' | 'pipelines' | 'architecture'>('services');
  const [selectedService, setSelectedService] = useState<Microservice | null>(null);

  const avgUptime = (microservices.reduce((s, m) => s + m.uptimePercent, 0) / (microservices.length || 1)).toFixed(2);
  const avgLatency = Math.round(microservices.reduce((s, m) => s + m.latencyMs, 0) / (microservices.length || 1));

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto" id="engineering-module-root">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Technical Infrastructure & Systems
            </span>
            <span className="text-xs text-neutral-400 font-mono">Sprint 34 Live</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Engineering & Infrastructure</h1>
          <p className="text-sm text-neutral-400">Microservice mesh monitoring, CI/CD automated deployment pipelines, and architectural stack health</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-300 font-mono">Cluster Ingress: OK</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Active Microservices</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              {microservices.length} Nodes
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">100% Operational</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Mesh Uptime SLA</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              {avgUptime}%
            </div>
            <span className="text-[10px] text-neutral-400 font-medium">30-day rolling average</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Avg API Latency (p95)</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              {avgLatency} ms
            </div>
            <span className="text-[10px] text-amber-400 font-medium">Within SLA target (&lt;150ms)</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">CI/CD Deployments</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              {deployPipelines.length} Runs
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">All pipelines passing</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'services'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Microservices & Clusters</span>
        </button>
        <button
          onClick={() => setActiveTab('pipelines')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'pipelines'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>CI/CD Deploy Pipeline</span>
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'architecture'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Architecture & Stack</span>
        </button>
      </div>

      {/* TAB 1: MICROSERVICES */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {microservices.map((svc) => (
            <div
              key={svc.id}
              className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-4 hover:border-cyan-500/40 transition-all cursor-pointer"
              onClick={() => setSelectedService(svc)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">{svc.code}</span>
                    <span className="text-[10px] font-mono text-neutral-400">({svc.version})</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{svc.name}</h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">{svc.repository}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {svc.status}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 text-center font-mono">
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase">Uptime</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">{svc.uptimePercent}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase">Latency</div>
                  <div className="text-xs font-bold text-white mt-0.5">{svc.latencyMs} ms</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase">Lead Eng</div>
                  <div className="text-xs font-bold text-cyan-300 mt-0.5 truncate">{(svc.leadEngineer || 'Lead').split(' ')[0]}</div>
                </div>
              </div>

              {/* Tech stack badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {svc.techStack.map((tech, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: CI/CD PIPELINES */}
      {activeTab === 'pipelines' && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider font-mono text-[11px] border-b border-neutral-800">
                <tr>
                  <th className="p-4">Target Service</th>
                  <th className="p-4">Branch & Commit</th>
                  <th className="p-4">Commit Message</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {deployPipelines.map((pipe) => (
                  <tr key={pipe.id} className="hover:bg-neutral-900/80 transition-colors">
                    <td className="p-4 font-bold text-white">
                      {pipe.serviceName}
                    </td>
                    <td className="p-4 font-mono">
                      <div className="flex items-center gap-1.5 text-cyan-400">
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>{pipe.branch}</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                        <GitCommit className="w-3 h-3" /> {pipe.commitHash}
                      </div>
                    </td>
                    <td className="p-4 text-neutral-300 font-mono text-[11px] max-w-xs truncate">
                      {pipe.commitMessage}
                    </td>
                    <td className="p-4 text-neutral-300">
                      {pipe.author}
                    </td>
                    <td className="p-4 font-mono text-neutral-400">
                      {pipe.durationSeconds}s
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> {pipe.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ARCHITECTURE & TECH STACK */}
      {activeTab === 'architecture' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Core Enterprise Infrastructure Architecture
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              BizFlow ERP runs on a distributed microservice topology featuring low-latency Go ingress gates, event-driven Node.js background workers, and real-time biometric cryptographic authentication.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                  <Shield className="w-4 h-4" /> Ingress & Cryptography
                </div>
                <p className="text-[11px] text-neutral-400">
                  SHA-256 rotating QR badge authentication with Redis session caching and 60-second salt expiration.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Database className="w-4 h-4" /> Persistent Storage & State
                </div>
                <p className="text-[11px] text-neutral-400">
                  Transactional SQL ledger for payroll and multi-currency billing, with vector database embeddings for ATS candidate scoring.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                  <Cpu className="w-4 h-4" /> Gemini 3.7 AI Copilot
                </div>
                <p className="text-[11px] text-neutral-400">
                  Real-time telemetry inference engine providing cross-departmental velocity synthesis and executive operational forecasting.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL / DRAWER FOR SELECTED SERVICE */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold">{selectedService.code}</span>
                <h3 className="text-lg font-bold text-white">{selectedService.name}</h3>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1 font-mono">
                <div className="text-neutral-400">Repository URL:</div>
                <div className="text-cyan-300 font-bold">{selectedService.repository}</div>
                <div className="text-neutral-500 text-[10px]">Last deployed: {selectedService.lastDeployed}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-neutral-300 pt-2">
                <div>Lead Engineer: <strong className="text-white">{selectedService.leadEngineer}</strong></div>
                <div>Runtime Version: <strong className="text-white">{selectedService.version}</strong></div>
                <div>Availability SLA: <strong className="text-emerald-400">{selectedService.uptimePercent}%</strong></div>
                <div>p95 Latency: <strong className="text-white">{selectedService.latencyMs} ms</strong></div>
              </div>

              <div className="pt-2">
                <span className="text-neutral-400 block mb-1">Tech Stack Components:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedService.techStack.map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-200 font-mono text-[10px]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-200 hover:bg-neutral-700 text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
