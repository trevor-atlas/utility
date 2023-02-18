export const identity = <T>(v: T): T => v;
export const noop = () => void 0;
export const truthy = () => true;
export const falsy = () => false;

export const pipe = <T>(
  ...fns: Array<(a: T) => T>
) => {
  const piped = fns.reduce(
    (prevFn, nextFn) => (value: T) => nextFn(prevFn(value)),
    identity
  );
  return (value: T) => piped(value);
};

export const compose = <R>(fn1: (a: R) => R, ...fns: Array<(a: R) => R>) =>
    fns.reduce((prevFn, nextFn) => value => prevFn(nextFn(value)), fn1);
