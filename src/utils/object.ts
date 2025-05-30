import { Entries, ValueOf } from '../types/common';

export const valuesOf = Object.values as <T extends object>(
  obj: T
) => Array<ValueOf<T>>;

export const entriesOf = Object.entries as <T extends object>(
  obj: T
) => Entries<T>;

export const cloneOf = <T>(obj: T): T =>
  ('structuredClone' in window && structuredClone
    ? structuredClone(obj)
    : JSON.parse(JSON.stringify(obj))) as T;

export const keysOf = Object.keys as <T extends object>(
  obj: T
) => Array<keyof T>;

export const hasKey = <T extends object, K extends keyof T>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> => key in obj;
