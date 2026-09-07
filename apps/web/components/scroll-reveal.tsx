"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { motion, useAnimationControls, useInView, useReducedMotion } from "motion/react";

type ScrollRevealProps = {
  children: ReactNode;
  as?: "div" | "section" | "article" | "aside";
  className?: string;
  delay?: number;
  hover?: "card" | "surface" | "none";
  variant?: "lift" | "image" | "line";
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
  const controls = useAnimationControls();
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.18, margin: "0px 0px -96px 0px" });
  const visible = reduceMotion || inView;
  const MotionTag = motion[as];
  const initialTransform = variant === "image" ? "translate3d(0, 0, 0) scale(0.985)" : "translate3d(0, 18px, 0) scale(0.985)";
  const hoverTransform = hover === "card" ? "translate3d(0, -6px, 0) scale(1.012)" : hover === "surface" ? "translate3d(0, -3px, 0) scale(1.006)" : undefined;

  useEffect(() => {
    if (!visible) return;
    if (reduceMotion) {
      void controls.set({ opacity: 1, transform: "translate3d(0, 0, 0) scale(1)", clipPath: "inset(0 0 0 0)" });
      return;
    }

    controls.set({
      opacity: 0,
      transform: initialTransform,
      clipPath: variant === "image" ? "inset(0 0 18% 0)" : "inset(0 0 0 0)",
    });

    const frame = window.requestAnimationFrame(() => {
      void controls.start({
        opacity: 1,
        transform: "translate3d(0, 0, 0) scale(1)",
        clipPath: "inset(0 0 0 0)",
        transition: { ...springTransition, delay: delay / 1000 },
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [controls, delay, initialTransform, reduceMotion, variant, visible]);

  const props = {
    className: ["scroll-reveal", `scroll-reveal-${variant}`, className].filter(Boolean).join(" "),
    animate: controls,
    whileHover: !reduceMotion && hoverTransform ? { transform: hoverTransform } : undefined,
    whileTap: !reduceMotion && hover !== "none" ? { transform: "translate3d(0, -1px, 0) scale(0.992)" } : undefined,
    transition: springTransition,
  };
  const setRef = (element: HTMLElement | null) => {
    ref.current = element;
  };

  return <MotionTag ref={setRef} {...(props as ComponentPropsWithoutRef<typeof MotionTag>)}>{children}</MotionTag>;
}
