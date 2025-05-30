import { None, Nullable } from '../types/common';

// likely not exhaustive
type StringOf<T extends any> = T extends string
  ? 'string'
  : T extends number
  ? 'number'
  : T extends boolean
  ? 'boolean'
  : T extends Date
  ? 'date'
  : T extends null
  ? 'null'
  : T extends undefined
  ? 'undefined'
  : T extends Error
  ? 'error'
  : T extends object
  ? 'object'
  : T extends Array<any>
  ? 'array'
  : T extends Map<any, any>
  ? 'map'
  : T extends Set<any>
  ? 'set'
  : T extends WeakMap<any, any>
  ? 'weakmap'
  : T extends WeakSet<any>
  ? 'weakset'
  : T extends Promise<any>
  ? 'promise'
  : T extends PromiseLike<any>
  ? 'promise'
  : T extends Date
  ? 'date'
  : T extends Function
  ? 'function'
  : T extends Symbol
  ? 'symbol'
  : T extends URL
  ? 'url'
  : T extends URLSearchParams
  ? 'urlsearchparams'
  : T extends NodeListOf<any>
  ? 'nodelist'
  : T extends HTMLCollectionOf<any>
  ? 'htmlcollection'
  : T extends Node
  ? 'node'
  : T extends Element
  ? 'element'
  : T extends EventTarget
  ? 'eventtarget'
  : T extends Event
  ? 'event'
  : T extends EventListener
  ? 'eventlistener'
  : T extends EventListenerObject
  ? 'eventlistenerobject'
  : T extends EventListenerOrEventListenerObject
  ? 'eventlisteneroreventlistenerobject'
  : T extends Iterable<any>
  ? 'iterable'
  : T extends Record<string, any>
  ? 'object'
  : string;

/**
 * typeof without all the footguns
 * e.g.
 * ```ts
 * type([]); // -> 'array'
 * type(null); // -> 'null'
 * type(undefined); // -> 'undefined'
 * type(new Number(2)); // -> 'number'
 * ``` */
export function kind<T extends any>(t: T): StringOf<T> {
  return Object.prototype.toString
    .call(t)
    .slice(8, -1)
    .toLowerCase() as StringOf<T>;
}

/**
 * Type guard for None
 * @param nullable any value that is Nullable
 * @returns boolean
 *
 * isNone(null) -> true
 * isNone(undefined) -> true
 * isNone('') -> false
 * isNone(0) -> false
 * isNone(false) -> false
 * isNone({}) -> false
 * isNone([]) -> false */
export function isNone<T>(nullable: Nullable<T>): nullable is None {
  return kind(nullable) === 'null' || kind(nullable) === 'undefined';
}

/**
 * Type guard for T
 * @param nullable any value that is Nullable
 * @returns boolean
 *
 * isSome(null) -> false
 * isSome(undefined) -> false
 * isSome('') -> true
 * isSome(0) -> true
 * isSome(false) -> true
 * isSome({}) -> true
 * isSome([]) -> true */
export function isSome<T>(nullable: Nullable<T>): nullable is T {
  return !isNone(nullable);
}

export function isError(error: Nullable<unknown>): error is Error {
  return error instanceof Error;
}

export function isString(x: Nullable<unknown>): x is string {
  return kind(x) === 'string';
}

export function isObject(x: unknown): x is object {
  return kind(x) === 'object';
}

export function isNumeric(value: Nullable<unknown>): value is number {
  return kind(value) === 'number' && !isNaN(value as number);
}

export function isBoolean(x: unknown): x is boolean {
  return kind(x) === 'boolean';
}

export function isDate(x: unknown): x is Date {
  return x instanceof Date;
}
