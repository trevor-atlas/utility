type Timestamp = number;
type Millis = number;

const isAfter = (date: Timestamp, comparisonDate: Timestamp): boolean =>
  date > comparisonDate;

const isBefore = (date: Timestamp, comparisonDate: Timestamp): boolean =>
  date < comparisonDate;

export const isPast = (deadline: Timestamp): boolean => Date.now() > deadline;

export const elapsedSince = (start: Timestamp): Millis =>
  Math.max(Date.now() - start, 0);

export const isHappeningNow = (start: Timestamp, end: Timestamp): boolean =>
  isAfter(Date.now(), start) && isBefore(Date.now(), end);

export const sortByDateAsc = (a: Timestamp, b: Timestamp): number => a - b;
export const sortByDateDesc = (a: Timestamp, b: Timestamp): number => b - a;

export const getWeekday = () => {
  switch (new Date().getDay()) {
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
