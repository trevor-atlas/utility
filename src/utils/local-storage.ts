import { None, Nullable } from '../types/common';
import { isNone, isSome } from './common';

export function setLocalStorageValue<T>(key: string, value: T) {
  try {
    const marshaled = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, marshaled);
  } catch {
    console.error(`Failed to set local storage value for "${key}"`);
  }
}

export function getLocalStorageValue<T>(key: string): Nullable<T> {
  try {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value) as T;
    }
    return null;
  } catch {
    return null;
  }
}

export function removeLocalStorageValue(key: string) {
  localStorage.removeItem(key);
}

interface SmartCache<Value> {
  get(): Promise<Nullable<Timestamped<Value>>>;
  set: (value: Value) => Promise<void>;
  isStaleOrInvalid: () => Promise<boolean>;
  isPrimed: () => Promise<boolean>;
}

type Timestamped<Value> = { value: Value; lastUpdated: number };

/**
 * Creates a cache object that can be used to store and retrieve values from a storage medium
 * such as local storage, session storage, or a database (though it's not async).
 * @param key the key to use when writing to the storage medium
 * @param writer a function to write to the storage medium
 * @param reader a function to read from the storage medium
 * @param validator a function to validate the cache value
 * @example
 * const cache = createCache(
 *  'my-key',
 * (key, value) => setLocalStorageValue(key, value),
 * (key) => getLocalStorageValue(key),
 * (value) => isNone(value) || Date.now() - value.lastUpdated > 1000 * 60 * 60 * 24,
 * );
 *
 * cache.set('value');
 * cache.get(); // -> { value: 'value', lastUpdated: 123456789 }
 *
 */
export function createCache<Value>(
  writer: (value: Timestamped<Value>) => Promise<void>,
  reader: () => Promise<Nullable<Timestamped<Value>>>,
  validator: (value: Nullable<Timestamped<Value>>) => Promise<boolean>
): SmartCache<Value> {
  const isStaleOrInvalid = async () => {
    const cached = await reader();
    return isNone(cached) || validator(cached);
  };
  return {
    get: async () => reader(),
    set: async (value: Value) => {
      await writer({ value, lastUpdated: Date.now() });
    },
    isStaleOrInvalid,
    isPrimed: async () => {
      const res = await isStaleOrInvalid();
      return res;
    },
  };
}

interface ReadonlyCache<V> {
  get(): Promise<Nullable<V>>;
}

export function createReadonlyCache<Value>(
  reader: () => Promise<Nullable<Value>>
): ReadonlyCache<Value> {
  return {
    async get() {
      const value = await reader();
      return value;
    },
  };
}

export function transformCache<T, U>(
  cache: { get(): Promise<T> },
  transformer: (value: T) => U
) {
  return {
    async get() {
      const value = await cache.get();
      return transformer(value);
    },
  };
}
