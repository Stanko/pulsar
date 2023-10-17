import { Point } from './types';

export const colors = [
  '#ff9500',
  '#ffcc02',
  '#35c759',
  '#5bc7fa',
  '#007aff',
  '#5856d7',
  '#af52de',
  '#ff2c55',
];

export function getColor(point: Point): string {
  const d = Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));

  return colors[Math.floor(d)] || colors[colors.length - 1];
}
