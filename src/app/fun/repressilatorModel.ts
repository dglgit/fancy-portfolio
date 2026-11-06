// Repressilator (Elowitz & Leibler 2000): LacI ⊣ TetR ⊣ cI ⊣ LacI.
// Each gene has mRNA and protein; time is in minutes. The same reaction rates drive
// a stochastic version (Gillespie's direct method) and a deterministic one (ODEs, RK4).

export const GENES = ["LacI", "TetR", "cI"] as const;

export interface Params {
  size: number; // system size: smaller = fewer molecules = noisier
}

const ALPHA = 1.5; // max transcription, mRNA/min
const LEAK = 0.005; // leaky transcription, mRNA/min
const M_DECAY = 0.35; // mRNA decay, 1/min
const P_DECAY = 0.07; // protein decay, 1/min
const HILL = 2;

// Writes the 12 reaction rates (transcription, mRNA decay, translation, protein decay per gene).
// The repressor of gene i is the protein of the previous gene in the ring.
function rates(m: ArrayLike<number>, p: ArrayLike<number>, size: number, out: Float64Array) {
  const K = 40 * size;
  const beta = 8 * size;
  for (let i = 0; i < 3; i++) {
    const r = p[(i + 2) % 3] / K;
    out[4 * i] = LEAK + ALPHA / (1 + r ** HILL);
    out[4 * i + 1] = M_DECAY * m[i];
    out[4 * i + 2] = beta * m[i];
    out[4 * i + 3] = P_DECAY * p[i];
  }
}

export interface Simulation {
  t: number;
  samples: number; // chart samples taken so far (owned by the UI)
  p: number[];
  params: Params;
  advance(until: number): void;
}

export class Repressilator implements Simulation {
  t = 0;
  samples = 0;
  m = [0, 0, 0];
  p = [0, 0, 0];
  params: Params;
  private a = new Float64Array(12);

  constructor(params: Params) {
    this.params = params;
    // Start with LacI ahead so the cycle begins right away.
    this.p = [Math.round(60 * params.size), 0, 0];
  }

  // Fire reactions until simulated time reaches `until`.
  advance(until: number) {
    while (this.t < until) {
      rates(this.m, this.p, this.params.size, this.a);
      let total = 0;
      for (let k = 0; k < 12; k++) total += this.a[k];
      const dt = -Math.log(1 - Math.random()) / total;
      if (this.t + dt > until) {
        // No reaction before `until`; memorylessness lets us just stop here.
        this.t = until;
        return;
      }
      this.t += dt;
      let pick = Math.random() * total;
      let k = 0;
      while (k < 11 && (pick -= this.a[k]) > 0) k++;
      const i = k >> 2;
      switch (k & 3) {
        case 0: this.m[i]++; break;
        case 1: this.m[i]--; break;
        case 2: this.p[i]++; break;
        case 3: this.p[i]--; break;
      }
    }
  }
}

const H = 0.05; // RK4 step, minutes

export class RepressilatorODE implements Simulation {
  t = 0;
  samples = 0;
  params: Params;
  // State: [m0, m1, m2, p0, p1, p2]
  private y = new Float64Array(6);
  private a = new Float64Array(12);
  private k = Array.from({ length: 4 }, () => new Float64Array(6));
  private tmp = new Float64Array(6);

  constructor(params: Params) {
    this.params = params;
    this.y[3] = 60 * params.size;
  }

  get p() {
    return [this.y[3], this.y[4], this.y[5]];
  }

  private deriv(y: Float64Array, out: Float64Array) {
    rates(y, y.subarray(3), this.params.size, this.a);
    for (let i = 0; i < 3; i++) {
      out[i] = this.a[4 * i] - this.a[4 * i + 1];
      out[3 + i] = this.a[4 * i + 2] - this.a[4 * i + 3];
    }
  }

  private step(h: number) {
    const [k1, k2, k3, k4] = this.k;
    const { y, tmp } = this;
    this.deriv(y, k1);
    for (let j = 0; j < 6; j++) tmp[j] = y[j] + (h / 2) * k1[j];
    this.deriv(tmp, k2);
    for (let j = 0; j < 6; j++) tmp[j] = y[j] + (h / 2) * k2[j];
    this.deriv(tmp, k3);
    for (let j = 0; j < 6; j++) tmp[j] = y[j] + h * k3[j];
    this.deriv(tmp, k4);
    for (let j = 0; j < 6; j++) y[j] += (h / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]);
    this.t += h;
  }

  advance(until: number) {
    while (until - this.t > 1e-9) this.step(Math.min(H, until - this.t));
    this.t = until;
  }
}
