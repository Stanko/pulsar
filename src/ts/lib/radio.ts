import { state } from './state';
import { AnimateType } from './types';

export class Radio {
  $inputs: HTMLInputElement[];
  name: 'animate' | 'grid';
  options: string[];
  initialValue: string;

  constructor(
    name: 'animate' | 'grid',
    options: string[],
    initialValue: string
  ) {
    this.name = name;
    this.options = options;
    this.initialValue = initialValue;

    this.$inputs = [
      ...document.querySelectorAll<HTMLInputElement>(`input[name=${name}]`),
    ];

    this.$inputs.forEach(($input) => {
      $input.addEventListener('change', () => {
        state.updateRadio(this.name, $input.value as AnimateType);
      });
    });

    this.updateFromURL();
  }

  updateFromURL() {
    const URLParams = new URLSearchParams(window.location.search);
    let value = URLParams.get(this.name) || this.initialValue;

    if (!this.options.includes(value)) {
      value = this.options[0];
    }

    state.updateRadio(this.name, value);
  }

  update(value: string) {
    state.updateRadio(this.name, value);
  }
}
