"use client";

import { useEffect, useRef } from "react";

const CELL = 10;
const TICK_MS = 160;
const COLOR = "rgba(0, 0, 0, 0.07)";
const GLIDER = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];

// Faint Conway's Game of Life behind the page. Moving the mouse seeds a cell per tick; clicking drops a glider.
export default function GameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let cols = 0, rows = 0;
    let grid = new Uint8Array(0);
    let next = new Uint8Array(0);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const newCols = Math.ceil(window.innerWidth / CELL), newRows = Math.ceil(window.innerHeight / CELL);
      const old = grid, oldCols = cols, oldRows = rows;
      cols = newCols;
      rows = newRows;
      grid = new Uint8Array(cols * rows);
      next = new Uint8Array(cols * rows);
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++)
          grid[y * cols + x] = x < oldCols && y < oldRows ? old[y * oldCols + x] : Math.random() < 0.2 ? 1 : 0;
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = COLOR;
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++)
          if (grid[y * cols + x]) ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
    };

    const step = () => {
      if (pointer) {
        set(pointer[0], pointer[1]);
        pointer = null;
      }
      let alive = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let n = 0;
          for (let dy = -1; dy <= 1; dy++)
            for (let dx = -1; dx <= 1; dx++)
              if (dx || dy) n += grid[((y + dy + rows) % rows) * cols + ((x + dx + cols) % cols)];
          const live = grid[y * cols + x] ? n === 2 || n === 3 : n === 3;
          next[y * cols + x] = live ? 1 : 0;
          alive += live ? 1 : 0;
        }
      }
      [grid, next] = [next, grid];
      // Keep things from dying out entirely.
      if (alive < cols * rows * 0.02) spawnGlider(Math.random() * cols, Math.random() * rows);
      draw();
    };

    const set = (x: number, y: number) => {
      grid[(((y | 0) % rows + rows) % rows) * cols + (((x | 0) % cols + cols) % cols)] = 1;
    };
    const spawnGlider = (x: number, y: number) => GLIDER.forEach(([dx, dy]) => set(x + dx, y + dy));

    // Remember the latest pointer position; step() drops at most one cell there per tick.
    let pointer: [number, number] | null = null;
    const onMove = (e: PointerEvent) => {
      pointer = [e.clientX / CELL, e.clientY / CELL];
    };
    const onClick = (e: MouseEvent) => spawnGlider(e.clientX / CELL, e.clientY / CELL);

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("click", onClick);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = reduceMotion ? 0 : window.setInterval(() => !document.hidden && step(), TICK_MS);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: -1, pointerEvents: "none" }} />;
}
