let debug = localStorage.getItem('pulsar:debug') === 'true';

(window as any).debug = () => {
  localStorage.setItem('pulsar:debug', (!debug).toString());
  window.location.reload();
};

if (debug) {
  document.body.classList.add('debug');
}

export default debug;
