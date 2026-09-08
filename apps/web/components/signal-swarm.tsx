"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 20000;
const REDUCED_PARTICLE_COUNT = 5000;

export function SignalSwarm({ locale }: { locale: "es" | "en" }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = reduceMotion ? REDUCED_PARTICLE_COUNT : PARTICLE_COUNT;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 500);
    const geometry = new THREE.BufferGeometry();
    const colorBuffer = new Float32Array(count * 3);
    const material = new THREE.PointsMaterial({
      blending: THREE.AdditiveBlending,
      color: 0xffffff,
      depthWrite: false,
      size: 0.95,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.78,
      vertexColors: true,
    });
    const mesh = new THREE.Points(geometry, material);
    const target = new THREE.Vector3();
    const color = new THREE.Color();
    const positions = new Float32Array(count * 3);
    const seedOne = new Float32Array(count);
    const seedTwo = new Float32Array(count);
    const gridWidth = Math.max(2, Math.floor(Math.sqrt(count)));
    const gridRows = Math.max(2, Math.ceil(count / gridWidth));

    camera.position.set(0, 0, 88);
    scene.fog = new THREE.Fog("#0a1521", 84, 170);
    scene.add(mesh);
    mount.appendChild(renderer.domElement);

    for (let i = 0; i < count; i += 1) {
      const h1 = Math.sin((i + 1) * 12.9898) * 43758.5453;
      const h2 = Math.sin((i + 1) * 78.233) * 23421.631;
      const r1 = h1 - Math.floor(h1);
      const r2 = h2 - Math.floor(h2);
      seedOne[i] = r1;
      seedTwo[i] = r2;
      const index = i * 3;
      positions[index] = (r1 - 0.5) * 84;
      positions[index + 1] = (r2 - 0.5) * 54;
      positions[index + 2] = ((((i * 233) % count) / count) - 0.5) * 84;
      color.setHSL(0.43 + r1 * 0.08, 0.86, 0.58 + r2 * 0.16);
      color.toArray(colorBuffer, index);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colorBuffer, 3));

    let frame = 0;
    let raf = 0;
    const startedAt = performance.now();

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const draw = () => {
      const time = reduceMotion ? 24 : (performance.now() - startedAt) / 1000 + 24;
      const pi = 3.14159265359;
      const tau = 6.28318530718;
      const safeCount = Math.max(1, count - 1);
      const simScale = 0.4;
      const simSpeed = 0.5;
      const detail = 1.98;
      const cycle = (time * simSpeed) % 24;
      const ds0 = Math.abs(cycle - 4);
      const dg0 = Math.abs(cycle - 12);
      const dw0 = Math.abs(cycle - 20);
      const ds = Math.min(ds0, 24 - ds0);
      const dg = Math.min(dg0, 24 - dg0);
      const dw = Math.min(dw0, 24 - dw0);
      const cs = Math.max(0, Math.cos((ds * pi) / 12));
      const cg = Math.max(0, Math.cos((dg * pi) / 12));
      const cw = Math.max(0, Math.cos((dw * pi) / 12));
      const rs = cs * cs * cs * cs;
      const rg = cg * cg * cg * cg;
      const rw = cw * cw * cw * cw;
      const sum = Math.max(0.0001, rs + rg + rw);
      const ws = rs / sum;
      const wg = rg / sum;
      const ww = rw / sum;
      const lerpAmount = reduceMotion ? 0.18 : 0.085;

      mesh.rotation.y = time * 0.045;
      mesh.rotation.x = -0.86 * wg - 0.58 * ww + Math.sin(time * 0.18) * 0.1;
      mesh.rotation.z = Math.sin(time * 0.11) * 0.08;

      for (let i = 0; i < count; i += 1) {
        const u = i / safeCount;
        const r1 = seedOne[i];
        const r2 = seedTwo[i];

        const sphereZ = 1 - 2 * u;
        const sphereR = Math.sqrt(Math.max(0, 1 - sphereZ * sphereZ));
        const sphereA = i * 2.39996322973 + time * 0.08;
        const pulse = 1 + 0.07 * Math.sin(sphereA * 7 + time * 2);
        const starRadius = 28 * pulse;
        const sx = Math.cos(sphereA) * sphereR * starRadius;
        const sy = sphereZ * starRadius;
        const sz = Math.sin(sphereA) * sphereR * starRadius;

        const arm = i % 5;
        const galaxyRadius = 7 + 93 * Math.sqrt(u);
        const galaxyNoise = (r1 - 0.5) * (4 + galaxyRadius * 0.035);
        const galaxyAngle = (arm * tau) / 5 + galaxyRadius * 0.078 * detail + time * 0.075;
        const gx = Math.cos(galaxyAngle) * (galaxyRadius + galaxyNoise);
        const gy = (r2 - 0.5) * 13 * Math.exp(-galaxyRadius / 62);
        const gz = Math.sin(galaxyAngle) * (galaxyRadius + galaxyNoise);

        const gridX = i % gridWidth;
        const gridZ = Math.floor(i / gridWidth);
        const px = (gridX / (gridWidth - 1) - 0.5) * 190;
        const pz = (gridZ / (gridRows - 1) - 0.5) * 190;
        const radiusSquared = px * px + pz * pz;
        const well = -68 / (1 + radiusSquared * 0.0032);
        const ripple = Math.sin(Math.sqrt(radiusSquared) * 0.22 - time * 1.8) * 4.5 * Math.exp(-radiusSquared / 7200);
        const wx = px;
        const wy = well + ripple;
        const wz = pz;

        target.set((sx * ws + gx * wg + wx * ww) * simScale, (sy * ws + gy * wg + wy * ww) * simScale, (sz * ws + gz * wg + wz * ww) * simScale);

        const index = i * 3;
        positions[index] += (target.x - positions[index]) * lerpAmount;
        positions[index + 1] += (target.y - positions[index + 1]) * lerpAmount;
        positions[index + 2] += (target.z - positions[index + 2]) * lerpAmount;

        const starHue = 0.38 + r1 * 0.04;
        const galaxyHue = 0.47 + r2 * 0.09;
        const wellHue = 0.41 + r1 * 0.08;
        const hue = (starHue * ws + galaxyHue * wg + wellHue * ww) % 1;
        const coreLift = 0.18 * Math.exp(-galaxyRadius / 35);
        const lightness = Math.min(0.88, 0.5 + 0.2 * ws + coreLift + 0.08 * ww);
        color.setHSL(hue, 0.92, lightness);
        color.toArray(colorBuffer, index);
      }

      const positionAttribute = geometry.getAttribute("position");
      const colorAttribute = geometry.getAttribute("color");
      positionAttribute.needsUpdate = true;
      colorAttribute.needsUpdate = true;
      renderer.render(scene, camera);
      frame += 1;
      if (!reduceMotion || frame < 2) raf = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (raf) window.cancelAnimationFrame(raf);
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <figure className="signal-swarm" aria-label={locale === "es" ? "Campo 3D de partículas para automatización con límites" : "3D particle field for bounded automation"}>
      <div ref={mountRef} className="signal-swarm-canvas" aria-hidden="true" />
      <figcaption>
        <span>cosmic scale journey</span>
        <strong>{locale === "es" ? "estrella, galaxia, campo curvo" : "star, galaxy, curved field"}</strong>
      </figcaption>
    </figure>
  );
}
