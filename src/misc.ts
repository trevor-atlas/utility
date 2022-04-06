import { Maybe } from "./types";

// typeof without all the footguns
// e.g. typeof null, typeof /abc/, typeof new Number(123), typeof new String('abc') and typeof new Date() are all 'object'
export function type<T>(t: T): string {
  return Object.prototype.toString.call(t).slice(8, -1).toLowerCase();
}

export const isNumber = (x: unknown): x is number => type(x) === 'number';
export const isString = (x: unknown): x is string => type(x) === 'string';
export const isBoolean = (x: unknown): x is boolean => type(x) === 'boolean';
export const isDate = (x: unknown): x is Date => type(x) === 'date';

const createValidator =
  <T>(test: (v: unknown) => v is T) =>
  (value: unknown, fallback: T): T =>
    test(value) ? value : fallback;

export const validateString = createValidator(isString);
export const validateNumber = createValidator(isNumber);
export const validateBoolean = createValidator(isBoolean);

export function isDefined<T>(x: Maybe<T>): x is T {
  return x !== undefined && x !== null;
}

export function isUndefined<T>(x: Maybe<T>): x is undefined | null {
  return !isDefined(x);
}

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
  typeof window !== "undefined" && typeof window.document !== "undefined";

export const isNode =
  typeof process !== "undefined" &&
  process.versions != null &&
  process.versions.node != null;

export const isWebWorker =
  typeof self === "object" &&
  self.constructor &&
  self.constructor.name === "DedicatedWorkerGlobalScope";
