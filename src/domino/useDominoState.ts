import { useMemo, useState } from 'react';
import { createDomino, defaultHashFunction } from './api';
import { DominoValues, Domino } from './types';

/**
 * @description A hook that returns a Domino object and public methods for manipulating the Domino.
 * @param defaults The default values of the Domino.
 * @returns A Domino object and its methods.
 */
export function useDominoState<T extends DominoValues = DominoValues>(
  defaults: T | (() => T)
): Domino<T> {
  const [domino, setDomino] = useState(() =>
    createDomino(typeof defaults === 'function' ? defaults() : defaults)
  );
  return useMemo(
    () => ({
      values: domino.values,
      defaults: domino.defaults,
      isModified: domino.isModified,
      setDefaults: (values: Partial<T>) =>
        setDomino((d) => d.setDefaults(values)),
      reset: () => setDomino((d) => d.reset()),
      update: (fields: Partial<T>) => setDomino((d) => d.update(fields)),
      resetField: (field: keyof T) => setDomino((d) => d.resetField(field)),
      addComputedField: <Key extends keyof T>(
        key: Key,
        compute: (args: {
          defaults: T;
          values: T;
          mutations: Partial<T>;
          isModified: boolean;
        }) => T[Key],
        hashFunction: (args: {
          defaults: T;
          values: T;
          mutations: Partial<T>;
          isModified: boolean;
        }) => string = defaultHashFunction
      ) => {
        const update = domino.addComputedField(key, compute, hashFunction);
        if (update) {
          setDomino(update);
        }
      },
    }),
    [domino]
  );
}
