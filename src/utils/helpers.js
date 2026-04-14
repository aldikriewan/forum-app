// Format date to readable format
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  // If less than 1 minute ago
  if (diff < 60000) {
    return 'just now';
  }

  // If less than 1 hour ago
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  // If less than 1 day ago
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  // If less than 1 week ago
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  // Otherwise show the date
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Truncate text
export const truncateText = (text, length = 100) => {
  if (text.length > length) {
    return `${text.substring(0, length)}...`;
  }
  return text;
};

// Get user initials from name
export const getUserInitials = (name) => {
  const parts = name.split(' ');
  const initials = parts.map((part) => part.charAt(0).toUpperCase()).join('');
  return initials;
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Check if user has voted
export const hasUserVoted = (userId, votesArray = []) => votesArray.includes(userId);
