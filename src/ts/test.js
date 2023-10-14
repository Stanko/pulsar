// import noise from 'asm-noise';
import simplify from 'simplify-js';
import * as clipperLib from 'js-angusj-clipper';
import mem from 'mem';

import KNOBS from './knobs';

import random from '../utils/random';

import { strToCharCode, chaikin, randomFromArray } from './helpers';
import { getEasing } from '../utils/easings';

// noise.algorithm = 'open-simplex';

const SQRT_3 = Math.sqrt(3);

const SIMPLIFY_TOLERANCE = 0.35;

let clipper;

// Used for clipper, as it works with integers only
const SCALE = 1000;

let nodeWeights = {};

function getNodeKey(node) {
  return `${node.x},${node.y}`;
}

function getNodeWeight(node) {
  const key = getNodeKey(node);

  return nodeWeights[key] || 0;
}

function increaseNodeWeight(node) {
  const key = getNodeKey(node);

  if (typeof nodeWeights[key] === 'number') {
    nodeWeights[key]++;
  } else {
    nodeWeights[key] = 1;
  }
}

export const directions = {
  RIGHT: { x: 1, y: 0 }, // right
  BOTTOM_RIGHT: { x: 0, y: 1 }, // bottom right
  BOTTOM_LEFT: { x: -1, y: 1 }, // bottom left
  LEFT: { x: -1, y: 0 }, // left
  TOP_LEFT: { x: 0, y: -1 }, // top left
  TOP_RIGHT: { x: 1, y: -1 }, // top right
};

export const directionsArray = [
  directions.RIGHT,
  directions.BOTTOM_RIGHT,
  directions.BOTTOM_LEFT,
  directions.LEFT,
  directions.TOP_LEFT,
  directions.TOP_RIGHT,
];

export const hexStates = {
  RIGHT: 'RIGHT',
  LEFT: 'LEFT',
  EMPTY: 'EMPTY',
};

export const hexDirections = {
  RIGHT: [directions.RIGHT, directions.BOTTOM_LEFT, directions.TOP_LEFT],
  LEFT: [directions.BOTTOM_RIGHT, directions.LEFT, directions.TOP_RIGHT],
  // Kada naidjem na secenje, preskacemo na sredinu sestougla
  EMPTY: directionsArray,
};

function generateGraph({ width, height, side, h }) {
  const map = [];
  const nodes = [];

  for (let i = 0; i < width; i++) {
    for (let y = 0; y < height; y++) {
      let x = i - Math.round(y / 2);

      if (!map[x]) {
        map[x] = [];
      }

      const node = {
        x,
        y,
        neighborsArray: [],
        neighbors: {},
        position: {
          x: side * x + (side / 2) * y,
          y: y * h,
        },
      };

      map[x][y] = node;
      nodes.push(node);
    }
  }

  nodes.forEach((node) => {
    node.hexState = getNodeHexState(node);

    for (let direction in directions) {
      const coords = directions[direction];

      const x = node.x + coords.x;
      const y = node.y + coords.y;

      if (map[x] && map[x][y]) {
        node.neighborsArray.push(map[x][y]);
        node.neighbors[direction] = map[x][y];
      }
    }
  });

  return {
    map,
    nodes,
  };
}

function getNodeHexState(node) {
  const xMod = (30000 + node.x) % 3;
  const yMod = (30000 + node.y) % 3;

  // Empty

  // y % 3 == 0
  // x % 3 == 1

  // y % 3 == 1
  // x % 3 == 2

  // y % 3 == 2
  // x % 3 == 0

  // Right, same as empty but x is one larger
  // x + 1 === right
  // Right, same as empty but x is one smaller
  // x - 1 === left

  const e1 = xMod === 1 && yMod === 0;
  const e2 = xMod === 2 && yMod === 1;
  const e3 = xMod === 0 && yMod === 2;

  const r1 = xMod === 2 && yMod === 0;
  const r2 = xMod === 0 && yMod === 1;
  const r3 = xMod === 1 && yMod === 2;

  // const l1 = xMod === 0 && yMod === 0;
  // const l2 = xMod === 1 && yMod === 1;
  // const l3 = xMod === 2 && yMod === 2;

  if (e1 || e2 || e3) {
    // empty
    return hexStates.EMPTY;
  } else if (r1 || r2 || r3) {
    // right
    return hexStates.RIGHT;
  }
  // left
  return hexStates.LEFT;
}

function getDirection(node, isHex) {
  if (isHex) {
    const nodeDirections = hexDirections[node.hexState];

    return randomFromArray(nodeDirections);
  } else {
    return randomFromArray(directionsArray);
  }
}

function getNodesVector(node1, node2) {
  const x = node2.x - node1.x;
  const y = node2.y - node1.y;

  for (let direction in directions) {
    const d = directions[direction];
    if (d.x === x && d.y === y) {
      return {
        type: direction,
        value: d,
      };
    }
  }
}

function walk(start, isHex = false, graph, selfIntersections) {
  // Get starting node
  let current = graph.map[start.x][start.y];

  const walkNodes = [current];

  if (isHex) {
    current = randomFromArray(
      current.neighborsArray.filter((node) => node.hexState !== hexStates.EMPTY)
    );
  } else {
    current = randomFromArray(current.neighborsArray);
  }

  let fail = 0;
  let previous;
  const failThreshold = 20;

  while (1) {
    if (fail > failThreshold) {
      break;
    }

    let direction = getDirection(current, isHex);

    const neighbor = {
      x: current.x + direction.x,
      y: current.y + direction.y,
    };

    let next = graph.map[neighbor.x] && graph.map[neighbor.x][neighbor.y];

    if (next) {
      if (!selfIntersections && walkNodes.includes(next)) {
        fail++;
        continue;
      }

      // Returned back
      if (previous && getNodeKey(previous) === getNodeKey(next)) {
        fail++;
        continue;
      }

      const weight = getNodeWeight(next);
      const weightProbability = weight > 0 ? 1 / (weight * weight) : 1;

      if (isHex && weight > 0) {
        const vector = getNodesVector(current, next);
        const n = next.neighbors[vector.type];

        if (n) {
          // TODO check if this node was used already
          increaseNodeWeight(next);
          next = n;
        } else {
          break;
        }
      }

      if (walkNodes.includes(next) || Math.random() > weightProbability) {
        // (weight > 0 && Math.random() > 0.4)) {
        fail++;
        continue;
      }

      fail = 0;
      walkNodes.push(current);
      increaseNodeWeight(current);
      previous = current;
      current = next;
    } else {
      fail++;
      continue;
    }
  }

  return walkNodes;
}

function getColor(rng = Math.random) {
  const h = random(0, 360, rng, 0);
  const s = random(70, 90, rng, 0);
  const l = random(60, 80, rng, 0);

  return `hsl(${h}, ${s}%, ${l}%)`;
}

function generateNodeLines(graph, { lineCount, useHex, selfIntersections }) {
  const nodeLines = [];
  const usedNodes = [];

  // Maximum loop count is lineCount * 5 to prevent infinite loops
  // it will be stopped earlier if we generate enough lines
  for (let i = 0; i < lineCount * 5; i++) {
    const isHex = useHex;
    // const isHex = useHex ? Math.random() > 0.5 : false;

    let start;
    const maxTries = 10;

    for (let j = 0; j < maxTries; j++) {
      start = randomFromArray(graph.nodes);

      if (!usedNodes.includes(start)) {
        break;
      }
    }

    if (!start) {
      continue;
    }

    // Chosen start is empty
    if (isHex && start.hexState === hexStates.EMPTY) {
      continue;
    }

    // Create a backup of node weights
    const nodeWeightsBackup = { ...nodeWeights };

    let line = walk(start, isHex, graph, selfIntersections);

    if (line && line.length > 10) {
      nodeLines.push(line);
      usedNodes.push(...line);
    } else {
      // If line wasn't accepted restore line weight to the previous state
      nodeWeights = nodeWeightsBackup;
    }

    if (nodeLines.length === lineCount) {
      break;
    }
  }

  return nodeLines;
}

function generateLines(
  nodeLines,
  {
    chaikinIterations,
    chaikinRatio,
    colorRng,
    side,
    displacementFactor,
    curvesToLinesRatio,
  }
) {
  const offset = side * displacementFactor;

  const lines = nodeLines.map((nodeLine) => {
    let line = nodeLine.map((node) => {
      return {
        x: node.position.x + random(-offset, offset),
        y: node.position.y + random(-offset, offset),
      };
    });

    line = chaikin(
      line,
      Math.random() > curvesToLinesRatio ? chaikinIterations : 0,
      false,
      chaikinRatio
    );

    line = simplify(line, SIMPLIFY_TOLERANCE);

    return line;
  });

  return lines;
}

function getFatLines(lines, { colorRng, thickness, side }) {
  return lines.map((line) => {
    const path = line.map((p) => {
      return {
        x: Math.round(p.x * SCALE),
        y: Math.round(p.y * SCALE),
      };
    });

    return clipper
      .offsetToPaths({
        delta: thickness * side * SCALE,
        offsetInputs: [
          {
            data: path,
            joinType: 'round',
            endType: 'openRound',
          },
        ],
      })
      .map((part) => {
        return simplify(part, SIMPLIFY_TOLERANCE);
      });
  });
}

function getCroppedLines(fatLines) {
  const data = fatLines.map((line) => {
    return line.map((part) => {
      return simplify(part, SCALE * SIMPLIFY_TOLERANCE);
    });
  });

  data.forEach((line1, index) => {
    for (let i = index + 1; i < data.length; i++) {
      let line2 = data[i];

      const diff1 = clipper.clipToPaths({
        clipType: 'difference',
        subjectFillType: 'evenOdd',
        subjectInputs: [{ data: line1, closed: true }],
        clipInputs: [{ data: line2 }],
      });

      line1 = diff1.map((part) => {
        return simplify(part, SCALE * SIMPLIFY_TOLERANCE);
      });

      data[index] = line1;
      data[i] = line2;
    }
  });

  return data;
}

function getOffsetLines(croppedLines, ratio = -0.05, { side }) {
  // return croppedLines;
  return croppedLines.map((croppedLine) => {
    return clipper
      .offsetToPaths({
        delta: ratio * side * SCALE,
        offsetInputs: [
          {
            data: croppedLine,
            joinType: 'round',
            endType: 'closedPolygon',
          },
        ],
      })
      .map((part) => {
        return simplify(part, SCALE * SIMPLIFY_TOLERANCE);
      });
  });
}

function scalePath(path, pathLengthThreshold) {
  const scaled = path
    // Filter out short paths
    .filter((part) => {
      return part.length > pathLengthThreshold;
    })
    .map((part) => {
      return part.map((point) => {
        return {
          x: point.x / SCALE,
          y: point.y / SCALE,
        };
      });
    });
  scaled.color = getColor();
  return scaled;
}

function getPolygon(graph, options) {
  const top = [];
  const left = [];
  const right = [];

  let x = Math.round(options.width * 0.25);
  let y = Math.round(options.height * 0.5);

  const offset = Math.round(options.width * 0.2);
  // Bottom corner
  top.push(graph.map[x][y].position);
  // Left corner
  top.push(graph.map[x - offset][y - offset].position);
  // Top corner
  top.push(graph.map[x + offset][y - offset * 2].position);
  // Right corner
  top.push(graph.map[x + offset * 2][y - offset].position);

  // Top right corner
  left.push(graph.map[x][y].position);
  // Bottom right corner
  left.push(graph.map[x - offset][y + 2 * offset].position);
  // Bottom left corner
  left.push(graph.map[x - 2 * offset][y + offset].position);
  // Top left corner
  left.push(graph.map[x - offset][y - offset].position);

  // Top left corner
  right.push(graph.map[x][y].position);
  // Bottom left corner
  right.push(graph.map[x - offset][y + 2 * offset].position);
  // Bottom right corner
  right.push(graph.map[x + offset][y + offset].position);
  // Top right corner
  right.push(graph.map[x + 2 * offset][y - offset].position);

  const outer = [top[1], top[2], right[3], right[2], right[1], left[2]].map(
    (point) => {
      return {
        x: point.x * SCALE,
        y: point.y * SCALE,
      };
    }
  );

  const polygon = [
    top.map((point) => {
      return {
        x: point.x * SCALE,
        y: point.y * SCALE,
      };
    }),
    left.map((point) => {
      return {
        x: point.x * SCALE,
        y: point.y * SCALE,
      };
    }),
    right.reverse().map((point) => {
      return {
        x: point.x * SCALE,
        y: point.y * SCALE,
      };
    }),
  ];

  const delta = 0.2 * options.side * SCALE;

  const step1 = clipper.offsetToPaths({
    delta: -delta * 1.3,
    offsetInputs: [
      {
        data: polygon,
        joinType: 'round',
        endType: 'closedPolygon',
      },
    ],
  });

  return {
    inner: clipper
      .offsetToPaths({
        delta: delta * 0.3,
        offsetInputs: [
          {
            data: step1,
            joinType: 'round',
            endType: 'closedPolygon',
          },
        ],
      })
      .map((part) => {
        return simplify(part, SCALE * SIMPLIFY_TOLERANCE);
      }),
    outer: clipper
      .offsetToPaths({
        delta: delta * 0.5,
        offsetInputs: [
          {
            data: outer,
            joinType: 'round',
            endType: 'closedPolygon',
          },
        ],
      })
      .map((part) => {
        return simplify(part, SCALE * SIMPLIFY_TOLERANCE);
      }),
  };
}

function getCircle(w, h, ratio) {
  const vertexCount = 72;
  const step = (2 * Math.PI) / vertexCount;

  const circle = [];

  for (let i = 0; i < vertexCount; i++) {
    const angle = i * step;
    circle.push({
      x: (w * 0.5 + Math.cos(angle) * w * ratio) * SCALE,
      y: (h * 0.5 + Math.sin(angle) * w * ratio) * SCALE,
    });
  }

  return [circle];
}

function getCutPolygon(polygon, offsetLines, { thickness }) {
  const clipInputs = offsetLines.map((path) => {
    return {
      data: path,
    };
  });

  return clipper
    .clipToPaths({
      clipType: 'difference',
      subjectFillType: 'evenOdd',
      subjectInputs: [{ data: polygon, closed: true }],
      clipInputs,
    })
    .map((part) => {
      return simplify(part, SIMPLIFY_TOLERANCE);
    });
}

function getClippedLines(polygon, offsetLines, { thickness }) {
  const clipInputs = offsetLines.map((path) => {
    return {
      data: path,
    };
  });

  return clipper
    .clipToPaths({
      clipType: 'intersection',
      subjectFillType: 'evenOdd',
      subjectInputs: [{ data: polygon, closed: true }],
      clipInputs,
    })
    .map((part) => {
      return simplify(part, SIMPLIFY_TOLERANCE);
    });
}

function getShadingLines(w, h, { side }) {
  const step = side * 0.07;
  const paths = [];

  i = step;
  while (i < w) {
    paths.push([
      { x: i * SCALE, y: 0 },
      { x: i * SCALE, y: h * SCALE },
    ]);

    // i *= 1.01;
    i += step;
  }

  return paths;
}

function getShading(shadingLines, polygons) {
  const subjectInputs = shadingLines.map((path) => {
    return {
      data: path,
      closed: false,
    };
  });

  const clipInputs = polygons.map((path) => {
    return {
      data: path,
    };
  });

  const tree = clipper.clipToPolyTree({
    clipType: 'intersection',
    subjectFillType: 'evenOdd',
    subjectInputs,
    clipInputs,
  });

  let current = tree.getFirst();

  const paths = [];

  while (current) {
    paths.push(current.contour);
    current = current.getNext();
  }

  return paths;
}

function getShadingDots(
  w,
  h,
  // circleRatio defaults:
  // 0.4 for circle
  // 0.35 for cube
  { radiusEasing, shadingRingCount, circleRatio }
) {
  const center = {
    x: w * 0.5,
    y: h * 0.5,
  };
  const radius = circleRatio * w;

  const dots = [];
  const easing = getEasing(radiusEasing);

  for (let ringIndex = 1; ringIndex < shadingRingCount; ringIndex++) {
    // const r = rStep * ringIndex;
    const r = easing(ringIndex / shadingRingCount) * radius;
    // const r = easings.easeOutQuad(ringIndex / ringCount) * radius;

    const dotsPerCircle = r * 1; // easings.easeOutQuad(ringIndex / ringCount) * dotStep;

    for (let i = 1; i < dotsPerCircle; i++) {
      const angle = random(0, 2 * Math.PI);

      const start = {
        x: (center.x + Math.cos(angle) * r) * SCALE, //  + random(0, 10)
        y: (center.y + Math.sin(angle) * r) * SCALE, //  + random(0, 10)
      };

      const dot = [
        start,
        {
          x: start.x + 1,
          y: start.y + 1,
        },
      ];

      dots.push(dot);
    }
  }

  return dots;
}

async function getDrawingData(cacheKey, options) {
  const { width, height, side, pathLengthThreshold, lineOffsetRatio } = options;

  if (!clipper) {
    // create an instance of the library (usually only do this once in your app)
    clipper = await clipperLib.loadNativeClipperLibInstanceAsync(
      // let it autodetect which one to use, but also available WasmOnly and AsmJsOnly
      clipperLib.NativeClipperLibRequestedFormat.WasmWithAsmJsFallback
    );
  }

  // Reset global nodeWeights
  nodeWeights = {};

  // noise.seed = strToCharCode(mainSeed);

  options.h = (side * SQRT_3) / 2;

  const w = width * side;
  const h = height * ((side * Math.sqrt(3)) / 2);

  // --------- Main logic

  let start = new Date();

  const graph = generateGraph(options);

  console.log('generateGraph', new Date().getTime() - start.getTime());
  start = new Date();

  const nodeLines = generateNodeLines(graph, options);
  const lines = generateLines(nodeLines, options);
  const fatLines = getFatLines(lines, options);

  console.log('fat lines', new Date().getTime() - start.getTime());
  start = new Date();

  const croppedLines = getCroppedLines(fatLines);

  console.log('cropped lines', new Date().getTime() - start.getTime());
  start = new Date();

  let offsetLines = getOffsetLines(croppedLines, -lineOffsetRatio, options);

  console.log('offset lines', new Date().getTime() - start.getTime());
  start = new Date();

  let circle;
  let outerCircle;

  if (options.shape === 'cube') {
    const poly = getPolygon(graph, options);
    circle = poly.inner;
    outerCircle = poly.outer;
  } else {
    circle = getCircle(w, h, 0.4);
    outerCircle = getCircle(w, h, 0.41);
  }

  const cutCircle = getCutPolygon(circle, offsetLines, options);

  // const shadingLines = getShadingLines(w, h, options);

  // const shading = getShading(shadingLines, [cutCircle]);

  // let shadingOffsetLines = getOffsetLines(croppedLines, -0.2, options);
  // shadingOffsetLines = getClippedLines(circle, shadingOffsetLines, options);

  offsetLines = getClippedLines(circle, offsetLines, options);

  // const shadingInner = getShading(shadingLines, offsetLines);

  const shadingDots = getShadingDots(w, h, options);
  const dotShading = getShading(shadingDots, [cutCircle]);
  const dotShadingInner = getShading(shadingDots, offsetLines);

  return {
    ...graph,
    nodeLines,
    lines,
    croppedLines: croppedLines.map((path) => {
      return scalePath(path, pathLengthThreshold);
    }),
    fatLines: fatLines.map((path) => {
      return scalePath(path, pathLengthThreshold);
    }),
    offsetLines: [offsetLines].map((path) => {
      return scalePath(path, pathLengthThreshold);
    }),
    circle: scalePath(circle, 0),
    cutCircle: scalePath(cutCircle, pathLengthThreshold),
    outerCircle: scalePath(outerCircle, 0),
    // shading: scalePath(shading, 0),
    // shadingInner: scalePath(shadingInner, 0),
    dotShading: scalePath(dotShading, 0),
    dotShadingInner: scalePath(dotShadingInner, 0),
  };
}

const memoizedGetDrawingData = mem(getDrawingData);

export default (options) => {
  // These props directly impact the data
  // That's why they are used for the cache key
  const recalculateProps = KNOBS.filter((knob) => knob.recalculate);

  const cacheKey = recalculateProps.map((prop) => options[prop.name]).join('_');

  return memoizedGetDrawingData(cacheKey, options);
};
