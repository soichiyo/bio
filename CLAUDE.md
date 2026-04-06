# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio/bio website for Soichiro Yoshimura, built with Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS. Single-page design with multiple sections.

## Commands

- **Dev server:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Type check:** `npm run type-check`

No test framework is configured.

## Architecture

### Data-Driven Design

All content is centralized in `lib/data.ts`. Profile info, work experiences, projects, skills, credentials, photos, and family data are exported as typed constants. Section components consume this data directly — there is no CMS or API layer.

Type definitions live in `types/index.ts`.

### Component Structure

- `app/page.tsx` — Home page that composes all section components
- `components/sections/` — 10 page sections (Work, Projects, Skills, Expertise, Gallery, Hobbies, Credentials, MyFamily, PersonalCharacteristics, Contact)
- `components/ui/` — Reusable primitives (ThemeToggle, ChatButton, ChatModal, Chip, CredentialItem)
- `components/` — Mid-level components (Header, Section, ProjectCard, PhotoGallery, SimpleCard, etc.)

### Styling

Tailwind CSS with CSS custom properties (HSL) defined in `app/globals.css`. Dark mode uses class-based toggling with localStorage persistence (`components/ui/ThemeToggle.tsx`). The `tailwindcss-animate` plugin is used for animations.

Utility function `cn()` from `lib/utils.ts` merges Tailwind classes via `clsx` + `tailwind-merge`.

### Key Integrations

- **AI Chat:** Dify-powered chat modal (`components/ui/ChatModal.tsx` + `ChatButton.tsx`)
- **Photo Gallery:** `react-masonry-css` layout + `yet-another-react-lightbox` viewer
- **Icons:** `lucide-react`

### Path Aliases

- `@/*` → root
- `@/components/*` → `./components/*`
- `@/lib/*` → `./lib/*`
- `@/app/*` → `./app/*`

## Conventions

- Content is in mixed Japanese and English
- Images go in `public/assets/` organized by category (app, company, photos, projects, skills)
- ESLint extends `next/core-web-vitals` and `next/typescript`; use Next.js `<Image>` instead of `<img>`
