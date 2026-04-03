# Dynamic Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Framer Motion（`motion`パッケージ）によるアニメーションをポートフォリオサイトに追加し、「只者じゃない感」と「情報の受け取りやすさ」を両立する。

**Architecture:** `motion/react` の `motion.div`、`useInView`、`variants` を使い、Server Component構造を維持したまま Client Component としてアニメーションを注入する。ProfileHeader を別ファイルに抽出し、残りのセクションは `ScrollReveal` ラッパーで囲む。

**Tech Stack:** Next.js 15 App Router, React 19, motion (motion/react), Tailwind CSS

---

### Task 1: Install motion package

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install motion**

```bash
npm install motion
```

- [ ] **Step 2: Verify installation**

```bash
node -e "require('motion/react'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add motion package for animations"
```

---

### Task 2: Create MotionProvider

**Files:**
- Create: `components/animations/MotionProvider.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create MotionProvider component**

```tsx
// components/animations/MotionProvider.tsx
"use client";

import { MotionConfig } from "motion/react";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
}
```

- [ ] **Step 2: Add MotionProvider to layout.tsx**

In `app/layout.tsx`, add the import and wrap `{children}` inside `<body>`:

```tsx
import { MotionProvider } from "../components/animations/MotionProvider";

// ... existing metadata ...

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Run dev server and verify no errors**

```bash
npm run dev
```

Open http://localhost:3000 — page should render identically to before.

- [ ] **Step 4: Run type check**

```bash
npm run type-check
```

Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add components/animations/MotionProvider.tsx app/layout.tsx
git commit -m "feat: add MotionProvider with reducedMotion support"
```

---

### Task 3: Create ScrollReveal component

**Files:**
- Create: `components/animations/ScrollReveal.tsx`

- [ ] **Step 1: Create ScrollReveal component**

```tsx
// components/animations/ScrollReveal.tsx
"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
  amount?: number;
};

export function ScrollReveal({
  children,
  className,
  once = true,
  amount = 0.2,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Run type check**

```bash
npm run type-check
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/animations/ScrollReveal.tsx
git commit -m "feat: add ScrollReveal animation component"
```

---

### Task 4: Create StaggerChildren component

**Files:**
- Create: `components/animations/StaggerChildren.tsx`

- [ ] **Step 1: Create StaggerChildren component**

```tsx
// components/animations/StaggerChildren.tsx
"use client";

import { motion, useInView } from "motion/react";
import { useRef, Children, type ReactNode } from "react";

type StaggerChildrenProps = {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
};

const containerVariants = {
  hidden: {},
  visible: (staggerDelay: number) => ({
    transition: {
      staggerChildren: staggerDelay,
    },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export function StaggerChildren({
  children,
  className,
  staggerDelay = 0.05,
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      custom={staggerDelay}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {Children.map(children, (child) => (
        <motion.div variants={itemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
}
```

- [ ] **Step 2: Run type check**

```bash
npm run type-check
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/animations/StaggerChildren.tsx
git commit -m "feat: add StaggerChildren animation component"
```

---

### Task 5: Create CharacterReveal component

**Files:**
- Create: `components/animations/CharacterReveal.tsx`

- [ ] **Step 1: Create CharacterReveal component**

```tsx
// components/animations/CharacterReveal.tsx
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
    transition: { duration: 0.3, ease: "easeOut" },
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
```

- [ ] **Step 2: Run type check**

```bash
npm run type-check
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/animations/CharacterReveal.tsx
git commit -m "feat: add CharacterReveal animation component"
```

---

### Task 6: Extract and animate ProfileHeader

**Files:**
- Create: `components/ProfileHeader.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create animated ProfileHeader component**

```tsx
// components/ProfileHeader.tsx
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
  // CharacterReveal の終了タイミング（名前の文字数 × 0.04s + 0.3s）
  const nameRevealDuration = profileData.name.length * 0.04 + 0.3;

  return (
    <header className="mb-12">
      <div className="flex items-center gap-6 mb-6">
        {/* アバター: pop-in */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "backOut" }}
        >
          <Image
            src={profileData.avatar}
            alt={profileData.name}
            width={140}
            height={140}
            className="w-[140px] h-[140px] rounded-full object-cover border-4 border-border shadow-lg"
            priority
          />
        </motion.div>

        <div>
          {/* 名前: Character Reveal */}
          <h1 className="text-2xl font-semibold text-foreground">
            <CharacterReveal text={profileData.name} delay={0.3} />
          </h1>

          {/* 肩書き: fade-in after name */}
          <motion.p
            className="text-lg text-muted-foreground mb-2"
            {...fadeIn(0.3 + nameRevealDuration)}
          >
            {profileData.jobTitle}
          </motion.p>

          {/* Location: fade-in */}
          <motion.p
            className="text-sm text-muted-foreground"
            {...fadeIn(0.3 + nameRevealDuration + 0.15)}
          >
            {profileData.location}
          </motion.p>
        </div>
      </div>

      {/* 説明文: fade-in */}
      <motion.p
        className="text-muted-foreground max-w-2xl leading-relaxed mb-6"
        {...fadeIn(0.3 + nameRevealDuration + 0.3)}
      >
        {profileData.description}
      </motion.p>

      {/* ChatButton: fade-in */}
      <motion.div
        className="mb-6"
        {...fadeIn(0.3 + nameRevealDuration + 0.45)}
      >
        <ChatButton />
      </motion.div>

      {/* SNSリンク: stagger fade-in */}
      <motion.div
        className="flex gap-3 text-sm"
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
                transition: { duration: 0.3, ease: "easeOut" },
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
```

- [ ] **Step 2: Update page.tsx — remove old ProfileHeader, import new one**

Replace the entire `ProfileHeader` function and update imports in `app/page.tsx`:

Remove these lines from imports:
```
import Image from "next/image";
import { ChatButton } from "../components/ui/ChatButton";
```

Remove the entire `function ProfileHeader() { ... }` block (lines 20-68).

Add this import:
```tsx
import { ProfileHeader } from "../components/ProfileHeader";
```

The `ProfilePage` component stays the same — it already uses `<ProfileHeader />`.

- [ ] **Step 3: Run dev server and verify ProfileHeader animates**

```bash
npm run dev
```

Open http://localhost:3000 — avatar should pop in, name should type out character by character, remaining elements should fade in sequentially.

- [ ] **Step 4: Run type check and lint**

```bash
npm run type-check && npm run lint
```

Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add components/ProfileHeader.tsx app/page.tsx
git commit -m "feat: extract ProfileHeader with character reveal and entrance animations"
```

---

### Task 7: Add ScrollReveal to all sections in page.tsx

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add ScrollReveal import and wrap each section**

Add import at the top of `app/page.tsx`:
```tsx
import { ScrollReveal } from "../components/animations/ScrollReveal";
```

Wrap each `<section>` block inside the `<div className="space-y-16">` with `<ScrollReveal>`. For example, the Work Experience section becomes:

```tsx
<ScrollReveal>
  <section>
    <h2 className="text-lg font-medium mb-4 flex items-center gap-3">
      <span className="text-3xl">💼</span>
      Work Experience
    </h2>
    <WorkSection />
  </section>
</ScrollReveal>
```

Apply the same wrapping to all 10 sections: Work Experience, Projects, Skills, Expertise, Personality, Gallery, Hobbies, Credentials, My Family, Contact.

- [ ] **Step 2: Run dev server and verify scroll reveals**

```bash
npm run dev
```

Scroll down — each section should fade in from below as it enters the viewport.

- [ ] **Step 3: Run type check**

```bash
npm run type-check
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add ScrollReveal to all page sections"
```

---

### Task 8: Add StaggerChildren to Skills and Hobbies sections

**Files:**
- Modify: `components/sections/SkillsSection.tsx`
- Modify: `components/sections/HobbiesSection.tsx`

- [ ] **Step 1: Update SkillsSection with StaggerChildren**

```tsx
// components/sections/SkillsSection.tsx
import { Chip } from "../ui/Chip";
import { skills } from "../../lib/data";
import { StaggerChildren } from "../animations/StaggerChildren";

export function SkillsSection() {
  return (
    <StaggerChildren className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <Chip
          key={skill.text}
          text={skill.text}
          icon={skill.icon}
          style={skill.style}
        />
      ))}
    </StaggerChildren>
  );
}
```

- [ ] **Step 2: Update HobbiesSection with StaggerChildren**

```tsx
// components/sections/HobbiesSection.tsx
import { hobbies } from "../../lib/data";
import { Chip } from "../ui/Chip";
import { StaggerChildren } from "../animations/StaggerChildren";

export function HobbiesSection() {
  return (
    <StaggerChildren className="flex flex-wrap gap-2">
      {hobbies.map((hobby) => (
        <Chip key={hobby.text} {...hobby} />
      ))}
    </StaggerChildren>
  );
}
```

- [ ] **Step 3: Run dev server and verify chip pop-in stagger**

```bash
npm run dev
```

Scroll to Skills/Hobbies — chips should pop in one by one with scale bounce.

- [ ] **Step 4: Run type check**

```bash
npm run type-check
```

Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add components/sections/SkillsSection.tsx components/sections/HobbiesSection.tsx
git commit -m "feat: add staggered pop-in animation to Skills and Hobbies chips"
```

---

### Task 9: Add hover lift to Projects and fix CSS transition conflict

**Files:**
- Modify: `components/sections/ProjectsSection.tsx`

- [ ] **Step 1: Add motion hover to ProjectsSection**

Update `ProjectsSection.tsx` — add `"use client"` and `motion` import, wrap each `<article>` with `motion.article`, change `transition-all` to `transition-colors`:

```tsx
// components/sections/ProjectsSection.tsx
"use client";

import { motion } from "motion/react";
import { projects } from "../../lib/data";

export function ProjectsSection() {
  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <motion.article
          key={project.id}
          className="group border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors duration-200"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {project.projectImage && (
            <div className="mb-4">
              <img
                src={project.projectImage}
                alt={project.title}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="flex items-center gap-3 mb-3">
            {project.appIcon && (
              <img
                src={project.appIcon}
                alt={`${project.appName} logo`}
                className="w-10 h-10 rounded-lg object-contain bg-white"
              />
            )}
            <div className="flex-1">
              <h3 className="font-medium text-foreground">
                {project.appName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {project.appDescription}
              </p>
            </div>
            {project.status === "live" && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
              >
                View →
              </a>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag) => {
              let emoji = "";
              let bgColor = "bg-muted text-muted-foreground";

              if (tag === "AI") {
                emoji = "🤖";
                bgColor = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
              } else if (tag === "Product Design") {
                emoji = "🎨";
                bgColor = "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
              } else if (tag === "Engineering") {
                emoji = "💻";
                bgColor = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
              }

              return (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${bgColor}`}
                >
                  <span>{emoji}</span>
                  {tag}
                </span>
              );
            })}
          </div>
        </motion.article>
      ))}
    </div>
  );
}
```

Key change: `transition-all duration-200` → `transition-colors duration-200` to avoid CSS transform conflicting with Motion's `whileHover` y transform.

- [ ] **Step 2: Run dev server and verify hover lift**

```bash
npm run dev
```

Hover over project cards — they should lift up 4px smoothly while background color still changes.

- [ ] **Step 3: Run type check**

```bash
npm run type-check
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add components/sections/ProjectsSection.tsx
git commit -m "feat: add hover lift animation to project cards, fix CSS transition conflict"
```

---

### Task 10: Add fade-in to Gallery photos

**Files:**
- Modify: `components/PhotoGallery.tsx`

- [ ] **Step 1: Add motion fade-in to each gallery photo**

Update `PhotoGallery.tsx` — add `motion` and `useInView` imports, wrap each photo `<div>` with a motion wrapper that fades in with opacity only (no transform to avoid masonry layout issues):

```tsx
// components/PhotoGallery.tsx
"use client";

import { useState } from "react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Masonry from "react-masonry-css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { type PhotoType } from "../lib/data";

type PhotoGalleryProps = {
  photos: PhotoType[];
};

function GalleryImage({
  photo,
  index,
  onOpen,
}: {
  photo: PhotoType;
  index: number;
  onOpen: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="mb-4"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: index % 2 * 0.15 }}
      onClick={() => onOpen(index)}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        className="rounded-lg border border-border cursor-pointer transition-opacity hover:opacity-80"
      />
    </motion.div>
  );
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const breakpointColumnsObj = {
    default: 2,
    768: 2,
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto -ml-4"
        columnClassName="pl-4 bg-clip-padding"
      >
        {photos.map((photo, index) => (
          <GalleryImage
            key={photo.src}
            photo={photo}
            index={index}
            onOpen={openLightbox}
          />
        ))}
      </Masonry>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={photos}
        index={currentIndex}
      />
    </>
  );
}
```

Key decisions:
- Opacity only, no translateY — avoids masonry layout recalculation.
- `delay: index % 2 * 0.15` — left column photos appear slightly before right column, creating a subtle wave.
- `GalleryImage` extracted as a component so each photo has its own `useInView` ref.

- [ ] **Step 2: Run dev server and verify gallery fade-in**

```bash
npm run dev
```

Scroll to Gallery — photos should fade in as they enter viewport, with slight left-to-right stagger per row.

- [ ] **Step 3: Run type check**

```bash
npm run type-check
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add components/PhotoGallery.tsx
git commit -m "feat: add fade-in reveal to gallery photos"
```

---

### Task 11: Final verification and build check

**Files:** None (verification only)

- [ ] **Step 1: Run full type check**

```bash
npm run type-check
```

Expected: no errors

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: no errors (warnings acceptable)

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Expected: build succeeds. Confirm `app/page.tsx` is listed as a Server Component (static or dynamic, not client) in the build output.

- [ ] **Step 4: Visual verification**

```bash
npm run dev
```

Full scroll-through checklist:
1. ProfileHeader: avatar pops in, name types out character by character, cursor blinks then fades, remaining elements cascade in
2. Work Experience: fades in on scroll
3. Projects: fades in on scroll, cards lift on hover
4. Skills: fades in on scroll, chips pop in with stagger
5. Expertise: fades in on scroll
6. Personality: fades in on scroll
7. Gallery: photos individually fade in
8. Hobbies: fades in on scroll, chips pop in with stagger
9. Credentials: fades in on scroll
10. My Family: fades in on scroll
11. Contact: fades in on scroll
12. Dark mode toggle: animations work in both themes
13. Fast scroll: no janky animations or layout shifts

- [ ] **Step 5: Test reduced motion**

In browser DevTools → Rendering → check "Emulate CSS media feature prefers-reduced-motion: reduce". Reload page. All animations should be skipped — content appears immediately.

- [ ] **Step 6: Commit any fixes if needed**
