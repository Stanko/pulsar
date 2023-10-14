const $code = document.querySelector(
  '.code-editor__highlighted-code'
) as HTMLPreElement;
const $input = document.querySelector(
  '.code-editor__input'
) as HTMLTextAreaElement;

const tokens = {
  equals: /(\b=\b)/g,
  quotes: /((&#39;.*?&#39;)|(&#34;.*?&#34;)|(".*?(?<!\\)")|('.*?(?<!\\)')|`)/g,
  comments: /((\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(\/\/.*))/g,
  logic:
    /(%=|%|\-|\+|\*|&amp;{1,2}|\|{1,2}|&lt;=|&gt;=|&lt;|&gt;|!={1,2}|={2,3})/g,
  number: /(\d+(\.\d+)?(e\d+)?)/g,
  fn: /(?<=^|\s*)(async|await|console|alert|Math|Object|Array|String|class(?!\s*\=)|function)(?=\b)/g,
  declaration: /(?<=^|\s*)(var|let|const)/g,
  parenthesis: /(\(|\))/g,
  squared: /(\[|\])/g,
  curly: /(\{|\})/g,
};

function highlightCode() {
  let code = $input.value;

  for (const [key, token] of Object.entries(tokens)) {
    code = code.replace(token, `<i class="${key}">$1</i>`);
  }

  $code.innerHTML = code;
}

$input.addEventListener('input', () => {
  highlightCode();
});

$input.addEventListener('scroll', () => {
  $code.scrollTop = $input.scrollTop;
});

$input.addEventListener('keydown', (e) => {
  if (e.key == 'Tab') {
    e.preventDefault();

    const start = $input.selectionStart;
    const end = $input.selectionEnd;
    const tab = '  ';

    // set textarea value to: text before caret + tab + text after caret
    $input.value =
      $input.value.substring(0, start) + tab + $input.value.substring(end);

    // put caret at right position again
    $input.selectionStart = $input.selectionEnd = start + tab.length;

    highlightCode();
  }
});

highlightCode();
