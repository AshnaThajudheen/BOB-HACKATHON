// Validation utility functions

export const isValidGitHubUrl = (url) => {
  const githubPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
  return githubPattern.test(url);
};

export const isValidEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateRepoInput = (input) => {
  const errors = {};
  
  if (!input || input.trim() === '') {
    errors.url = 'Repository URL is required';
    return errors;
  }
  
  if (!isValidUrl(input)) {
    errors.url = 'Please enter a valid URL';
    return errors;
  }
  
  if (!isValidGitHubUrl(input)) {
    errors.url = 'Please enter a valid GitHub repository URL';
    return errors;
  }
  
  return errors;
};

export const validateSettings = (settings) => {
  const errors = {};
  
  if (settings.apiKey && settings.apiKey.length < 10) {
    errors.apiKey = 'API key must be at least 10 characters';
  }
  
  if (settings.email && !isValidEmail(settings.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  return errors;
};

// Made with Bob
