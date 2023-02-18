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

    export function once<T>(fn: (...args: any[]) => T | Promise<T>) {
      let called = false;
      let result: T;
      return async (...args: any[]) => {
        if (!called) {
          result = await fn(...args);
          called = true;
        }
        return result;
      };
    }
    export function throttle(fn: Function, args?: any[], wait: number = 100) {
      let inThrottle: boolean;
      let lastFn: ReturnType<typeof setTimeout>;
      let lastTime: number;

      // @ts-ignore
      const context = this;
      return  () => {
        if (!inThrottle) {
          fn.apply(context, args);
          lastTime = Date.now();
          inThrottle = true;
        } else {
          clearTimeout(lastFn);
          lastFn = setTimeout(() => {
            if (Date.now() - lastTime >= wait) {
              fn.apply(context, args);
              lastTime = Date.now();
            }
          }, Math.max(wait - (Date.now() - lastTime), 0));
        }
      };
    };
