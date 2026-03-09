export const SCENE_WIDTH = 1184;
export const SCENE_HEIGHT = 667;

export const GRID = {
  cols: 4,
  rows: 5,
  originX: 301,
  originY: 34,
  stepX: 145,
  stepY: 117,
};

export const BOARD_BASE_CELLS = Array.from({ length: GRID.rows }, (_, row) =>
  Array.from({ length: GRID.cols }, (_, col) => ({
    row,
    col,
  })),
).flat();

export const INITIAL_LAYOUT = {
  nyamu: [0, 0],
  michelle: [1, 0],
  moca: [3, 0],
  arisa: [0, 2],
  yukina: [1, 2],
  eve: [3, 2],
  saaya: [1, 3],
  box: [2, 3],
  tae: [0, 4],
  tsukushi: [3, 4],
};

export const PIECE_DEFINITIONS = [
  {
    id: "nyamu",
    name: "Nyamu",
    width: 1,
    height: 2,
    cropX: 301,
    cropY: 34,
    renderWidth: 144,
    renderHeight: 233,
  },
  {
    id: "michelle",
    name: "Michelle",
    width: 2,
    height: 2,
    cropX: 446,
    cropY: 34,
    renderWidth: 289,
    renderHeight: 233,
  },
  {
    id: "moca",
    name: "Moca",
    width: 1,
    height: 2,
    cropX: 737,
    cropY: 34,
    renderWidth: 144,
    renderHeight: 233,
  },
  {
    id: "arisa",
    name: "Arisa",
    width: 1,
    height: 2,
    cropX: 301,
    cropY: 268,
    renderWidth: 144,
    renderHeight: 233,
  },
  {
    id: "yukina",
    name: "Yukina",
    width: 2,
    height: 1,
    cropX: 446,
    cropY: 268,
    renderWidth: 289,
    renderHeight: 116,
  },
  {
    id: "eve",
    name: "Eve",
    width: 1,
    height: 2,
    cropX: 737,
    cropY: 268,
    renderWidth: 144,
    renderHeight: 233,
  },
  {
    id: "saaya",
    name: "Saaya",
    width: 1,
    height: 1,
    cropX: 446,
    cropY: 385,
    renderWidth: 144,
    renderHeight: 116,
  },
  {
    id: "box",
    name: "Box",
    width: 1,
    height: 1,
    cropX: 591,
    cropY: 385,
    renderWidth: 144,
    renderHeight: 116,
  },
  {
    id: "tae",
    name: "Tae",
    width: 1,
    height: 1,
    cropX: 301,
    cropY: 502,
    renderWidth: 144,
    renderHeight: 116,
  },
  {
    id: "tsukushi",
    name: "Tsukushi",
    width: 1,
    height: 1,
    cropX: 737,
    cropY: 502,
    renderWidth: 144,
    renderHeight: 116,
  },
];

export function createInitialPieces() {
  return PIECE_DEFINITIONS.map((piece) => {
    const [gridX, gridY] = INITIAL_LAYOUT[piece.id];
    return {
      ...piece,
      gridX,
      gridY,
      element: null,
    };
  });
}
