import { times } from './arrays';
import { isDate } from './common';

export const MILLISECONDS_PER_SECOND = 1000;
export const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;
export const DAYS_PER_WEEK = 7;

export const ONE_SECOND = MILLISECONDS_PER_SECOND;
export const ONE_MINUTE = ONE_SECOND * SECONDS_PER_MINUTE;
export const ONE_HOUR = ONE_MINUTE * MINUTES_PER_HOUR;
export const ONE_DAY = ONE_HOUR * HOURS_PER_DAY;

// Maximum time after which setTimeout breaks.
// See https://stackoverflow.com/questions/3468607/why-does-settimeout-break-for-large-millisecond-delay-values
export const SETTIMEOUT_MAX_LIMIT = 2147483647;

export const timeElapsedSince = (start: number): number =>
  Math.max(Date.now() - start, 0);

export const getWeekday = (
  timestamp: number | Date
):
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday' => {
  if (typeof timestamp === 'number') {
    return getWeekday(new Date(timestamp));
  }
  switch (new Date().getDay()) {
    case 0:
      return 'Sunday';
    case 1:
      return 'Monday';
    case 2:
      return 'Tuesday';
    case 3:
      return 'Wednesday';
    case 4:
      return 'Thursday';
    case 5:
      return 'Friday';
    case 6:
      return 'Saturday';
    default:
      throw new Error('Invalid weekday, this should never happen');
  }
};

type DateLike = Date | number;

const isAfter = (date: DateLike, comparisonDate: DateLike): boolean =>
  date > comparisonDate;

const isBefore = (date: DateLike, comparisonDate: DateLike): boolean =>
  date < comparisonDate;

const addDays = (date: DateLike, daysToAdd: number): Date => {
  const day = new Date(date);
  if (!daysToAdd) {
    return day;
  }
  day.setDate(day.getDate() + daysToAdd);
  return day;
};

export const isPast = (deadline: DateLike): boolean => Date.now() > deadline;

export const elapsedSince = (start: DateLike): number => {
  if (isDate(start)) {
    return elapsedSince(start.getTime());
  }
  return Math.max(Date.now() - start, 0);
};

export const isHappeningNow = (start: DateLike, end: DateLike): boolean =>
  isAfter(Date.now(), start) && isBefore(Date.now(), end);

export const sortByDateAsc = (a: DateLike, b: DateLike): number => a - b;
export const sortByDateDesc = (a: DateLike, b: DateLike): number => b - a;

function getDate(date: DateLike): Date {
  return isDate(date) ? date : new Date(date);
}

export const createDays = (n = 7): Date[] => {
  const today = Date.now();
  return times(n, (i) => addDays(today, i));
};

export function getDateKey(date: DateLike = new Date()): string {
  const d = getDate(date);
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}
