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
