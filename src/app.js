import {
  BOARD_BASE_CELLS,
  GRID,
  SCENE_HEIGHT,
  SCENE_WIDTH,
  createInitialPieces,
} from "./config.js";
import { isSolved, reachablePositions, resetPieces, scenePositionFor } from "./puzzle.js";

const scene = document.querySelector(".scene");
const viewport = document.querySelector(".scene-viewport");
const boardCells = document.getElementById("board-cells");
const piecesLayer = document.getElementById("pieces-layer");

const pieces = createInitialPieces();

function renderBoardBase() {
  const fragment = document.createDocumentFragment();

  for (const cellConfig of BOARD_BASE_CELLS) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.style.left = `${GRID.originX + cellConfig.col * GRID.stepX}px`;
    cell.style.top = `${GRID.originY + cellConfig.row * GRID.stepY}px`;
    fragment.appendChild(cell);
  }

  boardCells.appendChild(fragment);
}

function renderPiece(piece) {
  if (!piece.element) {
    const element = document.createElement("button");
    element.className = "piece";
    element.type = "button";
    element.setAttribute("aria-label", piece.name);
    element.style.width = `${piece.renderWidth}px`;
    element.style.height = `${piece.renderHeight}px`;
    element.style.backgroundPosition = `-${piece.cropX}px -${piece.cropY}px`;
    piece.element = element;
    piecesLayer.appendChild(element);
    bindDrag(piece);
  }

  const position = scenePositionFor(piece);
  piece.element.style.left = `${position.x}px`;
  piece.element.style.top = `${position.y}px`;
}

function render() {
  pieces.forEach(renderPiece);
  scene.classList.toggle("is-cleared", isSolved(pieces));
}

function scaleViewport() {
  const scale = Math.min(
    (window.innerWidth - 32) / SCENE_WIDTH,
    (window.innerHeight - 32) / SCENE_HEIGHT,
    1,
  );

  viewport.style.transform = `scale(${scale})`;
}

function pointerToScene(pointEvent, sceneRect) {
  return {
    x: (pointEvent.clientX - sceneRect.left) * (SCENE_WIDTH / sceneRect.width),
    y: (pointEvent.clientY - sceneRect.top) * (SCENE_HEIGHT / sceneRect.height),
  };
}

function bindDrag(piece) {
  piece.element.addEventListener("pointerdown", (event) => {
    event.preventDefault();

    const sceneRect = scene.getBoundingClientRect();
    const startPointer = pointerToScene(event, sceneRect);
    const startPosition = scenePositionFor(piece);
    const targets = reachablePositions(pieces, piece).map((target) => ({
      ...target,
      px: GRID.originX + target.x * GRID.stepX,
      py: GRID.originY + target.y * GRID.stepY,
    }));

    const dragState = {
      pointerId: event.pointerId,
      offsetX: startPointer.x - startPosition.x,
      offsetY: startPointer.y - startPosition.y,
      startGridX: piece.gridX,
      startGridY: piece.gridY,
      targets,
    };

    piece.element.classList.add("is-dragging");
    piece.element.setPointerCapture(event.pointerId);

    function teardown() {
      piece.element.classList.remove("is-dragging");
      piece.element.releasePointerCapture(dragState.pointerId);
      piece.element.removeEventListener("pointermove", onPointerMove);
      piece.element.removeEventListener("pointerup", onPointerUp);
      piece.element.removeEventListener("pointercancel", onPointerCancel);
    }

    function commit(gridX, gridY) {
      piece.gridX = gridX;
      piece.gridY = gridY;
      teardown();
      render();
    }

    function onPointerMove(moveEvent) {
      if (moveEvent.pointerId !== dragState.pointerId) {
        return;
      }

      const pointer = pointerToScene(moveEvent, sceneRect);
      piece.element.style.left = `${pointer.x - dragState.offsetX}px`;
      piece.element.style.top = `${pointer.y - dragState.offsetY}px`;
    }

    function onPointerUp(upEvent) {
      if (upEvent.pointerId !== dragState.pointerId) {
        return;
      }

      const pointer = pointerToScene(upEvent, sceneRect);
      const desiredX = pointer.x - dragState.offsetX;
      const desiredY = pointer.y - dragState.offsetY;

      let bestTarget = dragState.targets[0];
      let bestDistance = Number.POSITIVE_INFINITY;

      for (const target of dragState.targets) {
        const distance = Math.hypot(target.px - desiredX, target.py - desiredY);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestTarget = target;
        }
      }

      commit(bestTarget.x, bestTarget.y);
    }

    function onPointerCancel(cancelEvent) {
      if (cancelEvent.pointerId !== dragState.pointerId) {
        return;
      }

      commit(dragState.startGridX, dragState.startGridY);
    }

    piece.element.addEventListener("pointermove", onPointerMove);
    piece.element.addEventListener("pointerup", onPointerUp);
    piece.element.addEventListener("pointercancel", onPointerCancel);
  });
}

window.addEventListener("resize", scaleViewport);
window.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() !== "r") {
    return;
  }

  resetPieces(pieces);
  render();
});

renderBoardBase();
render();
scaleViewport();
