import {
  Search,
  ArrowUpDown,
  X,
  Layers,
  CheckCircle2,
  PlusCircle,
  RotateCcw
} from 'lucide-react';
import IdeaCard from './IdeaCard';

const VALID_DOMAINS = [
  'All',
  'Smart Campus & IoT',
  'Sustainability & Green Campus',
  'Academic & EdTech',
  'Healthcare & Well-being',
  'Campus Safety & Security',
  'Fintech & Student Economy',
  'AI & Automation',
  'Community & Social Impact',
  'Other'
];

const VALID_STATUSES = ['All', 'Review', 'Approved', 'Prototype', 'Implemented'];

const sameId = (a, b) => String(a || '') === String(b || '');

const ExploreView = ({
  ideas,
  searchQuery,
  searchInput,
  setSearchInput,
  onSearchSubmit,
  domainFilter,
  setDomainFilter,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  onSelectIdea,
  onEditIdea,
  onDeleteIdea,
  onVote,
  onOpenSubmitModal,
  onResetFilters,
  currentUserId,
  currentUser
}) => {
  const safeIdeas = Array.isArray(ideas) ? ideas : [];
  const isOwnIdea = (idea) => currentUserId && (
    sameId(idea.author?.userId, currentUserId) ||
    (currentUser?.username && idea.author?.username === currentUser.username) ||
    (currentUser?.email && idea.author?.email === currentUser.email)
  );
  const myIdeas = currentUserId
    ? safeIdeas.filter(isOwnIdea)
    : [];
  const otherIdeas = currentUserId
    ? safeIdeas.filter((idea) => !isOwnIdea(idea))
    : safeIdeas;

  const hasActiveFilters =
    searchQuery ||
    domainFilter !== 'All' ||
    statusFilter !== 'All' ||
    sortBy !== 'newest';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search & Filter Controls Panel */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Search Bar & Sort Dropdown */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input (Searches Title, Problem statement, Technology) */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSearchSubmit(searchInput);
              }}
              placeholder="Type and press Enter to search..."
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchInput('');
                  onSearchSubmit('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown: Newest, Oldest, Votes */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-teal-500" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="newest" className="dark:bg-slate-900">✨ Newest First</option>
                <option value="oldest" className="dark:bg-slate-900">⏳ Oldest First</option>
                <option value="votes" className="dark:bg-slate-900">🔥 Most Votes</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 px-3 py-2 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-900 transition"
                title="Reset filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Badges: Domain & Status */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Status Filter Pills: Review -> Approved -> Prototype -> Implemented */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" /> Status:
            </span>
            {VALID_STATUSES.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
                  statusFilter === st
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Domain Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Layers className="w-3.5 h-3.5 text-blue-500" /> Domain:
            </span>
            {VALID_DOMAINS.map((dom) => (
              <button
                key={dom}
                onClick={() => setDomainFilter(dom)}
                className={`px-3.5 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
                  domainFilter === dom
                    ? 'bg-gradient-to-r from-teal-700 to-blue-700 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-700'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Output Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <strong className="text-slate-800 dark:text-slate-200">{safeIdeas.length}</strong> innovation cards
        </span>
        {hasActiveFilters && (
          <span className="text-teal-600 dark:text-teal-400 font-bold">
            (Filtered results)
          </span>
        )}
      </div>

      {/* Owner Projects Section */}
      {currentUserId && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
              MY IDEA
            </h3>
            <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold">
              Editable by you only
            </span>
          </div>

          {myIdeas.length === 0 ? (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm px-4 py-6 text-sm text-slate-500 dark:text-slate-400">
              You have not submitted any projects yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myIdeas.map((idea) => (
                <IdeaCard
                  key={idea._id}
                  idea={idea}
                  onSelect={onSelectIdea}
                  onEdit={onEditIdea}
                  onDelete={onDeleteIdea}
                  onVote={onVote}
                  currentUserId={currentUserId}
                  currentUser={currentUser}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Output Cards Display Grid */}
      {safeIdeas.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 text-teal-600 flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              No matching innovation cards found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Try adjusting your keywords or clearing filters. You can also propose a new idea!
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onResetFilters}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Reset Filters
            </button>
            <button
              onClick={onOpenSubmitModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Propose Idea</span>
            </button>
          </div>
        </div>
      ) : otherIdeas.length === 0 && myIdeas.length > 0 ? (
        <div className="text-center py-10 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            No other projects match the current filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentUserId && (
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider px-1">
              OTHER IDEAS
            </h3>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherIdeas.map((idea) => (
              <IdeaCard
                key={idea._id}
                idea={idea}
                onSelect={onSelectIdea}
                onEdit={onEditIdea}
                onDelete={onDeleteIdea}
                onVote={onVote}
                currentUserId={currentUserId}
                currentUser={currentUser}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreView;
