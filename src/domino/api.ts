import { cloneOf, entriesOf } from '../utils/object';
import { ComputedField, DominoInternals, DominoValues } from './types';

function hashPrimitive(arg: unknown): string {
  switch (typeof arg) {
    case 'string':
      return arg;
    case 'number':
      return arg.toString();
    case 'boolean':
      return arg.toString();
    case 'undefined':
      return 'undefined';
    case 'object':
      if (arg === null) {
        return 'null';
      }
      return JSON.stringify(arg);
    default:
      throw new Error(`Unknown argument type: ${typeof arg}`);
  }
}

export function defaultHashFunction(...args: unknown[]): string {
  if (args.length === 1) {
    return hashPrimitive(args[0]);
  }
  return args.map(hashPrimitive).join('|');
}

/**
 * @description Create a new Domino object.
 * @param initialDefaults The default values of the Domino.
 * @param initialMutations The mutations of the Domino.
 * @param initialComputedFields The computed fields of the Domino.
 * @returns A new Domino object.
 * @description A Domino's job is to make computing updates easy.
 * A Domino's internal state is made up of defaults, mutations, and computed fields.
 *
 * defaults are exactly what they sound like, the default values of the Domino.
 *
 * mutations are *only* the values that have been changed from the defaults.
 *
 * values are the final values of the Domino, computed from the defaults and mutations.
 *
 * Computed fields are cached and only recomputed when the defaults or mutations change, or when the computed field's hash changes.
 * All methods return new Domino objects, and do not modify the original Domino.
 */
export function createDomino<T extends DominoValues>(
  initialDefaults: T,
  initialMutations: Partial<T> = {},
  initialComputedFields: Record<keyof T, ComputedField<T>> = {} as Record<
    keyof T,
    ComputedField<T>
  >
): DominoInternals<T> {
  const defaults = cloneOf(initialDefaults);
  const mutations: Partial<T> = cloneOf(initialMutations);
  const computedFields: Record<keyof T, ComputedField<T>> = {
    ...initialComputedFields,
  };

  const isModified = Boolean(Object.keys(mutations).length);

  const initialValues: T = {
    ...defaults,
    ...mutations,
  };
  const values = {
    ...initialValues,
    ...entriesOf(computedFields).reduce(
      (acc, [key, field]) => {
        acc[key] = field.compute({
          defaults,
          values: initialValues,
          mutations,
          isModified,
        });
        return acc;
      },
      {} as Record<keyof T, T[keyof T]>
    ),
  };

  const update = (fields: Partial<T>) => {
    return createDomino(
      defaults,
      {
        ...mutations,
        ...fields,
      },
      computedFields
    );
  };

  const resetField = (field: keyof T) => {
    delete mutations[field];
    return createDomino(defaults, mutations, computedFields);
  };

  const setDefaults = (newDefaults: Partial<T>) => {
    return createDomino(
      {
        ...defaults,
        ...newDefaults,
      },
      mutations,
      computedFields
    );
  };

  const reset = () => {
    return createDomino(defaults, undefined, computedFields);
  };

  const addComputedField = <Key extends keyof T>(
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
    const hash = hashFunction({ defaults, values, mutations, isModified });
    if (key in computedFields && hash === computedFields[key].hash) {
      return;
    }

    return createDomino(defaults, mutations, {
      ...computedFields,
      [key]: {
        hash,
        compute,
      },
    });
  };

  return {
    values,
    mutations,
    defaults,
    computedFields,
    isModified,
    update,
    resetField,
    setDefaults,
    reset,
    addComputedField,
  };
}
