
import { err, ok, Result } from './Result';
import { toError } from './toError';

export async function tryCatchAsync<T, E = unknown>(
  callback: () => Promise<T>,
  handler?: (error: Error) => void
): Promise<Result<T, E>> {
  try {
    const value = await callback();
    return ok(value);
  } catch (originalError) {
    const error = toError(originalError);
    handler?.(error);
    return err(error as E);
  }
}

// https://www.youtube.com/watch?v=Y6jT-IkV0VM
export function tryCatch<T, E = unknown>(
  callback: () => T,
  handler?: (error: Error) => void
): Result<T, E> {
  try {
    return ok(callback());
  } catch (originalError) {
    const error = toError(originalError);
    handler?.(error);
    return err(error as E);
  }
}
