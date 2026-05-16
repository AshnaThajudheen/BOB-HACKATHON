// Formatting utility functions

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatPercentage = (value) => {
  return `${Math.round(value)}%`;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getRepoNameFromUrl = (url) => {
  try {
    const parts = url.split('/');
    return parts[parts.length - 1] || parts[parts.length - 2];
  } catch {
    return 'Unknown Repository';
  }
};

export const getStatusColor = (status) => {
  const colors = {
    completed: 'text-green-400',
    processing: 'text-yellow-400',
    failed: 'text-red-400',
    pending: 'text-gray-400',
  };
  return colors[status] || colors.pending;
};

export const getStatusBgColor = (status) => {
  const colors = {
    completed: 'bg-green-400/10 border-green-400/20',
    processing: 'bg-yellow-400/10 border-yellow-400/20',
    failed: 'bg-red-400/10 border-red-400/20',
    pending: 'bg-gray-400/10 border-gray-400/20',
  };
  return colors[status] || colors.pending;
};

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Made with Bob
