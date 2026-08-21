import { useState } from 'react';
import {
  X,
  Lightbulb,
  Sparkles,
  Layers,
  Code2,
  AlertCircle,
  FileText,
  Check,
  Target
} from 'lucide-react';

const VALID_DOMAINS = [
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

const VALID_STATUSES = ['Review', 'Approved', 'Prototype', 'Implemented'];
const VALID_IMPACTS = ['Low', 'Medium', 'High', 'Transformative'];

const IdeaFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  editIdea = null,
  currentUser = null
}) => {
  const [formData, setFormData] = useState(() => ({
    title: editIdea?.title || '',
    problemStatement: editIdea?.problemStatement || '',
    domain: editIdea?.domain || 'Smart Campus & IoT',
    description: editIdea?.description || '',
    technologies: Array.isArray(editIdea?.technologies)
      ? editIdea.technologies.join(', ')
      : (editIdea?.technologies || ''),
    expectedImpact: editIdea?.expectedImpact || 'High',
    status: editIdea?.status || 'Review',
    authorName: editIdea?.author?.name || currentUser?.name || 'Student Innovator'
  }));

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Frontend Javascript Validation
  const validateForm = () => {
    const errs = {};

    if (!formData.title.trim()) {
      errs.title = 'Idea Title is required.';
    } else if (formData.title.trim().length < 3) {
      errs.title = 'Idea Title must be at least 3 characters long.';
    }

    if (!formData.problemStatement.trim()) {
      errs.problemStatement = 'Problem statement is required.';
    } else if (formData.problemStatement.trim().length < 10) {
      errs.problemStatement = 'Problem statement must be at least 10 characters long describing the campus issue.';
    }

    if (!formData.domain || !VALID_DOMAINS.includes(formData.domain)) {
      errs.domain = 'Please select a valid innovation domain.';
    }

    if (!formData.description.trim()) {
      errs.description = 'Description is required.';
    } else if (formData.description.trim().length < 20) {
      errs.description = 'Description must be at least 20 characters long detailing your proposed solution.';
    }

    const techArray = formData.technologies
      ? formData.technologies.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    if (techArray.length === 0) {
      errs.technologies = 'At least one technology is required (e.g. Python, React, IoT).';
    }

    if (!formData.expectedImpact || !VALID_IMPACTS.includes(formData.expectedImpact)) {
      errs.expectedImpact = 'Please select a valid expected impact level.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const techArray = formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title.trim(),
        problemStatement: formData.problemStatement.trim(),
        domain: formData.domain,
        description: formData.description.trim(),
        technologies: techArray,
        expectedImpact: formData.expectedImpact,
        status: formData.status,
        authorName: formData.authorName.trim()
      };

      await onSubmit(payload, editIdea?._id);
      onClose();
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
        {/* Top Header with Green & Blue Gradient */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/8 via-teal-500/8 to-blue-500/8 dark:from-emerald-950/30 dark:to-blue-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-blue-500 text-white flex items-center justify-center shadow-md shadow-teal-500/15">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {editIdea ? 'Edit Innovation Project' : 'Propose New Campus Idea'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Complete all required innovation details and validation fields
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Idea Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              Idea Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Smart AI Campus Waste Classifier & Reward Engine"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition ${
                errors.title ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-500 font-semibold">{errors.title}</p>}
          </div>

          {/* Problem Statement */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-teal-500" />
              Problem Statement *
            </label>
            <textarea
              required
              rows={2}
              placeholder="What campus or community problem are you addressing? (Minimum 10 characters)"
              value={formData.problemStatement}
              onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none transition ${
                errors.problemStatement ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.problemStatement && (
              <p className="text-xs text-rose-500 font-semibold">{errors.problemStatement}</p>
            )}
          </div>

          {/* Domain & Expected Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                Domain *
              </label>
              <select
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
              >
                {VALID_DOMAINS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.domain && <p className="text-xs text-rose-500 font-semibold">{errors.domain}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                Expected Impact *
              </label>
              <select
                value={formData.expectedImpact}
                onChange={(e) => setFormData({ ...formData, expectedImpact: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                {VALID_IMPACTS.map((imp) => (
                  <option key={imp} value={imp}>{imp}</option>
                ))}
              </select>
              {errors.expectedImpact && (
                <p className="text-xs text-rose-500 font-semibold">{errors.expectedImpact}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-500" />
              Description & Methodology * (Min 20 chars)
            </label>
            <textarea
              required
              rows={3}
              placeholder="Provide full technical details, execution plan, and innovative approach..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-y transition ${
                errors.description ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-500 font-semibold">{errors.description}</p>
            )}
          </div>

          {/* Technologies & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-blue-500" />
                Technologies * (Comma separated)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. React, Node.js, Python, IoT, YOLOv8"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                  errors.technologies ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.technologies && (
                <p className="text-xs text-rose-500 font-semibold">{errors.technologies}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-500" />
                Status Workflow
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer font-bold"
              >
                {VALID_STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white font-black text-sm shadow-md shadow-teal-500/15 active:scale-95 transition disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : editIdea ? 'Update Proposal' : 'Submit Innovation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IdeaFormModal;
