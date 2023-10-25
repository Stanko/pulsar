const $code = document.querySelector(
  '.code-editor__highlighted-code'
) as HTMLPreElement;
export const $codeEditor = document.querySelector(
  '.code-editor__input'
) as HTMLTextAreaElement;

// Highlighting code is taken from this
const tokens = {
  equals: /(\b=\b)/g,
  quotes: /((&#39;.*?&#39;)|(&#34;.*?&#34;)|(".*?(?<!\\)")|('.*?(?<!\\)')|`)/g,
  comments: /((\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(\/\/.*))/g,
  logic:
    /(%=|%|\-|\+|\*|&amp;{1,2}|\|{1,2}|&lt;=|&gt;=|&lt;|&gt;|!={1,2}|={2,3})/g,
  fn: /(?<=^|\s*)(noise|async|await|console|alert|Math|Object|Array|String|class(?!\s*\=)|function)(?=\b)/g,
  number: /(\d+(\.\d+)?(e\d+)?)/g,
  declaration: /(?<=^|\s*)(var|let|const)/g,
  parenthesis: /(\(|\))/g,
  squared: /(\[|\])/g,
  curly: /(\{|\})/g,
};

function highlightCode() {
  let code = $codeEditor.value;

  for (const [key, token] of Object.entries(tokens)) {
    code = code.replace(token, `<i class="${key}">$1</i>`);
  }

  $code.innerHTML = code;
}

$codeEditor.addEventListener('input', highlightCode);
$codeEditor.addEventListener('change', highlightCode);

$codeEditor.addEventListener('scroll', () => {
  $code.scrollTop = $codeEditor.scrollTop;
});

$codeEditor.addEventListener('keydown', (e) => {
  if (e.key == 'Enter') {
    e.preventDefault();
  }
});

highlightCode();
