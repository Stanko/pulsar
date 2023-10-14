import { GetPointValue } from './types';

// ----- CONSTANTS ----- //

const MAXIMUM_VALUE = 1;

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

export let userFunction: GetPointValue;

function defaultFunction(x: number, y: number, t: number) {
  return (Math.sin(Math.abs(x) + Math.abs(y) + t) + 1) / 2;
}

function setUserFunction() {
  let userCode = $codeEditor.value;

  try {
    for (const word of forbiddenWords) {
      if (userCode.includes(word)) {
        throw new Error(`Let's play nice, no usage of "${word}" allowed.`);
      }
    }

    userFunction = new Function(
      'x',
      'y',
      't',
      `"use strict"; return ${userCode};`
    ) as GetPointValue;

    $error.innerHTML = '';
  } catch (e) {
    userFunction = defaultFunction;
    showError((e as any).toString());
  }
}

$codeEditor.addEventListener('input', setUserFunction);

setUserFunction();

export function getPointValue(x: number, y: number, t: number) {
  let value = 0;

  try {
    value = userFunction(x, y, t);
    // $error.innerHTML = '';

    if (typeof value !== 'number') {
      throw new Error('Return value is not a number');
    }
  } catch (e) {
    value = defaultFunction(x, y, t);

    showError((e as any).toString());
  }

  return Math.max(Math.min(value, MAXIMUM_VALUE), 0);
}
