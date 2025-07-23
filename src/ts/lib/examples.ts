import { Example } from './types';

const examples: Example[] = [
  {
    code: '(cos(x * t / 5) + sin(y * t / 5)) / 2',
  },
  {
    // Radial waves
    code: '(cos(sqrt(x * x + y * y) - t) + 1) / 2',
    grid: 'hex',
  },
  {
    // Floral pattern
    code: '(cos(sin(x * y) + t * 0.66) + 1) / 2',
  },
  {
    code: '((cos(t + x + cos(t)) + sin(t + y)) + 2) / 4',
  },
  {
    code: 'sqrt(x*x + y*y) > (cos(x + t) + 1) / 2 * 5  ? noise(x + t, y + t) * 0.3 : 1',
  },
  {
    // 2d waves
    code: 'cos(x + t) > y * 0.3 + 0.5 ? (cos(x + t) + 1) / 4 + 0.5 : 0', // 'cos(x + t) > y * 0.3 + 0.5 ? 0.8 : 0',
  },
  {
    // Simple pulse
    code: 'cos(t * 0.5) * 0.5 + 0.5',
    animate: 'opacity',
  },
  {
    // Spinning
    code: 'sin(0.5 * x + y * t * 0.8) * sin(t / 4)',
    grid: 'triangular',
  },
  {
    code: 'sin(x * cos(t * 0.5)) + cos(y * sin(t * 0.5))',
    grid: 'hex',
  },
  {
    code: 'sin(t) * sin(x) + cos(t) * cos(y)',
    grid: 'triangular',
    animate: 'opacity',
  },
  {
    code: 'abs(abs(x) - abs(y)) < t % 7 ? 1 : 0',
    grid: 'hex',
  },
  {
    // Windmill
    code: 'sin(3 * atan2(y,x) + t)',
    grid: 'hex',
  },
  {
    // Rain
    code: '1 - (((x + 3) * (x + 4) + y + t * 0.3 * (1 + x * x % 5) * 3) % 36) / 12',
    animate: 'opacity',
  },
  {
    // Diagonal wave
    code: '1 / abs((x + y) + (t * 4) % 70 - 35)',
  },
  {
    code: 'abs(sin(t / 3 * x / 2) * exp(1 - sqrt(pow(x / 2, 2) + pow(y / 2, 2))))',
  },
  {
    // Spinning circle
    code: '(3 / sqrt(((x * 1.5) - 6 * cos(t * 0.5)) ** 2 + ((y * 1.5) - 6 * sin(t * 0.5)) ** 2)) ** 2.5',
    grid: 'hex',
  },
  /*
  https://news.ycombinator.com/item?id=41478068

  // This script recognizes 17 regions and paints each region according to
  // the lookup table, where the following number corresponds to `c`.
  //
  //    |12|   7   | 2|
  //    +--+-------+--+
  //    |  |       |  |
  //    |11|   6   | 1|
  //    |  |       |  |
  //    +--+-------+--+
  // XX |10|   5   | 0| XX
  //    +--+-------+--+
  //    |  |       |  |
  //    | 9|   4   |-1|
  //    |  |       |  |
  //    +--+-------+--+
  //    | 8|   3   |-2|
  //
  (abs(x)<5)*   // Removes the left and right edge (XX above)
  (1-t%1)**.3*  // Blinks every time the digit changes, but not too quickly
  ((c,d)=>      // c: region index (see above), d: the current digit
    c&1&        // Even-numbered region is always blank
    ~(c+1?      // Due to the JS number semantics, at least one segment
                // should be encoded outside of the lookup table
      //          d=4     d=3    d=2    d=1    d=0
      // d<5:  0b011010_110000_100000_111110_000100
      // d>=5: 0b010000_000000_110110_000001_010001
      //          d=9     d=8    d=7    d=6    d=5
      268656721+(d<5)*180268851
      // Read the lookup table; c/2 will be truncated by `>>`
      >>d%5*6+c/2
    :
      d==2      // c==-1 case is handled separately
    )
  )(
    (y>4)-5*(x>2)+(y>0)-(y<0)+5*(x<-2)-(y<-4)+5, // Calculate a region index
    t%10|0                                       // `|0` for `Math.floor`
  )
  */
  {
    code: '(abs(x)<5)*(1-t%1)**.3*((c,d)=>c&1&~(c+1?268656721+(d<5)*180268851>>d%5*6+c/2:d==2))((y>4)-5*(x>2)+(y>0)-(y<0)+5*(x<-2)-(y<-4)+5,t%10|0)',
  },
  {
    // Spiral wave
    // // Calculate the distance from the center
    // const distance = Math.sqrt(x * x + y * y);

    // // Calculate the angle (in radians) of the point from the center
    // const angle = Math.atan2(y, x);

    // // Parameters to adjust the spiral effect
    // const spiralTightness = 0.5;
    // const waveFrequency = 2;
    // const contractionSpeed = 0.1;

    // // Create a smoother spiral effect
    // const spiral = distance + angle * spiralTightness;

    // // Use sine to create a wave effect, and make it contract over time
    // const wave = Math.sin(spiral * waveFrequency - t * contractionSpeed);

    // // Apply a smooth falloff based on distance from center
    // const falloff = 1 / (1 + distance * 0.2);

    // // Combine wave and falloff, then normalize to 0-1 range
    // return (wave * falloff + 1) / 2;
    code: '(sin(sqrt(x * x + y * y) + atan2(y, x) * 1 - t) * 1 / (1 + sqrt(x * x + y * y) * 0.2) + 1) / 2',
  },
  {
    // Checkered pulse
    code: '(sqrt(x*x + y*y) < 6) ? (i % 2 ? 1:-1) * (sin(t * 0.6)) : 0',
    grid: 'triangular',
  },
  // Diamond waves
  {
    code: '(sin(abs(x) + abs(y) - t * 0.6) + 1) / 2',
    grid: 'hex',
  },
  {
    // Christmas tree
    code: 'ceil(((abs(t * 0.7)^2)*7) % 120) === i ? 0 : ((abs(y-6) - abs(x*2.3)) * (cos(t * 0.2) * 0.3 + 0.5))',
  },
  {
    // Space invader
    // The array represents pixels of a space invader sprite
    //
    // This part moves pixel indexes to the left over time
    // (i % 13 + floor(t * 0.5)) % 13) + floor(i / 13) * 13
    //
    // Unminified it looks like this:
    //
    // const shift = floor(t * 0.5) % 13;
    //
    // const toXY(i) => {
    //   return [i % 13, floor(i / 13)];
    // }
    //
    // const toIndex(x, y) => {
    //   return y * 13 + x;
    // }
    //
    // pixels.map(i => {
    //   let [x, y] = toXY(i);
    //   x = (x + shift) % 13; // wrap horizontally only
    //   return toIndex(x, y);
    // })
    //
    // Rest of the pixels are using noise to emulate a starfield
    code: '[133,139,121,125,107,108,109,110,111,112,113,93,94,96,97,98,100,101,79,80,81,82,83,84,85,86,87,88,89,66,68,69,70,71,72,73,74,76,53,55,61,63,43,44,47,46].map(i => ((i % 13 + floor(t * 0.5)) % 13) + floor(i / 13) * 13).includes(i) ? 1 : noise(x * t * 0.1, y * t * 0.1) * 0.4 - 0.2',
  },
];

export function getRandomExample(): Example {
  return {
    grid: 'classic',
    animate: 'scale',
    ...examples[Math.floor(Math.random() * examples.length)],
  };
}

export const randomExample = getRandomExample();
