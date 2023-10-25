import '../css/style.scss';
import { generateHexGrid } from './grids/hex';

import './lib/controls';
import './lib/eval';

import { calculateGrid, hideError, showError } from './lib/eval';
import { generateTriangleGrid } from './grids/triangles';
import { Pixel, GridType } from './lib/types';

import './lib/code-editor';
import { generateCirclesGrid } from './grids/circles';
import { $autoplay, params } from './lib/controls';

// ----- Constants ----- //

const PERSPECTIVE = 100;

// ----- Variables ----- //

// Grid
let grid: Pixel[];

// Debug
let debug = window.location.hash === '#debug';
let frameStart: number;
let frameSum: number = 0;
let frameCount: number = 0;
const FRAMES_TO_REPORT = 100;

// Animation Loop

let isPlaying = $autoplay.checked;

let animationTime = 0;
let lastRestart = Date.now();
let timeSinceLastRestart = 0;
let raf: number;

// Dom
const $pixelWrapper = document.querySelector(
  '.pixel-wrapper'
) as HTMLDivElement;

const $toggleUI = document.querySelector('.toggle-ui') as HTMLButtonElement;
let isUIVisible = true;
$toggleUI.addEventListener('click', () => {
  isUIVisible = !isUIVisible;
  document.body.classList.toggle('ui-hidden');

  $toggleUI.innerHTML = isUIVisible ? 'Hide UI' : 'Show UI';
});

// ----- Init ----- //

window.addEventListener('hashchange', () => {
  debug = window.location.hash === '#debug';
});

const messageHandler = (e: MessageEvent<any>) => {
  if (e.data.error) {
    showError(e.data.error);
    return;
  }

  // hideError();

  e.data.forEach((value: number, index: number) => {
    const point = grid[index];

    // TODO
    // Investigate, once I got "Uncaught TypeError: point is undefined"
    // but I couldn't reproduce it and everything kept working normally.
    // It is probably happened when grid was changed and there was a leftover queue
    // for updating the old grid after message from the worker.
    if (!point) {
      return;
    }

    // Avoiding division by zero
    let z = (value === 0 ? 1000 : (1 - 1 / value) * PERSPECTIVE).toFixed(2);

    if (params.animate === 'scale') {
      point.$element.style.transform = `perspective(${PERSPECTIVE}px) translateZ(${z}px)`;
      point.$element.style.opacity = '';
    } else if (params.animate === 'opacity') {
      point.$element.style.opacity = value.toFixed(2);
      point.$element.style.transform = '';
    } else {
      point.$element.style.transform = `perspective(${PERSPECTIVE}px) translateZ(${z}px)`;
      point.$element.style.opacity = value.toFixed(2);
    }
  });

  if (debug) {
    const frameDuration = Date.now() - frameStart;
    frameSum += frameDuration;
    frameCount++;

    if (frameCount % FRAMES_TO_REPORT === 0) {
      console.log(
        `${FRAMES_TO_REPORT} frames, average per frame: ${
          frameSum / FRAMES_TO_REPORT
        } ms`
      );
      frameSum = 0;
      frameCount = 0;
    }
  }
};

async function updateGrid() {
  const variant: GridType = params.grid;

  const map: Record<string, () => Pixel[]> = {
    classic: () => generateCirclesGrid(6),
    hex: () => generateHexGrid(5, 6),
    triangular: () => generateTriangleGrid(8, 5),
  };

  grid = map[variant]();

  cancelAnimationFrame(raf);
  draw();

  $pixelWrapper.replaceChildren(...grid.map((point) => point.$element));

  $pixelWrapper.dataset.variant = variant;
}

updateGrid();

const $gridInputs = [
  ...document.querySelectorAll('.control--grid input'),
] as HTMLInputElement[];

$gridInputs.forEach(($gridInput) => {
  $gridInput.addEventListener('change', () => {
    updateGrid();
  });
});

async function draw(step = 0) {
  if (step !== 0) {
    timeSinceLastRestart += step;
  } else {
    // Map params.speed
    // 0 -> 280 - slow
    // 1 -> 200 - default
    // 2 -> 120 - fast
    const speed = 280 - params.speed * 80;
    timeSinceLastRestart = animationTime + (Date.now() - lastRestart) / speed;
  }

  // For debugging
  frameStart = Date.now();
  await calculateGrid(grid, timeSinceLastRestart, messageHandler);

  if (isPlaying) {
    raf = requestAnimationFrame(() => draw());
  }
}

// ----- Animation controls ----- //

const $playPause = document.querySelector('.play-pause') as HTMLButtonElement;
const $stepBack = document.querySelector('.step-back') as HTMLButtonElement;
const $stepForward = document.querySelector(
  '.step-forward'
) as HTMLButtonElement;

$playPause.addEventListener('click', () => {
  isPlaying = !isPlaying;

  if (isPlaying) {
    lastRestart = Date.now();
    draw();
    $playPause.innerHTML = 'Pause';
  } else {
    cancelAnimationFrame(raf);
    animationTime = timeSinceLastRestart;
    $playPause.innerHTML = 'Play';
  }
});

$stepBack.addEventListener('click', () => {
  isPlaying = false;
  cancelAnimationFrame(raf);
  draw(-0.1);
});

$stepForward.addEventListener('click', () => {
  isPlaying = false;
  cancelAnimationFrame(raf);
  draw(0.1);
});

// ----- Start ----- //

if (isPlaying) {
  $playPause.innerHTML = 'Pause';
  draw();
}
