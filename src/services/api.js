const API_BASE_URL = 'http://127.0.0.1:8000';

export const fetchHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/history`);
  if (!response.ok) throw new Error('Failed to fetch history');
  const data = await response.json();
  return data.repositories || [];
};

export const analyzeRepository = async (repoUrl) => {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: repoUrl }),
  });
  
  if (!response.ok) throw new Error('Failed to start analysis');
  const data = await response.json();
  
  // Return a mock repository object so the UI can immediately display the processing state
  return {
    id: data.id,
    name: repoUrl.split('/').pop(),
    url: repoUrl,
    status: data.status || 'processing',
    analyzedAt: new Date().toISOString(),
    testsGenerated: 0,
    apiEndpoints: 0,
    coverage: 0,
    language: 'Detecting...',
    framework: 'Detecting...',
    linesOfCode: 0,
  };
};

export const getRepositoryResults = async (repoId) => {
  const response = await fetch(`${API_BASE_URL}/results/${repoId}`);
  if (!response.ok) throw new Error('Failed to fetch results');
  const data = await response.json();
  return data;
};
