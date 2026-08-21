import { useState } from 'react';
import {
  Search,
  Download,
  Edit,
  Trash2,
  ExternalLink,
  ThumbsUp
} from 'lucide-react';

const TableView = ({
  ideas,
  onSelectIdea,
  onEditIdea,
  onDeleteIdea,
  onUpdateStatus,
  onVote
}) => {
  const safeIdeas = Array.isArray(ideas) ? ideas : [];
  const [tableSearch, setTableSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredIdeas = safeIdeas.filter((idea) => {
    const title = String(idea.title || '');
    const studentName = String(idea.studentName || '');
    const regNo = String(idea.regNo || '');
    const category = String(idea.category || '');
    const matchesSearch =
      title.toLowerCase().includes(tableSearch.toLowerCase()) ||
      studentName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      regNo.toLowerCase().includes(tableSearch.toLowerCase()) ||
      category.toLowerCase().includes(tableSearch.toLowerCase());

    const matchesStatus = statusFilter === 'All' || idea.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    if (filteredIdeas.length === 0) return;

    const headers = [
      'Title',
      'Student Name',
      'Reg No',
      'Category',
      'Scope',
      'Impact Level',
      'Budget (INR)',
      'Duration (Weeks)',
      'Status',
      'Votes',
      'Created At'
    ];

    const rows = filteredIdeas.map((i) => [
      `"${i.title.replace(/"/g, '""')}"`,
      `"${i.studentName}"`,
      `"${i.regNo}"`,
      `"${i.category}"`,
      `"${i.communityScope}"`,
      `"${i.impactLevel}"`,
      i.estimatedBudget,
      i.durationWeeks,
      `"${i.status}"`,
      i.votes || 0,
      `"${new Date(i.createdAt).toISOString()}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campus_innovation_ideas_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusOptions = [
    'Submitted',
    'Under Review',
    'Approved',
    'In Progress',
    'Completed',
    'Rejected'
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Table Top Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search table by title, student, ID, or domain..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <button
          onClick={exportToCSV}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition shadow-xs shrink-0"
        >
          <Download className="w-4 h-4 text-indigo-500" />
          <span>Export to CSV ({filteredIdeas.length})</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Innovation Title</th>
                <th className="px-4 py-3.5">Student / Submitter</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Scope & Impact</th>
                <th className="px-4 py-3.5">Budget & Time</th>
                <th className="px-4 py-3.5">Status & Workflow</th>
                <th className="px-4 py-3.5 text-center">Votes</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredIdeas.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-slate-400">
                    No proposals match the current table filter.
                  </td>
                </tr>
              ) : (
                filteredIdeas.map((idea) => (
                  <tr
                    key={idea._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                  >
                    {/* Title */}
                    <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white max-w-xs">
                      <div
                        onClick={() => onSelectIdea(idea)}
                        className="cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 truncate"
                        title={idea.title}
                      >
                        {idea.title}
                      </div>
                    </td>

                    {/* Submitter */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {idea.studentName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {idea.regNo}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 max-w-[140px] truncate">
                        {idea.category}
                      </span>
                    </td>

                    {/* Scope & Impact */}
                    <td className="px-4 py-3.5 text-xs">
                      <div>{idea.communityScope}</div>
                      <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        {idea.impactLevel} Impact
                      </span>
                    </td>

                    {/* Budget & Time */}
                    <td className="px-4 py-3.5 text-xs">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        ₹{Number(idea.estimatedBudget).toLocaleString()}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {idea.durationWeeks} weeks
                      </div>
                    </td>

                    {/* Status inline updater */}
                    <td className="px-4 py-3.5">
                      <select
                        value={idea.status}
                        onChange={(e) => onUpdateStatus(idea._id, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${
                          idea.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300' :
                          idea.status === 'In Progress' ? 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/70 dark:text-blue-300' :
                          idea.status === 'Completed' ? 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950/70 dark:text-purple-300' :
                          idea.status === 'Under Review' ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300' :
                          idea.status === 'Rejected' ? 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300' :
                          'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Votes */}
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => onVote(idea._id, 'upvote')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-xs font-bold text-slate-700 dark:text-slate-200"
                        title="Upvote"
                      >
                        <ThumbsUp className="w-3 h-3 text-indigo-500" />
                        <span>{idea.votes || 0}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectIdea(idea)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="View Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onEditIdea(idea)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDeleteIdea(idea._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableView;
