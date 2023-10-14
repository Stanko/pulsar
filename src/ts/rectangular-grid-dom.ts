import { Circle } from './types';

const CIRCLE_SCALE = 0.88;
const RADIUS = 0.5 * CIRCLE_SCALE;

export function generateRectangularGridDOM(size: number): Circle[] {
  const points: Circle[] = [];

  for (let x = -size; x <= size; x += 1) {
    for (let y = -size; y <= size; y += 1) {
      const $element = document.createElement('div') as HTMLDivElement;

      points.push({ x, y, r: RADIUS, $element });
    }
  }

  return points;
}
