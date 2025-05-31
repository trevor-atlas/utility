import { useState, useMemo } from 'react';
import { createDomino } from './api';
import { DominoValues, Domino } from './types';
import { StateProvider, DominoAdapter, createDominoAdapter, createDominoStore } from './adapters';

/**
 * Hook factory that creates Domino hooks for any state provider
 */
export function createUseDomino<ProviderState>(
  createProvider: <T>(initialState: T) => StateProvider<T>
) {
  return function useDomino<T extends DominoValues>(
    defaults: T | (() => T)
  ): Domino<T> {
    const initialDomino = useMemo(() => {
      const defaultsValue = typeof defaults === 'function' ? defaults() : defaults;
      return createDomino(defaultsValue);
    }, []);

    const provider = useMemo(() => createProvider(initialDomino), [initialDomino]);
    const adapter = useMemo(() => createDominoAdapter(provider), [provider]);
    const store = useMemo(() => createDominoStore(adapter), [adapter]);

    return useMemo(() => ({
      values: store.values,
      defaults: store.defaults,
      isModified: store.isModified,
      update: store.update,
      resetField: store.resetField,
      reset: store.reset,
      setDefaults: store.setDefaults,
    }), [store]);
  };
}

/**
 * Enhanced React useState adapter with proper hook integration
 */
export function useDominoWithReactState<T extends DominoValues>(
  defaults: T | (() => T)
): Domino<T> {
  const initialDomino = useMemo(() => {
    const defaultsValue = typeof defaults === 'function' ? defaults() : defaults;
    return createDomino(defaultsValue);
  }, []);

  const [dominoState, setDominoState] = useState(initialDomino);

  return useMemo(() => ({
    values: dominoState.values,
    defaults: dominoState.defaults,
    isModified: dominoState.isModified,
    update: (fields: Partial<T>) => setDominoState(state => state.update(fields)),
    resetField: (field: keyof T) => setDominoState(state => state.resetField(field)),
    reset: () => setDominoState(state => state.reset()),
    setDefaults: (values: Partial<T>) => setDominoState(state => state.setDefaults(values)),
  }), [dominoState]);
}

/**
 * Zustand integration
 */
export function createUseDominoWithZustand<T extends DominoValues>(
  useStore: any // Zustand store hook
) {
  return function useDominoWithZustand(
    defaults: T | (() => T),
    selector?: (state: any) => any
  ): Domino<T> {
    const initialDomino = useMemo(() => {
      const defaultsValue = typeof defaults === 'function' ? defaults() : defaults;
      return createDomino(defaultsValue);
    }, []);

    // Initialize store if needed
    const currentState = useStore(selector || ((state: any) => state.domino));
    
    if (!currentState) {
      useStore.setState({ domino: initialDomino });
    }

    const dominoState = useStore((state: any) => state.domino || initialDomino);

    return useMemo(() => ({
      values: dominoState.values,
      defaults: dominoState.defaults,
      isModified: dominoState.isModified,
      update: (fields: Partial<T>) => {
        useStore.setState((state: any) => ({
          ...state,
          domino: state.domino.update(fields)
        }));
      },
      resetField: (field: keyof T) => {
        useStore.setState((state: any) => ({
          ...state,
          domino: state.domino.resetField(field)
        }));
      },
      reset: () => {
        useStore.setState((state: any) => ({
          ...state,
          domino: state.domino.reset()
        }));
      },
      setDefaults: (values: Partial<T>) => {
        useStore.setState((state: any) => ({
          ...state,
          domino: state.domino.setDefaults(values)
        }));
      },
    }), [dominoState, useStore]);
  };
}

/**
 * Generic hook that works with any state management system
 */
export function useDominoWithProvider<T extends DominoValues>(
  provider: StateProvider<any>,
  defaults: T | (() => T),
  selector?: (state: any) => any
): Domino<T> {
  const initialDomino = useMemo(() => {
    const defaultsValue = typeof defaults === 'function' ? defaults() : defaults;
    return createDomino(defaultsValue);
  }, []);

  const currentState = provider.get();
  const dominoState = selector ? selector(currentState) : currentState.domino || initialDomino;

  return useMemo(() => ({
    values: dominoState.values,
    defaults: dominoState.defaults,
    isModified: dominoState.isModified,
    update: (fields: Partial<T>) => {
      if (selector) {
        provider.set((state: any) => {
          const newDomino = selector(state).update(fields);
          return { ...state, domino: newDomino };
        });
      } else {
        provider.set((state: any) => ({
          ...state,
          domino: (state.domino || initialDomino).update(fields)
        }));
      }
    },
    resetField: (field: keyof T) => {
      if (selector) {
        provider.set((state: any) => {
          const newDomino = selector(state).resetField(field);
          return { ...state, domino: newDomino };
        });
      } else {
        provider.set((state: any) => ({
          ...state,
          domino: (state.domino || initialDomino).resetField(field)
        }));
      }
    },
    reset: () => {
      if (selector) {
        provider.set((state: any) => {
          const newDomino = selector(state).reset();
          return { ...state, domino: newDomino };
        });
      } else {
        provider.set((state: any) => ({
          ...state,
          domino: (state.domino || initialDomino).reset()
        }));
      }
    },
    setDefaults: (values: Partial<T>) => {
      if (selector) {
        provider.set((state: any) => {
          const newDomino = selector(state).setDefaults(values);
          return { ...state, domino: newDomino };
        });
      } else {
        provider.set((state: any) => ({
          ...state,
          domino: (state.domino || initialDomino).setDefaults(values)
        }));
      }
    },
  }), [dominoState, provider, selector, initialDomino]);
}