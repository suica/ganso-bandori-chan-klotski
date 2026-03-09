import { GRID, INITIAL_LAYOUT } from "./config.js";

export function resetPieces(pieces) {
  for (const piece of pieces) {
    [piece.gridX, piece.gridY] = INITIAL_LAYOUT[piece.id];
  }
}

export function scenePositionFor(piece) {
  return {
    x: GRID.originX + piece.gridX * GRID.stepX,
    y: GRID.originY + piece.gridY * GRID.stepY,
  };
}

export function isSolved(pieces) {
  const michelle = pieces.find((piece) => piece.id === "michelle");
  return michelle.gridX === 1 && michelle.gridY === 3;
}

function buildOccupiedGrid(pieces, exceptId) {
  const occupied = Array.from({ length: GRID.rows }, () =>
    Array.from({ length: GRID.cols }, () => false),
  );

  for (const piece of pieces) {
    if (piece.id === exceptId) {
      continue;
    }

    for (let row = piece.gridY; row < piece.gridY + piece.height; row += 1) {
      for (let col = piece.gridX; col < piece.gridX + piece.width; col += 1) {
        occupied[row][col] = true;
      }
    }
  }

  return occupied;
}

function canPlace(piece, gridX, gridY, occupied) {
  if (gridX < 0 || gridY < 0) {
    return false;
  }

  if (gridX + piece.width > GRID.cols || gridY + piece.height > GRID.rows) {
    return false;
  }

  for (let row = gridY; row < gridY + piece.height; row += 1) {
    for (let col = gridX; col < gridX + piece.width; col += 1) {
      if (occupied[row][col]) {
        return false;
      }
    }
  }

  return true;
}

export function reachablePositions(pieces, currentPiece) {
  const occupied = buildOccupiedGrid(pieces, currentPiece.id);
  const startKey = `${currentPiece.gridX},${currentPiece.gridY}`;
  const queue = [{ x: currentPiece.gridX, y: currentPiece.gridY }];
  const visited = new Map([[startKey, { x: currentPiece.gridX, y: currentPiece.gridY }]]);

  while (queue.length > 0) {
    const current = queue.shift();
    const candidates = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ];

    for (const next of candidates) {
      const key = `${next.x},${next.y}`;
      if (visited.has(key)) {
        continue;
      }

      if (!canPlace(currentPiece, next.x, next.y, occupied)) {
        continue;
      }

      visited.set(key, next);
      queue.push(next);
    }
  }

  return [...visited.values()];
}
