import { Point, SVGOptions } from './types';

export function create(options: SVGOptions): SVGElement {
  const $svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  $svg.setAttribute('viewBox', `0 0 ${options.width} ${options.height}`);
  $svg.setAttribute('width', `${options.width}`);
  $svg.setAttribute('height', `${options.height}`);

  return $svg;
}

export function polygon(
  points: Point[],
  props: Record<string, string> = {}
): SVGPolygonElement {
  const $polygon = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'polygon'
  );

  $polygon.setAttribute(
    'points',
    points.map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ')
  );

  for (const key in props) {
    $polygon.setAttribute(key, props[key]);
  }

  return $polygon;
}

export function circle(
  center: Point,
  r: number,
  props: Record<string, string> = {}
): SVGCircleElement {
  const $circle = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle'
  );

  $circle.setAttribute('cx', center.x.toFixed(2));
  $circle.setAttribute('cy', center.y.toFixed(2));
  $circle.setAttribute('r', r.toFixed(2));

  for (const key in props) {
    $circle.setAttribute(key, props[key]);
  }

  return $circle;
}
