"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";

type CharacterRevealProps = {
  text: string;
  className?: string;
  delay?: number;
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

export function CharacterReveal({
  text,
  className,
  delay = 0,
}: CharacterRevealProps) {
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const totalDuration = delay + text.length * 0.04 + 0.3;
    const timer = setTimeout(
      () => setShowCursor(false),
      (totalDuration + 1.5) * 1000
    );
    return () => clearTimeout(timer);
  }, [delay, text.length]);

  return (
    <motion.span
      className={className}
      aria-label={text}
      variants={containerVariants}
      custom={delay}
      initial="hidden"
      animate="visible"
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
  );
}
