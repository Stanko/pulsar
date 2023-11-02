import { state } from './state';
import { getRandomExample } from './examples';

const $random = document.querySelector('.random-example') as HTMLButtonElement;

$random.addEventListener('click', () => {
  const example = getRandomExample();

  state.updateCode(example.code);

  if (example.grid) {
    state.updateRadio('grid', example.grid);
  }

  if (example.animate) {
    state.updateRadio('animate', example.animate);
  }
});
