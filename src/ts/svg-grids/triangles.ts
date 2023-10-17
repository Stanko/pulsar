import { Polygon } from '../utils/types';

const TRIANGLE_SCALE = 0.78;
const SCALE = 1.35; // Scale to fit the grid into the SVG bounds
const TRANSLATE = {
  x: -0.3,
  y: 0.2,
};

export function generateTriangleGrid(
  columnsCount: number,
  rowsCount: number
): Polygon[] {
  const points: Polygon[] = [];

  const side = 1 * SCALE;
  const h = (side * Math.sqrt(3)) / 2;
  const r = (h / 3) * 2;

  const horizontalStep = side / 2;
  const verticalStep = h;

  const DEG_30 = Math.PI / 6;
  const DEG_120 = DEG_30 * 4;

  for (let rowIndex = -rowsCount; rowIndex <= rowsCount; rowIndex += 1) {
    const y = rowIndex * verticalStep;
    const yOdd = y - h / 3;

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

      const yLocal = isOddColumn ? yOdd : y;

      const polygon = [0, 1, 2].map((index) => {
        const angle = index * DEG_120 + DEG_30 + angleOffset;
        return {
          x: x + r * TRIANGLE_SCALE * Math.cos(angle) + TRANSLATE.x,
          y: yLocal + r * TRIANGLE_SCALE * Math.sin(angle) + TRANSLATE.y,
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
        y: yLocal,
        polygon,
        $element,
      });
    }
  }

  return points;
}
