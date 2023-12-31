import { log } from './debug';
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
        log('Animate changed:', value);
        this.animate = value as AnimateType;
      } else if (param === 'grid') {
        log('Grid changed:', value);
        this.grid = value as GridType;
      }

      this.handlers[param].forEach((fn) => fn(value));
    }

    updateURLQuery({
      [param]: value,
    });
  }

  updateCode(code: string) {
    log('Code changed:', code);
    this.code = code;
    this.handlers['code'].forEach((fn) => fn(code));
    updateURLQuery({ code });
  }

  updateAll(newState: { grid: GridType; animate: AnimateType; code: string }) {
    this.code = newState.code;
    this.animate = newState.animate;
    this.grid = newState.grid;

    this.handlers.code.forEach((fn) => fn(this.code));
    this.handlers.animate.forEach((fn) => fn(this.animate));
    this.handlers.grid.forEach((fn) => fn(this.grid));

    updateURLQuery(newState);
  }
}

export const state = new State();
