import '../css/style.scss';
import { generateHexGrid } from './grids/hex';

import './lib/eval';
import { calculateGrid, worker } from './lib/eval';
import { generateTriangleGrid } from './grids/triangles';
import { Pixel, GridType } from './lib/types';

import './lib/controls';

import './lib/code-editor';
import { generateCirclesGrid } from './grids/circles';
import { params } from './lib/controls';

const PERSPECTIVE = 100;

// ----- Init ----- //

let grid: Pixel[];

const $pixelWrapper = document.querySelector(
  '.pixel-wrapper'
) as HTMLDivElement;

function updateGrid() {
  const variant: GridType = params.grid;

  console.log(variant);

  const map: Record<string, () => Pixel[]> = {
    classic: () => generateCirclesGrid(6),
    hex: () => generateHexGrid(5, 6),
    triangular: () => generateTriangleGrid(8, 5),
  };

  const grid = map[variant]();

  $pixelWrapper.dataset.variant = variant;

  $pixelWrapper.replaceChildren(...grid.map((point) => point.$element));

  return grid;
}

grid = updateGrid();

const $gridInputs = [
  ...document.querySelectorAll('.control--grid input'),
] as HTMLInputElement[];

$gridInputs.forEach(($gridInput) => {
  $gridInput.addEventListener('change', () => {
    grid = updateGrid();
  });
});

// ----- Animation Loop ----- //

let animationTime = 0;
let lastRestart = Date.now();
let timeSinceLastRestart = 0;
let raf: number;

// ----- Worker ----- //

// Debug, commented for now
// let frameStart: number;
// let frameSum: number = 0;
// let frameCount: number = 0;

worker.addEventListener('message', (e) => {
  if (e.data.error) {
    console.log(e.data.error);
    return;
  }

  e.data.forEach((value: number, index: number) => {
    const point = grid[index];

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

  // Debug, commented for now
  // const frameDuration = Date.now() - frameStart;
  // frameSum += frameDuration;
  // frameCount++;

  // if (frameCount % 100 === 0) {
  //   console.log(frameSum / 100);
  //   frameSum = 0;
  //   frameCount = 0;
  // }

  if (isPlaying) {
    raf = requestAnimationFrame(() => draw());
  }
});

function draw(step = 0) {
  if (step !== 0) {
    timeSinceLastRestart += step;
  } else {
    timeSinceLastRestart =
      animationTime + (Date.now() - lastRestart) / (params.speed * 10);
  }

  // Debug, commented for now
  // frameStart = Date.now();
  calculateGrid(grid, timeSinceLastRestart);
}

// ----- Animation controls ----- //

let isPlaying = false;

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
  } else {
    cancelAnimationFrame(raf);
    animationTime = timeSinceLastRestart;
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
  draw();
}
