import { log } from './debug';

type QueryParams = {
  code?: string;
  grid?: string;
  animate?: string;
};

export const AVAILABLE_PARAMS = ['grid', 'animate', 'code'];

// Base 64 and URI encode
export function encodeCode(code: string): string {
  return encodeURIComponent(btoa(code));
}

// URI decode and base 64 decode
export function decodeCode(code: string): string {
  try {
    return atob(decodeURIComponent(code));
  } catch (e) {
    return '';
  }
}

export function updateURLQuery(params: QueryParams) {
  const URLParams = new URLSearchParams(window.location.search);

  // Set new params
  Object.entries(params).forEach(([name, value]) => {
    if (name === 'code') {
      URLParams.set(name, encodeCode(value));
    } else {
      URLParams.set(name, value);
    }
  });

  // Remove any existing extra GET parameters that don't exist in AVAILABLE_PARAMS
  for (const key of URLParams.keys()) {
    if (!AVAILABLE_PARAMS.includes(key)) {
      URLParams.delete(key);
    }
  }

  const queryString = URLParams.toString();
  const url = `${window.location.origin}${window.location.pathname}?${queryString}`;

  log('Updated URL:', JSON.stringify(params));

  window.history.replaceState(null, '', url);
}
