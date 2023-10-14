import '../css/style.css';
import { generateHexGrid } from './hex-grid';
import { generateRectangularGrid } from './rectangular-grid';

import './eval';
import { getPointValue } from './eval';
import { generateTriangleGrid } from './triangle-grid';
import { Polygon, Circle } from './types';

import './code-editor';
// import { generateRectangularGridDOM } from './rectangular-grid-dom';

// ----- Init ----- //

const $svg = document.querySelector('svg') as SVGElement;

function updateGrid() {
  const gridVariants = ['#classic', '#hex', '#triangle'];
  const hash = window.location.hash;

  const variant = gridVariants.includes(hash)
    ? hash.replace('#', '')
    : 'classic';

  const map: Record<string, () => (Polygon | Circle)[]> = {
    classic: () => generateRectangularGrid(6),
    // classic: () => generateRectangularGridDOM(6),
    hex: () => generateHexGrid(5, 6),
    triangle: () => generateTriangleGrid(8, 5),
  };

  const grid = map[variant]();

  const colors = [
    '#ff9500',
    '#ffcc02',
    '#35c759',
    '#5bc7fa',
    '#007aff',
    '#5856d7',
    '#af52de',
    '#ff2c55',
  ];

  grid.forEach((point) => {
    // point.$element.style.opacity = 0.5 + Math.random() * 0.5 + '';
    // point.$element.style.fill =
    //   colors[Math.floor(Math.random() * colors.length)];
    const d = Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));

    point.$element.style.fill = colors[Math.floor(d)];
    // point.$element.style.background = colors[Math.floor(d)];
  });

  $svg.replaceChildren(...grid.map((point) => point.$element));
  // document
  //   .querySelector('.dom-wrapper')
  //   .replaceChildren(...grid.map((point) => point.$element));

  return grid;
}

let grid = updateGrid();

window.addEventListener('hashchange', () => {
  grid = updateGrid();
});

// ----- Animation Loop ----- //

const speed = 500;
const scale = 2;
let animationTime = 0;
let lastRestart = Date.now();
let timeSinceLastRestart = 0;
let raf: number;

function draw() {
  timeSinceLastRestart = animationTime + (Date.now() - lastRestart) / speed;

  grid.forEach((point) => {
    const value = getPointValue(
      point.x / scale,
      point.y / scale,
      timeSinceLastRestart
    );
    // point.$element.style.opacity = value.toFixed(3);
    point.$element.style.transform = `scale(${value.toFixed(3)})`;
  });

  raf = requestAnimationFrame(draw);
}

// ----- Animation controls ----- //

let isPlaying = false;

const $playPause = document.querySelector('.play-pause') as HTMLButtonElement;

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

// ----- Start ----- //

if (isPlaying) {
  draw();
}
