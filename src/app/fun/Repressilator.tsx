"use client";

import { useEffect, useRef, useState } from "react";
import { GENES, Repressilator as Stochastic, RepressilatorODE, type Simulation } from "./repressilatorModel";

const COLORS = ["#d62728", "#2ca02c", "#1f77b4"];
const WINDOW = 400; // minutes of history shown
const SAMPLE = 0.5; // minutes between chart samples
const NODES = [
  [100, 25],
  [170, 145],
  [30, 145],
];
const VERSIONS = [
  { title: "Stochastic (Gillespie)", note: "Every reaction is a random event, so molecule counts are noisy and no two cycles look alike." },
  { title: "Deterministic (ODEs)", note: "The same rates as smooth concentrations: a perfectly regular cycle, and changing cell size only rescales it." },
];

function Ring({ proteins }: { proteins: number[] }) {
  const total = Math.max(1, ...proteins);
  const leader = proteins.indexOf(Math.max(...proteins));
  return (
    <svg viewBox="0 0 200 175" width={200} height={175} role="img" aria-label="Repressilator ring: LacI represses TetR, TetR represses cI, cI represses LacI">
      {NODES.map(([x1, y1], i) => {
        const [x2, y2] = NODES[(i + 1) % 3];
        const len = Math.hypot(x2 - x1, y2 - y1);
        const ux = (x2 - x1) / len, uy = (y2 - y1) / len;
        const sx = x1 + ux * 38, sy = y1 + uy * 38, ex = x2 - ux * 38, ey = y2 - uy * 38;
        return (
          <g key={i} stroke="#555" strokeWidth={2}>
            <line x1={sx} y1={sy} x2={ex} y2={ey} />
            <line x1={ex - uy * 7} y1={ey + ux * 7} x2={ex + uy * 7} y2={ey - ux * 7} />
          </g>
        );
      })}
      {NODES.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={8 + 22 * (proteins[i] / total)} fill={COLORS[i]} fillOpacity={i === leader ? 0.9 : 0.25} />
          <text x={x} y={y + 4} textAnchor="middle" fontSize={11} fontWeight={i === leader ? "bold" : "normal"}>
            {GENES[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

function drawChart(canvas: HTMLCanvasElement, history: number[][], yMax: number) {
  const ctx = canvas.getContext("2d")!;
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== w * dpr) {
    canvas.width = w * dpr;
    canvas.height = h * dpr;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
  const n = WINDOW / SAMPLE;
  history.forEach((series, i) => {
    ctx.strokeStyle = COLORS[i];
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    series.forEach((v, k) => {
      const x = ((k + n - series.length) / n) * w;
      const y = h - (v / yMax) * (h - 4) - 2;
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });
}

export default function Repressilator() {
  const canvasRefs = [useRef<HTMLCanvasElement>(null), useRef<HTMLCanvasElement>(null)];
  const sims = useRef<Simulation[]>([]);
  const histories = useRef<number[][][]>([]);
  const settings = useRef({ size: 0.3, speed: 20, playing: true });
  const [size, setSize] = useState(0.3);
  const [speed, setSpeed] = useState(20);
  const [playing, setPlaying] = useState(true);
  const [proteins, setProteins] = useState([
    [0, 0, 0],
    [0, 0, 0],
  ]);

  const reset = () => {
    const params = { size: settings.current.size };
    sims.current = [new Stochastic(params), new RepressilatorODE(params)];
    histories.current = [
      [[], [], []],
      [[], [], []],
    ];
  };

  useEffect(() => {
    reset();
    let yMax = 50;
    let last = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const { speed, playing } = settings.current;
      if (playing) {
        sims.current.forEach((sim, s) => {
          const target = sim.t + dt * speed;
          while (sim.t < target) {
            const nextSample = sim.samples * SAMPLE;
            sim.advance(Math.min(target, nextSample));
            if (sim.t >= nextSample) {
              sim.samples++;
              const p = sim.p;
              histories.current[s].forEach((h, i) => {
                h.push(p[i]);
                if (h.length > WINDOW / SAMPLE) h.shift();
              });
            }
          }
        });
        setProteins(sims.current.map((sim) => sim.p));
      }

      // Both charts share one y-scale so their amplitudes compare directly.
      const peak = Math.max(10, ...histories.current.flat(2));
      yMax += (peak * 1.1 - yMax) * 0.05;
      canvasRefs.forEach((ref, s) => ref.current && drawChart(ref.current, histories.current[s], yMax));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <p>
        {GENES.map((g, i) => (
          <span key={g} style={{ color: COLORS[i], marginRight: "1em" }}>— {g}</span>
        ))}
        <br />
        <small>Protein counts over the last {WINDOW} simulated minutes, same parameters for both.</small>
      </p>

      {VERSIONS.map((v, s) => {
        const p = proteins[s];
        const leader = p.indexOf(Math.max(...p));
        return (
          <div key={v.title}>
            <h3>{v.title}</h3>
            <p>{v.note}</p>
            <p>
              <strong style={{ color: COLORS[leader] }}>{GENES[leader]}</strong> has the upper hand (
              {p.map((x, i) => `${GENES[i]} ${Math.round(x)}`).join(", ")})
            </p>
            <Ring proteins={p} />
            <canvas ref={canvasRefs[s]} style={{ width: "100%", height: 160, display: "block" }} />
          </div>
        );
      })}

      <p>
        <button
          onClick={() => {
            settings.current.playing = !playing;
            setPlaying(!playing);
          }}
        >
          {playing ? "Pause" : "Play"}
        </button>{" "}
        <button onClick={reset}>Reset</button>
      </p>
      <p>
        <label>
          Cell size (fewer molecules = noisier):{" "}
          <input
            type="range"
            min={0.05}
            max={2}
            step={0.05}
            value={size}
            onChange={(e) => {
              const v = Number(e.target.value);
              setSize(v);
              settings.current.size = v;
              sims.current.forEach((sim) => (sim.params.size = v));
            }}
          />{" "}
          {size.toFixed(2)}
        </label>
        <br />
        <label>
          Speed:{" "}
          <input
            type="range"
            min={2}
            max={80}
            value={speed}
            onChange={(e) => {
              const v = Number(e.target.value);
              setSpeed(v);
              settings.current.speed = v;
            }}
          />{" "}
          {speed} sim-min/s
        </label>
      </p>
    </div>
  );
}
