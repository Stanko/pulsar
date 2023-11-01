import {
  AnimateType,
  GridType,
  AvailableParams,
  StateChangeHandler,
} from './types';
import { updateURLQuery } from './url';

export const DEFAULT_STATE = {
  code: 'sin(t) * 0.5 + 0.5',
  grid: 'classic',
  animate: 'scale',
} as const;

// const $editor = document.querySelector(
//   '.editor__textarea'
// ) as HTMLTextAreaElement;

class State {
  code: string = DEFAULT_STATE.code;
  grid: GridType = DEFAULT_STATE.grid;
  animate: AnimateType = DEFAULT_STATE.animate;
  error: string = ''; // Code editor error

  handlers: Record<AvailableParams, StateChangeHandler[]> = {
    code: [],
    grid: [],
    animate: [],
  };

  constructor() {}

  onChange(param: AvailableParams, fn: StateChangeHandler) {
    this.handlers[param].push(fn);
  }

  updateRadio(param: AvailableParams, value: string) {
    if (this[param] !== value) {
      if (param === 'animate') {
        this.animate = value as AnimateType;
      } else if (param === 'grid') {
        this.grid = value as GridType;
      }

      this.handlers[param].forEach((fn) => fn(value));
    }

    const $input = document.querySelector(
      `input[name=${param}][value=${value}]`
    ) as HTMLInputElement;

    $input.checked = true;

    updateURLQuery({
      [param]: value,
    });
  }

  updateCode(code: string) {
    this.code = code;
    this.handlers['code'].forEach((fn) => fn(code));
    updateURLQuery({ code });
  }
}

export const state = new State();
