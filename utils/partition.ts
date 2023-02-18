import { Nullable } from '../types/common';

export const partition = <T>(list: Nullable<T[]>, callback: (item: T) => boolean): [T[], T[]] => {
  const passed: T[] = [];
  const failed: T[] = [];

  if (!Array.isArray(list) || list.length === 0) {
    return [passed, failed];
  }

  for (const item of list) {
    if (!callback(item)) {
      failed.push(item);
    } else {
      passed.push(item);
    }
  }

  return [passed, failed];
};
