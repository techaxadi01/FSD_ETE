import { useState, useEffect, useCallback } from 'react';
import {
  getIdeas,
  getStats,
  createIdea,
  updateIdea,
  deleteIdea,
  voteIdea,
  addComment,
  seedDemoData
} from '../services/api';

export const useIdeas = (getVoterIdentifier) => {
  const [ideas, setIdeas] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, votes
  const [error, setError] = useState(null);

  const fetchIdeas = useCallback(async () => {
    try {
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (domainFilter !== 'All') params.domain = domainFilter;
      if (statusFilter !== 'All') params.status = statusFilter;
      if (sortBy) params.sort = sortBy;

      const data = await getIdeas(params);
      const normalizedIdeas = Array.isArray(data)
        ? data
        : Array.isArray(data?.ideas)
          ? data.ideas
          : Array.isArray(data?.data)
            ? data.data
            : [];

      if (!Array.isArray(data)) {
        console.warn('Unexpected ideas response shape:', data);
      }

      setIdeas(normalizedIdeas);
      setError(null);
    } catch (err) {
      console.error('Error loading ideas:', err);
      setError(err.response?.data?.error || 'Failed to connect to idea repository.');
      setIdeas([]);
    }
  }, [searchQuery, domainFilter, statusFilter, sortBy]);

  const fetchStats = async () => {
    try {
      const data = await getStats();
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        setStats(data);
      } else {
        console.warn('Unexpected stats response shape:', data);
        setStats(null);
      }
    } catch (err) {
      console.error('Error loading statistics:', err);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await Promise.allSettled([fetchIdeas(), fetchStats()]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchIdeas]);

  const handleCreate = async (ideaData) => {
    const created = await createIdea(ideaData);
    await Promise.all([fetchIdeas(), fetchStats()]);
    return created;
  };

  const handleUpdate = async (id, ideaData) => {
    const updated = await updateIdea(id, ideaData);
    await Promise.all([fetchIdeas(), fetchStats()]);
    return updated;
  };

  const handleDelete = async (id) => {
    await deleteIdea(id);
    await Promise.all([fetchIdeas(), fetchStats()]);
  };

  const handleVote = async (id) => {
    const voterId = getVoterIdentifier ? getVoterIdentifier() : null;
    const response = await voteIdea(id, voterId);

    // Update local idea votes & hasVoted state immediately
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea._id === id) {
          return {
            ...idea,
            votes: response.votes,
            hasVoted: response.hasVoted
          };
        }
        return idea;
      })
    );

    await fetchStats();
    return response;
  };

  const handleAddComment = async (id, commentData) => {
    const updated = await addComment(id, commentData);
    setIdeas((prev) =>
      prev.map((idea) => (idea._id === id ? updated : idea))
    );
    return updated;
  };

  const handleSeed = async () => {
    const result = await seedDemoData();
    await Promise.all([fetchIdeas(), fetchStats()]);
    return result;
  };

  const resetFilters = () => {
    setSearchQuery('');
    setDomainFilter('All');
    setStatusFilter('All');
    setSortBy('newest');
  };

  return {
    ideas,
    stats,
    loading,
    error,
    searchQuery,
    setSearchQuery,
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
  };
};
