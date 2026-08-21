import {
  Lightbulb,
  Compass,
  BarChart3,
  GitBranch,
  PlusCircle,
  Sparkles,
  LogIn,
  LogOut
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = ({
  activeTab,
  setActiveTab,
  onOpenSubmitModal,
  onOpenAuthModal,
  onSeedData,
  isSeeding
}) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Linear Gradient Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-blue-500 flex items-center justify-center shadow-md shadow-emerald-500/15 text-white font-bold">
              <Lightbulb className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 bg-clip-text text-transparent">
                  CampusInno Hub
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider">
                  MERN
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none hidden sm:block">
                Campus Innovation & Problem Solving Network
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'explore'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Innovations Grid</span>
            </button>

            <button
              onClick={() => setActiveTab('workflow')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'workflow'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Workflow Pipeline</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Quick Demo Seed */}
            <button
              onClick={onSeedData}
              disabled={isSeeding}
              title="Reset sample innovation ideas"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 transition shadow-2xs disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 text-emerald-500 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>{isSeeding ? 'Seeding...' : 'Seed Data'}</span>
            </button>

            {/* User Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {user?.name}
                    </p>
                    <p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium leading-none">
                      {user?.role || 'Student'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50/70 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 text-xs font-bold transition"
              >
                <LogIn className="w-3.5 h-3.5 text-teal-600" />
                <span>Sign In</span>
              </button>
            )}

            {/* Propose Idea CTA Button */}
            <button
              onClick={onOpenSubmitModal}
              className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white shadow-md shadow-teal-500/15 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Propose Idea</span>
              <span className="sm:hidden">Propose</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg ${
              activeTab === 'explore'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600'
                : 'text-slate-600'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Innovations</span>
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg ${
              activeTab === 'workflow'
                ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-600'
                : 'text-slate-600'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>Workflow</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg ${
              activeTab === 'analytics'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600'
                : 'text-slate-600'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
