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
  'console',
  'debugger',
];

// Highlighting code is taken from this Stack Overflow answer:
// https://stackoverflow.com/a/41885674
const tokens = {
  equals: /(\b=\b)/g,
  quotes: /((&#39;.*?&#39;)|(&#34;.*?&#34;)|(".*?(?<!\\)")|('.*?(?<!\\)')|`)/g,
  comments: /((\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(\/\/.*))/g,
  logic:
    /(%=|%|\-|\+|\*|&amp;{1,2}|\|{1,2}|&lt;=|&gt;=|&lt;|&gt;|!={1,2}|={2,3})/g,
  fn: /(?<=^|\s*)(abs|acos|asin|atan|atan2|ceil|cos|floor|log|max|min|pow|random|round|sin|sqrt|tan|noise|async|await|window|fetch|console|alert|Math|Object|Array|String|class(?!\s*\=)|function)(?=\b)/g,
  number: /(\d+(\.\d+)?(e\d+)?)/g,
  declaration: /(?<=^|\s*)(var|let|const)/g,
  parenthesis: /(\(|\))/g,
  squared: /(\[|\])/g,
  curly: /(\{|\})/g,
};

export class Editor {
  $textarea: HTMLTextAreaElement;
  $pre: HTMLPreElement;
  $error: HTMLDivElement;

  value: string = '';
  error: string = '';

  constructor() {
    this.$pre = document.querySelector('.editor__pre') as HTMLPreElement;
    this.$error = document.querySelector('.editor__error') as HTMLDivElement;
    this.$textarea = document.querySelector(
      '.editor__textarea'
    ) as HTMLTextAreaElement;

    this.$textarea.addEventListener('input', this.validate);
    this.$textarea.addEventListener('change', this.validate);

    this.validate();

    this.$textarea.addEventListener('keydown', (e) => {
      if (e.key == 'Enter') {
        e.preventDefault();
      }
    });
  }

  update(code: string) {
    this.$textarea.value = code;
    this.validate();
    this.$textarea.dispatchEvent(new Event('input'));
  }

  validate = () => {
    const value = this.$textarea.value.trim();

    this.highlightCode();

    for (const word of forbiddenWords) {
      if (value.includes(word)) {
        const error = `Let's play nice, no usage of "${word}" allowed.`;
        this.error = error;
        return;
      }
    }

    this.error = '';

    this.value = value;
  };

  highlightCode() {
    let code = this.$textarea.value;

    for (const [key, token] of Object.entries(tokens)) {
      code = code.replace(token, `<i class="${key}">$1</i>`);
    }

    this.$pre.innerHTML = code;
  }

  showError(error: string) {
    this.error = error;
    this.$error.innerHTML = error;
  }

  hideError() {
    this.error = '';
    this.$error.innerHTML = '';
  }
}
