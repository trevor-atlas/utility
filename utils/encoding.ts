export function toBase64(str: string): string {
  return window.btoa(encodeURIComponent(str));
}

export function fromBase64(str: string): string {
  return decodeURIComponent(window.atob(str));
}
