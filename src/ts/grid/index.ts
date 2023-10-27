import { GridType, Pixel } from '../lib/types';

import { generateHexGrid } from './hex';
import { generateTriangleGrid } from './triangles';
import { generateCirclesGrid } from './circles';

const gridMap: Record<string, () => Pixel[]> = {
  classic: () => generateCirclesGrid(6),
  hex: () => generateHexGrid(5, 6),
  triangular: () => generateTriangleGrid(8, 5),
};

export class Grid {
  $element: HTMLDivElement = document.querySelector(
    '.pixel-wrapper'
  ) as HTMLDivElement;
  pixels: Pixel[] = [];

  constructor(type: GridType = 'classic') {
    this.update(type);
  }

  update(type: GridType = 'classic') {
    this.pixels = gridMap[type]();

    this.$element.replaceChildren(
      ...this.pixels.map((point) => point.$element)
    );

    this.$element.dataset.variant = type;
  }
}
