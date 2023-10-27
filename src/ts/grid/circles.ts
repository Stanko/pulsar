import { Pixel } from '../lib/types';
import { circle, create } from '../lib/svg';
import { getColor } from '../lib/colors';

const CIRCLE_SCALE = 0.88;
const RADIUS = 0.5 * CIRCLE_SCALE;

const SVG_SIZE = 100;

export function generateCirclesGrid(size: number): Pixel[] {
  const points: Pixel[] = [];

  for (let x = -size; x <= size; x += 1) {
    for (let y = -size; y <= size; y += 1) {
      const $element = create({ width: SVG_SIZE, height: SVG_SIZE });

      const $circle = circle(
        { x: SVG_SIZE * 0.5, y: SVG_SIZE * 0.5 },
        RADIUS * SVG_SIZE,
        {
          fill: getColor({ x, y }),
        }
      );

      $element.appendChild($circle);
      $element.classList.add('circle');

      $element.style.left = `${(x * 100).toFixed(2)}%`;
      $element.style.top = `${(-y * 100).toFixed(2)}%`; // SVG uses inverted Y axis

      // $element.style.transform = `translate3d(${x * 100}%, ${y * 100}%, 0)`;

      points.push({ x, y, $element });
    }
  }

  return points;
}
