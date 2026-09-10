import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Mail,
  User,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
  Fingerprint
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { ResilientAppIcon } from '../common/ResilientAppIcon';

interface AuthPortalProps {
  onSuccess?: () => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ onSuccess }) => {
  const {
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    allUserAccounts,
  } = useERP();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Executive Leadership');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('comfort.designszw@gmail.com');
  const [googleName, setGoogleName] = useState('Comfort (Administrator)');

  const isFirstUser = allUserAccounts.length === 0 || !allUserAccounts.some(a => a.role === 'ADMIN');

  useEffect(() => {
    // If no accounts registered yet, default to register view or prefill helpful admin email
    if (isFirstUser) {
      if (!email) setEmail('comfort.designszw@gmail.com');
      if (!name) setName('Comfort');
    }
  }, [isFirstUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!name.trim()) {
          setError('Please provide your full name.');
          setLoading(false);
          return;
        }
        if (!email.trim() || !email.includes('@')) {
          setError('Please enter a valid email address.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }

        const res = await registerWithEmail(name, email, password, department);
        if (!res.success) {
          setError(res.error || 'Failed to create account.');
        } else {
          if (onSuccess) onSuccess();
        }
      } else {
        if (!email.trim() || !password) {
          setError('Please provide both email and password.');
          setLoading(false);
          return;
        }

        const res = await loginWithEmail(email, password);
        if (!res.success) {
          setError(res.error || 'Failed to sign in.');
        } else {
          if (onSuccess) onSuccess();
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (userEmail: string, userName: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await loginWithGoogle({
        email: userEmail,
        name: userName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`
      });
      if (!res.success) {
        setError(res.error || 'Google authentication failed.');
      } else {
        setGoogleModalOpen(false);
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Google authentication encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden" id="auth-portal-root">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-neutral-900/90 backdrop-blur-xl border border-neutral-800/80 rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-3 relative">
            <ResilientAppIcon size={64} className="rounded-2xl shadow-lg border border-blue-500/20" />
            <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full shadow-md">
              <Shield className="w-3.5 h-3.5" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">BizFlow Enterprise ERP</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Offline-First Biometric &amp; Enterprise Resource Operations
          </p>
        </div>

        {/* First User Notice Banner */}
        {isFirstUser && (
          <div className="mb-5 bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200">
              <span className="font-semibold text-amber-300">Initial System Setup: </span>
              The first account to sign in or register will automatically be elevated to{' '}
              <span className="font-semibold text-white">Super Administrator</span> with master system authority.
            </div>
          </div>
        )}

        {/* Auth Mode Toggle */}
        <div className="flex bg-neutral-950/80 p-1 rounded-xl border border-neutral-800 mb-6">
          <button
            type="button"
            id="tab-auth-login"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            id="tab-auth-register"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Google One-Click Button */}
        <button
          type="button"
          id="btn-google-auth"
          onClick={() => setGoogleModalOpen(true)}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-sm mb-4 disabled:opacity-50"
        >
          {/* Official Google Vector Logo */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google Account
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-neutral-800" />
          <span className="px-3 text-[11px] uppercase tracking-wider text-neutral-500 font-medium">
            or with email
          </span>
          <div className="flex-1 border-t border-neutral-800" />
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-500/50 rounded-xl flex items-start gap-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  id="auth-name-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Comfort D."
                  required
                  className="w-full bg-neutral-950/80 border border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm placeholder-neutral-600 outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                id="auth-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full bg-neutral-950/80 border border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm placeholder-neutral-600 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-neutral-300">
                Password
              </label>
              {mode === 'login' && (
                <span className="text-[11px] text-neutral-500 hover:text-blue-400 cursor-pointer">
                  Forgot password?
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="auth-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-neutral-950/80 border border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-xl pl-9 pr-10 py-2 text-xs sm:text-sm placeholder-neutral-600 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Primary Department
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <select
                  id="auth-dept-select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-neutral-950/80 border border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm outline-none transition-colors"
                >
                  <option value="Executive Leadership">Executive Leadership</option>
                  <option value="Engineering">Engineering (Mechanical, Electrical, Automation)</option>
                  <option value="IT Systems">IT Systems &amp; Infrastructure</option>
                  <option value="Finance & Accounts">Finance &amp; Accounts</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Procurement & Fleet">Procurement &amp; Fleet Operations</option>
                  <option value="Sales & Business Dev">Sales &amp; Business Development</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            id="btn-auth-submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : mode === 'register' ? (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Sign In to ERP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Security Badge */}
        <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
          <div className="flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Token Gateway</span>
          </div>
          <div className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-blue-400" />
            <span>Offline Synced DEXIE</span>
          </div>
        </div>
      </div>

      {/* Google Account Selector Dialog */}
      {googleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white rounded-xl shadow-md">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Sign in with Google</h3>
                <p className="text-xs text-neutral-400">Select or confirm your Google Account</p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs text-neutral-300 block mb-1 font-medium">Google Account Email</label>
                <input
                  type="email"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-xs focus:border-blue-500 outline-none"
                  placeholder="name@gmail.com"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-300 block mb-1 font-medium">Display Name</label>
                <input
                  type="text"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-3 py-2 text-xs focus:border-blue-500 outline-none"
                  placeholder="Comfort"
                />
              </div>

              {isFirstUser && (
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-[11px] text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  <span>Will be registered as <strong>Primary Super Administrator</strong>.</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGoogleModalOpen(false)}
                className="flex-1 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-google-auth"
                onClick={() => handleGoogleSignIn(googleEmail, googleName)}
                disabled={loading}
                className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
