declare module 'gif.js.optimized' {
  interface GifOptions {
    repeat?: number;
    quality?: number;
    workers?: number;
    workerScript?: string;
    background?: string;
    width?: null | number;
    height?: null | number;
    transparent?: null | string;
  }

  class GifJS {
    constructor(options: GifOptions);
    addFrame(
      canvas: HTMLCanvasElement | CanvasRenderingContext2D,
      options?: { delay?: number; copy?: boolean }
    ): void;
    render(): void;
    on(event: 'finished', callback: (blob: Blob) => void): void;
  }

  export default GifJS;
}
