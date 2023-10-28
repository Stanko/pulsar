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
const $toggleUIButtons: HTMLButtonElement[] = [
  ...(document.querySelectorAll('.toggle-ui') as NodeListOf<HTMLButtonElement>),
];

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
        this.grid.update(params.grid);
      } else if (name === 'code') {
        if (this.isPlaying) {
          // Make sure to start animation when user changes code
          // cause it can be paused on error
          this.play();
        }
      }

      // If the animation is paused, draw once when any of the params change
      if (!this.isPlaying) {
        this.draw();
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

    // Toggle UI
    $toggleUIButtons.forEach(($toggleUI) => {
      $toggleUI.addEventListener('click', () => {
        document.body.classList.toggle('ui-hidden');
      });
    });

    // Pause when tab is hidden
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.pause();
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
    this.updateRootClass();
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

      // Not every grid type has the same number of points.
      // Therefore when the grid is changed multiple times in a single requestAnimationFrame,
      // we need to check if the point exists
      if (!point) {
        return;
      }

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

export default Pulsar;

new Pulsar();
