import { state } from './state';
import { getRandomExample } from './examples';

const $random = document.querySelector('.random-example') as HTMLButtonElement;

$random.addEventListener('click', () => {
  const example = getRandomExample();

  state.updateAll({
    grid: example.grid || 'classic',
    animate: example.animate || 'scale',
    code: example.code,
  });
});
