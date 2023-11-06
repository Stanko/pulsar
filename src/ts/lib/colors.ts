import { isGif } from '../canvas-grid/constants';
import { Point } from './types';

// https://miro.medium.com/v2/resize:fit:5600/1*_4oYdLn-kt6nq9D1_Jyo-A.png
export const colors = isGif
  ? [
      '#ff9500',
      '#ffcc02',
      '#35c759',
      '#5bc7fa',
      '#007aff',
      '#af52de',
      '#ff2c60',
    ]
  : [
      '#ff9500',
      '#ffcc02',
      '#35c759',
      '#5bc7fa',
      '#007aff',
      '#5856d7',
      '#af52de',
      '#ff2c55',
    ];

export function getColor(point: Point, scale: number = 1): string {
  const d = Math.sqrt(
    Math.pow(point.x * scale, 2) + Math.pow(point.y * scale, 2)
  );

  return colors[Math.floor(d)] || colors[colors.length - 1];
}
