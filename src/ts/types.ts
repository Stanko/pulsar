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

export type GetPointValue = (x: number, y: number, t: number) => number;
