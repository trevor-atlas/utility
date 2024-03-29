import { None, Nullable } from '../types/common';

/**
 * typeof without all the footguns
 * e.g.
 * ```ts
 * type([]); // -> 'array'
 * type(null); // -> 'null'
 * type(undefined); // -> 'undefined'
 * type(new Number(2)); // -> 'number'
 * ``` */
export function kind<T>(t: T) {
  return Object.prototype.toString.call(t).slice(8, -1).toLowerCase();
}

export function isSome<T>(value: Nullable<T>): value is T {
  return value !== undefined && value !== null;
}

export function isNone<T>(value: Nullable<T>): value is None {
  return !isSome(value);
}

export const isNumber = (x: unknown): x is number => kind(x) === 'number';
export const isString = (x: unknown): x is string => kind(x) === 'string';
export const isBoolean = (x: unknown): x is boolean => kind(x) === 'boolean';
export const isDate = (x: unknown): x is Date => kind(x) === 'date';

export const isFilled = <T>(array: Nullable<T[]>): array is T[] => {
  if (isNone(array)) {
    return false;
  }
  return Array.isArray(array) && !!array.length;
};

export const isEmpty = <T>(array: Nullable<T[]>): array is [] | None => {
  if (isNone(array)) {
    return true;
  }
  return !Array.isArray(array) || !array.length;
};

export const genKey = (str: string, n: number): string =>
  window.btoa(`${str}-${n}`);

export const sleep = (ms = 100) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const createValidator =
  <T>(test: (v: unknown) => v is T) =>
  (value: unknown, fallback: T): T =>
    test(value) ? value : fallback;

export const validateString = createValidator(isString);
export const validateNumber = createValidator(isNumber);
export const validateBoolean = createValidator(isBoolean);

/**
 * Generates sequential IDs that will always be the same across multiple instances
 * Useful if you need to generate mocks of something that must reference another object by id
 * can also be used to get react to shut up about unique item keys in development
 */
export class IDGen {
  private n = 0.0001;
  private iterate(): string {
    const res = btoa(this.n.toString(36));
    this.n += 0.0001;
    return res;
  }
  public next(): string {
    return this.iterate().toUpperCase();
  }
}

export const isBrowser =
  typeof window !== 'undefined' && typeof window.document !== 'undefined';

export const isWebWorker =
  typeof self === 'object' &&
  self.constructor &&
  self.constructor.name === 'DedicatedWorkerGlobalScope';
