import { Pixel } from '../lib/types';
import { polygon, create } from '../lib/svg';
import { getColor } from '../lib/colors';

const SCALE = 1.1; // Scale to fit the grid into the SVG bounds
const SVG_SIZE = 100;
const HEX_SCALE = SVG_SIZE * 0.85;

export function generateHexGrid(
  columnsCount: number,
  rowsCount: number
): Pixel[] {
  const points: Pixel[] = [];

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

      const path = [0, 1, 2, 3, 4, 5].map((index) => {
        const angle = index * DEG_60 + DEG_30;
        return {
          x: SVG_SIZE * 0.5 + outerRadius * HEX_SCALE * Math.cos(angle),
          y: SVG_SIZE * 0.5 + outerRadius * HEX_SCALE * Math.sin(angle),
        };
      });

      const $element = create({ width: SVG_SIZE, height: SVG_SIZE });
      const $polygon = polygon(path, { fill: getColor({ x, y }) });

      $element.classList.add('hex');
      $element.appendChild($polygon);

      $element.style.left = `${(x * 100).toFixed(2)}%`;
      $element.style.top = `${(-y * 100).toFixed(2)}%`; // SVG uses inverted Y axis

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
      //   y,
      //   polygon,
      //   $element,
      // });
    }
  }

  return points;
}
