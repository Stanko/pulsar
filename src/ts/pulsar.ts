import '../css/pulsar.scss';

import { Params } from './lib/types';

import { $autoplay, Controls } from './lib/controls';
import { calculateGrid } from './lib/calculate';
import { Editor } from './lib/editor';
import { Grid } from './grid';
import debug from './lib/debug';

// DOM
const $root: HTMLDivElement = document.querySelector(
  '.pulsar'
) as HTMLDivElement;
const $playPause: HTMLButtonElement = document.querySelector(
  '.play-pause'
) as HTMLButtonElement;

class Pulsar {
  // Animation
  isPlaying: boolean = false;
  raf: number = 0;
  time: number = 0;
  lastRestart = Date.now();
  timeSinceLastRestart = 0;

  // FPS
  fps: number = 0;
  fpsStartTime: number = Date.now();

  // Modules
  grid: Grid;
  editor: Editor;
  controls: Controls;

  constructor() {
    this.editor = new Editor();

    this.controls = new Controls((params: Params, name: string) => {
      if (name === 'grid') {
        // this.params.grid = $gridInput.value as GridType;
        this.grid.update(params.grid);

        if (!this.isPlaying) {
          this.draw();
        }
      } else if (name === 'code') {
        if (this.isPlaying) {
          // Start animation when user changes code
          this.play();
        } else {
          // Draw once when user changes code if the animation is paused
          this.draw();
        }
      }
    });

    this.grid = new Grid(this.controls.params.grid);

    // Autoplay on load
    this.isPlaying = $autoplay.checked;

    if (this.isPlaying) {
      this.play();
    } else {
      this.draw();
    }

    // Play/pause button
    $playPause.addEventListener('click', () => {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    });
  }

  updateRootClass() {
    const classes: string[] = ['pulsar'];

    if (this.isPlaying) {
      classes.push('is-playing');
    } else {
      classes.push('is-paused');
    }

    if (this.editor.error) {
      classes.push('has-error');
    }

    $root.setAttribute('class', classes.join(' '));
  }

  play() {
    this.isPlaying = true;
    this.lastRestart = Date.now();

    this.animate();

    // FPS
    if (debug) {
      this.fpsStartTime = Date.now();
      this.fps = 0;
    }

    this.updateRootClass();
  }

  pauseOnError() {
    cancelAnimationFrame(this.raf);
    this.time = this.timeSinceLastRestart;

    // FPS
    if (debug) {
      this.fpsStartTime = Date.now();
      this.fps = 0;
    }

    this.updateRootClass();
  }

  pause() {
    this.isPlaying = false;
    this.time = this.timeSinceLastRestart;

    cancelAnimationFrame(this.raf);
  }

  async draw() {
    if (this.editor.error) {
      this.editor.showError(this.editor.error);
      this.pauseOnError();
      return false;
    }

    const response = await calculateGrid(
      this.grid.pixels,
      this.timeSinceLastRestart,
      this.controls.params.code
    );

    // FPS
    if (debug) {
      this.fps++;

      if (Date.now() - this.fpsStartTime > 1000) {
        console.log('fps', this.fps);
        this.fpsStartTime = Date.now();
        this.fps = 0;
      }
    }

    if (response.error) {
      this.editor.showError(response.error);
      this.pauseOnError();
      return false;
    }

    this.editor.hideError();

    response.data.forEach((value: number, index: number) => {
      const point = this.grid.pixels[index];

      // TODO
      // Investigate, once I got "Uncaught TypeError: point is undefined"
      // but I couldn't reproduce it and everything kept working normally.
      // It is probably happened when grid was changed and there was a leftover queue
      // for updating the old grid after message from the worker.
      // if (!point) {
      //   return;
      // }

      const PERSPECTIVE = 100;

      // Avoiding division by zero
      let z = (value === 0 ? 1000 : (1 - 1 / value) * PERSPECTIVE).toFixed(2);

      if (this.controls.params.animate === 'scale') {
        point.$element.style.transform = `perspective(${PERSPECTIVE}px) translateZ(${z}px)`;
        point.$element.style.opacity = '';
      } else if (this.controls.params.animate === 'opacity') {
        point.$element.style.opacity = value.toFixed(2);
        point.$element.style.transform = '';
      } else {
        point.$element.style.transform = `perspective(${PERSPECTIVE}px) translateZ(${z}px)`;
        point.$element.style.opacity = value.toFixed(2);
      }
    });

    this.updateRootClass();

    return true;
  }

  animate = async () => {
    const speed = 200;

    this.timeSinceLastRestart =
      this.time + (Date.now() - this.lastRestart) / speed;

    const drawNext = await this.draw();

    if (drawNext && this.isPlaying) {
      this.raf = requestAnimationFrame(this.animate);
    }
  };
}

// class Checkbox {
//   $element: HTMLInputElement;
//   checked: boolean;

//   constructor(
//     $element: HTMLInputElement,
//     onChange: ((e: Event) => void) | undefined = undefined
//   ) {
//     this.checked = $element.checked;
//     this.$element = $element;
//     this.$element.addEventListener('change', this.handleChange);
//   }

//   handleChange = () => {
//     this.checked = this.$element.checked;
//   };
// }

// class Control {
//   $element: HTMLInputElement;
//   validate: (value: string) => boolean;

//   constructor(
//     $element: HTMLInputElement,
//     validate: (value: string) => boolean
//   ) {
//     this.$element = $element;
//     this.validate = validate;

//     this.$element.addEventListener('change', this.handleChange);
//   }

//   handleChange = () => {};
// }

export default Pulsar;

new Pulsar();
