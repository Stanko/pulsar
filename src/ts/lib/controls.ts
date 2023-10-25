import { Params } from './types';

// ----- Autoplay ----- //

const AUTOPLAY_KEY = 'pulsar:autoplay';
export const $autoplay = document.querySelector(
  'input[name=autoplay]'
) as HTMLInputElement;
$autoplay.checked = localStorage.getItem(AUTOPLAY_KEY) === 'true';

$autoplay.addEventListener('change', () => {
  localStorage.setItem(AUTOPLAY_KEY, $autoplay.checked.toString());
});

// ----- Params ----- //

const $inputs = [
  ...document.querySelectorAll('.control input, .code-editor__input'),
] as HTMLInputElement[];

const gridTypes = ['classic', 'hex', 'triangular'];
const animateTypes = ['both', 'scale', 'opacity'];

export const CODE_MAX_LENGTH = 120;

const examples = [
  '(Math.cos(x * t / 5) + Math.sin(y * t / 5)) / 2',
  '(Math.cos(Math.sqrt(x * x + y * y) - t) + 1) / 2',
  '(Math.cos(Math.sin(x * y) + t * 0.66) + 1) / 2',
  '((Math.cos(t + x + Math.cos(t)) + Math.sin(t + y)) + 2) / 4',
  'Math.sqrt(x*x + y*y) > (Math.cos(x + t) + 1) / 2 * 5  ? noise(x + t, y + t) * 0.3 : 1',
  'Math.cos(x + t) > y * 0.3 + 0.5 ? (Math.cos(x + t) + 1) / 4 + 0.5 : 0', // 'Math.cos(x + t) > y * 0.3 + 0.5 ? 0.8 : 0',
];

const DEFAULT_PARAMS: Params = {
  grid: 'classic',
  animate: 'scale',
  speed: 1,
  code: examples[Math.floor(Math.random() * examples.length)],
};

export const PARAMS = [
  {
    name: 'grid',
    validate: (value: string) => {
      if (gridTypes.includes(value)) {
        return value;
      }
      return DEFAULT_PARAMS.grid;
    },
  },
  {
    name: 'animate',
    validate: (value: string) => {
      if (animateTypes.includes(value)) {
        return value;
      }
      return DEFAULT_PARAMS.animate;
    },
  },
  {
    name: 'speed',
    validate: (value: string) => {
      const intValue = parseInt(value, 10);
      const MIN = 1;
      const MAX = 9;

      if (intValue >= MIN && intValue <= MAX) {
        return intValue;
      }

      return DEFAULT_PARAMS.speed;
    },
  },
  {
    name: 'code',
    validate: (value: string) => {
      const code = decodeCode(value);

      if (code.length <= CODE_MAX_LENGTH) {
        return code;
      }

      return DEFAULT_PARAMS.code;
    },
  },
];

export const params: Params = { ...DEFAULT_PARAMS };

export function toQueryString(params: Record<string, any>): string {
  return Object.entries(params)
    .map(([key, value]) => {
      if (key === 'code') {
        value = encodeCode(value);
      }

      return `${key}=${value}`;
    })
    .join('&');
}

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

// Update URL after input changes
function updateURL() {
  const queryString = toQueryString(params);
  const url = `${window.location.origin}${window.location.pathname}?${queryString}`;

  window.history.replaceState(null, '', url);
}

// Update params from URL
function updateParamsFromURL() {
  const URLParams = new URLSearchParams(window.location.search);

  PARAMS.forEach((param) => {
    if (URLParams.get(param.name) && Object.keys(params).includes(param.name)) {
      params[param.name] = param.validate(URLParams.get(param.name) || '');
    }
  });

  updateInputs();
}

// Update inputs from params
function updateInputs() {
  $inputs.forEach(($input) => {
    if ($input.type === 'radio' || $input.type === 'checkbox') {
      $input.checked = $input.value === params[$input.name];
    } else {
      $input.value = params[$input.name];
    }
    $input.dispatchEvent(new Event('change'));
  });
}

// Add event listeners
$inputs.forEach(($input) => {
  $input.addEventListener('input', () => {
    params[$input.name] = $input.value;
    updateURL();
  });
});

updateParamsFromURL();
