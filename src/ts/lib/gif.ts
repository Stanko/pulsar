import GifJS from 'gif.js.optimized';

import { ctx } from '../canvas-grid/canvas';

import { CANVAS_SIZE, pixelRatio } from '../canvas-grid/constants';
import { Pulsar } from './pulsar';

const $record = document.querySelector('.record') as HTMLButtonElement;

const FRAME_DELAY = 100;

export class GifRecorder {
  pulsar: Pulsar;
  gifRecorder: GifJS | null = null;
  interval: number = 0;
  isRecording = false;

  constructor(pulsar: Pulsar) {
    this.pulsar = pulsar;

    $record.addEventListener('click', () => {
      this.isRecording = !this.isRecording;
      document.body.classList.toggle('is-recording');

      if (this.isRecording) {
        pulsar.play();

        // Start recording
        this.gifRecorder = new GifJS({
          // workers: 2,
          quality: 1,
          width: CANVAS_SIZE * pixelRatio,
          height: CANVAS_SIZE * pixelRatio,
        });

        this.gifRecorder.on('finished', function (blob: Blob) {
          window.open(URL.createObjectURL(blob));
        });

        this.interval = setInterval(() => {
          // or copy the pixels from a canvas context
          this.gifRecorder?.addFrame(ctx, { copy: true, delay: FRAME_DELAY });
        }, FRAME_DELAY);
      } else {
        // End of recording
        clearInterval(this.interval);
        this.gifRecorder?.render();
      }
    });
  }
}
