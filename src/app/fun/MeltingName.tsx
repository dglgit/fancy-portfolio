"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const ProteinNameScene = dynamic(() => import("./ProteinNameScene"), { ssr: false });

// One loop: hold at 300 K, heat to 500 K, hold, cool and refold.
const CYCLE = 14;
function cycleTemp(t: number) {
  const s = t % CYCLE;
  if (s < 3) return 300;
  if (s < 7) return 300 + (200 * (s - 3)) / 4;
  if (s < 9) return 500;
  if (s < 13) return 500 - (200 * (s - 9)) / 4;
  return 300;
}

export default function MeltingName() {
  const temp = useRef(300);
  const [T, setT] = useState(300);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const start = performance.now() - (3 + (4 * (temp.current - 300)) / 200) * 1000;
    let raf = 0;
    const loop = (now: number) => {
      const v = cycleTemp((now - start) / 1000);
      temp.current = v;
      setT(v);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  return (
    <div>
      <div style={{ height: 360 }}>
        <ProteinNameScene temp={temp} />
      </div>
      <p>
        <button onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</button>{" "}
        <input
          type="range"
          min={300}
          max={500}
          value={T}
          aria-label="Temperature"
          onChange={(e) => {
            setPlaying(false);
            temp.current = Number(e.target.value);
            setT(temp.current);
          }}
        />{" "}
        {Math.round(T)} K
      </p>
    </div>
  );
}
