import { Nullable } from '../types/common';
import { isNone } from './common';

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

interface SmartCache<Value, CacheValue> {
  get: () => Nullable<CacheValue>;
  set: (value: Value) => void;
  clear: () => void;
  isStaleOrInvalid: () => boolean;
  isPrimed: () => boolean;
}

type Cache<Value> = { value: Value; lastUpdated: number };

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
  key: string,
  writer: (key: string, value: Cache<Value>) => void,
  reader: (key: string) => Nullable<Cache<Value>>,
  validator: (value: Nullable<Cache<Value>>) => boolean
): SmartCache<Value, Cache<Value>> {
  const isStaleOrInvalid = () => {
    const cached = getLocalStorageValue<Cache<Value>>(key);
    return isNone(cached) || validator(cached);
  };
  return {
    get: () => reader(key),
    set: (value: Value) => writer(key, { value, lastUpdated: Date.now() }),
    clear: () => removeLocalStorageValue(key),
    isStaleOrInvalid,
    isPrimed: () => !isStaleOrInvalid(),
  };
}

interface ReadonlyCache<Value, Transformed> {
  get: () => Nullable<Value | Transformed>;
}

export function createReadonlyCache<Value, Transformed>(
  key: string,
  reader: (key: string) => Nullable<Value>,
  transformer?: (value: Value) => Transformed
): ReadonlyCache<Value, Transformed> {
  return {
    get: () => {
      const value = reader(key);
      if (isNone(value)) {
        return null;
      }
      if (isNone(transformer)) {
        return value;
      }
      return transformer(value);
    },
  };
}
