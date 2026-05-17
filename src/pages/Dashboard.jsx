import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner, { SkeletonLoader } from '../components/common/LoadingSpinner';
import { validateRepoInput } from '../utils/validators';
import { formatDate, formatNumber, getStatusColor, getStatusBgColor } from '../utils/formatters';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { repositories, stats, loading, analyzeRepo } = useApp();
  const [repoUrl, setRepoUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateRepoInput(repoUrl);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setAnalyzing(true);
    try {
      const newRepo = await analyzeRepo(repoUrl);
      setRepoUrl('');
      setErrors({});
      navigate(`/results/${newRepo.id}`);
    } catch (error) {
      toast.error('Failed to analyze repository');
    } finally {
      setAnalyzing(false);
    }
  };

  const recentRepos = repositories.slice(0, 5);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Dashboard</h1>
          <h2 className="text-xl md:text-2xl text-gray-300 mb-2">
            BOBCAT - AI-Powered Repository Intelligence for Automated Documentation & Testing
          </h2>
          <p className="text-gray-400 text-lg">
            Analyze repositories and view your generated tests and documentation
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <Card>
            <p className="text-gray-400 text-sm mb-2">Total Repositories</p>
            <h3 className="text-4xl font-bold">{formatNumber(stats.totalRepositories)}</h3>
          </Card>

          <Card>
            <p className="text-gray-400 text-sm mb-2">Tests Generated</p>
            <h3 className="text-4xl font-bold text-green-400">{formatNumber(stats.totalTests)}</h3>
          </Card>

          <Card>
            <p className="text-gray-400 text-sm mb-2">Documents Created</p>
            <h3 className="text-4xl font-bold text-blue-400">{formatNumber(stats.totalDocuments)}</h3>
          </Card>

          <Card>
            <p className="text-gray-400 text-sm mb-2">Avg Coverage</p>
            <h3 className="text-4xl font-bold text-purple-400">{stats.averageCoverage}%</h3>
          </Card>
        </motion.div>

        {/* Repository Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Analyze New Repository</h2>
            
            <form onSubmit={handleAnalyze} className="space-y-4">
              <Input
                label="GitHub Repository URL"
                placeholder="https://github.com/username/repository"
                value={repoUrl}
                onChange={(e) => {
                  setRepoUrl(e.target.value);
                  setErrors({});
                }}
                error={errors.url}
                disabled={analyzing}
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  loading={analyzing}
                  disabled={analyzing || !repoUrl}
                >
                  {analyzing ? 'Analyzing...' : 'Analyze Repository'}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/history')}
                >
                  View History
                </Button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-gray-800">
              <p className="text-sm text-gray-400">
                <strong>Tip:</strong> Make sure the repository is public or you have access rights.
                Analysis typically takes 2-5 minutes depending on repository size.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Recent Repositories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Analyses</h2>
            <Button variant="ghost" onClick={() => navigate('/history')}>
              View All →
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4">
              <SkeletonLoader className="h-32" count={3} />
            </div>
          ) : recentRepos.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-400 mb-4">No repositories analyzed yet</p>
              <p className="text-sm text-gray-500">
                Start by analyzing your first repository above
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {recentRepos.map((repo, index) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card
                    hover
                    onClick={() => navigate(`/results/${repo.id}`)}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{repo.name}</h3>
                          <span className={`text-xs px-3 py-1 rounded-full border ${getStatusBgColor(repo.status)}`}>
                            <span className={getStatusColor(repo.status)}>
                              {repo.status}
                            </span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{repo.url}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <span>📝 {repo.testsGenerated} tests</span>
                          <span>🔌 {repo.apiEndpoints} endpoints</span>
                          <span>📊 {repo.coverage}% coverage</span>
                          <span>🕒 {formatDate(repo.analyzedAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {repo.status === 'processing' && (
                          <LoadingSpinner size="sm" />
                        )}
                        <Button variant="secondary" size="sm">
                          View Results →
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Activity Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card>
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            <div className="flex items-end justify-between gap-2 h-48">
              {stats.recentActivity.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.count / 6) * 100}%` }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="w-full bg-white rounded-t-lg min-h-[20px]"
                  />
                  <span className="text-xs text-gray-500">
                    {new Date(day.date).getDate()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

// Made with Bob
