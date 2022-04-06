import {Maybe} from "./types";

// helper to check if an array is undefined, null, or empty.
const isEmpty = <T>(array: Maybe<T[]>): array is undefined | null => !Array.isArray(array) || !array.length;

/**
 * input array of objects with some unique value, and an attributeGetter to pull that property value off them
 * get back an object with keys that are the result of calling the attributeGetter on each object
 * and values that are each object with the specific value for that property.
 * This is very valuable if you have a lot of objects, and you need a way to look a specific one up in O(1) time.

   const vehicles = [
     { id: 123, type: 'car', make: 'Toyota', name: 'Prius' },
     { id: 456, type: 'car', make: 'Ford', name: 'Mustang' },
     { id: 789, type: 'car', make: 'Toyota', name: 'Corolla' }
   ];
   keyBy(vehicles, vehicle => vehicle.id);
   {
      123: { id: 123, type: 'car', make: 'Toyota', name: 'Prius' },
      456: { id: 456, type: 'car', make: 'Ford', name: 'Mustang' },
      789: { id: 789, type: 'car', make: 'Toyota', name: 'Corolla' }
   }
 */
export function keyBy<
    T extends Record<string | number, string | number>,
    K extends keyof T
    >(array: Maybe<T[]>, attributeGetter: (item: T) => T[K]): Record<T[K], T> {
    if (isEmpty(array)) {
        return {} as Record<T[K], T>;
    }
    return array.reduce(
        (accumulator, item) => {
            const value = attributeGetter(item);
            accumulator[value] = item;
            return accumulator;
        }, {} as Record<T[K], T>);
}

/**
 * input array of objects with some key, and an attributeGetter to pull that property value off them
 * get back an object with keys that are the result of calling the attributeGetter on each object
 * and values that are an array of each object with the same value for that property

  const vehicles = [
    { type: 'car', make: 'Toyota', name: 'Prius' },
    { type: 'car', make: 'Ford', name: 'Mustang' },
    { type: 'car', make: 'Toyota', name: 'Corolla' }
  ];
  groupBy(vehicles, (vehicle) => vehicle.make);
  {
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
    >(array: Maybe<T[]>, attributeGetter: (item: T) => T[K]): Record<T[K], T[]> {
    if (isEmpty(array)) {
        return {} as Record<T[K], T[]>;
    }
    return array.reduce((previous, current) => {
        const value = attributeGetter(current);
        previous[value] = previous[value].concat(current);
        return previous;
    }, {} as Record<T[K], T[]>);
}

// Split an array into two groups based on the return value of a predicate function
// essentially filter, but it doesn't throw filtered items out.
export function partition<T>(
    array: Maybe<T[]>,
    predicate: (item: T) => boolean
): [T[], T[]] {
    if (isEmpty(array)) {
        return [[], []];
    }
    const match = [];
    const miss = [];
    for (const item of array) {
        if (predicate(item)) {
            match.push(item);
        } else {
            miss.push(item);
        }
    }
    return [match, miss];
}

export function sample<T>(array: Maybe<T[]>): Maybe<T> {
  if (isEmpty(array)) return null;
  return array[Math.floor(Math.random() * array.length)];
}


// times(5, getRandomNumber); -> [64, 70, 29, 10, 23]
export function times<T>(count: number, predicate: () => T): T[] {
  const result: T[] = [];
  while(count--) {
    result.push(predicate);
  }
  return result;
}
