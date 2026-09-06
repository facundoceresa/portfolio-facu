"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  as?: "div" | "section" | "article" | "aside";
  className?: string;
  delay?: number;
  variant?: "lift" | "image" | "line";
};

export function ScrollReveal({
  children,
  as = "div",
  className,
  delay = 0,
  variant = "lift",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const show = () => {
      element.dataset.visible = "true";
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.dataset.revealReady = "true";

    if (reduceMotion || !("IntersectionObserver" in window)) {
      show();
      return;
    }

    const rect = element.getBoundingClientRect();
    const isAlreadyInView = rect.top < window.innerHeight * 0.88 && rect.bottom > 0;

    if (isAlreadyInView) {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        show();
        observer.disconnect();
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.16 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const revealProps = {
    className: ["scroll-reveal", `scroll-reveal-${variant}`, className].filter(Boolean).join(" "),
    style: { "--reveal-delay": `${delay}ms` } as CSSProperties,
  };
  const setRef = (element: HTMLElement | null) => {
    ref.current = element;
  };

  if (as === "section") return <section ref={setRef} {...revealProps}>{children}</section>;
  if (as === "article") return <article ref={setRef} {...revealProps}>{children}</article>;
  if (as === "aside") return <aside ref={setRef} {...revealProps}>{children}</aside>;
  return <div ref={setRef} {...revealProps}>{children}</div>;
}
