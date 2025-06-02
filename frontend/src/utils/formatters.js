import { formatDistanceToNow } from 'date-fns';

// Format price to currency
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

// Format date to relative time
export const formatDate = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};
