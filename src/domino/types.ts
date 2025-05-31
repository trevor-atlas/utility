export type DominoValues = Record<string, unknown>;

/**
 * @description The internal representation of a Domino object.
 * A Domino is an immutable, reusable and flexible abstraction
 * for managing complex state in javascript applications.
 *
 * A Domino is designed to be used in conjunction with a store implementation
 * that will handle the actual storage and retrieval of the state.
 * Dominoes only provide an API for managing the state of an object, not the storage or retrieval of that state.  */
export type DominoInternals<T extends DominoValues> = {
  /** * The default values of the Domino.  */
  defaults: T;
  /** * The current mutations of the Domino.  */
  mutations: Partial<T>;
  /** * The current final values of the Domino.  */
  values: T;
  /** * fields that are computed from the current state of the Domino.  */
  isModified: boolean;
  /** Update multiple fields at once */
  update: (fields: Partial<T>) => DominoInternals<T>;
  /** Reset a single field to the default value */
  resetField: (field: keyof T) => DominoInternals<T>;
  /** Reset the entire Domino to the default values */
  reset: () => DominoInternals<T>;
  /** Set the default values of the Domino */
  setDefaults: (values: Partial<T>) => DominoInternals<T>;
};

export type DominoStore<T extends DominoValues> = {
  domino: DominoInternals<T>;
} & PublicDominoMethods<T>;

/**
 * @description A literal representation of a Domino object.
 * This represents the public API of a Domino object.
 */
export type Domino<T extends DominoValues> = {
  values: T;
  defaults: T;
  isModified: boolean;
} & PublicDominoMethods<T>;

/**
 * Public methods for the Domino object.
 * These methods are used to manipulate a Domino object
 * agnostic of the chosen store implementation.
 */
export type PublicDominoMethods<T extends DominoValues> = {
  setDefaults: (values: Partial<T>) => void;
  reset: () => void;
  update: (fields: Partial<T>) => void;
  resetField: (field: keyof T) => void;
};
