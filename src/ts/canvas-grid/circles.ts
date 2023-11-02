import { GridItem } from '../lib/types';
import { getColor } from '../lib/colors';
import { RADIUS } from './constants';

const CIRCLE_SCALE = 0.88;
const r = 0.5 * CIRCLE_SCALE;

export function generateCirclesGrid(size: number): GridItem[] {
  const points: GridItem[] = [];

  for (let y = -size; y <= size; y += 1) {
    for (let x = -size; x <= size; x += 1) {
      const color = getColor({ x, y });

      points.push({
        x,
        y,
        r: r * RADIUS,
        color,
      });
    }
  }

  return points;
}
