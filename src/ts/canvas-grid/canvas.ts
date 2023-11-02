import '../../css/pulsar.scss';

import { state } from '../lib/state';
import { GridItem, Point } from '../lib/types';
import { CANVAS_SIZE, RADIUS } from './constants';

const $canvas = document.querySelector('.canvas') as HTMLCanvasElement;

const pixelRatio = window.devicePixelRatio;
const ctx = $canvas.getContext('2d') as CanvasRenderingContext2D;

$canvas.width = CANVAS_SIZE * pixelRatio;
$canvas.height = CANVAS_SIZE * pixelRatio;

ctx.scale(pixelRatio, pixelRatio);

const { PI } = Math;
const DEG_30 = Math.PI / 6;
const DEG_60 = DEG_30 * 2;
const DEG_120 = DEG_60 * 2;

const HEX_ANGLES = [0, 1, 2, 3, 4, 5].map((index) => {
  return DEG_30 + index * DEG_60;
});

const TRIANGLE_ANGLES = [0, 1, 2].map((index) => {
  return PI + DEG_30 + index * DEG_120;
});

function drawHexagon(center: Point, side: number) {
  const { x, y } = center;

  ctx.moveTo(
    x + side * Math.cos(HEX_ANGLES[0]),
    y + side * Math.sin(HEX_ANGLES[0])
  );

  HEX_ANGLES.forEach((angle) => {
    ctx.lineTo(x + side * Math.cos(angle), y + side * Math.sin(angle));
  });
}

function drawTriangle(center: Point, side: number, angleOffset: number) {
  const { x, y } = center;

  ctx.moveTo(
    x + side * Math.cos(TRIANGLE_ANGLES[0] + angleOffset),
    y + side * Math.sin(TRIANGLE_ANGLES[0] + angleOffset)
  );

  TRIANGLE_ANGLES.forEach((angle) => {
    ctx.lineTo(
      x + side * Math.cos(angle + angleOffset),
      y + side * Math.sin(angle + angleOffset)
    );
  });
}

function drawCircle(center: Point, radius: number) {
  const { x, y } = center;

  ctx.arc(x, y, radius, 0, 2 * Math.PI);
}

const drawMethods = {
  classic: drawCircle,
  hex: drawHexagon,
  triangular: drawTriangle,
};

export function drawGrid(grid: GridItem[], data: number[]) {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  const isScale = state.animate === 'scale' || state.animate === 'both';
  const isOpacity = state.animate === 'opacity' || state.animate === 'both';

  grid.forEach((point, index) => {
    const { color, x, y, r, angleOffset } = point;
    const pointScale = data[index];
    const scale = isScale ? pointScale : 1;
    const opacity = isOpacity ? pointScale : 1;
    const drawMethod = drawMethods[state.grid];

    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;

    ctx.beginPath();

    drawMethod(
      {
        x: x * RADIUS + CANVAS_SIZE * 0.5,
        y: CANVAS_SIZE * 0.5 - y * RADIUS,
      },
      r * scale,
      angleOffset || 0
    );

    ctx.fill();
  });
}
