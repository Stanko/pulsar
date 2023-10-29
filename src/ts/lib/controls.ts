import { Params } from './types';

// ----- Autoplay ----- //

const AUTOPLAY_KEY = 'pulsar:autoplay';

export const $autoplay = document.querySelector(
  'input[name=autoplay]'
) as HTMLInputElement;

if (localStorage.getItem(AUTOPLAY_KEY)) {
  $autoplay.checked = localStorage.getItem(AUTOPLAY_KEY) === 'true';
}

$autoplay.addEventListener('change', () => {
  localStorage.setItem(AUTOPLAY_KEY, $autoplay.checked.toString());
});

// ----- Params ----- //

const gridTypes = ['classic', 'hex', 'triangular'];
const animateTypes = ['both', 'scale', 'opacity'];

export const CODE_MAX_LENGTH = 120;

const examples = [
  {
    code: '(cos(x * t / 5) + sin(y * t / 5)) / 2',
  },
  {
    code: '(cos(sqrt(x * x + y * y) - t) + 1) / 2',
    grid: 'hex',
  },
  {
    code: '(cos(sin(x * y) + t * 0.66) + 1) / 2',
  },
  {
    code: '((cos(t + x + cos(t)) + sin(t + y)) + 2) / 4',
  },
  {
    code: 'sqrt(x*x + y*y) > (cos(x + t) + 1) / 2 * 5  ? noise(x + t, y + t) * 0.3 : 1',
  },
  {
    code: 'cos(x + t) > y * 0.3 + 0.5 ? (cos(x + t) + 1) / 4 + 0.5 : 0', // 'cos(x + t) > y * 0.3 + 0.5 ? 0.8 : 0',
  },
  {
    code: 'cos(t * 0.5) * 0.5 + 0.5', // pulse
    animate: 'opacity',
  },
  {
    code: 'sin(0.5 * x + y * t * 0.8) * sin(t / 4)',
    grid: 'triangular',
  },
  {
    code: 'sin(x * cos(t * 0.5)) + cos(y * sin(t * 0.5))',
    grid: 'hex',
  },
  {
    code: ' sin(t) * sin(x) + cos(t) * cos(y)',
    grid: 'triangular',
    animate: 'opacity',
  },
  {
    code: 'abs(abs(x) - abs(y)) < t % 7 ? 1 : 0',
    grid: 'hex',
  },
];

const randomExample = examples[Math.floor(Math.random() * examples.length)];

const DEFAULT_PARAMS: Params = {
  grid: 'classic',
  animate: 'scale',
  ...randomExample,
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

export class Controls {
  params: Params = { ...DEFAULT_PARAMS };
  handler: (params: Params, name: string) => void;
  $inputs: (HTMLInputElement | HTMLTextAreaElement)[];

  constructor(handler: (params: Params, name: string) => void) {
    this.handler = handler;

    this.$inputs = [
      ...(document.querySelectorAll(
        'input[name=grid], input[name=animate], textarea[name=code]'
      ) as NodeListOf<HTMLInputElement | HTMLTextAreaElement>),
    ];

    // Add event listeners
    this.$inputs.forEach(($input) => {
      $input.addEventListener('input', () => {
        this.params[$input.name] = $input.value;
        this.updateURL();
        this.handler(this.params, $input.name);
      });
    });

    this.updateParamsFromURL();
    this.updateURL();
  }

  // Update inputs from params
  updateInputs() {
    this.$inputs.forEach(($input) => {
      if ($input.type === 'radio' || $input.type === 'checkbox') {
        ($input as HTMLInputElement).checked =
          $input.value === this.params[$input.name];
      } else {
        $input.value = this.params[$input.name];
      }

      $input.dispatchEvent(new Event('change'));
    });
  }

  // Update params from URL
  updateParamsFromURL() {
    const URLParams = new URLSearchParams(window.location.search);

    PARAMS.forEach((param) => {
      if (
        URLParams.get(param.name) &&
        Object.keys(this.params).includes(param.name)
      ) {
        this.params[param.name] = param.validate(
          URLParams.get(param.name) || ''
        );
      }
    });

    this.updateInputs();
  }

  // Update URL after input changes
  updateURL() {
    const queryString = toQueryString(this.params);
    const url = `${window.location.origin}${window.location.pathname}?${queryString}`;

    window.history.replaceState(null, '', url);
  }
}
