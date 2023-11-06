import { GridItem } from '../lib/types';
import { getColor } from '../lib/colors';
import {
  TRIANGLE_RADIUS,
  TRIANGLE_SCALE,
  TRIANGLE_RADIUS_SCALE,
  TRIANGLE_COLOR_SCALE,
} from './constants';

export function generateTriangleGrid(
  columnsCount: number,
  rowsCount: number
): GridItem[] {
  const points: GridItem[] = [];

  const side = 1;
  const h = (side * Math.sqrt(3)) / 2;
  const r = (h / 3) * 2 * TRIANGLE_RADIUS * TRIANGLE_SCALE;

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

      const color = getColor(
        { x, y: y - yLocal },
        (1 / TRIANGLE_SCALE) * TRIANGLE_COLOR_SCALE
      );

      points.push({
        x: x * TRIANGLE_RADIUS_SCALE,
        y: (y - yLocal) * TRIANGLE_RADIUS_SCALE,
        r: r,
        color,
        angleOffset,
      });
    }
  }

  return points;
}
