import { GridItem } from '../lib/types';
import { getColor } from '../lib/colors';
import { RADIUS } from './constants';

const SCALE = 1.33; // Scale to fit the grid into the SVG bounds
const TRIANGLE_SCALE = 0.8;

export function generateTriangleGrid(
  columnsCount: number,
  rowsCount: number
): GridItem[] {
  const points: GridItem[] = [];

  const side = 1;
  const h = (side * Math.sqrt(3)) / 2;
  const r = (h / 3) * 2 * RADIUS;

  const horizontalStep = side / 2;
  const verticalStep = h;

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

      const color = getColor({ x, y: y - yLocal }, 1 / TRIANGLE_SCALE);

      points.push({
        x: x * SCALE,
        y: (y - yLocal) * SCALE,
        r: r * TRIANGLE_SCALE * SCALE,
        color,
        angleOffset,
      });
    }
  }

  return points;
}
