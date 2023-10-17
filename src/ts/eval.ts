import { Pixel } from './utils/types';

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

const $codeEditor = document.querySelector(
  '.code-editor__input'
) as HTMLTextAreaElement;

const $error = document.querySelector('.error') as HTMLPreElement;

// ----- Helpers ----- //

function showError(text: string) {
  $error.innerHTML = text;
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

    $error.innerHTML = '';
  } catch (e) {
    userCode = DEFAULT_CODE;
    showError((e as any).toString());
  }
}

$codeEditor.addEventListener('input', setUserFunction);

setUserFunction();

// ----- Worker ----- //

export function calculateGrid(grid: Pixel[], t: number) {
  worker.postMessage({
    grid: grid.map(({ x, y }) => {
      return { x, y };
    }),
    t,
    userCode,
  });
}
