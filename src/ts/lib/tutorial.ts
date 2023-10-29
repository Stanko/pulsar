import type { Pulsar } from '../pulsar';
import { GridType, AnimationType } from './types';

const $next: HTMLButtonElement = document.querySelector(
  '.tutorial'
) as HTMLButtonElement;

const $introText: HTMLParagraphElement = document.querySelector(
  '.intro-text'
) as HTMLParagraphElement;

let step: number | null = null;

const steps: {
  code: string;
  text: string;
  grid?: GridType;
  animate?: AnimationType;
}[] = [
  {
    text: 'Pulsar allows you to create animations using code.',
    code: 'sin(t) * 0.5 + 0.5',
    grid: 'classic',
    animate: 'scale',
  },
  {
    text: 'Write code that returns a value between 0 and 1 (try changing it).',
    code: '0.5 ',
    grid: 'classic',
    animate: 'scale',
  },
  {
    text: 'The code is evaluated for each "pixel" individually.',
    code: 'random()',
    grid: 'classic',
    animate: 'scale',
  },
  {
    text: 'Parameter "t" is time in fifth of a second.',
    code: 'cos(t) * 0.5 + 0.5',
    grid: 'classic',
    animate: 'scale',
  },
  {
    text: 'You can slow down the animation by multiplying the "t" and make it loop using "%" operator.',
    code: '(t * 0.1) % 1',
    grid: 'classic',
    animate: 'scale',
  },
  {
    text: 'Parameters "x" and "y" are coordinates and they span roughly from -6 to 6.',
    code: 'abs(x / 12) + abs(y / 12)',
    grid: 'classic',
    animate: 'scale',
  },
  {
    text: 'You can use any of the mathematical functions available in JavaScript like "cos" or "sqrt".',
    code: 'cos(x) + sin(y)',
    grid: 'classic',
    animate: 'scale',
  },
  {
    text: 'Simplex noise is also available.',
    code: 'noise(x + t, y + t)',
    grid: 'classic',
    animate: 'scale',
  },
  {
    text: 'You can switch between different grid types and animation properties.',
    code: 'cos(x + t) * 0.5 + 0.5',
    grid: 'hex',
    animate: 'both',
  },
  {
    text: 'Here are a few examples to get you started. Radial wave:',
    code: '(cos(sqrt(x * x + y * y) - t) + 1) / 2',
    grid: 'classic',
    animate: 'scale',
  },
  {
    text: 'Liner cosine wave:',
    code: 'cos(x * 0.8 + t) > y * 0.25 ? 1 : 0',
    grid: 'classic',
    animate: 'scale',
  },
  {
    text: '"Floral" pattern:',
    code: '(cos(sin(x * y) + t * 0.66) + 1) / 2',
    grid: 'classic',
    animate: 'scale',
  },
  {
    text: 'Experiment combining different functions and parameters to create funky animations. Have fun!',
    code: 'sqrt(x*x + y*y) > (cos(x + t) + 1) / 2 * 5  ? noise(x + t, y + t) * 0.3 : 1',
    grid: 'classic',
    animate: 'scale',
  },
  {
    text: $introText.innerText,
    code: '',
  },
];

export class Tutorial {
  constructor(pulsar: Pulsar) {
    steps[steps.length - 1].code = pulsar.controls.params.code;
    steps[steps.length - 1].grid = pulsar.controls.params.grid;
    steps[steps.length - 1].animate = pulsar.controls.params.animate;

    $next.addEventListener('click', () => {
      if (step === null) {
        step = 0;
      } else {
        step = (step + 1) % steps.length;
      }

      if (step === steps.length - 2) {
        $next.innerHTML = 'Finish';
      } else if (step === steps.length - 1) {
        $next.innerHTML = 'Restart';
      } else {
        $next.innerHTML = 'Next';
      }
      const data = steps[step];

      $introText.innerHTML = data.text;
      pulsar.editor.update(data.code);

      if (data.grid || data.animate) {
        if (data.grid && pulsar.grid.type !== data.grid) {
          pulsar.controls.params.grid = data.grid;
          pulsar.grid.update(data.grid);
        }

        if (data.animate) {
          pulsar.controls.params.animate = data.animate;
        }

        pulsar.controls.updateURL();
        pulsar.controls.updateParamsFromURL();
        pulsar.controls.updateInputs();
      }

      if (!pulsar.isPlaying) {
        pulsar.play();
      }
    });
  }
}
