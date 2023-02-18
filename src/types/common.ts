export type None = null | undefined;
export type Nullable<T> = T | None;

/** Make all of T's properties nullable
 * ```ts
 * NullableOfType<{something: boolean, other: number}>;
 * // -> {something: Nullable<boolean>, other: Nullable<number>}
 * ```
*/
export type NullableOfType<T> = {
  [P in keyof T]: Nullable<T[P]>;
};

/** Correct type for Object.entries(myobj)
 * ```ts
 * Entries<{something: true, other: 1}>; // -> [["something", true], ["other", 1]]
 * ```
*/
export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

/** Correct type for `Object.values(myobj)`
 * ```ts
 * Values<{something: true, other: 1}>; // -> [true, 1]
 * ```
*/
export type Values<T> = T[keyof T][];

/**
 * Correct type for `Object.keys(myobj);`
 *
 * ```ts
 * Keys<{something: true, other: 1}>; // -> "something" | "other"
 * ```
 * */
export type Keys<T> = keyof T;

/**
 * ```ts
 * ValueOf<{something: true, other: 1}> // -> true | 1
 * ```
 *  */
export type ValueOf<T> = T[keyof T];

/** Matches any [primitive value](https://developer.mozilla.org/en-US/docs/Glossary/Primitive).  */
export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

/**
 * helper type-level function to expand a given type to show all of its inferred fields when hovered.
 * (this is a workaround for the fact that VSCode doesn't show inferred fields when hovering, only the Supertype(s) of the union)
 *
 * Say you have a few simple types:
 * ```ts
 * type Hat = { hatBrand: string };
 * type Shirt = { shirtSize: number };
 * type Outfit = { isFavorite: boolean; isFormal: boolean; } & Hat & Shirt;
 * ```
 * when you hover over `Outfit` in your editor, you'll see:
 * ```ts
 * type Outfit = { isFavorite: boolean; isFormal: boolean; } & Hat & Shirt;
 * ```
 *
 * when what you actually want (and this helper gives you) is
 * ```ts
 * type Outfit = {
 *   isFavorite: boolean;
 *   isFormal: boolean;
 *   hatBrand: string;
 *   shirtSize: number;
 * }
 * ```
 * https://github.com/microsoft/vscode/issues/94679 */
 export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
