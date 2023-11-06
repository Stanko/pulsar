import { GridItem, GridType } from '../lib/types';

import { generateHexGrid } from './hex';
import { generateTriangleGrid } from './triangles';
import { generateCirclesGrid } from './circles';
import {
  CIRCLE_GRID_SIZE,
  HEX_GRID_SIZE,
  TRIANGLE_GRID_SIZE,
} from './constants';

const gridMap: Record<string, () => GridItem[]> = {
  classic: () => generateCirclesGrid(CIRCLE_GRID_SIZE),
  hex: () => generateHexGrid(HEX_GRID_SIZE.w, HEX_GRID_SIZE.h),
  triangular: () =>
    generateTriangleGrid(TRIANGLE_GRID_SIZE.w, TRIANGLE_GRID_SIZE.h),
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
