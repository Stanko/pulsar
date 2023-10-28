const $share: HTMLButtonElement = document.querySelector(
  '.share'
) as HTMLButtonElement;

let timeout: number = 0;

$share.addEventListener('click', async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: document.title,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      clearTimeout(timeout);
      $share.classList.add('share--success');

      timeout = setTimeout(() => {
        $share.classList.remove('share--success');
      }, 3000);
    }
  } catch (error) {
    clearTimeout(timeout);
    $share.classList.add('share--error');
    timeout = setTimeout(() => {
      $share.classList.remove('share--error');
    }, 3000);
  }
});
