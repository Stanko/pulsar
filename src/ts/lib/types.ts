// ----- Types ----- //

export type Point = {
  x: number;
  y: number;
};

export type Polygon = {
  x: number;
  y: number;
  polygon: Point[];
  $element: SVGPolygonElement;
};

export type Circle = {
  x: number;
  y: number;
  r: number;
  $element: SVGCircleElement;
};

export type WorkerData = {
  grid: Point[];
  t: number;
  userCode: string;
};

export type Pixel = {
  x: number;
  y: number;
  $element: SVGElement;
};

export type GetPointValue = (x: number, y: number, t: number) => number;

export type SVGOptions = {
  width: number;
  height: number;
};

export type GridType = 'classic' | 'hex' | 'triangular';

export type Params = Record<string, any>;
