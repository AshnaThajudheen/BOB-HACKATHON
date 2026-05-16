import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const repoData = getRepoById(id);
        if (!repoData) {
          toast.error('Repository not found');
          navigate('/dashboard');
          return;
        }
        setRepo(repoData);

        if (repoData.status === 'completed') {
          const resultsData = await getRepoResults(id);
          setResults(resultsData);
          if (resultsData.tests?.unitTests?.length > 0) {
            setSelectedTest(resultsData.tests.unitTests[0]);
          }
        }
      } catch (error) {
        toast.error('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, getRepoById, getRepoResults, navigate]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File downloaded!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!repo) {
    return null;
  }

  const tabs = [
    { id: 'tests', label: 'Tests', count: results?.tests?.unitTests?.length || 0 },
    { id: 'docs', label: 'Documentation', count: results?.documentation?.apiDocs?.length || 0 },
    { id: 'explanations', label: 'Code Explanations', count: results?.explanations?.length || 0 },
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
              <h1 className="text-4xl font-bold mb-2">{repo.name}</h1>
              <p className="text-gray-400">{repo.url}</p>
            </div>

            <span className={`text-sm px-4 py-2 rounded-full border ${getStatusColor(repo.status)}`}>
              {repo.status}
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
            <p className="text-gray-400 text-sm mb-1">Tests Generated</p>
            <h3 className="text-2xl font-bold">{repo.testsGenerated}</h3>
          </Card>

          <Card>
            <p className="text-gray-400 text-sm mb-1">API Endpoints</p>
            <h3 className="text-2xl font-bold">{repo.apiEndpoints}</h3>
          </Card>

          <Card>
            <p className="text-gray-400 text-sm mb-1">Coverage</p>
            <h3 className="text-2xl font-bold">{repo.coverage}%</h3>
          </Card>

          <Card>
            <p className="text-gray-400 text-sm mb-1">Analyzed</p>
            <h3 className="text-lg font-bold">{formatDate(repo.analyzedAt)}</h3>
          </Card>
        </motion.div>

        {repo.status === 'processing' ? (
          <Card className="text-center py-12">
            <LoadingSpinner size="lg" className="mb-4" />
            <h3 className="text-xl font-semibold mb-2">Analysis in Progress</h3>
            <p className="text-gray-400">
              This usually takes 2-5 minutes. You can leave this page and come back later.
            </p>
          </Card>
        ) : repo.status === 'failed' ? (
          <Card className="text-center py-12">
            <div className="text-red-400 text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">Analysis Failed</h3>
            <p className="text-gray-400 mb-4">{repo.error || 'An error occurred during analysis'}</p>
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
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'tests' && (
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Test List */}
                  <div className="space-y-3">
                    <h3 className="font-semibold mb-4">Unit Tests</h3>
                    {results?.tests?.unitTests?.map((test) => (
                      <Card
                        key={test.id}
                        hover
                        onClick={() => setSelectedTest(test)}
                        className={`cursor-pointer ${selectedTest?.id === test.id ? 'border-white' : ''}`}
                      >
                        <h4 className="font-semibold mb-2">{test.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{test.framework}</span>
                          <span>{test.testCount} tests</span>
                        </div>
                      </Card>
                    ))}

                    {results?.tests?.integrationTests?.length > 0 && (
                      <>
                        <h3 className="font-semibold mb-4 mt-6">Integration Tests</h3>
                        {results.tests.integrationTests.map((test) => (
                          <Card
                            key={test.id}
                            hover
                            onClick={() => setSelectedTest(test)}
                            className={`cursor-pointer ${selectedTest?.id === test.id ? 'border-white' : ''}`}
                          >
                            <h4 className="font-semibold mb-2">{test.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span>{test.framework}</span>
                              <span>{test.testCount} tests</span>
                            </div>
                          </Card>
                        ))}
                      </>
                    )}
                  </div>

                  {/* Test Code */}
                  <div className="md:col-span-2">
                    {selectedTest ? (
                      <Card>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold">{selectedTest.name}</h3>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => copyToClipboard(selectedTest.code)}
                            >
                              Copy
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => downloadFile(selectedTest.code, selectedTest.name)}
                            >
                              Download
                            </Button>
                          </div>
                        </div>
                        <pre className="bg-black rounded-xl p-4 overflow-x-auto text-sm border border-gray-800">
                          <code className="text-gray-300">{selectedTest.code}</code>
                        </pre>
                      </Card>
                    ) : (
                      <Card className="text-center py-12">
                        <p className="text-gray-400">Select a test file to view its content</p>
                      </Card>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'docs' && (
                <div className="space-y-6">
                  {results?.documentation?.apiDocs?.map((doc) => (
                    <Card key={doc.id}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{doc.title}</h3>
                          <span className="text-sm text-gray-400">{doc.type}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => copyToClipboard(doc.content)}
                          >
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => downloadFile(doc.content, `${doc.title}.yaml`)}
                          >
                            Download
                          </Button>
                        </div>
                      </div>
                      <pre className="bg-black rounded-xl p-4 overflow-x-auto text-sm border border-gray-800">
                        <code className="text-gray-300">{doc.content}</code>
                      </pre>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'explanations' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {results?.explanations?.map((exp) => (
                    <Card key={exp.id}>
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-2">{exp.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span>{exp.file}</span>
                          <span>•</span>
                          <span>{exp.type}</span>
                          <span>•</span>
                          <span className={`
                            ${exp.complexity === 'Low' ? 'text-green-400' : ''}
                            ${exp.complexity === 'Medium' ? 'text-yellow-400' : ''}
                            ${exp.complexity === 'High' ? 'text-red-400' : ''}
                          `}>
                            {exp.complexity} complexity
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                        {exp.explanation}
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-800 text-sm text-gray-400">
                        {exp.linesOfCode} lines of code
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Results;

// Made with Bob
