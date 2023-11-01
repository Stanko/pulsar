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

export type WorkerRequest = {
  grid: Point[];
  t: number;
  userCode: string;
  id: number;
};

export type Pixel = {
  x: number;
  y: number;
  $element: SVGElement;
};

export type GetPointValue = (
  x: number,
  y: number,
  t: number,
  i: number,
  noise: (x: number, y: number) => number
) => number;

export type SVGOptions = {
  width: number;
  height: number;
};

export type AvailableParams = 'grid' | 'animate' | 'code';

export type GridType = 'classic' | 'hex' | 'triangular';
export type AnimateType = 'both' | 'scale' | 'opacity';

export type Params = {
  grid?: GridType;
  animate?: AnimateType;
  code?: string;
};

export type WorkerResponse = {
  id: string;
  error?: string;
  data: number[];
};

export type StateChangeHandler = (value: string) => void;

export type GridItem = {
  x: number;
  y: number;
  color: string;
  r: number;
  angleOffset?: number;
};
