import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { useIdeas } from './hooks/useIdeas';
import Navbar from './components/Navbar';
import ExploreView from './components/ExploreView';
import DashboardMetrics from './components/DashboardMetrics';
import IdeaFormModal from './components/IdeaFormModal';
import IdeaDetailModal from './components/IdeaDetailModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

function CampusHubContent() {
  const [activeTab, setActiveTab] = useState('explore'); // explore, workflow, analytics
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const { user, getVoterIdentifier } = useAuth();
  const {
    ideas,
    stats,
    loading,
    error,
    searchQuery,
    searchInput,
    setSearchInput,
    submitSearch,
    domainFilter,
    setDomainFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    fetchIdeas,
    fetchStats,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleVote,
    handleAddComment,
    handleSeed,
    resetFilters
  } = useIdeas(getVoterIdentifier);

  const safeIdeas = Array.isArray(ideas) ? ideas : [];
  const safeStats = stats && typeof stats === 'object' && !Array.isArray(stats) ? stats : null;

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: 'success' });
    }, 4000);
  };

  const onIdeaSubmit = async (formData, id = null) => {
    try {
      if (id) {
        const updated = await handleUpdate(id, formData);
        showToast('Innovation idea updated successfully!', 'success');
        if (selectedIdea?._id === id) setSelectedIdea(updated);
      } else {
        await handleCreate(formData);
        showToast('Your campus idea has been proposed successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.error || 'Failed to save proposal', 'error');
      throw err;
    }
  };

  const onIdeaDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this innovation proposal?')) return;
    try {
      await handleDelete(id);
      showToast('Innovation idea deleted.', 'info');
      if (selectedIdea?._id === id) setSelectedIdea(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to delete proposal', 'error');
    }
  };

  const onIdeaVote = async (id) => {
    try {
      const res = await handleVote(id);
      showToast(res.message || 'Vote updated', 'success');
      if (selectedIdea?._id === id) {
        setSelectedIdea((prev) => ({
          ...prev,
          votes: res.votes,
          hasVoted: res.hasVoted
        }));
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.error || 'Could not register vote', 'error');
    }
  };

  const onUpdateWorkflowStatus = async (id, newStatus) => {
    try {
      const updated = await handleUpdate(id, { status: newStatus });
      showToast(`Workflow status updated to "${newStatus}"`, 'success');
      if (selectedIdea?._id === id) setSelectedIdea(updated);
    } catch (err) {
      console.error(err);
      showToast('Failed to update status', 'error');
    }
  };

  const onSeedDemo = async () => {
    if (!window.confirm('Reset and load standard campus innovation proposals into database?')) return;
    setIsSeeding(true);
    try {
      await handleSeed();
      showToast('Demo innovation ideas seeded successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to seed demo data', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 relative overflow-x-hidden">
      {/* Background Decorative Circular & Radial Gradients */}
      <div className="fixed top-0 left-1/4 -mt-32 w-[600px] h-[600px] rounded-full bg-radial-gradient from-emerald-300/6 via-teal-300/3 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/2 right-10 -mt-20 w-[500px] h-[500px] rounded-full bg-radial-gradient from-blue-300/6 via-cyan-200/3 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-10 -mb-20 w-[500px] h-[500px] rounded-full bg-radial-gradient from-teal-300/6 via-emerald-300/3 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSubmitModal={() => {
          setEditingIdea(null);
          setIsSubmitModalOpen(true);
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSeedData={onSeedDemo}
        isSeeding={isSeeding}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
              Loading Campus Innovations...
            </p>
          </div>
        ) : error && safeIdeas.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/60 shadow-sm max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Unable to Connect to Server
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {error || 'Make sure the backend is running on port 5000.'}
              </p>
            </div>
            <button
              onClick={() => {
                fetchIdeas();
                fetchStats();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-md transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        ) : (
          <>
            {/* View 1: Innovations Cards Grid */}
            {activeTab === 'explore' && (
              <ExploreView
                ideas={safeIdeas}
                searchQuery={searchQuery}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                onSearchSubmit={submitSearch}
                domainFilter={domainFilter}
                setDomainFilter={setDomainFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onSelectIdea={(idea) => setSelectedIdea(idea)}
                onEditIdea={(idea) => {
                  setEditingIdea(idea);
                  setIsSubmitModalOpen(true);
                }}
                onDeleteIdea={onIdeaDelete}
                onVote={onIdeaVote}
                onOpenSubmitModal={() => {
                  setEditingIdea(null);
                  setIsSubmitModalOpen(true);
                }}
                onResetFilters={resetFilters}
                currentUserId={user?.id}
                currentUser={user}
              />
            )}

            {/* View 2: Workflow Pipeline Stages */}
            {activeTab === 'workflow' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-black">Innovation Workflow Pipeline</h2>
                    <p className="text-xs sm:text-sm text-emerald-100">
                      Tracking project progression from Review → Approved → Prototype → Implemented
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingIdea(null);
                      setIsSubmitModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-white text-teal-900 font-black text-xs shadow-md hover:bg-emerald-50 transition active:scale-95 self-start sm:self-auto"
                  >
                    + Submit Proposal
                  </button>
                </div>

                {/* 4 Pipeline Stage Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {['Review', 'Approved', 'Prototype', 'Implemented'].map((stage) => {
                    const stageIdeas = safeIdeas.filter((i) => i.status === stage);
                    const stageColors = {
                      'Review': 'border-amber-400/40 bg-amber-50/30 dark:bg-amber-950/20 text-amber-600 dark:text-amber-300',
                      'Approved': 'border-teal-400/40 bg-teal-50/30 dark:bg-teal-950/20 text-teal-600 dark:text-teal-300',
                      'Prototype': 'border-cyan-400/40 bg-cyan-50/30 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-300',
                      'Implemented': 'border-emerald-400/40 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-300'
                    };

                    return (
                      <div
                        key={stage}
                        className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 space-y-4 flex flex-col min-h-[500px]"
                      >
                        <div className={`p-3 rounded-2xl border flex items-center justify-between font-black text-xs ${stageColors[stage]}`}>
                          <span>{stage}</span>
                          <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 shadow-2xs">
                            {stageIdeas.length}
                          </span>
                        </div>

                        <div className="space-y-3 flex-1 overflow-y-auto">
                          {stageIdeas.length === 0 ? (
                            <p className="text-center text-xs text-slate-400 py-8 italic">
                              No ideas in {stage} stage.
                            </p>
                          ) : (
                            stageIdeas.map((idea) => (
                              <div
                                key={idea._id}
                                onClick={() => setSelectedIdea(idea)}
                                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-md hover:border-teal-400 cursor-pointer space-y-2 transition"
                              >
                                <span className="inline-block text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                                  {idea.domain}
                                </span>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                                  {idea.title}
                                </h4>
                                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-700/50">
                                  <span>{idea.author?.name || 'Student'}</span>
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                    {idea.votes || 0} votes
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* View 3: Analytics & KPIs */}
            {activeTab === 'analytics' && (
              <DashboardMetrics
                stats={safeStats}
                ideas={safeIdeas}
                onFilterStatus={(status) => {
                  setStatusFilter(status);
                  setActiveTab('explore');
                }}
                onFilterDomain={(domain) => {
                  setDomainFilter(domain);
                  setActiveTab('explore');
                }}
                onOpenSubmitModal={() => {
                  setEditingIdea(null);
                  setIsSubmitModalOpen(true);
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Campus Idea & Innovation Hub • Green & Blue MERN Stack
          </span>
          <span>Full-Stack Web Engineering</span>
        </div>
      </footer>

      {/* Modals */}
      {selectedIdea && (
        <IdeaDetailModal
          idea={selectedIdea}
          onClose={() => setSelectedIdea(null)}
          onEdit={(idea) => {
            setEditingIdea(idea);
            setIsSubmitModalOpen(true);
          }}
          onDelete={onIdeaDelete}
          onVote={onIdeaVote}
          onAddComment={handleAddComment}
          onUpdateStatus={onUpdateWorkflowStatus}
          currentUser={user}
        />
      )}

      {isSubmitModalOpen && (
        <IdeaFormModal
          isOpen={isSubmitModalOpen}
          onClose={() => {
            setIsSubmitModalOpen(false);
            setEditingIdea(null);
          }}
          onSubmit={onIdeaSubmit}
          editIdea={editingIdea}
          currentUser={user}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={() => {
            showToast(`Welcome ${user?.name || 'Innovator'}!`, 'success');
            fetchIdeas();
          }}
        />
      )}

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CampusHubContent />
    </AuthProvider>
  );
}

export default App;
