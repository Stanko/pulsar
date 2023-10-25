import { $codeEditor } from './code-editor';
import { Pixel } from './types';

export const worker = new Worker(new URL('./worker.ts', import.meta.url));

// ----- Constants ----- //

const forbiddenWords = [
  'fetch',
  'import',
  'export',
  'eval',
  'Function',
  'window',
  'self',
  'top',
  'location',
  'document',
  'alert',
  'prompt',
  'confirm',
  'XMLHttpRequest',
  'setTimeout',
  'setInterval',
  'clearTimeout',
  'clearInterval',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'postMessage',
  'addEventListener',
  'removeEventListener',
  'dispatchEvent',
  'localStorage',
  'sessionStorage',
  'indexedDB',
  'Geolocation',
  'await',
  'async',
  'WebSocket',
  'Worker',
  'postMessage',
  'importScripts',
  'URL',
];

// ----- DOM ----- //

const $error = document.querySelector('.error') as HTMLPreElement;

// ----- Helpers ----- //

export function showError(text: string) {
  $error.innerHTML = text;
}

export function hideError() {
  $error.innerHTML = '';
}

// ----- Handlers ----- //

const DEFAULT_CODE = '(Math.sin(Math.abs(x) + Math.abs(y) + t) + 1) / 2';

let userCode = DEFAULT_CODE;

function setUserFunction() {
  userCode = $codeEditor.value;

  try {
    for (const word of forbiddenWords) {
      if (userCode.includes(word)) {
        throw new Error(`Let's play nice, no usage of "${word}" allowed.`);
      }
    }

    hideError();
  } catch (e) {
    // userCode = DEFAULT_CODE;
    showError((e as any).toString());
  }
}

$codeEditor.addEventListener('input', setUserFunction);

setUserFunction();

// ----- Worker ----- //

let callback: (e: MessageEvent<any>) => void;
let resolveMethod: () => void;

worker.addEventListener('message', (e) => {
  callback(e);
  resolveMethod();
});

export async function calculateGrid(
  grid: Pixel[],
  t: number,
  userCallback: (e: MessageEvent<any>) => void
) {
  callback = userCallback;

  return new Promise<void>((resolve) => {
    resolveMethod = resolve;

    worker.postMessage({
      grid: grid.map(({ x, y }) => {
        return { x, y };
      }),
      t,
      userCode,
    });
  });
}
