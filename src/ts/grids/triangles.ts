import { Pixel } from '../utils/types';
import { polygon, create } from '../utils/svg';
import { getColor } from '../utils/colors';

const TRIANGLE_SCALE = 0.78;

export function generateTriangleGrid(
  columnsCount: number,
  rowsCount: number
): Pixel[] {
  const points: Pixel[] = [];

  const side = 1;
  const h = (side * Math.sqrt(3)) / 2;
  const r = (h / 3) * 2;

  const horizontalStep = side / 2;
  const verticalStep = h;

  const DEG_30 = Math.PI / 6;
  const DEG_120 = DEG_30 * 4;

  for (let rowIndex = -rowsCount; rowIndex <= rowsCount; rowIndex += 1) {
    const y = rowIndex * verticalStep;

    const isOddRow = rowIndex % 2 !== 0;
    const horizontalOffset = isOddRow ? horizontalStep : 0;

    const startOffset = isOddRow ? 1 : 0;
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
          x: 0.5 + r * TRIANGLE_SCALE * Math.cos(angle),
          y: 0.5 + r * TRIANGLE_SCALE * Math.sin(angle) - yLocal,
        };
      });

      const $element = create({ width: 1, height: 1 });
      const $polygon = polygon(path, { fill: getColor({ x, y }) });

      $element.classList.add('triangle');
      $element.appendChild($polygon);

      const step = 1;
      $element.style.left = `${(x * 100).toFixed(2)}%`;
      $element.style.top = `${(y * 100).toFixed(2)}%`;

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
