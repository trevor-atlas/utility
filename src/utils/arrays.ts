import { Nullable, ValueOf } from '../types/common';
import { isEmpty, isNone } from './common';

export type IdLike = string | number;

export interface Normalized<T> {
  byKey: Record<IdLike, T>;
  allKeys: Array<IdLike>;
}

/**
 * input array of objects with some unique value, and an keyGetter to pull that property value off them
 * get back an object with keys that are the result of calling the keyGetter on each object
 * and values that are each object with the specific value for that property.
 * This is very valuable if you have a lot of objects, and you need a way to look a specific one up in O(1) time.
 * @example
   const vehicles = [
     { id: 123, type: 'car', make: 'Toyota', name: 'Prius' },
     { id: 456, type: 'car', make: 'Ford', name: 'Mustang' },
     { id: 789, type: 'car', make: 'Toyota', name: 'Corolla' }
   ];
   keyBy(vehicles, v => v.id);
   // -> {
      123: { id: 123, type: 'car', make: 'Toyota', name: 'Prius' },
      456: { id: 456, type: 'car', make: 'Ford', name: 'Mustang' },
      789: { id: 789, type: 'car', make: 'Toyota', name: 'Corolla' }
   }
 */
export function keyBy<
  T extends Record<string | number, string | number>,
  K extends keyof T
>(array: Nullable<T[]>, getKey: (item: T) => T[K]): Record<T[K], T> {
  if (isEmpty(array)) {
    return {} as Record<T[K], T>;
  }
  return array.reduce((accumulator, item) => {
    const key = getKey(item);
    accumulator[key] = item;
    return accumulator;
  }, {} as Record<T[K], T>);
}

/**
 * input array of objects with some key, and a keyGetter to pull that property value off them
 * get back an object with keys that are the result of calling the keyGetter on each object
 * and values that are an array of each object with the same value for that property
 * @example
  const vehicles = [
    { type: 'car', make: 'Toyota', name: 'Prius' },
    { type: 'car', make: 'Ford', name: 'Mustang' },
    { type: 'car', make: 'Toyota', name: 'Corolla' }
  ];
  groupBy(vehicles, v => v.make);
  // -> {
    Toyota: [
      { type: 'car', make: 'Toyota', name: 'Prius' },
      { type: 'car', make: 'Toyota', name: 'Corolla' }
    ],
    Ford: [
      { type: 'car', make: 'Ford', name: 'Mustang' },
    ]
  }
 */
export function groupBy<
  T extends Record<string | number, string | number>,
  K extends keyof T
>(array: Nullable<T[]>, getKey: (item: T) => T[K]): Record<T[K], T[]> {
  if (isEmpty(array)) {
    return {} as Record<T[K], T[]>;
  }
  return array.reduce((previous, current) => {
    const value = getKey(current);
    previous[value] = previous[value].concat(current);
    return previous;
  }, {} as Record<T[K], T[]>);
}

export function normalizeEntities<T>(
  entities: Nullable<T[]>,
  getKey: (item: T) => IdLike
): Normalized<T> {
  if (isEmpty(entities)) {
    return {
      byKey: {},
      allKeys: [],
    };
  }

  return entities.reduce<Normalized<T>>(
    (accumulator, entity) => {
      if (isNone(entity)) {
        return accumulator;
      }
      const key = getKey(entity);
      if (!(key in accumulator.byKey)) {
        accumulator.allKeys.push(key);
      }
      accumulator.byKey[key] = entity;
      return accumulator;
    },
    {
      byKey: {},
      allKeys: [],
    }
  );
}

export function normalizedToList<T, NormalizedEntities extends Normalized<T>>(
  normalized: Nullable<NormalizedEntities>
) {
  if (isNone(normalized) || isEmpty(normalized.allKeys)) {
    return [];
  }
  return normalized.allKeys.map((id) => normalized.byKey[id]);
}

/**
 * @description Returns a random element from an array
 * @example sample([1, 2, 3, 4, 5]) -> 3
 *
 */
export function sample<T>(array: Nullable<T[]>): Nullable<T> {
  if (isEmpty(array)) {
    return null;
  }
  return array[Math.floor(Math.random() * array.length)];
}

/**
 *
 * @example times(5, getRandomNumber); -> [64, 70, 29, 10, 23]
 */
export function times<T>(count: number, predicate: (index: number) => T): T[] {
  const result: T[] = [];
  let i = 0;
  while (i < count) {
    result.push(predicate(i));
    i++;
  }
  return result;
}

export const toId = <T>(
  entity: T,
  keyGetter: (entity: T) => ValueOf<T>
): ValueOf<T> => keyGetter(entity);

export const partition = <T>(list: Nullable<T[]>, callback: (item: T) => boolean): [T[], T[]] => {
  const passed: T[] = [];
  const failed: T[] = [];

  if (isEmpty(list)) {
    return [passed, failed];
  }

  for (const item of list) {
    if (!callback(item)) {
      failed.push(item);
    } else {
      passed.push(item);
    }
  }

  return [passed, failed];
};
