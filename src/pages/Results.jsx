import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate, getStatusColor } from '../utils/formatters';
import toast from 'react-hot-toast';

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRepoById, getRepoResults } = useApp();
  const [repo, setRepo] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tests');
  const toastShownRef = useRef(false);

  useEffect(() => {
    toastShownRef.current = false;
  }, [id]);

  useEffect(() => {
    let pollInterval;

    const loadData = async () => {
      try {
        const repoData = getRepoById(id);
        if (!repoData && !results) {
          // If we just landed on the page and context isn't fully hydrated, we might need to fetch directly
          // but for now, rely on getRepoResults
        }

        const resultsData = await getRepoResults(id);
        setResults(resultsData);
        setRepo(resultsData); // Results API returns the full repo object

        if (resultsData.status === 'processing') {
          // Poll every 3 seconds
          pollInterval = setTimeout(loadData, 3000);
        } else if (resultsData.status === 'completed') {
          setLoading(false);
          if (!toastShownRef.current) {
            toast.success('Analysis completed successfully!');
            toastShownRef.current = true;
          }
        } else if (resultsData.status === 'failed') {
          setLoading(false);
          if (!toastShownRef.current) {
            toast.error('Analysis failed.');
            toastShownRef.current = true;
          }
        }

      } catch (error) {
        toast.error('Failed to load results');
        setLoading(false);
      }
    };

    loadData();

    return () => {
      if (pollInterval) clearTimeout(pollInterval);
    };
  }, [id, getRepoResults]);

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadFile = (content, filename) => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File downloaded!');
  };

  if (!results && loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!repo && !results) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center flex-col">
        <p className="text-xl text-gray-400 mb-4">Repository not found.</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  const activeRepo = results || repo;

  const tabs = [
    { id: 'tests', label: 'Generated Tests' },
    { id: 'docs', label: 'API Documentation' },
    { id: 'explanations', label: 'Code Explanations' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{activeRepo.name || activeRepo.url}</h1>
              <p className="text-gray-400">{activeRepo.url}</p>
            </div>

            <span className={`text-sm px-4 py-2 rounded-full border ${getStatusColor(activeRepo.status)}`}>
              {activeRepo.status}
            </span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <p className="text-gray-400 text-sm mb-1">Files Analyzed</p>
            <h3 className="text-2xl font-bold">
              {activeRepo.results?.files_analyzed?.length || 0}
            </h3>
          </Card>

          <Card>
            <p className="text-gray-400 text-sm mb-1">API Endpoints</p>
            <h3 className="text-2xl font-bold">{activeRepo.api_endpoints || 0}</h3>
          </Card>

          <Card>
            <p className="text-gray-400 text-sm mb-1">Coverage</p>
            <h3 className="text-2xl font-bold">{activeRepo.coverage || 0}%</h3>
          </Card>

          <Card>
            <p className="text-gray-400 text-sm mb-1">Analyzed</p>
            <h3 className="text-lg font-bold">
              {activeRepo.analyzed_at ? formatDate(activeRepo.analyzed_at) : 'Processing...'}
            </h3>
          </Card>
        </motion.div>

        {activeRepo.status === 'processing' ? (
          <Card className="text-center py-12">
            <LoadingSpinner size="lg" className="mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">AI Analysis in Progress...</h3>
            <p className="text-gray-400 max-w-lg mx-auto">
              IBM Watsonx is currently reading your repository files and generating tests and documentation. 
              This page will automatically update when finished.
            </p>
          </Card>
        ) : activeRepo.status === 'failed' ? (
          <Card className="text-center py-12">
            <div className="text-red-400 text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">Analysis Failed</h3>
            <p className="text-gray-400 mb-4">{activeRepo.error || 'An error occurred during analysis.'}</p>
            <Button onClick={() => navigate('/dashboard')}>Try Another Repository</Button>
          </Card>
        ) : (
          <>
            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="flex gap-2 border-b border-gray-800">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-6 py-3 font-semibold transition-all
                      ${activeTab === tab.id
                        ? 'border-b-2 border-white text-white'
                        : 'text-gray-400 hover:text-white'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Markdown Content Viewer */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <div className="flex justify-end gap-2 mb-4 pb-4 border-b border-gray-800">
                   <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => copyToClipboard(activeRepo.results?.[activeTab])}
                    >
                      Copy Markdown
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => downloadFile(activeRepo.results?.[activeTab], `${activeTab}.md`)}
                    >
                      Download .md
                    </Button>
                </div>
                <div className="prose prose-invert prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 max-w-none">
                  {activeRepo.results?.[activeTab] ? (
                     <ReactMarkdown>{activeRepo.results[activeTab]}</ReactMarkdown>
                  ) : (
                    <p className="text-gray-400 italic">No content generated for this section.</p>
                  )}
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Results;
