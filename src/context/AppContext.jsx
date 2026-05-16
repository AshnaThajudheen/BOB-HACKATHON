import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchHistory, analyzeRepository, getRepositoryResults } from '../services/api';
import { mockStats } from '../services/mockData'; // Keeping stats mocked for the dashboard visuals
import toast from 'react-hot-toast';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [repositories, setRepositories] = useState([]);
  const [stats, setStats] = useState(mockStats);
  const [loading, setLoading] = useState(false);
  const [currentRepo, setCurrentRepo] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [settings, setSettings] = useState({
    apiKey: '',
    email: '',
    notifications: true,
    autoAnalyze: false,
  });

  // Load initial data
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await fetchHistory();
        setRepositories(history);
      } catch (error) {
        console.error("Failed to load history:", error);
      }
    };
    loadHistory();
    
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
  }, [settings]);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const analyzeRepo = async (repoUrl) => {
    setLoading(true);
    try {
      const newRepo = await analyzeRepository(repoUrl);
      setRepositories(prev => [newRepo, ...prev]);
      setCurrentRepo(newRepo);
      
      toast.success('Repository analysis started!');
      
      // We don't simulate completion anymore, the Results page will poll.
      
      return newRepo;
    } catch (error) {
      toast.error('Failed to analyze repository');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getRepoById = (id) => {
    return repositories.find(repo => repo.id === id);
  };

  const getRepoResults = useCallback(async (repoId) => {
    // Only set loading if it's the first time
    try {
      const results = await getRepositoryResults(repoId);
      
      // If we got the results, ensure the repo in context is up to date
      if (results.status === 'completed' || results.status === 'failed') {
        setRepositories(prev => prev.map(r => r.id === repoId ? results : r));
      }
      
      return results;
    } catch (error) {
      console.error('Failed to load results:', error);
      throw error;
    }
  }, []);

  const deleteRepo = (repoId) => {
    setRepositories(prev => prev.filter(repo => repo.id !== repoId));
    toast.success('Repository deleted');
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    toast.success('Settings updated');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const value = {
    repositories,
    stats,
    loading,
    currentRepo,
    theme,
    settings,
    analyzeRepo,
    getRepoById,
    getRepoResults,
    deleteRepo,
    updateSettings,
    toggleTheme,
    setCurrentRepo,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Made with Bob
