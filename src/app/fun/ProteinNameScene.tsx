'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { buildName, updateChain, type Chain } from './proteinName';

const PALETTE = ['#3fa34d', '#f2b51d', '#3aa6dd', '#e2725b', '#2a9d8f', '#f08fb0', '#8bc34a', '#f2b51d', '#3aa6dd', '#e2725b'];
const RADIAL = 8;
const SAMPLES_PER_RES = 3;
const TUBE_R = 0.027;

export const meltFromTemp = (T: number) => {
  const u = Math.min(1, Math.max(0, (T - 330) / 160));
  return u * u * (3 - 2 * u);
};

function makeOutlineMaterial() {
  const mat = new THREE.MeshBasicMaterial({ color: '#2f4a3a', side: THREE.BackSide });
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', 'vec3 transformed = position + normal * 0.011;');
  };
  return mat;
}

function ChainTube({ chain, gradient, outline, melt }: { chain: Chain; gradient: THREE.Texture; outline: THREE.Material; melt: RefObject<number> }) {
  const n = chain.folded.length;
  const M = n * SAMPLES_PER_RES;
  const { geometry, curve, pts, samples } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const verts = M * (RADIAL + 1);
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts * 3), 3));
    g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(verts * 3), 3));
    const idx: number[] = [];
    for (let k = 0; k < M - 1; k++) {
      for (let j = 0; j < RADIAL; j++) {
        const a = k * (RADIAL + 1) + j, b = a + RADIAL + 1, c = b + 1, d = a + 1;
        idx.push(a, d, b, b, d, c);
      }
    }
    g.setIndex(idx);
    const pts = chain.folded.map((p) => p.clone());
    return { geometry: g, pts, curve: new THREE.CatmullRomCurve3(pts, false, 'centripetal'), samples: Array.from({ length: M }, () => new THREE.Vector3()) };
  }, [chain, M]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const t = useMemo(() => new THREE.Vector3(), []);
  const nrm = useMemo(() => new THREE.Vector3(), []);
  const bin = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    updateChain(chain, melt.current ?? 0, clock.elapsedTime, pts);
    for (let k = 0; k < M; k++) curve.getPoint(k / (M - 1), samples[k]);
    const pos = geometry.attributes.position.array as Float32Array;
    const nor = geometry.attributes.normal.array as Float32Array;
    for (let k = 0; k < M; k++) {
      t.subVectors(samples[Math.min(k + 1, M - 1)], samples[Math.max(k - 1, 0)]).normalize();
      // Parallel-transport the ring frame along the curve so the tube doesn't twist.
      if (k === 0) nrm.set(0, 0, 1).addScaledVector(t, -t.z).normalize();
      else nrm.addScaledVector(t, -nrm.dot(t)).normalize();
      bin.crossVectors(t, nrm);
      const r = TUBE_R * Math.min(1, (k + 1) / 5, (M - k) / 5);
      for (let j = 0; j <= RADIAL; j++) {
        const a = (j / RADIAL) * Math.PI * 2;
        dir.copy(nrm).multiplyScalar(Math.cos(a)).addScaledVector(bin, Math.sin(a));
        const o = (k * (RADIAL + 1) + j) * 3;
        pos[o] = samples[k].x + dir.x * r;
        pos[o + 1] = samples[k].y + dir.y * r;
        pos[o + 2] = samples[k].z + dir.z * r;
        nor[o] = dir.x;
        nor[o + 1] = dir.y;
        nor[o + 2] = dir.z;
      }
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.normal.needsUpdate = true;
  });

  return (
    <>
      <mesh geometry={geometry} frustumCulled={false}>
        <meshToonMaterial color={PALETTE[chain.letter % PALETTE.length]} gradientMap={gradient} />
      </mesh>
      <mesh geometry={geometry} material={outline} frustumCulled={false} />
    </>
  );
}

function FitCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const k = 2 * Math.tan((cam.fov * Math.PI) / 360);
    const narrow = size.width / size.height < 1.2;
    cam.position.z = narrow ? Math.max(7 / k, 6 / ((size.width / size.height) * k)) : Math.max(4.6 / k, 11 / ((size.width / size.height) * k));
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function Name({ temp }: { temp: RefObject<number> }) {
  const narrow = useThree((s) => s.size.width / s.size.height < 1.2);
  const chains = useMemo(() => buildName(narrow ? ['DOUG', 'LAS', 'LIN'] : ['DOUGLAS', 'LIN']), [narrow]);
  const gradient = useMemo(() => {
    const tex = new THREE.DataTexture(new Uint8Array([110, 190, 255]), 3, 1, THREE.RedFormat);
    tex.minFilter = tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);
  const outline = useMemo(makeOutlineMaterial, []);
  const melt = useRef(0);
  const group = useRef<THREE.Group>(null);

  useFrame(({ pointer, clock }, dt) => {
    melt.current += (meltFromTemp(temp.current ?? 300) - melt.current) * Math.min(1, dt * 3);
    const g = group.current;
    if (!g) return;
    g.rotation.y += (pointer.x * 0.18 - g.rotation.y) * 0.05;
    g.rotation.x += (-pointer.y * 0.08 - g.rotation.x) * 0.05;
    g.position.y = Math.sin(clock.elapsedTime * 0.6) * 0.05;
  });

  return (
    <group ref={group}>
      {chains.map((c, i) => (
        <ChainTube key={i} chain={c} gradient={gradient} outline={outline} melt={melt} />
      ))}
    </group>
  );
}

export default function ProteinNameScene({ temp }: { temp: RefObject<number> }) {
  return (
    <Canvas camera={{ fov: 35, position: [0, 0, 12] }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
      <FitCamera />
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 6, 7]} intensity={2.4} color="#fff3d6" />
      <Name temp={temp} />
    </Canvas>
  );
}
