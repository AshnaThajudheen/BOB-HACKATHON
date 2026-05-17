import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
  const [activeTab, setActiveTab] = useState('overview');
  const toastShownRef = useRef(false);

  useEffect(() => {
    toastShownRef.current = false;
  }, [id]);

  useEffect(() => {
    let pollInterval;

    const loadData = async () => {
      try {
        const repoData = getRepoById(id);
        const resultsData = await getRepoResults(id);
        setResults(resultsData);
        setRepo(resultsData);

        if (resultsData.status === 'processing') {
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

  // Enhanced markdown components with overflow handling
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="relative my-4 rounded-xl overflow-hidden border border-gray-800">
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            className="!bg-gray-900 !m-0"
            customStyle={{
              padding: '1.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              overflowX: 'auto',
              maxWidth: '100%',
            }}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-gray-800 px-2 py-1 rounded text-sm break-words" {...props}>
          {children}
        </code>
      );
    },
    pre({ children }) {
      return <div className="overflow-x-auto w-full">{children}</div>;
    },
    p({ children }) {
      return <p className="mb-4 leading-relaxed break-words">{children}</p>;
    },
    h1({ children }) {
      return <h1 className="text-3xl font-bold mb-4 mt-8 break-words">{children}</h1>;
    },
    h2({ children }) {
      return <h2 className="text-2xl font-bold mb-3 mt-6 break-words">{children}</h2>;
    },
    h3({ children }) {
      return <h3 className="text-xl font-semibold mb-2 mt-4 break-words">{children}</h3>;
    },
    ul({ children }) {
      return <ul className="list-disc list-inside mb-4 space-y-2 pl-4">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="list-decimal list-inside mb-4 space-y-2 pl-4">{children}</ol>;
    },
    li({ children }) {
      return <li className="leading-relaxed break-words">{children}</li>;
    },
    table({ children }) {
      return (
        <div className="overflow-x-auto my-4 w-full">
          <table className="min-w-full border border-gray-800 rounded-lg">{children}</table>
        </div>
      );
    },
    th({ children }) {
      return <th className="border border-gray-800 px-4 py-2 bg-gray-900 font-semibold text-left">{children}</th>;
    },
    td({ children }) {
      return <td className="border border-gray-800 px-4 py-2 break-words">{children}</td>;
    },
    blockquote({ children }) {
      return (
        <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-400 break-words">
          {children}
        </blockquote>
      );
    },
    a({ href, children }) {
      return (
        <a href={href} className="text-blue-400 hover:text-blue-300 underline break-all" target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
  };

  if (!results && loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-2xl px-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 relative">
              <LoadingSpinner size="xl" className="mb-6" />
              <motion.div
                className="absolute inset-0 blur-3xl opacity-30"
                animate={{
                  background: [
                    'radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)',
                    'radial-gradient(circle, rgba(168,85,247,0.5) 0%, transparent 70%)',
                    'radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🤖 BobCat AI is analyzing your repository
            </h2>
            <p className="text-gray-400 mb-8">Powered by IBM watsonx.ai & Granite Models</p>
            
            <div className="space-y-3 text-left bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <motion.div
                className="flex items-center gap-3 text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-gray-300">Scanning repository structure...</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-3 text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-gray-300">Detecting frameworks and patterns...</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-3 text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-gray-300">Generating tests and documentation...</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-3 text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-gray-300">Analyzing code quality and architecture...</span>
              </motion.div>
            </div>
            
            <p className="text-xs text-gray-500 mt-6">This usually takes 30-60 seconds</p>
          </motion.div>
        </div>
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
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'tests', label: '🧪 Generated Tests', icon: '🧪' },
    { id: 'docs', label: '📚 API Documentation', icon: '📚' },
    { id: 'explanation', label: '💡 Code Explanations', icon: '💡' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-12">
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
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 break-words">{activeRepo.name || activeRepo.url}</h1>
              <p className="text-gray-400 break-all text-sm md:text-base">{activeRepo.url}</p>
              
              {/* Technology Badges */}
              {activeRepo.language && activeRepo.language !== 'Unknown' && (
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm text-blue-300">
                    {activeRepo.language}
                  </span>
                  {activeRepo.framework && activeRepo.framework !== 'Unknown' && (
                    <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300">
                      {activeRepo.framework}
                    </span>
                  )}
                </div>
              )}
            </div>

            <span className={`text-sm px-4 py-2 rounded-full border whitespace-nowrap ${getStatusColor(activeRepo.status)}`}>
              {activeRepo.status}
            </span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <Card>
            <p className="text-gray-400 text-sm mb-1">Files Analyzed</p>
            <h3 className="text-2xl font-bold">
              {activeRepo.results?.files_analyzed?.length || 0}
            </h3>
          </Card>

          <Card>
            <p className="text-gray-400 text-sm mb-1">API Endpoints</p>
            <h3 className="text-2xl font-bold text-blue-400">{activeRepo.api_endpoints || 0}</h3>
          </Card>

          <Card>
            <p className="text-gray-400 text-sm mb-1">Coverage</p>
            <h3 className="text-2xl font-bold text-green-400">{activeRepo.coverage || 0}%</h3>
          </Card>

          <Card>
            <p className="text-gray-400 text-sm mb-1">Lines of Code</p>
            <h3 className="text-2xl font-bold text-purple-400">
              {activeRepo.lines_of_code ? activeRepo.lines_of_code.toLocaleString() : 
               activeRepo.results?.metrics?.total_lines ? activeRepo.results.metrics.total_lines.toLocaleString() : 0}
            </h3>
          </Card>

          <Card>
            <p className="text-gray-400 text-sm mb-1">AI Confidence</p>
            <h3 className="text-2xl font-bold text-cyan-400">
              {activeRepo.results?.ai_confidence || 85}%
            </h3>
          </Card>
        </motion.div>

        {activeRepo.status === 'processing' ? (
          <Card className="text-center py-16">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingSpinner size="lg" className="mb-6 mx-auto" />
              <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                🤖 AI Analysis in Progress
              </h3>
              <p className="text-gray-400 max-w-lg mx-auto mb-6">
                BobCat is analyzing your repository with IBM watsonx.ai
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-sm max-w-2xl mx-auto">
                <motion.span 
                  className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-300"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  📂 Scanning files
                </motion.span>
                <motion.span 
                  className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                >
                  🔍 Detecting patterns
                </motion.span>
                <motion.span 
                  className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-300"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                >
                  🧪 Generating tests
                </motion.span>
                <motion.span 
                  className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-300"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
                >
                  📚 Creating docs
                </motion.span>
              </div>
            </motion.div>
          </Card>
        ) : activeRepo.status === 'failed' ? (
          <Card className="text-center py-12">
            <div className="text-red-400 text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">Analysis Failed</h3>
            <p className="text-gray-400 mb-4 break-words">{activeRepo.error || 'An error occurred during analysis.'}</p>
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
              <div className="flex gap-2 border-b border-gray-800 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-4 md:px-6 py-3 font-semibold transition-all whitespace-nowrap text-sm md:text-base
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

            {/* Content Viewer */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-gray-800">
                    <h2 className="text-xl font-bold">
                      {tabs.find(t => t.id === activeTab)?.label}
                    </h2>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyToClipboard(activeRepo.results?.[activeTab])}
                      >
                        📋 Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => downloadFile(activeRepo.results?.[activeTab], `${activeTab}.md`)}
                      >
                        ⬇️ Download
                      </Button>
                    </div>
                  </div>

                  <div className="w-full min-w-0 overflow-hidden">
                    <div className="prose prose-invert max-w-none break-words">
                      {activeRepo.results?.[activeTab] ? (
                        <ReactMarkdown components={MarkdownComponents}>
                          {activeRepo.results[activeTab]}
                        </ReactMarkdown>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-gray-400 text-lg mb-2">No content generated for this section</p>
                          <p className="text-gray-500 text-sm">The AI analysis may not have produced output for this category</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Architecture Summary Section */}
            {activeRepo.results?.architecture_summary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <Card>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 flex-wrap">
                    <span className="text-3xl">🏗️</span>
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Architecture Intelligence
                    </span>
                  </h2>
                  <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl">
                      <h3 className="text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wide">
                        System Architecture
                      </h3>
                      <p className="text-gray-300 leading-relaxed break-words">
                        {activeRepo.results.architecture_summary}
                      </p>
                    </div>
                    {activeRepo.results?.architecture_flow && (
                      <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-xl">
                        <h3 className="text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wide">
                          🔄 Data Flow Visualization
                        </h3>
                        <div className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                          <code className="text-xs md:text-sm text-gray-300 font-mono whitespace-nowrap block">
                            {activeRepo.results.architecture_flow}
                          </code>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Missing Documentation Section */}
            {activeRepo.results?.missing_documentation && activeRepo.results.missing_documentation.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <Card>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 flex-wrap">
                    <span className="text-3xl">⚠️</span>
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                      Documentation Insights
                    </span>
                  </h2>
                  <div className="space-y-3">
                    {activeRepo.results.missing_documentation.map((issue, idx) => {
                      // Handle both old string format and new object format
                      const isObject = typeof issue === 'object';
                      const severity = isObject ? issue.severity : 'medium';
                      const severityColors = {
                        high: 'bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/40',
                        medium: 'bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/40',
                        low: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/40'
                      };
                      const severityTextColors = {
                        high: 'text-red-200',
                        medium: 'text-yellow-200',
                        low: 'text-blue-200'
                      };
                      const severityBadgeColors = {
                        high: 'bg-red-500/20 text-red-300 border-red-500/50',
                        medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
                        low: 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                      };
                      const severityIcons = {
                        high: '🔴',
                        medium: '⚠️',
                        low: 'ℹ️'
                      };
                      
                      return (
                        <div key={idx} className={`p-5 border rounded-xl ${severityColors[severity] || severityColors.medium} transition-all hover:scale-[1.01]`}>
                          {isObject ? (
                            <div className="flex items-start gap-3">
                              <span className="text-2xl flex-shrink-0 mt-1">{severityIcons[severity]}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-2">
                                  <p className={`font-semibold ${severityTextColors[severity]} break-words`}>
                                    {issue.type === 'function' && `Function "${issue.name}"`}
                                    {issue.type === 'class' && `Class "${issue.name}"`}
                                    {issue.type === 'endpoint' && `Endpoint ${issue.name}`}
                                    {' '}
                                    <span className="text-gray-400 font-normal text-sm break-all">in {issue.file}</span>
                                  </p>
                                  <span className={`text-xs px-3 py-1 rounded-full uppercase font-bold border flex-shrink-0 ${severityBadgeColors[severity]}`}>
                                    {severity}
                                  </span>
                                </div>
                                <div className="flex items-start gap-2 mt-3 p-3 bg-black/20 rounded-lg">
                                  <span className="text-lg flex-shrink-0">💡</span>
                                  <p className="text-sm text-gray-300 leading-relaxed break-words">
                                    {issue.suggestion}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm break-words">{issue}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Results;

// Made with Bob