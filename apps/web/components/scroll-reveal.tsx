"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

type ScrollRevealProps = {
  children: ReactNode;
  as?: "div" | "section" | "article" | "aside";
  className?: string;
  delay?: number;
  hover?: "card" | "surface" | "none";
  variant?: "lift" | "image" | "line" | "slide-left" | "slide-right" | "compress" | "trace";
};

const springTransition = {
  type: "spring" as const,
  duration: 0.5,
  bounce: 0.2,
};

export function ScrollReveal({
  children,
  as = "div",
  className,
  delay = 0,
  hover = "none",
  variant = "lift",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.18, margin: "0px 0px -96px 0px" });
  const visible = reduceMotion || inView;
  const MotionTag = motion[as];
  const initialTransform =
    variant === "image"
      ? "var(--reveal-image)"
      : variant === "line"
        ? "var(--reveal-line)"
      : variant === "slide-left"
        ? "var(--reveal-slide-left)"
        : variant === "slide-right"
          ? "var(--reveal-slide-right)"
          : variant === "compress"
            ? "var(--reveal-compress)"
            : variant === "trace"
              ? "var(--reveal-trace)"
              : "var(--reveal-lift)";
  const hoverTransform = hover === "card" ? "translate3d(0, -6px, 0) scale(1.012)" : hover === "surface" ? "translate3d(0, -3px, 0) scale(1.006)" : undefined;

  const props = {
    className: ["scroll-reveal", `scroll-reveal-${variant}`, className].filter(Boolean).join(" "),
    initial: reduceMotion
      ? false
      : {
          transform: initialTransform,
          filter: variant === "trace" ? "blur(2px)" : "blur(0px)",
          opacity: variant === "line" ? 0.76 : undefined,
          clipPath: variant === "line" ? "inset(0 0 14% 0)" : undefined,
        },
    animate: visible
      ? {
          transform: "translate3d(0, 0, 0) scale(1)",
          filter: "blur(0px)",
          opacity: 1,
          clipPath: variant === "line" ? "inset(0 0 0% 0)" : undefined,
        }
      : undefined,
    whileHover: !reduceMotion && hoverTransform ? { transform: hoverTransform } : undefined,
    whileTap: !reduceMotion && hover !== "none" ? { transform: "translate3d(0, -1px, 0) scale(0.992)" } : undefined,
    transition: { ...springTransition, delay: visible ? delay / 1000 : 0 },
  };
  const setRef = (element: HTMLElement | null) => {
    ref.current = element;
  };

  return <MotionTag ref={setRef} {...(props as ComponentPropsWithoutRef<typeof MotionTag>)}>{children}</MotionTag>;
}
