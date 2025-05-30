import { tryCatch } from './tryCatch';
import { Nullable } from '../types/common';
import { isNone } from './typeguards';
import { identity, none } from './common';

interface StorageStrategy {
  get: <T>(key: string, deserialize?: (value: string) => T) => Nullable<T>;
  set: <T>(key: string, value: T, serialize?: (value: T) => string) => void;
  remove: (key: string) => void;
  clear: () => void;
  keys: () => string[];
}

/**
 * Creates a wrapper around the Storage API that provides a more type-safe and functional interface.
 * @param namespace - The namespace to use for the storage keys
 * @param storage - The Storage object to wrap (localStorage, sessionStorage, or something that implements the Storage interface)
 * @returns An object with methods for getting, setting, removing, and clearing items in the storage */
export function createStorageWrapper(
  namespace: string,
  storage: Storage
): StorageStrategy {
  if (!namespace) {
    throw new Error('Namespace must be a non-empty string');
  }
  const getKey = (key: string) => `${namespace}:${key}`;
  const inNamespace = (key: string) => key.startsWith(namespace);
  return {
    get<T>(
      key: string,
      deserialize: (value: string) => T = JSON.parse
    ): Nullable<T> {
      return tryCatch(() => {
        const entry = storage.getItem(getKey(key));
        if (isNone(entry) || entry === '') {
          return null;
        }
        return deserialize(entry);
      }).match(identity, none);
    },
    set<T>(key: string, value: T, serialize?: (value: T) => string): void {
      tryCatch(() => {
        if (typeof serialize === 'function') {
          storage.setItem(getKey(key), serialize(value));
        } else {
          storage.setItem(
            getKey(key),
            typeof value === 'string' ? value : JSON.stringify(value)
          );
        }
      });
    },
    remove(key: string): void {
      tryCatch(() => {
        storage.removeItem(getKey(key));
      });
    },
    clear(): void {
      tryCatch(() => {
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key && inNamespace(key)) {
            storage.removeItem(key);
          }
        }
      });
    },
    keys(): string[] {
      return Array(storage.length)
        .fill(0)
        .map((_, i) => storage.key(i))
        .filter((key) => key && inNamespace(key)) as string[];
    },
  };
}
