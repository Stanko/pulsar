import { GetPointValue, WorkerData } from './utils/types';

const MAXIMUM_VALUE = 1;

onmessage = function (e: MessageEvent) {
  const { grid, t, userCode } = e.data as WorkerData;

  const data = [];

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
      throw new Error('Return value is not a number');
    }

    value = Math.max(Math.min(value, MAXIMUM_VALUE), 0); // * 32;

    // value = 100 - 100 / value;

    data.push(value);
  }

  postMessage(data);
};
