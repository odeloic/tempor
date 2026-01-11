import { strings } from '@/constants/strings';
import { isToday, isYesterday, startOfDay } from 'date-fns';

export const formatDateLabel = (timestamp: number): string => {
  const date = startOfDay(timestamp);

  if (isToday(date)) return strings.today;
  if (isYesterday(date)) return strings.yesterday;

  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
};

export const getDateKey = (timestamp: number): string => {
  const date = startOfDay(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
