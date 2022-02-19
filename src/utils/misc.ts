import { Maybe } from "../Helpers";

// typeof without all the footguns
// e.g. typeof null, typeof /abc/, typeof new Number(123) and typeof new String('abc') are all 'object'
function type<T>(t: T): string {
  return Object.prototype.toString.call(t).slice(8, -1).toLowerCase();
}

const isNumber = (x: unknown): x is number => type(x) === "number";
const isString = (x: unknown): x is string => type(x) === "string";
const isBoolean = (x: unknown): x is boolean => type(x) === "boolean";

const createValidator =
  <T>(test: (v: unknown) => v is T) =>
  (value: unknown, fallback: T): T =>
    test(value) ? value : fallback;

const validateString = createValidator(isString);
const validateNumber = createValidator(isNumber);
const validateBoolean = createValidator(isBoolean);

export function isDefined<T>(x: Maybe<T>): x is T {
  return x !== undefined && x !== null;
}

export function isUndefined<T>(x: Maybe<T>) {
  return !isDefined(x);
}

// input array of objects with some key, and an attributeGetter to pull that property value off them
// get back an object with keys that are the result of calling the attributeGetter on each object
// and values that are each object with the specific value for that property
// this is very valuable if you have a lot of object and you need a way to look a specific one up in O(1) time.
/**
 * const vehicles = [
 * {id: 123, type: 'car', make: 'Toyota', name: 'Prius'},
 * {id: 456, type: 'car', make: 'Ford', name: 'Mustang'},
 * {id: 789, type: 'car', make: 'Toyota', name: 'Corolla'}
 * ];
 * keyByProperty(vehicles, (vehicle) => vehicle.id);
    {
        123: {id: 123, type: 'car', make: 'Toyota', name: 'Prius'},
        456: {id: 456, type: 'car', make: 'Ford', name: 'Mustang'},
        789: {id: 789, type: 'car', make: 'Toyota', name: 'Corolla'}
    }
 */
export function keyByProperty<
  T extends Record<string | number, string | number>,
  K extends keyof T
>(array: T[], attributeGetter: (item: T) => T[K]): Record<T[K], T> {
  return array.reduce(
    (accumulator, item) => {
      const value = attributeGetter(item);
      accumulator[value] = item;
      return accumulator;
    },

    {} as Record<T[K], T>
  );
}

// input array of objects with some key, and an attributeGetter to pull that property value off them
// get back an object with keys that are the result of calling the attributeGetter on each object
// and values that are an array of each object with the same value for that property
/**
 * const vehicles = [
 * {type: 'car', make: 'Toyota', name: 'Prius'},
 * {type: 'car', make: 'Ford', name: 'Mustang'},
 * {type: 'car', make: 'Toyota', name: 'Corolla'}
 * ];
 * groupByProperty(vehicles, (vehicle) => vehicle.make);
    {
        Toyota: [
            {type: 'car', make: 'Toyota', name: 'Prius'},
            {type: 'car', make: 'Toyota', name: 'Corolla'}
        ],
        Ford: [
            {type: 'car', make: 'Ford', name: 'Mustang'},
        ]
    }
 */
export function groupByProperty<
  T extends Record<string | number, string | number>,
  K extends keyof T
>(array: T[], attributeGetter: (item: T) => T[K]): Record<T[K], T[]> {
  return array.reduce((previous, current) => {
    const value = attributeGetter(current);
    previous[value] = (previous[value] || []).concat(current);
    return previous;
  }, {} as Record<T[K], T[]>);
}

export function partition<T>(
  list: T[],
  predicate: (item: T) => boolean
): [predicateMatch: T[], predicateMiss: T[]] {
  if (!list || list.length === 0) {
    return [[], []];
  }
  const match = [];
  const miss = [];
  for (const item of list) {
    if (predicate(item)) {
      match.push(item);
    } else {
      miss.push(item);
    }
  }
  return [match, miss];
}

const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;

export function groupByDate<T>(
  list: T[],
  groupByGetter: (item: T) => string | number
): Record<string | number, T[]> {}

/**
 * Generates sequential IDs that will always be the same across multiple instances
 * Useful if you need to generate mocks of something that must reference another object by id
 */
export const buildIDGen = (): (() => string) => {
  let n = 0.0001;
  const iterate = (): string => {
    const res = n.toString(36);
    n += 0.0001;
    return res;
  };
  return (): string => iterate().substr(2, 5).toUpperCase();
};
