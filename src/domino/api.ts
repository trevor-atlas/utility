import { cloneOf } from '../utils/object';
import { createDominoStore } from './adapters';
import { DominoValues } from './types';

/**
 * @description Create a new DominoAPI object.
 * @param defaults The default values of the DominoAPI.
 * @param mutations The mutations of the DominoAPI.
 * @param initialDefaults The initial default values of the DominoAPI.
 * @returns A new DominoAPI object.
 * @description A Domino's job is to make computing updates easy.
 * A Domino's internal state is made up of defaults, mutations, and computed fields.
 *
 * defaults are exactly what they sound like, the default values of the Domino.
 *
 * mutations are *only* the values that have been changed from the defaults.
 *
 * values are the final values of the Domino, computed from the defaults and mutations.
 *
 * All methods return new DominoAPI objects, and do not modify the original DominoAPI.
 */
class DominoAPI<T extends DominoValues> {
  public readonly defaults!: T;
  public readonly values!: T;
  public readonly isModified: boolean;
  public readonly mutations!: Partial<T>;
  private readonly initialDefaults: T;

  constructor(defaults: T, mutations: Partial<T> = {}, initialDefaults: T) {
    this.initialDefaults = cloneOf(initialDefaults);
    this.defaults = cloneOf(defaults);
    this.mutations = cloneOf(mutations);
    this.isModified = Boolean(Object.keys(this.mutations).length);
    this.values = {
      ...this.defaults,
      ...this.mutations,
    };
  }

  public update(fields: Partial<T>) {
    return new DominoAPI(
      this.defaults,
      {
        ...this.mutations,
        ...fields,
      },
      this.initialDefaults,
    );
  }

  public resetField(field: keyof T) {
    delete this.mutations[field];
    return new DominoAPI(this.defaults, this.mutations, this.initialDefaults);
  }

  public setDefaults(newDefaults: Partial<T>) {
    return new DominoAPI(
      {
        ...this.defaults,
        ...newDefaults,
      },
      this.mutations,
      this.initialDefaults,
    );
  }

  public reset() {
    return new DominoAPI(this.defaults, undefined, this.initialDefaults);
  }

  public clear() {
    return new DominoAPI(this.initialDefaults, undefined, this.initialDefaults);
  }
}

/**
 * @description The public Domino object.
 * @description A Domino's job is to make managing complex state easy.
 * A Domino's internal state is made up of defaults and mutations.
 * defaults are exactly what they sound like, the default values of the Domino.
 * mutations are *only* the values that have been changed from the defaults.
 * values are the final values of the Domino, computed from the defaults and mutations. */
class Domino<T extends DominoValues> {
  private api: DominoAPI<T>;

  private constructor(api: DominoAPI<T>) {
    this.api = api;
  }

  public static from<T extends DominoValues>(defaults: T) {
    return new Domino(new DominoAPI(defaults, {}, defaults));
  }

  public get values() {
    return this.api.values;
  }

  public get defaults() {
    return this.api.defaults;
  }

  public get mutations() {
    return this.api.mutations;
  }

  public get isModified() {
    return this.api.isModified;
  }

  public update(fields: Partial<T>) {
    return new Domino(this.api.update(fields));
  }

  public resetField(field: keyof T) {
    return new Domino(this.api.resetField(field));
  }

  public setDefaults(newDefaults: Partial<T>) {
    return new Domino(this.api.setDefaults(newDefaults));
  }

  public reset() {
    return new Domino(this.api.reset());
  }

  public clear() {
    return new Domino(this.api.clear());
  }
}

export function useDominoState<T extends DominoValues>(
  defaultState: () => T | T,
) {
  const [domino, setDomino] = useState(() => {
    const domino = Domino.from(
      typeof defaultState === 'function' ? defaultState() : defaultState,
    );
  });

  return createDominoStore({
    getState: () => domino,
    setState: (update) => setDomino(update),
  });
}
