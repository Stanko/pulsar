import { Circle } from './types';

const CIRCLE_SCALE = 0.88;
const RADIUS = 0.5 * CIRCLE_SCALE;

export function generateRectangularGrid(size: number): Circle[] {
  const points: Circle[] = [];

  for (let x = -size; x <= size; x += 1) {
    for (let y = -size; y <= size; y += 1) {
      const $element = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle'
      ) as SVGCircleElement;

      $element.setAttribute('cx', x.toFixed(3));
      $element.setAttribute('cy', y.toFixed(3));
      $element.setAttribute('r', RADIUS.toFixed(3));

      points.push({ x, y, r: RADIUS, $element });
    }
  }

  return points;
}
