# AGENTS.md

This file provides guidance to coding agents working in this repository.

## Project Overview

Personal portfolio/bio website for Soichiro Yoshimura. The site is built with Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Motion, and lucide-react.

The current product direction is **Personal Telemetry OS**: a Nothing-inspired, dot-matrix, industrial dashboard that presents Soichiro's work, coaching, writing, projects, family, and contact channels as readable system signals.

## Commands

- **Dev server:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Type check:** `npm run type-check`
- **Test:** `npm test`

For UI changes, run at least `npm run type-check` and `npm run lint`, then spot-check `http://localhost:3000/` in the browser.

## Architecture

### Data-Driven Content

Portfolio content is split by domain under `content/` and re-exported from `content/index.ts`. Profile info, work experiences, projects, skills, expertise, writings, credentials, photos, hobbies, and family data are exported as typed constants. Section components consume this data directly; there is no CMS or database layer.

Type definitions live in `content/types.ts`.

### Page Composition

- `app/layout.tsx` — metadata, global CSS, and `MotionProvider`.
- `app/page.tsx` — selects `TelemetryBioPage` by default. `?design=legacy` or `BIO_DESIGN_VARIANT=legacy` selects `LegacyBioPage`; both are in `components/pages/`.
- `components/PersonalOSDashboard.tsx` — main telemetry dashboard surface.
- `components/SectionRail.tsx` — fixed left section navigator for desktop/tablet.
- `components/sections/` — detailed content sections below the dashboard.
- `components/ui/` — reusable primitives such as `ThemeToggle`, `ChatButton`, `ChatModal`, `Chip`, and `CredentialItem`.
- `components/animations/` — Motion provider and reveal helpers.

### Personal Telemetry Dashboard

`PersonalOSDashboard` is the current first impression of the site. Keep it characterful but readable. Important modules include:

- Identity Core
- Current Signal
- Coaching Meter
- Product Log
- Capability Matrix
- Writing Transmission
- Human Network
- Optical Archive
- Public Channels
- Contact Beacon

When editing the dashboard:
- Preserve mobile behavior. Several cards use different layouts at `sm`, `md`, and `lg`.
- Avoid `h-full` inside card bodies unless the parent height is explicitly safe; cards use `overflow-hidden`, so child height mistakes can clip buttons.
- Keep the Contact Beacon red accent rare and intentional.
- Do not make telemetry values look arbitrary; tie them to `content/` where possible.

## Styling

Tailwind CSS is used with CSS custom properties in `app/globals.css`.

Current visual language:
- Dark-first UI with light mode support.
- Dot-matrix and segmented data surfaces.
- Industrial borders, hairlines, module labels, and scanline hover passes.
- `Doto` for hero dot numerals only.
- `Space Mono` for uppercase labels, metadata, and numeric readouts.
- `Space Grotesk` for readable headings and body text.
- One rare red signal: `#D71921`.

Reusable classes such as `telemetry-card`, `telemetry-label`, `telemetry-rule`, `led-dot`, `dot-pulse`, `font-display-dot`, and `font-data` live in `app/globals.css`.

## AI Chat

The site has a persistent `ChatButton` CTA and a `ChatModal`.

- UI: `components/ui/ChatButton.tsx`, `components/ui/ChatModal.tsx`
- API: `app/api/chat/route.ts`
- Prompt assembly: `lib/chat-prompt.ts`
- Knowledge files: `lib/knowledge/self-analysis.md`, `lib/knowledge/resume.md`
- Safety/rate helpers: `lib/input-validator.ts`, `lib/rate-limiter.ts`

The chat uses Vercel AI SDK (`ai`, `@ai-sdk/react`) with an OpenAI-compatible Kimi/Moonshot provider. Required env vars include `KIMI_API_KEY`; `KIMI_BASE_URL` and `KIMI_MODEL` are optional overrides.

## Images

Use Next.js `<Image>` for local images where practical. Images live under `public/assets/`, organized by category:

- `public/assets/app/`
- `public/assets/company/`
- `public/assets/photos/`
- `public/assets/projects/`
- `public/assets/skills/`

Project banner images are very wide (`697x138`). On mobile, keep them aspect-preserving rather than forcing tall cropped banners.

## Path Aliases

- `@/*` → repo root
- `@/components/*` → `./components/*`
- `@/lib/*` → `./lib/*`
- `@/app/*` → `./app/*`

## Git And Release Notes

Use small `codex/*` branches for changes. The usual release path is:

1. Make the change.
2. Run `npm run type-check` and `npm run lint`.
3. Spot-check locally at `http://localhost:3000/`.
4. Commit only intentional source changes.
5. Open a PR against `main`.
6. Wait for Vercel preview checks.
7. Merge.
8. Confirm Vercel production is `Ready`.

Do not commit generated/local artifacts such as:
- `.playwright-mcp/`
- `tsconfig.tsbuildinfo`
- `.next/`
- `.vercel/`

`next-env.d.ts` may gain a generated `./.next/types/routes.d.ts` reference after type checks. Do not commit that churn unless the project intentionally adopts that generated reference.

## Conventions

- Content is mixed Japanese and English.
- Prefer existing data and local component patterns over new abstractions.
- Keep frontend changes responsive and verify mobile layouts.
- Avoid external UI frameworks or new design systems.
- Avoid emoji-led interface language on the main telemetry surface.
- Preserve the site as a personal bio first; the OS/dashboard metaphor should support readability, not obscure it.
