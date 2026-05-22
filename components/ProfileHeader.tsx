"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { ChatButton } from "./ui/ChatButton";
import { CharacterReveal } from "./animations/CharacterReveal";
import { profileData } from "../lib/data";

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

export function ProfileHeader() {
  const nameRevealDuration = profileData.name.length * 0.04 + 0.3;

  return (
    <header className="mb-12">
      <div className="flex flex-col items-center sm:flex-row sm:items-center gap-6 mb-6">
        <motion.div
          className="shrink-0"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "backOut" }}
        >
          <Image
            src={profileData.avatar}
            alt={profileData.name}
            width={140}
            height={140}
            className="w-20 h-20 sm:w-[140px] sm:h-[140px] rounded-full object-cover border-4 border-border shadow-lg"
            priority
          />
        </motion.div>

        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-semibold text-foreground">
            <CharacterReveal text={profileData.name} delay={0.3} glitch />
          </h1>

          <motion.p
            className="text-lg text-muted-foreground mb-2"
            {...fadeIn(0.3 + nameRevealDuration)}
          >
            {profileData.jobTitle}
          </motion.p>

          <motion.p
            className="text-sm text-muted-foreground"
            {...fadeIn(0.3 + nameRevealDuration + 0.15)}
          >
            {profileData.location}
          </motion.p>
        </div>
      </div>

      <motion.p
        className="text-muted-foreground max-w-2xl leading-relaxed mb-6"
        {...fadeIn(0.3 + nameRevealDuration + 0.3)}
      >
        {profileData.description}
      </motion.p>

      <motion.div
        className="mb-6"
        {...fadeIn(0.3 + nameRevealDuration + 0.45)}
      >
        <ChatButton variant="inline" />
      </motion.div>

      <motion.div
        className="flex flex-wrap gap-3 text-sm"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08,
              delayChildren: 0.3 + nameRevealDuration + 0.55,
            },
          },
        }}
      >
        {profileData.socialLinks.map((link) => (
          <motion.a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors underline"
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.3, ease: "easeOut" as const },
              },
            }}
          >
            {link.name === "X (Twitter)" ? "𝕏" : link.name}
          </motion.a>
        ))}
      </motion.div>
    </header>
  );
}
