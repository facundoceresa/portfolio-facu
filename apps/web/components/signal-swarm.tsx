"use client";

import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 420;

export function SignalSwarm({ locale }: { locale: "es" | "en" }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = reduceMotion ? 120 : PARTICLE_COUNT;
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
      context.fillStyle = "rgba(10, 21, 33, 0.5)";
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      const centerX = width * 0.5;
      const centerY = height * 0.52;
      const radius = Math.min(width, height) * 0.34;
      const breath = 0.86 + Math.sin(time * 0.7) * 0.08;

      for (let i = 0; i < count; i += 1) {
        const angle = seedA[i] + time * (0.18 + seedB[i] * 0.16);
        const lane = seedB[i] * 2 - 1;
        const curl = Math.sin(angle * 3 + time * 0.9 + seedC[i] * 7);
        const ring = radius * (0.36 + seedC[i] * 0.72) * breath;
        const x = centerX + Math.cos(angle + curl * 0.24) * ring + lane * width * 0.08;
        const y = centerY + Math.sin(angle * 1.6) * ring * 0.54 + curl * height * 0.08;
        const alpha = 0.16 + Math.abs(curl) * 0.26;
        const size = 0.7 + seedC[i] * 1.4;

        context.fillStyle = `rgba(${82 + seedB[i] * 35}, 255, ${184 + seedC[i] * 28}, ${alpha})`;
        context.fillRect(x, y, size, size);
      }

      context.globalCompositeOperation = "source-over";
      const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.35);
      gradient.addColorStop(0, "rgba(115, 255, 184, 0.12)");
      gradient.addColorStop(0.55, "rgba(45, 212, 168, 0.04)");
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
        <span>{locale === "es" ? "campo acotado" : "bounded field"}</span>
        <strong>{locale === "es" ? "IA sólo donde deja trazabilidad" : "AI only where traceability remains"}</strong>
      </figcaption>
    </figure>
  );
}
