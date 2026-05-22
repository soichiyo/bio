# Design Direction — Personal Telemetry OS

## Concept

This portfolio is not a resume page with decorative motion. It is a personal operating surface for Soichiro Yoshimura: work, coaching, product craft, writing, photography, family, and personality expressed as live signals.

The visitor should feel they are observing a person in motion, not reading a static profile.

## Core Principle

**Readable bio first, characterful system second.**

The site must still let recruiters, collaborators, and friends quickly understand who Soichiro is, what he has done, and how to contact him. The design earns its personality through structure, typography, rhythm, and small mechanical behaviors.

## Design DNA

### Dot Matrix as Structure

Dots are used to express signal density, capability matrices, status, and activity. They are not confetti. If a dot appears, it should imply state, rhythm, history, or telemetry.

### Industrial Transparency

Expose the structure: hairline borders, module IDs, labels, timestamps, coordinate-like grids, visible sections, and deliberate empty space. Cards should feel like instruments, not marketing tiles.

### One Red Signal

Nothing red is rare and earned. Use `#D71921` only as the primary beacon, preferably for contact or current availability. It should not become an ambient accent.

### Telemetry Over Decoration

Every animated element should read as data: a metric counting up, a ticker transmitting writing, a signal pulsing, a meter filling, a scanline checking a module. Motion should settle unless it represents ongoing life.

### Human Layer Inside the Machine

The OS language should not erase warmth. Family, coaching, photography, and personality are not side notes; they are the human signal inside the system.

## Typography

- `Doto`: hero numerals and dot-matrix display moments only.
- `Space Mono`: uppercase labels, status text, metadata, numeric readouts.
- `Space Grotesk`: names, section titles, body copy, readable interface text.

Avoid casual emoji-led headings in the main system surface. Use labels, IDs, and structured language instead.

## Layout Strategy

### Top Surface

Create a high-impact `PersonalOSDashboard` above the detailed bio sections.

Recommended modules:

- Identity Core: name, roles, current mode, location.
- Current Signal: Studio Prairie and current responsibility.
- Coaching Meter: 850+ hours and certifications.
- Product Log: LINE, Lovegraph, THE COACH, Studio Prairie.
- Writing Ticker: Zenn and note transmissions.
- Skill Matrix: capability signal field.
- Family Nodes: human network.
- Contact Beacon: the single red signal.

### Detail Sections

Below the dashboard, keep the page readable with calmer sections:

- Career Log / Work Experience
- Modules / Projects
- Transmission Log / Writings
- Capability Matrix / Skills and Expertise
- Inner Telemetry / Personality
- Optical Archive / Gallery
- Human Network / Family
- Beacon / Contact

## Motion Rules

- Count important numbers on first render.
- Fill segmented meters in sequence.
- Let tickers and live clocks move continuously.
- Use LED pulses sparingly.
- Add scanline hover passes on system cards.
- Support reduced motion.

Do not animate every section. The top surface can feel alive; the long-form content should feel calm and readable.

## Implementation Notes

- Keep content centralized in `lib/data.ts`.
- Prefer small reusable dashboard primitives over one giant component when the pattern repeats.
- Use existing Next.js, React, Tailwind, Motion, and lucide dependencies.
- Do not introduce a design system or external UI framework.
- Validate with `npm run type-check` and `npm run build`.

## Design Variants

The site keeps both the calmer legacy bio and the Personal Telemetry OS surface
available so the first impression can be switched without reverting commits.

- `telemetry`: the default dashboard-first Personal Telemetry OS surface.
- `legacy`: the one-column profile page with the avatar header and emoji-led
  sections.

Switch locally with URL params:

- `/` or `/?design=telemetry`
- `/?design=legacy`

Switch the default deployment by setting `BIO_DESIGN_VARIANT=legacy` or
`BIO_DESIGN_VARIANT=telemetry`.
