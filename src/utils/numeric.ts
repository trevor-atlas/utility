import { Nullable } from '../types/common';
import { isSome } from './common';

export const IS_NUMERIC_STRING = /\d+/;

export const isNumericString = (
  value: Nullable<string>
): value is `${number}` => isSome(value) && IS_NUMERIC_STRING.test(value);

export const isNumeric = (value: Nullable<number>): value is number =>
  isSome(value) && typeof value === 'number';

export const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(n, min));

export const randomHex = () =>
  '#' + Math.floor(Math.random() * 16777215).toString(16);

export const suffixNumber = (n: number) => {
  // gives us the last digit of n
  const d = n % 10;
  if (d === 1 && n !== 11) return `${n}st`;
  if (d === 2 && n !== 12) return `${n}nd`;
  if (d === 3 && n !== 13) return `${n}rd`;
  return `${n}th`;
};

export const roundToNearestHundred = (n: number) => Math.round(n / 100) * 100;

export const toPercentageOf = (n: number, total: number) => (n / total) * 100;

export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
