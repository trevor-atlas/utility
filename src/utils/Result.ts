interface Ok<T> {
  ok: true;
  value: T;
  map: <U>(fn: (value: T) => U) => Result<U, never>;
}

interface Err<E> {
  ok: false;
  error: E;
  map: <U>(fn: (value: E) => U) => Result<never, U>;
}

export type Result<T, E> = (Ok<T> | Err<E>) & {
  orElse: <U>(fn: (error: E) => U) => Result<T, U>;
  unwrap: () => T | E;
  match: <U, V>(ok: (value: T) => U, err: (error: E) => V) => U | V;
};

export function ok<T>(value: T): Result<T, never> {
  return {
    ok: true,
    value,
    map: (fn) => ok(fn(value)),
    orElse: () => ok(value),
    unwrap: () => value,
    match: (okCallback) => okCallback(value),
  };
}

export function err<E>(error: E): Result<never, E> {
  return {
    ok: false,
    error,
    map: (fn) => err(fn(error)),
    orElse: (fn) => err(fn(error)),
    unwrap: () => error,
    match: (__, errCallback) => errCallback(error),
  };
}
