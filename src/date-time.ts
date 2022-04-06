import {isDate, type} from "./misc";

type Timestamp = number;
type Millis = number;
type DateLike = Date | Timestamp;

const isAfter = (date: DateLike, comparisonDate: DateLike): boolean =>
  date > comparisonDate;

const isBefore = (date: DateLike, comparisonDate: DateLike): boolean =>
  date < comparisonDate;

const addDays = (date: DateLike, daysToAdd: number): Date => {
  const day = new Date(date);
  if (!daysToAdd) {
    return day;
  }
  day.setDate(day.getDate() + daysToAdd)
  return day;
}

export const isPast = (deadline: DateLike): boolean => Date.now() > deadline;

export const elapsedSince = (start: DateLike): Millis =>
  Math.max(Date.now() - start, 0);

export const isHappeningNow = (start: DateLike, end: DateLike): boolean =>
  isAfter(Date.now(), start) && isBefore(Date.now(), end);

export const sortByDateAsc = (a: DateLike, b: DateLike): number => a - b;
export const sortByDateDesc = (a: DateLike, b: DateLike): number => b - a;

function getDate(date: DateLike): Date {
  return isDate(date) ? date : new Date(date);
}

export const getWeekday = (date: DateLike = new Date()) => {
  switch (getDate(date).getDay()) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
  }
};

export const createDays = (n = 7): Date[] => {
  const today = Date.now();
  return Array(n)
      .fill(0)
      .map((_, i) => addDays(today, i));
};

export function getDateKey(date: DateLike = new Date()): string {
  const d = getDate(date);
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}
