export const isGif = window.location.pathname.endsWith('gif.html');

export const pixelRatio = isGif ? 1 : devicePixelRatio;

export const CANVAS_SIZE = isGif ? 64 : 400;

const radiusFactor = isGif ? 0.145 : 0.075;

export const RADIUS = CANVAS_SIZE * radiusFactor;
export const CIRCLE_SCALE = isGif ? 0.8 : 0.88;
export const CIRCLE_GRID_SIZE = isGif ? 4 : 6;
export const CIRCLE_COLOR_SCALE = isGif ? 1.5 : 1;

export const HEX_RADIUS = isGif ? RADIUS * 0.8 : RADIUS * 0.85;
export const HEX_SCALE = isGif ? 1.1 : 1.1; // Scale to fit the grid into the SVG bounds
export const HEX_GRID_SIZE = isGif ? { w: 2, h: 3 } : { w: 5, h: 6 };
export const HEX_COLOR_SCALE = isGif ? 1.9 : 1;

export const TRIANGLE_RADIUS_SCALE = isGif ? 1.42 : 1.33;
export const TRIANGLE_RADIUS = isGif
  ? RADIUS * TRIANGLE_RADIUS_SCALE
  : RADIUS * TRIANGLE_RADIUS_SCALE;
export const TRIANGLE_SCALE = isGif ? 0.77 : 0.8; // Scale to fit the grid into the SVG bounds
export const TRIANGLE_GRID_SIZE = isGif ? { w: 3, h: 2 } : { w: 8, h: 5 };
export const TRIANGLE_COLOR_SCALE = isGif ? 1.9 : 1;
