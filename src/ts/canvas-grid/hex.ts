import { GridItem } from '../lib/types';
import { getColor } from '../lib/colors';
import { RADIUS } from './constants';

const SCALE = 1.1; // Scale to fit the grid into the SVG bounds
const HEX_SCALE = RADIUS * 0.85;

export function generateHexGrid(
  columnsCount: number,
  rowsCount: number
): GridItem[] {
  const points: GridItem[] = [];

  const innerRadius = 0.5 * SCALE; // height of the each of the six triangles in hexagon
  const outerRadius = (2 * innerRadius) / Math.sqrt(3); // side of the hexagon and each of the six triangles in it

  const horizontalStep = innerRadius * 2;
  const verticalStep = outerRadius * 1.5;

  for (let rowIndex = -rowsCount; rowIndex <= rowsCount; rowIndex += 1) {
    const y = rowIndex * verticalStep;

    const isOddRow = rowIndex % 2 !== 0;
    const horizontalOffset = isOddRow ? innerRadius : 0;

    const startOffset = isOddRow ? 1 : 0;

    for (
      let columnIndex = -columnsCount - startOffset;
      columnIndex <= columnsCount;
      columnIndex += 1
    ) {
      const x = columnIndex * horizontalStep + horizontalOffset;

      const color = getColor({ x, y });

      points.push({
        x,
        y,
        color,
        r: outerRadius * HEX_SCALE,
      });
    }
  }

  return points;
}
