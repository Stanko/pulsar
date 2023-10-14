import { Polygon } from './types';

const HEX_SCALE = 0.85;
const SCALE = 1.1; // Scale to fit the grid into the SVG bounds

export function generateHexGrid(
  columnsCount: number,
  rowsCount: number
): Polygon[] {
  const points: Polygon[] = [];

  const innerRadius = 0.5 * SCALE; // height of the each of the six triangles in hexagon
  const outerRadius = (2 * innerRadius) / Math.sqrt(3); // side of the hexagon and each of the six triangles in it

  const horizontalStep = innerRadius * 2;
  const verticalStep = outerRadius * 1.5;

  const DEG_60 = Math.PI / 3;
  const DEG_30 = Math.PI / 6;

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

      const polygon = [0, 1, 2, 3, 4, 5].map((index) => {
        const angle = index * DEG_60 + DEG_30;
        return {
          x: x + outerRadius * HEX_SCALE * Math.cos(angle),
          y: y + outerRadius * HEX_SCALE * Math.sin(angle),
        };
      });

      const $element = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'polygon'
      ) as SVGPolygonElement;

      $element.setAttribute(
        'points',
        polygon.map((p) => `${p.x.toFixed(3)}, ${p.y.toFixed(3)}`).join(' ')
      );

      points.push({
        x,
        y,
        polygon,
        $element,
      });
    }
  }

  return points;
}
