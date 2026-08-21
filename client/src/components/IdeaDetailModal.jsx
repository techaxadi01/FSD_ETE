import { useState } from 'react';
import {
  X,
  ThumbsUp,
  MessageSquare,
  Send,
  User,
  Calendar,
  Layers,
  Sparkles,
  Code2,
  AlertCircle,
  Edit3,
  Trash2,
  Check,
  ShieldCheck
} from 'lucide-react';
import WorkflowBadge from './WorkflowBadge';

const VALID_STATUSES = ['Review', 'Approved', 'Prototype', 'Implemented'];
const sameId = (a, b) => String(a || '') === String(b || '');

const IdeaDetailModal = ({
  idea,
  onClose,
  onEdit,
  onDelete,
  onVote,
  onAddComment,
  onUpdateStatus,
  currentUser
}) => {
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState(currentUser?.name || '');
  const [authorRole, setAuthorRole] = useState(currentUser?.role || 'Student');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  if (!idea) return null;

  const isAuthor = currentUser && sameId(idea.author?.userId, currentUser.id);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      await onAddComment(idea._id, {
        author: authorName.trim() || 'Student Innovator',
        authorRole,
        comment: commentText.trim()
      });
      setCommentText('');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
        {/* Header with Green-Blue gradient */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 dark:from-emerald-950/30 dark:to-blue-950/30">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              <Layers className="w-3.5 h-3.5" />
              {idea.domain}
            </span>

            <WorkflowBadge currentStatus={idea.status} size="pill" />

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              {idea.expectedImpact} Impact
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* IDEA TITLE */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              {idea.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-teal-500" />
                Submitted by <strong className="text-slate-800 dark:text-slate-200">{idea.author?.name || 'Student Innovator'}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {new Date(idea.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </span>
            </div>
          </div>

          {/* Problem Statement Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-200/60 dark:border-teal-900/40 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-teal-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Problem Statement
            </span>
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-medium">
              {idea.problemStatement}
            </p>
          </div>

          {/* Description / Proposed Methodology */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Description & Proposed Innovation Methodology
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
              {idea.description}
            </div>
          </div>

          {/* Technologies Chips */}
          {idea.technologies && idea.technologies.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-teal-500" />
                Implemented Technologies
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {idea.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Status Workflow Updater */}
          {isAuthor ? (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-500" />
                  Update Innovation Workflow Stage
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {VALID_STATUSES.map((st) => (
                  <button
                    key={st}
                    onClick={() => onUpdateStatus(idea._id, st)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      idea.status === st
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              Only the project owner can update workflow status.
            </div>
          )}

          {/* Voting Action Bar */}
          <div className="flex items-center justify-between py-3 border-y border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onVote(idea._id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition active:scale-95 ${
                idea.hasVoted
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-800 dark:text-slate-200'
              }`}
            >
              {idea.hasVoted ? <Check className="w-4 h-4 text-white" /> : <ThumbsUp className="w-4 h-4 text-emerald-500" />}
              <span>{idea.hasVoted ? 'You Endorsed This' : 'Vote for Innovation'}</span>
              <span className="px-2 py-0.5 rounded-lg bg-black/10 text-white text-[11px] font-black ml-1">
                {idea.votes || 0}
              </span>
            </button>

            {isAuthor && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onEdit(idea);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition"
                >
                  <Edit3 className="w-3.5 h-3.5 text-teal-500" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onDelete(idea._id);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-xs font-bold transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Community Feedback Thread */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Community Feedback & Mentor Reviews ({idea.comments?.length || 0})
              </h3>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {(!idea.comments || idea.comments.length === 0) ? (
                <p className="text-xs text-slate-400 italic p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                  No comments yet. Share your feedback, advice, or mentorship suggestions!
                </p>
              ) : (
                idea.comments.map((cmt, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-800 dark:text-slate-200">{cmt.author}</strong>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300">
                          {cmt.authorRole || 'Student'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {cmt.createdAt ? new Date(cmt.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                      {cmt.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Your Name (e.g. Dr. Kumar / Priya)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />

                <select
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
                >
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Mentor">Mentor</option>
                  <option value="Innovator">Innovator</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-2">
                <textarea
                  required
                  rows={2}
                  placeholder="Provide constructive review or technical feedback..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
                />

                <button
                  type="submit"
                  disabled={isSubmittingComment || !commentText.trim()}
                  className="px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1 disabled:opacity-50 transition shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Post</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetailModal;
