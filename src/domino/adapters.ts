import { DominoValues, DominoInternals } from './types';

/**
 * Generic state provider interface that any external state management system can implement
 */
export interface StateProvider<T> {
  get(): T;
  set(value: T | ((prev: T) => T)): void;
  subscribe?(listener: (value: T) => void): () => void;
}

/**
 * Adapter interface for connecting Domino to external state providers
 */
export interface DominoAdapter<T extends DominoValues> {
  getState(): DominoInternals<T>;
  setState(updater: (prev: DominoInternals<T>) => DominoInternals<T>): void;
}

/**
 * Creates a Domino adapter from any state provider
 */
export function createDominoAdapter<T extends DominoValues>(
  provider: StateProvider<DominoInternals<T>>,
): DominoAdapter<T> {
  return {
    getState: () => provider.get(),
    setState: (updater) => {
      provider.set(updater);
    },
    subscribe: provider.subscribe,
  };
}

/**
 * React useState adapter
 */
export function createReactStateAdapter<T extends DominoValues>(
  useState: (
    initial: DominoInternals<T>,
  ) => [
    DominoInternals<T>,
    (
      value:
        | DominoInternals<T>
        | ((prev: DominoInternals<T>) => DominoInternals<T>),
    ) => void,
  ],
  initialState: DominoInternals<T>,
): DominoAdapter<T> {
  const [state, setState] = useState(initialState);

  return {
    getState: () => state,
    setState: (updater) => setState(updater),
  };
}

/**
 * Zustand-like store adapter
 */
export function createZustandAdapter<T extends DominoValues>(
  create: <U>(
    stateCreator: (
      set: (partial: Partial<U> | ((state: U) => Partial<U>)) => void,
      get: () => U,
    ) => U,
  ) => U,
): DominoAdapter<T> {
  type StoreState = { domino: DominoInternals<T> };

  const useStore = create<StoreState>((set, get) => ({
    domino: null as any, // Will be set externally
  }));

  return {
    getState: () => useStore.getState().domino,
    setState: (updater) => {
      useStore.setState((state) => ({
        domino: updater(state.domino),
      }));
    },
    subscribe: (listener) => {
      return useStore.subscribe((state) => listener(state.domino));
    },
  };
}

/**
 * Generic store factory that works with any state provider
 */
export function createDominoStore<T extends DominoValues>(
  adapter: DominoAdapter<T>,
) {
  return {
    get values() {
      return adapter.getState().values;
    },
    get defaults() {
      return adapter.getState().defaults;
    },
    get mutations() {
      return adapter.getState().mutations;
    },
    get isModified() {
      return adapter.getState().isModified;
    },
    update: (fields: Partial<T>) => {
      adapter.setState((state) => state.update(fields));
    },
    resetField: (field: keyof T) => {
      adapter.setState((state) => state.resetField(field));
    },
    reset: () => {
      adapter.setState((state) => state.reset());
    },
    setDefaults: (values: Partial<T>) => {
      adapter.setState((state) => state.setDefaults(values));
    },
  };
}
