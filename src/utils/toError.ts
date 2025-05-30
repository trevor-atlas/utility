import { isError, isNone, isObject, isString } from './typeguards';
import { stringify } from './common';

export function toError(error: unknown): Error {
  if (isNone(error)) {
    return new Error('Error: null or undefined');
  }

  // '', 0, NaN, false
  if (!error) {
    return new Error(String(error) || 'Unknown error');
  }

  if (isString(error)) {
    return new Error(error);
  }

  if (isError(error)) {
    return error;
  }

  if (isObject(error) || Array.isArray(error)) {
    return new Error(`Stringified error:\n${stringify(error)}`);
  }

  return new Error(`Unknown error: ${String(error)}`);
}
