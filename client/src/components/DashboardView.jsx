import {
  Lightbulb,
  CheckCircle2,
  Clock,
  ThumbsUp,
  Sparkles,
  Layers,
  ArrowRight,
  Flame,
  PlusCircle
} from 'lucide-react';

const DashboardView = ({
  stats,
  ideas,
  onFilterStatus,
  onFilterCategory,
  onOpenSubmitModal,
  onSelectIdea,
  onVote
}) => {
  const statusBreakdown = stats?.statusBreakdown || {
    submitted: 0,
    underReview: 0,
    approved: 0,
    inProgress: 0,
    completed: 0,
    rejected: 0
  };

  const activeApprovedCount = (statusBreakdown.approved || 0) + (statusBreakdown.inProgress || 0);
  const totalCount = stats?.total || ideas.length || 0;
  const totalVotes = stats?.totalVotes || ideas.reduce((acc, curr) => acc + (curr.votes || 0), 0);

  // Top 3 trending ideas by votes
  const trendingIdeas = [...ideas]
    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
    .slice(0, 3);

  // Categories list & counts
  const categories = [
    { name: 'Sustainability & Green Campus', color: 'emerald', bg: 'bg-emerald-500' },
    { name: 'Smart Campus & IoT', color: 'blue', bg: 'bg-blue-500' },
    { name: 'Academic & Learning Hub', color: 'violet', bg: 'bg-violet-500' },
    { name: 'Healthcare & Well-being', color: 'rose', bg: 'bg-rose-500' },
    { name: 'Community & Social Impact', color: 'amber', bg: 'bg-amber-500' },
    { name: 'Campus Safety & Security', color: 'sky', bg: 'bg-sky-500' },
    { name: 'Fintech & Campus Economy', color: 'indigo', bg: 'bg-indigo-500' },
    { name: 'Other', color: 'slate', bg: 'bg-slate-500' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white p-6 sm:p-10 shadow-xl border border-indigo-700/50">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Campus Innovation & Problem Solver Ecosystem</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Empowering Students to Solve Real Campus & Community Challenges
          </h1>

          <p className="text-sm sm:text-base text-indigo-100/90 max-w-2xl leading-relaxed">
            Submit your innovative ideas, collaborate with peers and faculty mentors, upvote groundbreaking proposals, and track implementation from concept to reality.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenSubmitModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow-md hover:bg-indigo-50 active:scale-95 transition"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              <span>Submit New Idea</span>
            </button>
            <button
              onClick={() => onFilterStatus('All')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition"
            >
              <span>Explore All Innovations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Ideas */}
        <div
          onClick={() => onFilterStatus('All')}
          className="group cursor-pointer p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Proposals
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Lightbulb className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {totalCount}
            </span>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Campus Ideas
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Addressing local & campus challenges
          </p>
        </div>

        {/* Approved & Active */}
        <div
          onClick={() => onFilterStatus('Approved')}
          className="group cursor-pointer p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Approved & Active
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {activeApprovedCount}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {totalCount > 0 ? `${Math.round((activeApprovedCount / totalCount) * 100)}%` : '0%'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {statusBreakdown.approved} Approved · {statusBreakdown.inProgress} In Progress
          </p>
        </div>

        {/* Under Review */}
        <div
          onClick={() => onFilterStatus('Under Review')}
          className="group cursor-pointer p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Under Review
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {(statusBreakdown.submitted || 0) + (statusBreakdown.underReview || 0)}
            </span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Pending
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Faculty & mentor evaluation pipeline
          </p>
        </div>

        {/* Total Community Votes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Community Votes
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ThumbsUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {totalVotes}
            </span>
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
              <Flame className="w-3.5 h-3.5" /> High Engagement
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Student & faculty endorsements
          </p>
        </div>
      </div>

      {/* Main Grid: Trending Innovations + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Trending / Spotlight Innovations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                <Flame className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Trending Innovations on Campus
              </h2>
            </div>
            <button
              onClick={() => onFilterStatus('All')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {trendingIdeas.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
                No ideas found yet. Click Submit Idea to get started!
              </div>
            ) : (
              trendingIdeas.map((idea) => (
                <div
                  key={idea._id}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                        {idea.category}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        idea.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        idea.status === 'In Progress' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' :
                        idea.status === 'Completed' ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' :
                        idea.status === 'Under Review' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {idea.status}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectIdea(idea)}
                      className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer truncate"
                    >
                      {idea.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {idea.description}
                    </p>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>By <strong className="text-slate-700 dark:text-slate-200">{idea.studentName}</strong> ({idea.regNo})</span>
                      <span>•</span>
                      <span>Scope: {idea.communityScope}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => onVote(idea._id, 'upvote')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/80 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition active:scale-95 border border-slate-200 dark:border-slate-700"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{idea.votes || 0}</span>
                    </button>

                    <button
                      onClick={() => onSelectIdea(idea)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition"
                    >
                      View & Discuss
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Innovation Categories & Impact Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Category Distribution
            </h2>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            {categories.map((cat) => {
              const count = stats?.categoryCounts?.[cat.name] || ideas.filter(i => i.category === cat.name).length;
              const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

              return (
                <div
                  key={cat.name}
                  onClick={() => onFilterCategory(cat.name)}
                  className="space-y-1.5 cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate max-w-[200px]">
                      {cat.name}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {count} <span className="text-[10px] text-slate-400 font-normal">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full ${cat.bg} transition-all duration-500 rounded-full`}
                      style={{ width: `${Math.max(percentage, count > 0 ? 5 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
