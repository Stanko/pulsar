import { Circle } from './types';

const CIRCLE_SCALE = 0.88;
const RADIUS = 50 * CIRCLE_SCALE;

const SCALE = 100;

export function generateRectangularGrid(size: number): Circle[] {
  const points: Circle[] = [];

  for (let x = -size; x <= size; x += 1) {
    for (let y = -size; y <= size; y += 1) {
      const $element = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle'
      ) as SVGCircleElement;

      $element.setAttribute('cx', (x * SCALE).toFixed(3));
      $element.setAttribute('cy', (y * SCALE).toFixed(3));
      $element.setAttribute('r', RADIUS.toFixed(3));

      points.push({ x, y, r: RADIUS, $element });
    }
  }

  return points;
}
