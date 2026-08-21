import {
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Layers,
  Code2,
  AlertCircle,
  Edit3,
  Trash2,
  ArrowRight,
  Check
} from 'lucide-react';
import WorkflowBadge from './WorkflowBadge';

const sameId = (a, b) => String(a || '') === String(b || '');

const IdeaCard = ({
  idea,
  onSelect,
  onEdit,
  onDelete,
  onVote,
  currentUserId,
  currentUser,
  showOwnerActions = false
}) => {
  const isAuthor = showOwnerActions || Boolean(
    currentUserId && (
      sameId(idea.author?.userId, currentUserId) ||
      (currentUser?.username && idea.author?.username === currentUser.username) ||
      (currentUser?.email && idea.author?.email === currentUser.email)
    )
  );

  const domainThemes = {
    'Smart Campus & IoT': 'from-blue-600 to-cyan-500 text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800',
    'Sustainability & Green Campus': 'from-emerald-600 to-teal-500 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
    'Academic & EdTech': 'from-teal-600 to-blue-500 text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-800',
    'Healthcare & Well-being': 'from-teal-500 to-emerald-600 text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-800',
    'Campus Safety & Security': 'from-blue-600 to-indigo-600 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800',
    'Fintech & Student Economy': 'from-emerald-500 to-blue-600 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
    'AI & Automation': 'from-cyan-600 to-blue-600 text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800',
    'Community & Social Impact': 'from-emerald-600 to-teal-600 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
    'Other': 'from-slate-600 to-teal-600 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
  };

  const impactStyles = {
    'Low': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    'Medium': 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    'High': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    'Transformative': 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black shadow-xs'
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:border-emerald-400 dark:hover:border-teal-500 transition-all duration-300 overflow-hidden">
      {/* Decorative Circular Radial Gradients */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-36 h-36 rounded-full bg-radial-gradient from-emerald-400/15 via-teal-500/10 to-transparent blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-36 h-36 rounded-full bg-radial-gradient from-blue-500/15 via-cyan-400/10 to-transparent blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

      <div className="relative z-10 space-y-4">
        {/* Top Meta Badges: Domain & Impact */}
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${domainThemes[idea.domain] || domainThemes['Other']}`}>
            <Layers className="w-3.5 h-3.5" />
            <span className="truncate max-w-[170px]">{idea.domain}</span>
          </span>

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
              impactStyles[idea.expectedImpact] || impactStyles['Medium']
            }`}
          >
            <Sparkles className="w-3 h-3" />
            {idea.expectedImpact} Impact
          </span>
        </div>

        {/* IDEA TITLE */}
        <h3
          onClick={() => onSelect(idea)}
          className="text-lg font-black text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition cursor-pointer line-clamp-2 leading-snug tracking-tight"
        >
          {idea.title}
        </h3>

        {/* Problem Statement Card Section */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-blue-50/70 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-blue-950/20 border border-emerald-100/80 dark:border-emerald-900/40 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-teal-300 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Problem Statement
          </span>
          <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {idea.problemStatement}
          </p>
        </div>

        {/* Description Snippet */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {idea.description}
        </p>

        {/* Technologies Chips */}
        {idea.technologies && idea.technologies.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <Code2 className="w-3 h-3 text-teal-500" />
              <span>Technologies</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {idea.technologies.slice(0, 4).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80"
                >
                  {tech}
                </span>
              ))}
              {idea.technologies.length > 4 && (
                <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400">
                  +{idea.technologies.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Status Workflow Indicator */}
        <div className="pt-2">
          <WorkflowBadge currentStatus={idea.status} />
        </div>

        {/* Submitter info */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
              {idea.author?.name ? idea.author.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
              {idea.author?.name || 'Campus Student'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {new Date(idea.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Card Footer: Vote Button + Action Controls */}
      <div className="relative z-10 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        {/* Voting Button with repeated voting prevention */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVote(idea._id);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 border ${
            idea.hasVoted
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 border-slate-200/80 dark:border-slate-700'
          }`}
          title={idea.hasVoted ? 'You voted for this idea (Click to unvote)' : 'Vote for this idea'}
        >
          {idea.hasVoted ? (
            <Check className="w-3.5 h-3.5 text-white" />
          ) : (
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
          )}
          <span>{idea.votes || 0}</span>
          <span className="text-[10px] opacity-80">{idea.hasVoted ? 'Voted' : 'Vote'}</span>
        </button>

        {/* Discussions & Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSelect(idea)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{idea.comments?.length || 0}</span>
          </button>

          {isAuthor && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(idea);
                }}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/50 transition"
                title="Edit Idea"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(idea._id);
                }}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                title="Delete Idea"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </>
          )}

          <button
            onClick={() => onSelect(idea)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold text-xs shadow-sm active:scale-95 transition"
          >
            <span>View</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
