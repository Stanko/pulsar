import { Point, WorkerResponse } from './types';

export const worker = new Worker(new URL('./worker.ts', import.meta.url));

// ----- Worker ----- //

let resolvers: Record<string, (response: WorkerResponse) => void> = {};

worker.addEventListener('message', (e) => {
  resolvers[e.data.id](e.data);
  delete resolvers[e.data.id];
});

export async function calculateGrid(
  grid: Point[],
  t: number,
  userCode: string
): Promise<WorkerResponse> {
  return new Promise<WorkerResponse>((resolve) => {
    const id = Math.random().toString(16) + Date.now().toString(16);

    resolvers[id] = resolve;

    worker.postMessage({
      id,
      grid,
      t,
      userCode,
    });
  });
}
