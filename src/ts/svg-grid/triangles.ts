import { Pixel } from '../lib/types';
import { polygon, create } from './svg';
import { getColor } from '../lib/colors';

const TRIANGLE_SCALE = 0.8;
const SVG_SIZE = 100;

export function generateTriangleGrid(
  columnsCount: number,
  rowsCount: number
): Pixel[] {
  const points: Pixel[] = [];

  const side = 1;
  const h = (side * Math.sqrt(3)) / 2;
  const r = (h / 3) * 2 * SVG_SIZE;

  const horizontalStep = side / 2;
  const verticalStep = h;

  const DEG_30 = Math.PI / 6;
  const DEG_120 = DEG_30 * 4;

  for (let rowIndex = -rowsCount; rowIndex <= rowsCount; rowIndex += 1) {
    const y = rowIndex * verticalStep;

    const isOddRow = rowIndex % 2 !== 0;
    const horizontalOffset = isOddRow ? horizontalStep : 0;

    const startOffset = isOddRow ? 2 : 1;
    const endOffset = isOddRow ? 0 : 1;

    for (
      let columnIndex = -columnsCount - startOffset;
      columnIndex <= columnsCount + endOffset;
      columnIndex += 1
    ) {
      const x = columnIndex * horizontalStep + horizontalOffset;

      const isOddColumn = columnIndex % 2 !== 0;
      const angleOffset = isOddColumn ? Math.PI : 0;

      const yLocal = isOddColumn ? h / 3 : 0;

      const path = [0, 1, 2].map((index) => {
        const angle = index * DEG_120 + DEG_30 + angleOffset;
        return {
          x: 0.5 * SVG_SIZE + r * TRIANGLE_SCALE * Math.cos(angle),
          y: 0.5 * SVG_SIZE + r * TRIANGLE_SCALE * Math.sin(angle),
        };
      });

      const $element = create({ width: SVG_SIZE, height: SVG_SIZE });
      const $polygon = polygon(path, {
        fill: getColor({ x, y: y + yLocal }, 1 / TRIANGLE_SCALE),
      });

      $element.classList.add('triangle');
      $element.appendChild($polygon);

      $element.style.left = `${(x * 100).toFixed(2)}%`;
      $element.style.top = `${((y + yLocal) * -100).toFixed(2)}%`; // SVG uses inverted Y axis

      points.push({ x, y, $element });

      // const $element = document.createElementNS(
      //   'http://www.w3.org/2000/svg',
      //   'polygon'
      // ) as SVGPolygonElement;

      // $element.setAttribute(
      //   'points',
      //   polygon.map((p) => `${p.x.toFixed(3)}, ${p.y.toFixed(3)}`).join(' ')
      // );

      // points.push({
      //   x,
      //   y: yLocal,
      //   polygon,
      //   $element,
      // });
    }
  }

  return points;
}
