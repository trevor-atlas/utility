import { isBrowser } from "./misc";

function toBase64(str: string): string {
  if (isBrowser) {
    return window.btoa(encodeURIComponent(str));
  }
  return Buffer.from(str, 'binary').toString('base64');
}

function fromBase64(str: string): string {
  if (isBrowser) {
    return decodeURIComponent(window.atob(str));
  }
  return Buffer.from(str, 'base64').toString('binary');
}
