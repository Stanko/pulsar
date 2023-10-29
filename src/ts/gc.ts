if (window.location.hostname === 'muffinman.io') {
  const script = document.createElement('script');
  script.setAttribute(
    'data-goatcounter',
    'https://muffinman_io.goatcounter.com/count'
  );
  script.setAttribute('async', '');
  script.setAttribute('src', '//gc.zgo.at/count.js');
  document.body.appendChild(script);
}
