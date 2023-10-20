import { Point } from './types';

// https://miro.medium.com/v2/resize:fit:5600/1*_4oYdLn-kt6nq9D1_Jyo-A.png
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
