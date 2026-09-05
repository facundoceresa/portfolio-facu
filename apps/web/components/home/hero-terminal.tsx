"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type TerminalLine = {
  text: string;
  tone: "command" | "output" | "muted";
};

export function HeroTerminal({ summary }: { summary: string }) {
  const lines = useMemo<TerminalLine[]>(
    () => [
      { text: "$ whoami", tone: "command" },
      { text: "facundo.ceresa", tone: "output" },
      { text: "$ cat role.md", tone: "command" },
      { text: summary, tone: "muted" },
    ],
    [summary],
  );
  const [visibleLines, setVisibleLines] = useState<TerminalLine[]>([lines[0]]);
  const [typingLine, setTypingLine] = useState("");
  const [nextIndex, setNextIndex] = useState(1);
  const timerRef = useRef<number | undefined>(undefined);
  const sequenceRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== undefined) {
      window.clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    sequenceRef.current += 1;
    const sequence = sequenceRef.current;
    let cancelled = false;

    const setTimer = (callback: () => void, delay: number) => {
      timerRef.current = window.setTimeout(callback, delay);
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      clearTimer();
      setTimer(() => {
        if (cancelled || sequence !== sequenceRef.current) return;
        setVisibleLines(lines);
        setTypingLine("");
        setNextIndex(lines.length);
      }, 0);
      return () => {
        cancelled = true;
        sequenceRef.current += 1;
        clearTimer();
      };
    }

    const typeLine = (lineIndex: number) => {
      if (cancelled || sequence !== sequenceRef.current || lineIndex >= lines.length) return;
      const line = lines[lineIndex];
      let charIndex = 0;
      setTypingLine("");

      const typeNextChar = () => {
        if (cancelled || sequence !== sequenceRef.current) return;
        charIndex += 1;
        setTypingLine(line.text.slice(0, charIndex));

        if (charIndex < line.text.length) {
          setTimer(typeNextChar, line.tone === "command" ? 18 : 8);
          return;
        }

        setTimer(() => {
          if (cancelled || sequence !== sequenceRef.current) return;
          setVisibleLines((current) => [...current, line]);
          setTypingLine("");
          setNextIndex(lineIndex + 1);
          setTimer(() => typeLine(lineIndex + 1), line.tone === "command" ? 160 : 220);
        }, 90);
      };

      setTimer(typeNextChar, line.tone === "command" ? 180 : 90);
    };

    clearTimer();
    setTimer(() => {
      if (cancelled || sequence !== sequenceRef.current) return;
      setVisibleLines([lines[0]]);
      setTypingLine("");
      setNextIndex(1);
      setTimer(() => typeLine(1), 180);
    }, 0);

    return () => {
      cancelled = true;
      sequenceRef.current += 1;
      clearTimer();
    };
  }, [clearTimer, lines]);

  const revealNext = () => {
    sequenceRef.current += 1;
    clearTimer();

    if (nextIndex >= lines.length) {
      setVisibleLines([lines[0]]);
      setTypingLine("");
      setNextIndex(1);
      return;
    }

    setVisibleLines((current) => [...current, lines[nextIndex]]);
    setTypingLine("");
    setNextIndex((current) => current + 1);
  };

  const typingTone = lines[nextIndex]?.tone ?? "output";

  return (
    <button
      type="button"
      className="terminal-window scanline mt-7 block w-full text-left"
      aria-label="Terminal de perfil"
      onClick={revealNext}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          revealNext();
        }
      }}
    >
      <div className="mb-4 flex items-center justify-between border-b border-[color:var(--line)] pb-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[rgba(115,255,184,0.4)]" aria-hidden="true" />
          <span className="h-2 w-2 rounded-full bg-[rgba(115,255,184,0.4)]" aria-hidden="true" />
          <span className="h-2 w-2 rounded-full bg-[rgba(115,255,184,0.4)]" aria-hidden="true" />
          <span className="ml-2 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[color:var(--dim)]">~/ceresa</span>
        </div>
        <span className="pulse-dot h-2 w-2 bg-[color:var(--glow)]" aria-hidden="true" />
      </div>
      <div className="terminal-session font-mono text-[0.68rem] leading-5">
        {visibleLines.map((line, index) => (
          <p key={`${line.text}-${index}`} className={`terminal-line terminal-line-${line.tone}`}>
            {line.text}
          </p>
        ))}
        {typingLine ? <p className={`terminal-line terminal-line-${typingTone}`}>{typingLine}</p> : null}
        <span className="terminal-cursor mt-1 inline-block h-[10px] w-[7px] bg-[color:var(--glow)]" aria-hidden="true" />
      </div>
    </button>
  );
}
