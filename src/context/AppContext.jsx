import { createContext, useContext, useState, useEffect } from 'react';
import { mockRepositories, mockStats, analyzeRepository, getRepositoryResults } from '../services/mockData';
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
    setRepositories(mockRepositories);
    
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
      
      // Simulate processing completion after 3 seconds
      setTimeout(() => {
        setRepositories(prev => 
          prev.map(repo => 
            repo.id === newRepo.id 
              ? { ...repo, status: 'completed', testsGenerated: 142, apiEndpoints: 38, coverage: 87 }
              : repo
          )
        );
        toast.success('Analysis completed!');
      }, 3000);
      
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

  const getRepoResults = async (repoId) => {
    setLoading(true);
    try {
      const results = await getRepositoryResults(repoId);
      return results;
    } catch (error) {
      toast.error('Failed to load results');
      throw error;
    } finally {
      setLoading(false);
    }
  };

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
