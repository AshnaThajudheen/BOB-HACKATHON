import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { formatDate, getStatusColor, getStatusBgColor } from '../utils/formatters';
import toast from 'react-hot-toast';

const History = () => {
  const navigate = useNavigate();
  const { repositories, deleteRepo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [repoToDelete, setRepoToDelete] = useState(null);

  const filteredRepos = repositories.filter((repo) => {
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         repo.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || repo.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleDeleteClick = (repo) => {
    setRepoToDelete(repo);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (repoToDelete) {
      deleteRepo(repoToDelete.id);
      setDeleteModalOpen(false);
      setRepoToDelete(null);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'processing', label: 'Processing' },
    { value: 'failed', label: 'Failed' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Analysis History</h1>
          <p className="text-gray-400 text-lg">
            View and manage all your analyzed repositories
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div className="flex gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilterStatus(option.value)}
                    className={`
                      flex-1 px-4 py-3 rounded-xl font-medium transition-all
                      ${filterStatus === option.value
                        ? 'bg-white text-black'
                        : 'bg-gray-900 text-gray-400 hover:text-white'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-gray-400">
            Showing {filteredRepos.length} of {repositories.length} repositories
          </p>
        </motion.div>

        {/* Repository List */}
        {filteredRepos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No repositories found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start by analyzing your first repository'
                }
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredRepos.map((repo, index) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <Card hover className="cursor-pointer">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div
                      className="flex-1"
                      onClick={() => navigate(`/results/${repo.id}`)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold">{repo.name}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full border ${getStatusBgColor(repo.status)}`}>
                          <span className={getStatusColor(repo.status)}>
                            {repo.status}
                          </span>
                        </span>
                      </div>

                      <p className="text-sm text-gray-400 mb-3">{repo.url}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Language</p>
                          <p className="font-medium">{repo.language}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Framework</p>
                          <p className="font-medium">{repo.framework}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Tests</p>
                          <p className="font-medium">{repo.testsGenerated}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Coverage</p>
                          <p className="font-medium">{repo.coverage}%</p>
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-gray-500">
                        Analyzed {formatDate(repo.analyzedAt)}
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/results/${repo.id}`)}
                        className="flex-1 lg:flex-none"
                      >
                        View Results
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(repo);
                        }}
                        className="flex-1 lg:flex-none"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Repository"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-300">
              Are you sure you want to delete <strong>{repoToDelete?.name}</strong>?
              This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default History;

// Made with Bob
