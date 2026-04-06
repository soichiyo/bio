"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";

type CharacterRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  glitch?: boolean;
};

const containerVariants = {
  hidden: {},
  visible: (delay: number) => ({
    transition: {
      staggerChildren: 0.04,
      delayChildren: delay,
    },
  }),
};

const charVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

// ランダムなグリッチ文字
const glitchChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>/\\|";
function randomGlitchChar() {
  return glitchChars[Math.floor(Math.random() * glitchChars.length)];
}

function GlitchPhase({
  text,
  duration,
  onComplete,
}: {
  text: string;
  duration: number;
  onComplete: () => void;
}) {
  const [display, setDisplay] = useState<string[]>([]);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // 初回セット + ランダム文字をバチバチ切り替える
    setDisplay(text.split("").map(() => randomGlitchChar()));
    const interval = setInterval(() => {
      setDisplay(text.split("").map(() => randomGlitchChar()));
    }, 50);

    // duration後にグリッチ終了
    const timer = setTimeout(() => {
      clearInterval(interval);
      setOpacity(0);
      onComplete();
    }, duration * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [text, duration, onComplete]);

  return (
    <span
      aria-hidden="true"
      className="inline-block"
      style={{ opacity, position: "relative" }}
    >
      {/* メインのグリッチテキスト */}
      <span>{display.join("")}</span>
      {/* RGBずれ - 赤 */}
      <span
        style={{
          position: "absolute",
          top: 0,
          left: "2px",
          color: "rgba(255, 0, 0, 0.4)",
          clipPath: "inset(10% 0 60% 0)",
        }}
      >
        {display.join("")}
      </span>
      {/* RGBずれ - シアン */}
      <span
        style={{
          position: "absolute",
          top: 0,
          left: "-2px",
          color: "rgba(0, 255, 255, 0.4)",
          clipPath: "inset(50% 0 10% 0)",
        }}
      >
        {display.join("")}
      </span>
    </span>
  );
}

export function CharacterReveal({
  text,
  className,
  delay = 0,
  glitch = false,
}: CharacterRevealProps) {
  const [showCursor, setShowCursor] = useState(true);
  const [glitchDone, setGlitchDone] = useState(!glitch);

  const glitchDuration = 0.4;
  const effectiveDelay = glitch ? delay + glitchDuration : delay;

  useEffect(() => {
    const totalDuration = effectiveDelay + text.length * 0.04 + 0.3;
    const timer = setTimeout(
      () => setShowCursor(false),
      (totalDuration + 1.5) * 1000
    );
    return () => clearTimeout(timer);
  }, [effectiveDelay, text.length]);

  return (
    <span
      className={className}
      aria-label={text}
      style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}
    >
      {/* 透明なテキストでスペースを確保（レイアウトシフト防止） */}
      <span style={{ visibility: "hidden" }} aria-hidden="true">
        {text}
      </span>

      {/* グリッチフェーズ — 確保したスペースの上に重ねる */}
      {glitch && !glitchDone && (
        <span style={{ position: "absolute", top: 0, left: 0 }}>
          <GlitchPhase
            text={text}
            duration={glitchDuration}
            onComplete={() => setGlitchDone(true)}
          />
        </span>
      )}

      {/* Character Revealフェーズ — 同じく重ねる */}
      <motion.span
        style={{ position: "absolute", top: 0, left: 0 }}
        variants={containerVariants}
        custom={effectiveDelay}
        initial="hidden"
        animate={glitchDone ? "visible" : "hidden"}
      >
        {text.split("").map((char, i) => (
          <motion.span key={i} variants={charVariants} aria-hidden="true">
            {char}
          </motion.span>
        ))}
        {showCursor && (
          <motion.span
            aria-hidden="true"
            className="inline-block ml-0.5"
            animate={{ opacity: [1, 0] }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            |
          </motion.span>
        )}
      </motion.span>
    </span>
  );
}
