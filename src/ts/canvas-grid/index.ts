import { GridItem, GridType } from '../lib/types';

import { generateHexGrid } from './hex';
import { generateTriangleGrid } from './triangles';
import { generateCirclesGrid } from './circles';

const gridMap: Record<string, () => GridItem[]> = {
  classic: () => generateCirclesGrid(6),
  hex: () => generateHexGrid(5, 6),
  triangular: () => generateTriangleGrid(8, 5),
};

export class Grid {
  type: GridType = 'classic';

  points: GridItem[] = [];

  constructor(type: GridType = 'classic') {
    this.type = type;
    this.update(type);
  }

  update(type: GridType = 'classic') {
    this.type = type;
    this.points = gridMap[type]();
  }
}
