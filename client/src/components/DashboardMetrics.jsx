import {
  Lightbulb,
  CheckCircle2,
  Clock,
  ThumbsUp,
  Cpu,
  Rocket,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  PlusCircle
} from 'lucide-react';

const DashboardMetrics = ({
  stats,
  ideas,
  onFilterStatus,
  onFilterDomain,
  onOpenSubmitModal
}) => {
  const safeIdeas = Array.isArray(ideas) ? ideas : [];
  const safeStats = stats && typeof stats === 'object' && !Array.isArray(stats) ? stats : null;

  const statusWorkflow = stats?.statusWorkflow || {
    review: 0,
    approved: 0,
    prototype: 0,
    implemented: 0
  };

  const totalIdeas = safeStats?.total || safeIdeas.length || 0;
  const totalVotes = safeStats?.totalVotes || safeIdeas.reduce((acc, curr) => acc + (curr.votes || 0), 0);

  const domains = [
    { name: 'Smart Campus & IoT', color: 'bg-cyan-500' },
    { name: 'Sustainability & Green Campus', color: 'bg-emerald-500' },
    { name: 'Academic & EdTech', color: 'bg-teal-500' },
    { name: 'Healthcare & Well-being', color: 'bg-emerald-600' },
    { name: 'Campus Safety & Security', color: 'bg-blue-600' },
    { name: 'Fintech & Student Economy', color: 'bg-teal-600' },
    { name: 'AI & Automation', color: 'bg-cyan-600' },
    { name: 'Community & Social Impact', color: 'bg-emerald-400' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner with Green & Blue Linear and Circular Radial Gradients */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-blue-950 text-white p-6 sm:p-10 shadow-xl border border-teal-700/40">
        {/* Circular / Radial Gradient Orbs */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-radial-gradient from-emerald-400/25 via-teal-500/15 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-16 w-96 h-96 rounded-full bg-radial-gradient from-cyan-400/20 via-blue-500/15 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>Campus Innovation & Problem Solver Ecosystem</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Innovate, Prototype & Implement Solutions for Campus & Community
          </h1>

          <p className="text-sm sm:text-base text-teal-100/90 max-w-2xl leading-relaxed">
            A collaborative platform where student problem statements transform into approved prototypes and deployed community initiatives.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenSubmitModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-md active:scale-95 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Propose an Idea</span>
            </button>

            <button
              onClick={() => onFilterStatus('All')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md border border-white/20 transition"
            >
              <span>Explore All Cards</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Ideas */}
        <div
          onClick={() => onFilterStatus('All')}
          className="group cursor-pointer relative p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-emerald-300 dark:hover:border-teal-700 transition-all overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Proposals
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Lightbulb className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {totalIdeas}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-teal-400">
              Innovations
            </span>
          </div>
        </div>

        {/* Prototype & Implemented */}
        <div
          onClick={() => onFilterStatus('Prototype')}
          className="group cursor-pointer relative p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-cyan-300 dark:hover:border-cyan-700 transition-all overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              In Prototype
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {statusWorkflow.prototype}
            </span>
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
              Active Builds
            </span>
          </div>
        </div>

        {/* Implemented */}
        <div
          onClick={() => onFilterStatus('Implemented')}
          className="group cursor-pointer relative p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-700 transition-all overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Implemented
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Rocket className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {statusWorkflow.implemented}
            </span>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
              Deployed
            </span>
          </div>
        </div>

        {/* Total Votes */}
        <div className="relative p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Community Votes
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <ThumbsUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {totalVotes}
            </span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              Endorsements
            </span>
          </div>
        </div>
      </div>

      {/* Workflow Progression Pipeline Stage Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Innovation Workflow Pipeline Stages
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onFilterStatus('Review')}
            className="cursor-pointer p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 hover:border-amber-400 transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300">1. Review</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {statusWorkflow.review}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Initial faculty & peer assessment
            </p>
          </div>

          <div
            onClick={() => onFilterStatus('Approved')}
            className="cursor-pointer p-4 rounded-2xl bg-teal-500/10 border border-teal-400/30 hover:border-teal-400 transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-300">2. Approved</span>
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {statusWorkflow.approved}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Accepted for campus development
            </p>
          </div>

          <div
            onClick={() => onFilterStatus('Prototype')}
            className="cursor-pointer p-4 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 hover:border-cyan-400 transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300">3. Prototype</span>
              <Cpu className="w-4 h-4 text-cyan-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {statusWorkflow.prototype}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Hardware/Software build phase
            </p>
          </div>

          <div
            onClick={() => onFilterStatus('Implemented')}
            className="cursor-pointer p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 hover:border-emerald-400 transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">4. Implemented</span>
              <Rocket className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {statusWorkflow.implemented}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Live in campus / community
            </p>
          </div>
        </div>
      </div>

      {/* Domain Distribution Breakdown */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Domain Distribution
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {domains.map((dom) => {
            const count = safeStats?.domainCounts?.[dom.name] || safeIdeas.filter((i) => i.domain === dom.name).length;
            const percentage = totalIdeas > 0 ? Math.round((count / totalIdeas) * 100) : 0;

            return (
              <div
                key={dom.name}
                onClick={() => onFilterDomain(dom.name)}
                className="cursor-pointer group space-y-1.5 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300 group-hover:text-teal-600 transition truncate max-w-[220px]">
                    {dom.name}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {count} <span className="text-[10px] text-slate-400 font-normal">({percentage}%)</span>
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full ${dom.color} transition-all duration-500 rounded-full`}
                    style={{ width: `${Math.max(percentage, count > 0 ? 5 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
