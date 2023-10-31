import { calculateGrid } from './calculate';
import { Grid } from '../grid';

import debug from './debug';

import { state } from './state';
import { GridType } from './types';

// DOM
const $root = document.querySelector('.pulsar') as HTMLElement;
const $playPause = document.querySelector('.play-pause') as HTMLButtonElement;
const $toggleUIButtons = [
  ...(document.querySelectorAll('.toggle-ui') as NodeListOf<HTMLButtonElement>),
];

// Toggle UI
$toggleUIButtons.forEach(($toggleUI) => {
  $toggleUI.addEventListener('click', () => {
    document.body.classList.toggle('ui-hidden');
  });
});

export const $autoplay = document.querySelector(
  'input[name=autoplay]'
) as HTMLInputElement;

export class Pulsar {
  // Animation
  isPlaying: boolean = false;
  wasPlaying: boolean = false;
  raf: number = 0;
  time: number = 0;
  lastRestart = Date.now();
  timeSinceLastRestart = 0;

  // FPS
  fps: number = 0;
  fpsStartTime: number = Date.now();

  // Modules
  grid: Grid;

  constructor() {
    this.grid = new Grid(state.grid);

    // Autoplay on load
    this.isPlaying = $autoplay.checked;

    state.onChange('grid', (grid) => {
      this.grid.update(grid as GridType);
      this.playOrDraw();
    });

    state.onChange('animate', this.playOrDraw);

    state.onChange('code', () => {
      this.playOrDraw();
    });

    // Play/pause button
    $playPause.addEventListener('click', () => {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    });

    // Pause when tab is hidden
    window.addEventListener('visibilitychange', () => {
      // Pause when tab is hidden
      if (document.visibilityState === 'hidden') {
        // Save if animation was playing
        this.wasPlaying = this.isPlaying;
        this.pause();
      } else if (document.visibilityState === 'visible') {
        // When tab is visible again, resume animation if it was playing
        if (this.wasPlaying) {
          this.play();
        }
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

    $root.setAttribute('class', classes.join(' '));
  }

  play() {
    if (this.isPlaying) {
      return;
    }

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

  draw = async () => {
    cancelAnimationFrame(this.raf);

    if (state.error !== '') {
      this.pauseOnError();
      return;
    }

    const response = await calculateGrid(
      this.grid.points,
      this.timeSinceLastRestart,
      state.code
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
      this.pauseOnError();
      return;
    }

    response.data.forEach((value: number, index: number) => {
      const $point = this.grid.$points[index];

      // Not every grid type has the same number of points.
      // Therefore when the grid is changed multiple times in a single requestAnimationFrame,
      // we need to check if the point exists
      if (!$point) {
        return;
      }

      const PERSPECTIVE = 100;

      // Avoiding division by zero
      let z = (value === 0 ? 1000 : (1 - 1 / value) * PERSPECTIVE).toFixed(2);

      if (state.animate === 'scale') {
        $point.style.transform = `perspective(${PERSPECTIVE}px) translateZ(${z}px)`;
        $point.style.opacity = '';
      } else if (state.animate === 'opacity') {
        $point.style.opacity = value.toFixed(2);
        $point.style.transform = '';
      } else {
        $point.style.transform = `perspective(${PERSPECTIVE}px) translateZ(${z}px)`;
        $point.style.opacity = value.toFixed(2);
      }
    });

    this.updateRootClass();

    if (this.isPlaying) {
      this.raf = requestAnimationFrame(this.animate);
    }
  };

  animate = () => {
    this.timeSinceLastRestart =
      this.time + (Date.now() - this.lastRestart) / 200;

    this.draw();
  };

  playOrDraw = () => {
    if (this.isPlaying) {
      this.animate();
    } else {
      this.draw();
    }
  };
}
