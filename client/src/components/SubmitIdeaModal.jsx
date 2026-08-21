import { useState } from 'react';
import {
  X,
  Lightbulb,
  Sparkles,
  Layers,
  User,
  Hash,
  Clock,
  IndianRupee,
  Tag,
  Target,
  FileText,
  Check
} from 'lucide-react';

const SubmitIdeaModal = ({
  isOpen,
  onClose,
  onSubmit,
  editIdea = null
}) => {
  const [formData, setFormData] = useState(() => ({
    title: editIdea?.title || '',
    description: editIdea?.description || '',
    studentName: editIdea?.studentName || '',
    regNo: editIdea?.regNo || '',
    category: editIdea?.category || 'Smart Campus & IoT',
    communityScope: editIdea?.communityScope || 'Campus Wide',
    impactLevel: editIdea?.impactLevel || 'Medium',
    estimatedBudget: editIdea?.estimatedBudget !== undefined ? editIdea?.estimatedBudget : 15000,
    durationWeeks: editIdea?.durationWeeks || 4,
    tags: Array.isArray(editIdea?.tags) ? editIdea.tags.join(', ') : (editIdea?.tags || ''),
    status: editIdea?.status || 'Submitted'
  }));

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const categories = [
    'Sustainability & Green Campus',
    'Smart Campus & IoT',
    'Academic & Learning Hub',
    'Healthcare & Well-being',
    'Community & Social Impact',
    'Campus Safety & Security',
    'Fintech & Campus Economy',
    'Other'
  ];

  const scopes = [
    'Campus Wide',
    'Department Specific',
    'Local Community',
    'Hostel / Residential',
    'General Public'
  ];

  const impactLevels = ['Low', 'Medium', 'High', 'Transformative'];

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim() || formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long.';
    }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      newErrors.description = 'Please provide at least 10 characters describing problem and solution.';
    }
    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required.';
    }
    if (!formData.regNo.trim()) {
      newErrors.regNo = 'Registration number / Student ID is required.';
    }
    if (formData.estimatedBudget < 0) {
      newErrors.estimatedBudget = 'Budget cannot be negative.';
    }
    if (formData.durationWeeks < 1) {
      newErrors.durationWeeks = 'Duration must be at least 1 week.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        estimatedBudget: Number(formData.estimatedBudget),
        durationWeeks: Number(formData.durationWeeks),
        tags: formData.tags
          ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : []
      };

      await onSubmit(payload, editIdea?._id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 via-white to-blue-50/50 dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editIdea ? 'Edit Innovation Proposal' : 'Submit Campus Innovation Idea'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {editIdea ? 'Update parameters and implementation scope' : 'Propose a technology or community solution'}
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
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              Idea Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AI-Powered Solar Bus Tracker & Booking"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                errors.title ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-500 font-medium">{errors.title}</p>}
          </div>

          {/* Submitter info: Student Name & Reg No */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-500" />
                Student Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aarav Sharma"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                  errors.studentName ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.studentName && (
                <p className="text-xs text-rose-500 font-medium">{errors.studentName}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-indigo-500" />
                Registration No / Student ID *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 21BCE1042"
                value={formData.regNo}
                onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                  errors.regNo ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.regNo && (
                <p className="text-xs text-rose-500 font-medium">{errors.regNo}</p>
              )}
            </div>
          </div>

          {/* Category & Community Scope */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                Innovation Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-500" />
                Community Scope
              </label>
              <select
                value={formData.communityScope}
                onChange={(e) => setFormData({ ...formData, communityScope: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                {scopes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Impact Level, Budget, Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Impact Level
              </label>
              <select
                value={formData.impactLevel}
                onChange={(e) => setFormData({ ...formData, impactLevel: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                {impactLevels.map((imp) => (
                  <option key={imp} value={imp}>{imp}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-indigo-500" />
                Est. Budget (₹) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.estimatedBudget}
                onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-xl text-sm border bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                  errors.estimatedBudget ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.estimatedBudget && (
                <p className="text-xs text-rose-500 font-medium">{errors.estimatedBudget}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                Duration (Weeks) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.durationWeeks}
                onChange={(e) => setFormData({ ...formData, durationWeeks: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-xl text-sm border bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                  errors.durationWeeks ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.durationWeeks && (
                <p className="text-xs text-rose-500 font-medium">{errors.durationWeeks}</p>
              )}
            </div>
          </div>

          {/* Problem & Solution Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              Problem Description & Innovation Solution *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe the campus or community problem, your proposed methodology, and expected outcomes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-y transition ${
                errors.description ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-500 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Tags & Status (when editing) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. AI, IoT, Green Tech, Python"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {editIdea && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Current Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            )}
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
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-md shadow-indigo-500/20 active:scale-95 transition disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : editIdea ? 'Update Proposal' : 'Submit Idea'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitIdeaModal;
