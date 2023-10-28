let debug = localStorage.getItem('pulsar:debug') === 'true';

(window as any).debug = () => {
  localStorage.setItem('pulsar:debug', debug.toString());
  window.location.reload();
};

export default debug;
