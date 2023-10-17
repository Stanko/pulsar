import '../css/style.scss';
// import { generateHexGrid } from './svg-grids/hex';

import './eval';
import { calculateGrid, worker } from './eval';
import { generateTriangleGrid } from './grids/triangles';
import { Pixel } from './utils/types';

import './code-editor';
import { generateCirclesGrid } from './grids/circles';

// ----- Init ----- //

const $animationWrapper = document.querySelector(
  '.animation-wrapper'
) as HTMLDivElement;

function updateGrid() {
  const gridVariants = ['#classic', '#hex', '#triangle'];
  const hash = window.location.hash;

  const variant = gridVariants.includes(hash)
    ? hash.replace('#', '')
    : 'classic';

  const map: Record<string, () => Pixel[]> = {
    classic: () => generateCirclesGrid(6),
    // hex: () => generateHexGrid(5, 6),
    triangle: () => generateTriangleGrid(8, 5),
  };

  const grid = map[variant]();

  $animationWrapper.replaceChildren(...grid.map((point) => point.$element));

  return grid;
}

let grid = updateGrid();

window.addEventListener('hashchange', () => {
  grid = updateGrid();
});

// ----- Animation Loop ----- //

const speed = 300;
// const scale = 2;
let animationTime = 0;
let lastRestart = Date.now();
let timeSinceLastRestart = 0;
let raf: number;

// ----- Worker ----- //

let frameStart: number;
let frameSum: number = 0;
let frameCount: number = 0;

worker.addEventListener('message', (e) => {
  e.data.forEach((value: number, index: number) => {
    const point = grid[index];
    // point.$element.style.transform = `scale(${value.toFixed(3)}) translateZ(0)`;
    // point.$element.style.transform = `translate3d(${point.x * 100}%, ${
    //   point.y * 100
    // }%, 0) scale(${value.toFixed(3)})`;
    // point.$element.style.transform = ` translate3d(${
    //   point.x * 100
    // }%, ${point.y * 100}%, ${(value * 30).toFixed(3)}px)`;

    let z = (1 - 1 / value) * 100;

    point.$element.style.transform = `perspective(100px) translateZ(${z.toFixed(
      2
    )}px)`;
    point.$element.setAttribute('data-value', value.toFixed(2));
  });
  const frameDuration = Date.now() - frameStart;
  frameSum += frameDuration;
  frameCount++;

  if (frameCount % 100 === 0) {
    console.log(frameSum / 100);
    frameSum = 0;
    frameCount = 0;
  }

  if (isPlaying) {
    raf = requestAnimationFrame(() => draw());
  }
});

function draw(fakeStep = 0) {
  if (fakeStep !== 0) {
    timeSinceLastRestart += fakeStep;
  } else {
    timeSinceLastRestart = animationTime + (Date.now() - lastRestart) / speed;
  }

  frameStart = Date.now();
  calculateGrid(grid, timeSinceLastRestart);
  // grid.forEach((point) => {
  //   const value = getPointValue(
  //     point.x / scale,
  //     point.y / scale,
  //     timeSinceLastRestart
  //   );

  //   // point.$element.style.opacity = value.toFixed(3);
  //   point.$element.style.transform = `scale(${value.toFixed(3)})`;
  // });
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
