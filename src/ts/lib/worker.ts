import { GetPointValue, WorkerData } from './types';

const MAXIMUM_VALUE = 1;

onmessage = function (e: MessageEvent) {
  const { grid, t, userCode } = e.data as WorkerData;

  const data = [];

  try {
    const userFunction = new Function(
      'x',
      'y',
      't',
      `"use strict"; return ${userCode};`
    ) as GetPointValue;

    for (const point of grid) {
      const { x, y } = point;

      let value = 0;

      value = userFunction(x, y, t);

      if (typeof value !== 'number') {
        postMessage({
          error: 'Return value is not a number',
        });
      }

      // Cap value to 0-1
      value = Math.max(Math.min(value, MAXIMUM_VALUE), 0);

      data.push(value);
    }

    postMessage(data);
  } catch (e) {
    postMessage({
      error: (e as Error).message,
    });
  }
};
