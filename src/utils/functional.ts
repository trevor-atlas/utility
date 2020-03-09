import { Maybe } from '../Helpers';

export const identity = <T>(v: T) => v;
export const noop = () => void 0;
export const truthy = () => true;
export const falsy = () => false;

export const pipe = <T extends any>(
    evaluate: (value: Maybe<T>) => boolean,
     ...fns: Array<(a: T) => T>
) => {
    const piped = fns.reduce(
        (prevFn, nextFn) => (value: T) => {
            // handle undefined and null by passing value through as is (skip operations)
            if (value === null || value === undefined) return value;
            if (evaluate(value)) {
                return nextFn(prevFn(value));
            }
            return value
        },
        identity
    );
    return (value: T) => piped(value);
};

export const compose = <R>(fn1: (a: R) => R, ...fns: Array<(a: R) => R>) =>
    fns.reduce((prevFn, nextFn) => value => prevFn(nextFn(value)), fn1);

