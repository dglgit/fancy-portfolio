import * as THREE from 'three';

// Builds "protein" CA traces shaped like letters. Each stroke is wound into an
// alpha helix (folded state) and paired with a loose random coil that drifts
// around the same path (denatured state). The scene blends between the two.

type P = [number, number];
const H = 1.4;

function arc(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 28): P[] {
  const out: P[] = [];
  for (let i = 0; i <= n; i++) {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    out.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
  }
  return out;
}

const GLYPHS: Record<string, { width: number; strokes: P[][] }> = {
  D: { width: 1, strokes: [[[0, 0], [0, H], ...arc(0.2, 0.7, 0.8, 0.7, 90, -90), [0, 0]]] },
  O: { width: 1, strokes: [arc(0.5, 0.7, 0.5, 0.7, 90, 450, 48)] },
  U: { width: 1, strokes: [[[0, H], ...arc(0.5, 0.5, 0.5, 0.5, 180, 360), [1, H]]] },
  G: { width: 1, strokes: [[...arc(0.5, 0.7, 0.5, 0.7, 40, 360, 44), [1, 0.65], [0.55, 0.65]]] },
  L: { width: 0.85, strokes: [[[0, H], [0, 0], [0.85, 0]]] },
  A: { width: 1.1, strokes: [[[0, 0], [0.55, H], [1.1, 0]], [[0.25, 0.55], [0.85, 0.55]]] },
  S: { width: 0.95, strokes: [[...arc(0.48, 1.05, 0.45, 0.35, 20, 270), ...arc(0.48, 0.35, 0.47, 0.35, 90, -160)]] },
  I: { width: 0.15, strokes: [[[0.075, 0], [0.075, H]]] },
  N: { width: 1, strokes: [[[0, 0], [0, H], [1, 0], [1, H]]] },
};

// Real helix: 3.6 residues/turn, 1.5 Å rise, 2.3 Å radius. Letter height ≈ 60 Å.
const RISE = 0.035;
const HELIX_R = 0.055;
const BOND = 0.075;

function resample(points: P[], step: number): P[] {
  const out: P[] = [points[0]];
  let carry = 0;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const len = Math.hypot(x1 - x0, y1 - y0);
    if (len < 1e-6) continue;
    let d = step - carry;
    while (d <= len) {
      out.push([x0 + ((x1 - x0) * d) / len, y0 + ((y1 - y0) * d) / len]);
      d += step;
    }
    carry = len - (d - step);
  }
  return out;
}

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Chain {
  letter: number;
  folded: THREE.Vector3[];
  coil: THREE.Vector3[];
  delay: Float32Array;
  phase: [number, number, number];
}

function buildChain(path: P[], ox: number, oy: number, letter: number, seed: number): Chain {
  const rand = rng(seed);
  const axis = resample(path, RISE).map(([x, y]) => new THREE.Vector3(x + ox, y + oy, 0));
  const n = axis.length;
  const z = new THREE.Vector3(0, 0, 1);
  const folded = axis.map((c, i) => {
    const t = axis[Math.min(i + 1, n - 1)].clone().sub(axis[Math.max(i - 1, 0)]).normalize();
    const b = new THREE.Vector3().crossVectors(t, z).normalize();
    const theta = (i * 2 * Math.PI) / 3.6;
    return c.clone().addScaledVector(b, HELIX_R * Math.cos(theta)).addScaledVector(z, HELIX_R * Math.sin(theta));
  });

  // Floppy random walk, loosely tethered to the letter's axis so the name stays faintly readable.
  const coil: THREE.Vector3[] = [folded[0].clone()];
  const dir = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize();
  const kick = new THREE.Vector3();
  for (let i = 1; i < n; i++) {
    const prev = coil[i - 1];
    kick.set(rand() - 0.5, rand() - 0.5, (rand() - 0.5) * 0.7);
    dir.multiplyScalar(0.6).addScaledVector(kick, 0.9).addScaledVector(axis[i].clone().sub(prev), 2.4).normalize();
    coil.push(prev.clone().addScaledVector(dir, BOND));
  }

  // Ends and random patches unravel first.
  const p1 = rand() * 6, p2 = rand() * 6;
  const delay = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const endDist = Math.min(i, n - 1 - i) / (n / 2);
    const noise = 0.5 + 0.25 * Math.sin(i * 0.11 + p1) + 0.25 * Math.sin(i * 0.047 + p2);
    delay[i] = 0.35 * endDist + 0.45 * noise;
  }
  return { letter, folded, coil, delay, phase: [rand() * 6, rand() * 6, rand() * 6] };
}

const GAP = 0.38;
const ROW_GAP = 0.65;

export function buildName(rows: string[]): Chain[] {
  const chains: Chain[] = [];
  let letter = 0;
  const totalH = rows.length * H + (rows.length - 1) * ROW_GAP;
  rows.forEach((row, r) => {
    const glyphs = [...row].map((ch) => GLYPHS[ch]);
    const width = glyphs.reduce((s, g) => s + g.width, 0) + GAP * (glyphs.length - 1);
    let x = -width / 2;
    const y = totalH / 2 - H - r * (H + ROW_GAP);
    glyphs.forEach((g) => {
      g.strokes.forEach((stroke, s) => chains.push(buildChain(stroke, x, y, letter, 97 * letter + 13 * s + 1)));
      x += g.width + GAP;
      letter++;
    });
  });
  return chains;
}

const smooth = (u: number) => u * u * (3 - 2 * u);

// Writes the blended, thermally jiggling positions for melt fraction m into out.
export function updateChain(chain: Chain, m: number, time: number, out: THREE.Vector3[]) {
  const amp = 0.003 + 0.03 * m;
  const [a, b, c] = chain.phase;
  for (let i = 0; i < out.length; i++) {
    const u = smooth(Math.min(1, Math.max(0, m * 1.8 - chain.delay[i])));
    out[i].lerpVectors(chain.folded[i], chain.coil[i], u);
    out[i].x += amp * Math.sin(time * 1.7 + i * 0.35 + a);
    out[i].y += amp * Math.sin(time * 1.3 + i * 0.41 + b);
    out[i].z += amp * 0.7 * Math.sin(time * 2.1 + i * 0.29 + c);
  }
}
