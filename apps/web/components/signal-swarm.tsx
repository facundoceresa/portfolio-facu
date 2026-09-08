"use client";

import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 1280;

export function SignalSwarm({ locale }: { locale: "es" | "en" }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = reduceMotion ? 320 : PARTICLE_COUNT;
    const seedA = new Float32Array(count);
    const seedB = new Float32Array(count);
    const seedC = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      const ratio = i / Math.max(1, count - 1);
      seedA[i] = ratio * Math.PI * 2;
      seedB[i] = ((i * 89) % count) / count;
      seedC[i] = ((i * 233) % count) / count;
    }

    let width = 1;
    let height = 1;
    let raf = 0;
    const startedAt = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const time = reduceMotion ? 2.2 : (performance.now() - startedAt) / 1000;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(10, 21, 33, 0.72)";
      context.fillRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const scale = Math.min(width, height);
      const breath = 0.92 + Math.sin(time * 0.62) * 0.075;

      context.lineWidth = 1;
      for (let ring = 0; ring < 3; ring += 1) {
        context.strokeStyle = `rgba(115, 255, 184, ${0.08 + ring * 0.035})`;
        context.beginPath();
        context.ellipse(centerX, centerY, scale * (0.34 + ring * 0.075) * breath, scale * (0.16 + ring * 0.04), Math.sin(time * 0.28 + ring) * 0.22, 0, Math.PI * 2);
        context.stroke();
      }

      context.beginPath();
      context.moveTo(centerX - scale * 0.36, centerY);
      context.bezierCurveTo(centerX - scale * 0.14, centerY - scale * 0.26, centerX + scale * 0.14, centerY + scale * 0.26, centerX + scale * 0.36, centerY);
      context.stroke();

      context.globalCompositeOperation = "lighter";

      for (let i = 0; i < count; i += 1) {
        const base = seedA[i] * 4 + time * (0.22 + seedB[i] * 0.05);
        const phase = seedC[i] * Math.PI * 2;
        const lane = Math.sin(seedA[i] * 3);
        const knot = Math.sin(base * 2 + phase);
        const orbit = scale * (0.18 + seedB[i] * 0.23) * breath;
        const twist = Math.cos(base * 3 - time * 0.4 + phase);
        const depth = 0.72 + Math.sin(base + phase) * 0.24;
        const lobe = Math.sin(base) >= 0 ? -1 : 1;
        const x =
          centerX +
          lobe * scale * 0.18 +
          Math.cos(base) * orbit * depth +
          Math.cos(base * 0.5 + phase) * scale * 0.055;
        const y =
          centerY +
          Math.sin(base * 2) * orbit * 0.48 +
          knot * scale * 0.066 +
          lane * twist * scale * 0.025;
        const alpha = 0.2 + Math.abs(knot) * 0.28 + depth * 0.1;
        const size = 0.7 + depth * 1.35;

        context.fillStyle = `rgba(${66 + seedB[i] * 42}, 255, ${176 + seedC[i] * 42}, ${alpha})`;
        context.fillRect(x, y, size, size);
      }

      context.globalCompositeOperation = "source-over";
      const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, scale * 0.62);
      gradient.addColorStop(0, "rgba(115, 255, 184, 0.1)");
      gradient.addColorStop(0.48, "rgba(45, 212, 168, 0.04)");
      gradient.addColorStop(1, "rgba(10, 21, 33, 0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      if (!reduceMotion) raf = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <figure className="signal-swarm" aria-label={locale === "es" ? "Campo de señales con límites de automatización" : "Signal field with automation boundaries"}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <figcaption>
        <span>{locale === "es" ? "atractor acotado" : "bounded attractor"}</span>
        <strong>{locale === "es" ? "decisión, auditoría, fallback" : "decision, audit, fallback"}</strong>
      </figcaption>
    </figure>
  );
}
