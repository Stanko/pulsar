import { Pixel, WorkerResponse } from './types';

export const worker = new Worker(new URL('./worker.ts', import.meta.url));

// ----- Worker ----- //

let resolveMethod: (response: WorkerResponse) => void;

worker.addEventListener('message', (e) => {
  resolveMethod(e.data);
});

export async function calculateGrid(
  grid: Pixel[],
  t: number,
  userCode: string
): Promise<WorkerResponse> {
  return new Promise<WorkerResponse>((resolve) => {
    resolveMethod = resolve;

    worker.postMessage({
      grid: grid.map(({ x, y }) => {
        return { x, y };
      }),
      t,
      userCode,
    });
  });
}
