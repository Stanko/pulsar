import { calculateGrid } from './calculate';
import { Grid } from '../canvas-grid';

import debug, { log } from './debug';

import { state } from './state';
import { GridType } from './types';
import { drawGrid } from '../canvas-grid/canvas';

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

// Autoplay checkbox
const $autoplay = document.querySelector(
  'input[name=autoplay]'
) as HTMLInputElement;

// FPS meter elements
const $fps = document.querySelector('.fps') as HTMLDivElement;
const $fpsValue = document.querySelector('.fps__value') as HTMLPreElement;

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
  fpsHistory: number[] = [];
  fpsStartTime: number = Date.now();

  // Modules
  grid: Grid;

  constructor() {
    this.grid = new Grid(state.grid);

    // Autoplay on load
    this.isPlaying = $autoplay.checked;

    this.playOrDraw();

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
        log('Tab went inactive');
        this.wasPlaying = this.isPlaying;
        this.pause();
      } else if (document.visibilityState === 'visible') {
        // When tab is visible again, resume animation if it was playing
        if (this.wasPlaying) {
          log('Tab is active again - resuming');
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
      log('Play, already playing');
      return;
    }

    log('Play');

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
    log('Pause on error');

    // FPS
    if (debug) {
      this.fpsStartTime = Date.now();
      this.fps = 0;
    }

    this.updateRootClass();
  }

  pause() {
    log('Pause');
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
        this.fpsHistory.push(this.fps);
        if (this.fpsHistory.length > 60) {
          this.fpsHistory.shift();
        }

        $fps.innerHTML = this.fpsHistory
          .map((fps) => {
            return `<div class="fps__bar" style="height: ${fps / 2}%"></div>`;
          })
          .join('\n');
        $fpsValue.innerHTML = this.fps.toString();
        this.fpsStartTime = Date.now();
        this.fps = 0;
      }
    }

    if (response.error) {
      this.pauseOnError();
      return;
    }

    drawGrid(this.grid.points, response.data);

    // SVG renderer
    // response.data.forEach((value: number, index: number) => {
    //   const $point = this.grid.$points[index];

    //   // Not every grid type has the same number of points.
    //   // Therefore when the grid is changed multiple times in a single requestAnimationFrame,
    //   // we need to check if the point exists
    //   if (!$point) {
    //     return;
    //   }

    //   const PERSPECTIVE = 100;

    //   // Avoiding division by zero
    //   let z = (value === 0 ? 1000 : (1 - 1 / value) * PERSPECTIVE).toFixed(2);

    //   if (state.animate === 'scale') {
    //     $point.style.transform = `perspective(${PERSPECTIVE}px) translateZ(${z}px)`;
    //     $point.style.opacity = '';
    //   } else if (state.animate === 'opacity') {
    //     $point.style.opacity = value.toFixed(2);
    //     $point.style.transform = '';
    //   } else {
    //     $point.style.transform = `perspective(${PERSPECTIVE}px) translateZ(${z}px)`;
    //     $point.style.opacity = value.toFixed(2);
    //   }
    // });

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
      log('Play or draw - start/resume animation');
      this.animate();
    } else {
      log('Play or draw - draw a single frame');
      this.draw();
    }
  };
}
