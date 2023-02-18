import { Nullable } from '../types/common';
import { isEmpty, isNone, isSome } from './common';

export function $<ElementType extends HTMLElement>(
  selector: string
): Nullable<ElementType> {
  const maybeEl = document.querySelector<ElementType>(selector);
  if (!maybeEl) {
    return null;
  }

  return maybeEl;
}

export function $$<ElementType extends Element>(selector: string): ElementType[] {
  const query = document.querySelectorAll<ElementType>(selector);
  if (isEmpty(query)) {
    return [];
  }
  return [...query];
}


export async function waitForElements<ElementType extends HTMLElement[]>(
  selector: string,
  timeout = 100
) {
  return new Promise<ElementType>((resolve) => {
    const interval = setInterval(() => {
      const el = $$(selector);
      if (el && el.length) {
        clearInterval(interval);
        resolve(el as ElementType);
      }
    }, timeout);
  });
}

export async function waitForElement<ElementType extends HTMLElement>(
  selector: string,
  timeout = 100
) {
  return new Promise<ElementType>((resolve) => {
    const interval = setInterval(() => {
      const el = $(selector);
      if (el) {
        clearInterval(interval);
        resolve(el as ElementType);
      }
    }, timeout);
  });
}

export function click<ElementType extends HTMLElement>(
  el: Nullable<ElementType>
) {
  if (isSome(el) && 'click' in el) {
    el.click();
  }
  return el;
}


export function createJSLoader() {
  const loadedJS = new Set<string>();
  return (src: string, cb: () => void) => {
    if (loadedJS.has(src)) {
      console.log('Already loaded: ', src);
      return;
    }
    const ref = window.document.getElementsByTagName('script')[0];
    var script = window.document.createElement('script');
    script.src = src;
    script.async = true;
    if (!ref.parentNode) {
      console.error('Failed to load script: ', src, 'ref.parentNode is null')
      return;
    }
    ref.parentNode.insertBefore(script, ref);
    loadedJS.add(src);
    if (cb && typeof cb === 'function') {
      script.onload = cb;
    }
    return script;
  }
}

export function writeToClipboard(text: string) {
  if (!('clipboard' in navigator)) {
    console.log('Clipboard API not supported');
    return;
  }
  navigator.clipboard.writeText(text);
}
