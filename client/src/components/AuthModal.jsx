import { useState } from 'react';
import { X, Lock, Mail, User, Building, LogIn, UserPlus, Sparkles, AtSign } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    department: 'Computer Science & Engineering'
  });
  const [loginIdentifier, setLoginIdentifier] = useState('adi'); // Default pre-filled with 'adi'
  const [loginPassword, setLoginPassword] = useState('000');     // Default pre-filled with '000'
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isRegister) {
        if (!formData.name.trim() || formData.name.length < 2) {
          setError('Name must be at least 2 characters');
          setIsSubmitting(false);
          return;
        }
        if (!formData.username.trim() || formData.username.length < 2) {
          setError('Username must be at least 2 characters (letters, numbers, underscores)');
          setIsSubmitting(false);
          return;
        }
        if (formData.password.length < 3) {
          setError('Password must be at least 3 characters');
          setIsSubmitting(false);
          return;
        }
        await register(formData);
      } else {
        await login(loginIdentifier.trim(), loginPassword);
      }
      if (onAuthSuccess) onAuthSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
        {/* Header with Green-Blue Linear Gradient */}
        <div className="p-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Innovation Network</span>
          </div>

          <h2 className="text-xl font-black tracking-tight">
            {isRegister ? 'Register Innovator Account' : 'Welcome to Campus Hub'}
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1">
            {isRegister
              ? 'Create a unique username to submit & manage campus projects'
              : 'Sign in using your Username or Email address'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              setIsRegister(false);
              setError('');
            }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition ${
              !isRegister
                ? 'border-teal-500 text-teal-600 dark:text-teal-400 bg-teal-50/30 dark:bg-teal-950/20'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Sign In (Username / Email)
          </button>
          <button
            onClick={() => {
              setIsRegister(true);
              setError('');
            }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition ${
              isRegister
                ? 'border-teal-500 text-teal-600 dark:text-teal-400 bg-teal-50/30 dark:bg-teal-950/20'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Register New Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 font-semibold">
              {error}
            </div>
          )}

          {isRegister ? (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-teal-500" /> Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <AtSign className="w-3.5 h-3.5 text-teal-500" /> Unique Username *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. adi"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-teal-500" /> Unique Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. adi@campus.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-teal-500" /> Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-teal-500" /> Department
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science & AI"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </>
          ) : (
            <>
              {/* Login Form: Supports either username or email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <AtSign className="w-3.5 h-3.5 text-teal-500" /> Username or Email Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="Username (e.g. adi) or Email (adi@campus.edu)"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-teal-500" /> Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter password (e.g. 000)"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-500/15 active:scale-95 transition flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2"
          >
            {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>{isSubmitting ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}</span>
          </button>

          {!isRegister && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/30 dark:to-teal-950/30 border border-teal-200/70 dark:border-teal-800/60 text-[11px] space-y-1">
              <p className="font-bold text-teal-700 dark:text-teal-200">Demo Account with 2 Projects:</p>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Username: <code className="font-bold text-teal-600 dark:text-teal-300">adi</code></span>
                <span>Password: <code className="font-bold text-teal-600 dark:text-teal-300">000</code></span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
