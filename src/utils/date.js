// src/utils/date.js

// Converts ISO date (e.g., 2023-08-01) to a readable format (e.g., Aug 1, 2023)
export const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Gets today’s date in YYYY-MM-DD format (useful for date input max attribute)
export const getTodayISODate = () => {
  return new Date().toISOString().split('T')[0];
};
