export const isNodejs = () =>
    typeof process === 'object'
    && typeof process.versions === 'object'
    && typeof process.versions.node !== 'undefined';

export const isBrowser = () =>
    typeof window === 'object'
    && window instanceof Window
    && 'JSON' in window;

export const traceProperty = (object: object, property: string | symbol) => {
    let value = object[property];
    const prop = typeof property === 'string' ? property : property.toString();
    Object.defineProperty(object, property, {
        get() {
            console.trace(`${prop} requested`);
            return value;
        },
        set(newValue) {
            console.trace(`setting ${prop} to `, newValue);
            value = newValue;
        },
    })
};

export const getWeekday = () => {
    switch (new Date().getDay()) {
        case 0:
            return 'Sunday';
        case 1:
            return 'Monday';
        case 2:
            return 'Tuesday';
        case 3:
            return 'Wednesday';
        case 4:
            return 'Thursday';
        case 5:
            return 'Friday';
        case 6:
            return 'Saturday';
    }
}


const isNumber = (x: unknown): x is number => typeof x === "number";
const isString = (x: unknown): x is string => typeof x === "string";
const isBoolean = (x: unknown): x is boolean => typeof x === "boolean";

const createValidator = <X>(test: (v: unknown) => v is X) => (value: unknown, fallback: X): X =>
  test(value) ? value : fallback;

const validateString = createValidator(isString);
const validateNumber = createValidator(isNumber);
const validateBoolean = createValidator(isBoolean);

export function isDefined<T>(x: Maybe<T>): x is T {
  return x !== undefined && x !== null;
}

export function isUndefined<T>(x: Maybe<T>): x is void {
  return !isDefined(x);
}


