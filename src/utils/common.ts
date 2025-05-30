import { None, Nullable } from '../types/common';
import { tryCatch } from './tryCatch';

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


export function parseNumber(value: Nullable<string>): Nullable<number> {
  if (isNone(value) || value.trim() === '') {
    return null;
  }
  return tryCatch(() => Number(value)).match(
    (v) => v,
    () => null
  );
}

/** forces exhaustive checking in a switch statement (you will get a type error if you don't check every case) and throws a traceable error if it ever actually gets called at runtime.
 * Stick it in the default case of a switch statement to make sure you've covered all cases.  */
export function assertNever(val: never, message: string) {
  return new Error(
    `unexpected 'never' case encountered in switch statement over ${message} for value: ${JSON.stringify(
      val,
      null,
      2
    )}`
  );
}

export function noop() {}

export function identity<T>(value: T): T {
  return value;
}

export function none(): None {
  return null;
}

export function parseJSON<T>(value: string): Nullable<T> {
  return tryCatch<T>(() => JSON.parse(value)).match(
    (v) => v,
    () => null
  );
}

export function stringify(value: unknown): Nullable<string> {
  return tryCatch(() => JSON.stringify(value, null, 2)).match(
    (v) => v,
    () => null
  );
}
