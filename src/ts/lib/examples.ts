const examples = [
  {
    code: '(cos(x * t / 5) + sin(y * t / 5)) / 2',
  },
  {
    code: '(cos(sqrt(x * x + y * y) - t) + 1) / 2',
    grid: 'hex',
  },
  {
    code: '(cos(sin(x * y) + t * 0.66) + 1) / 2',
  },
  {
    code: '((cos(t + x + cos(t)) + sin(t + y)) + 2) / 4',
  },
  {
    code: 'sqrt(x*x + y*y) > (cos(x + t) + 1) / 2 * 5  ? noise(x + t, y + t) * 0.3 : 1',
  },
  {
    code: 'cos(x + t) > y * 0.3 + 0.5 ? (cos(x + t) + 1) / 4 + 0.5 : 0', // 'cos(x + t) > y * 0.3 + 0.5 ? 0.8 : 0',
  },
  {
    code: 'cos(t * 0.5) * 0.5 + 0.5', // pulse
    animate: 'opacity',
  },
  {
    code: 'sin(0.5 * x + y * t * 0.8) * sin(t / 4)',
    grid: 'triangular',
  },
  {
    code: 'sin(x * cos(t * 0.5)) + cos(y * sin(t * 0.5))',
    grid: 'hex',
  },
  {
    code: ' sin(t) * sin(x) + cos(t) * cos(y)',
    grid: 'triangular',
    animate: 'opacity',
  },
  {
    code: 'abs(abs(x) - abs(y)) < t % 7 ? 1 : 0',
    grid: 'hex',
  },
  {
    code: 'sin(3 * atan2(y,x) + t)',
    grid: 'hex',
  },
  {
    code: '1 - (((x + 3) * (x + 4) + y + t * 0.3 * (1 + x * x % 5) * 3) % 36) / 12',
    animate: 'opacity',
  },
  {
    code: '1 / abs((x + y) + (t * 4) % 70 - 35)',
  },
];

export const randomExample =
  examples[Math.floor(Math.random() * examples.length)];
