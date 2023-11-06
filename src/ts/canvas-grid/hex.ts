import { GridItem } from '../lib/types';
import { getColor } from '../lib/colors';
import { HEX_RADIUS, HEX_SCALE, HEX_COLOR_SCALE, isGif } from './constants';

export function generateHexGrid(
  columnsCount: number,
  rowsCount: number
): GridItem[] {
  const points: GridItem[] = [];

  const innerRadius = 0.5 * HEX_SCALE; // height of the each of the six triangles in hexagon
  const outerRadius = (2 * innerRadius) / Math.sqrt(3); // side of the hexagon and each of the six triangles in it

  const horizontalStep = innerRadius * 2;
  const verticalStep = outerRadius * 1.5;

  const gifRowOffset = isGif ? -1 : 0;
  const gifVerticalOffset = isGif ? verticalStep : 0;

  for (
    let rowIndex = -rowsCount + gifRowOffset;
    rowIndex <= rowsCount + gifRowOffset;
    rowIndex += 1
  ) {
    const y = rowIndex * verticalStep + gifVerticalOffset;

    const isOddRow = rowIndex % 2 !== 0;
    const horizontalOffset = isOddRow ? innerRadius : 0;

    const startOffset = isOddRow ? 1 : 0;

    for (
      let columnIndex = -columnsCount - startOffset;
      columnIndex <= columnsCount;
      columnIndex += 1
    ) {
      const x = columnIndex * horizontalStep + horizontalOffset;

      const color = getColor({ x, y }, (1 / HEX_SCALE) * HEX_COLOR_SCALE);

      points.push({
        x,
        y,
        color,
        r: outerRadius * HEX_RADIUS,
      });
    }
  }

  return points;
}
