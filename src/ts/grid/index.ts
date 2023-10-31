import { GridType, Pixel, Point } from '../lib/types';

import { generateHexGrid } from './hex';
import { generateTriangleGrid } from './triangles';
import { generateCirclesGrid } from './circles';

const gridMap: Record<string, () => Pixel[]> = {
  classic: () => generateCirclesGrid(6),
  hex: () => generateHexGrid(5, 6),
  triangular: () => generateTriangleGrid(8, 5),
};

const $grid = document.querySelector('.pixel-wrapper') as HTMLDivElement;

export class Grid {
  type: GridType = 'classic';

  points: Point[] = [];
  $points: SVGElement[] = [];

  constructor(type: GridType = 'classic') {
    this.type = type;
    this.update(type);
  }

  update(type: GridType = 'classic') {
    this.type = type;
    const data = gridMap[type]();

    this.points = data.map((point) => {
      return {
        x: point.x,
        y: point.y,
      };
    });

    this.$points = data.map((point) => point.$element);

    $grid.replaceChildren(...this.$points);

    $grid.dataset.variant = type;
  }
}
