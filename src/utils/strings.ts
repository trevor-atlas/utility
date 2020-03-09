import { Maybe } from '../Helpers';
import { pipe } from './functional';

const isString = (value: Maybe<string>) => typeof value === 'string' && value.length > 0;

export const normalize = (str: string): string => pipe(
    isString,
    stripTabAndDuplicateWhitespace,
    stripNewlines,
    trim
)(str);

export const titleCase = (str: string): string => pipe(
    isString,
    normalize,
    (val) =>
        val.split(' ')
        .map((word) => word[0].toUpperCase() + word.substr(1).toLowerCase())
        .join(' '),
)(str);

export const enumToTitle = (str: string): string => pipe(
    isString,
    snakeToSpace,
    titleCase,
)(str);

export const humanToPascal = (str: string): string => pipe(
    isString,
    titleCase,
    spaceToPascal
)(str);


// wrap string.prototype.* so we can run them in pipe operations
export const replace = (search: string | RegExp, replace: string) => (str: string) => str.replace(search, replace);
export const toUpper = (str: string) => str.toUpperCase();
export const toLower = (str: string) => str.toLowerCase();
export const padLeft = (maxLen: number = 50, fill: string = ' ') => (str: string) => str.padStart(maxLen, fill);
export const padRight = (maxLen: number = 50, fill: string = ' ') => (str: string) => str.padEnd(maxLen, fill);
export const trim = (str: string) => str.trim();
export const split = (splitOn: string) => (str: string) => str.split(splitOn);
export const join = (joinOn: string) => (strArr: string[]) => strArr.join(joinOn);

export const snakeToSpace = replace(/_/g, ' ');
export const kebabToSpace = replace(/-/g, ' ');
export const spaceToKebab = replace(/\s/g, '-');
export const spaceToSnake = replace(/_/g, ' ');
export const spaceToPascal = replace(/\s/g, '');

export const stripNewlines = replace(/\n*/g, '');
export const stripTabAndDuplicateWhitespace = replace(/\s+/g, ' ');


