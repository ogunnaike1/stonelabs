# Handoff: Stone Labs — scroll-driven homepage

## READ FIRST — match this exactly
The client wants the production build to look and move **exactly like `Home.dc.html` does when opened in a browser** — treat that file as the pixel/motion spec, not a loose inspiration.

1. Open `Home.dc.html` in Chrome and scroll top to bottom, slowly and also upward, before writing code. Every timeline, offset and colour is in its `Component` class (`buildCinema`, `buildFooter`, `loadWorld`) and inline styles — port values verbatim (times, eases, px/vw/vh, hex colours).
2. **The client's browser renders the "no 3D" mode.** What they see (and approved) is the **DOM stage**: four stone-toned shapes (circle, wide rounded rect, tall pill, arch) plus the **two-stone travelling logo** that follows the dotted path and morphs. Build this DOM/SVG version as the primary, canonical experience. The Three.js scene in `world.js` (steel logo, rocks, turntable with four objects, process ring) is the progressive enhancement shown when WebGL works; when it is active the DOM shapes hide and the 3D logo replaces the travelling SVG logo (the footer ring logo handoff stays).
3. `reference/` contains screenshots of the real rendering (services chapter, work shapes, footer, travelling logo, contact and footer in their current light theme) and the original motion reference video for the hero's materials/depth. Compare your build against `06-contact-footer-current.png` and `01`/`02`/`04` for fidelity. (`03` and `05` are earlier iterations kept only for context: the footer and contact are now **light**, not black.)
4. Current theme order: hero light → services light → work **dark** → process light → contact stone `#F1EEE8→#E2DED5` → footer soft white. Only the Work chapter is dark.
5. Do not simplify motion. Everything is scrubbed by scroll and must reverse smoothly; hand-offs between chapters (logo path, shape deck → large work shape → ring tiles → logo halo) are the core of the design.
6. Verify in a real browser at 1440×900 and a 390×844 mobile viewport, plus `prefers-reduced-motion`.

## Overview
Single-page marketing site for **Stone Labs**, a creative digital studio (motion graphics, web development, mobile app development, 3D visualization). The whole homepage is one continuous, scroll-scrubbed sequence: hero → services → selected work → studio/process → contact → footer. A single logo travels from the top of the page to the footer, changing size, colour and shape.

## About the Design Files
The files in this bundle are **design references built in HTML** — prototypes that show intended look and behaviour, not production code to copy. Recreate them in the target codebase's environment (the brief asked for **Next.js + GSAP ScrollTrigger + React Three Fiber / Three.js**) using its own patterns. If no codebase exists, use Next.js (App Router) + TypeScript.

## Fidelity
**High-fidelity.** Colours, type, spacing and motion timings are final-intent. Recreate pixel-accurately; motion timing/easing values below are the source of truth.

## Files in this bundle
- `Home.dc.html` — the whole page: markup, styles (inline), and the GSAP choreography (class `Component` → `buildCinema`, `buildFooter`, `loadWorld`). Read the logic class for every timeline.
- `world.js` — Three.js persistent scene (logo extrusion, rocks, turntable, 4 service objects, process ring). Exports `createWorld(container, {state, mobile, idle, interactive})`; scroll code mutates a shared `state` object each frame.
- `stone-data.js` — all content (services, process steps, projects, contact, socials). **Placeholders marked `placeholder:true`.**
- `image-slot.js` — drag-and-drop image placeholder used for frames/cards (replace with real `<Image>`).
- `assets/logo.png`, `assets/logo-mark.png` — logo (transparent version is `logo-mark.png`, ink #111).

## Modes
1. **Cinema** (desktop, motion allowed, viewport height ≥ 380): hero section is **pinned** for `innerHeight × pace(0.26) × 35.5` px (mobile ×0.85) and one GSAP timeline (scrub 0.9; mobile 0.6) drives everything. Smooth scroll via Lenis (desktop only, optional).
2. **Flow** (`prefers-reduced-motion`, or very short viewports): static stacked sections, no pin, no scrub. A "Play animations" button lets a reduced-motion user opt in.
3. **No WebGL**: the 3D scene is replaced by a DOM stage (4 stone-toned cards: circle / wide rect / pill / arch) that follows the same choreography.

## Design Tokens
Colors: ink `#111111`, soft white `#F5F5F2`, pure white `#FFFFFF`, stone `#E4E0D8`, stone-dark `#D6D0C6`, graphite `#292929`, mid grey `#4a4743` / `#5f5b55`, muted `#8a857d`, silver `#BFC3C7`, brushed silver (3D) `#c4c8cc`, dark chapter bg `#171717→#111`.
Fonts: **Clash Display** 300/400/500/600 (headings, wordmark) and **Satoshi** 400/500/700 (UI/body) from Fontshare.
Type: hero wordmark 15vw/0.8 weight 300; chapter headings `clamp(38px,4.6vw,84px)` / `clamp(32px,3.4vw,60px)` weight 500, letter-spacing −0.015…−0.03em; eyebrow 12px uppercase +0.14em; body 15–16px / 1.55.
Radii: 2px buttons (old), pills 999px (navbar, CTA), cards per shape. Shadows: soft `0 40px 90px -28px rgba(17,17,17,.55)`.
Spacing: page gutters 6vw; chapter text blocks anchored bottom 8vh.

## Sections & handoffs (timeline units; 1 unit ≈ 0.26 viewport heights of scroll; TOTAL = 35.5)
Light = `#FFF→#EEEBE6` radial; dark = graphite; contact = stone `#F1EEE8→#E2DED5`.
1. **Hero (0–2.6)** light. Giant "STONE LABS" (letters split, fly toward camera on scroll). 3D steel logo between procedural rocks; camera dolly + pointer parallax. Three tilted white-bordered picture frames (Fig. 01–03) fly outward. Left/right labels fade out. Intro: letter-spacing tween, UI fades in.
2. **Hero → Services (1.85–3.6)** logo completes a turn and shrinks to an emblem; graphite turntable rises (`stageY −5.5 → −0.8`), spotlight on; four objects (display, laptop, phone, architectural model) rise from the disc (`rise0..3`). Ghost word "SERVICES" drifts right→left behind.
3. **Services (3.9–9.7)** light. Quarter turn per service every ~1.6 units (`turn` 0→3, ease power2.inOut 0.8s). Title/description wipe out left / in right (clip-path inset + x 56px). Four index segments fill.
4. **Services → Work (9.7–12)** turntable completes revolution while camera dollies to the motion display; background fades to graphite (SW+0.6, 1.2); text panel moves to the right column.
5. **Selected Work (12–23.2)** dark. Four showcases (motion display / laptop with scrolling website / phone with scrolling app / architectural model with camera orbit). Per project: camera pulls back → turns → dollies in (~1s), 3s hold. Counter 01–04 rolls; progress segments fill. Ghost word "WORK".
6. **Work → Process (23.2–25.6)** objects sink into the disc, camera rises to top-down (`phi 1.12`), background returns to light; logo drops into the centre; steel rim becomes a 4-step cycle with a bead drawing a trail (`prog 0→4`).
7. **Process (25.6–31.4)** light. Wheel rotates a quarter per step under a fixed reading point; vertical text clip-reveals; step list highlights.
8. **Process → Contact (31.4–35.5)** ring tilts upright into a halo around the logo; background → stone. Headline "Let's build something worth seeing." revealed line by line; CTA + email + socials.
9. **Footer (scroll-triggered, not pinned)** light. Infinite marquee (outlined/filled service words, skew from scroll velocity), headline lines rise, round "START A PROJECT" badge (rotating circular text, magnetic hover, elastic return), divider draws, 4 columns rise, second marquee in stone band, giant "STONE LABS" letters rise (hover hop), logo ring spinning with orbiting dot.

## The travelling logo (DOM mode)
Fixed full-viewport overlay with a dotted SVG path (Catmull-Rom through waypoints) and a drawn trail. The logo is an inline SVG made of **two stone paths** (outlines in `Home.dc.html`, viewBox `130 105 985 1055`). Its position is `path.getPointAtLength(u)` driven by a proxy tween per leg (power2.inOut). Waypoints (desktop, % of viewport): (50,52) → (40,46) → (86,20) → (82,15) → (60,20) → (30,52) → (70,48) then footer ring. Scales per leg `[1,1.08,.3,.3,.3,.5,.62]`; rotation −18° then 0, spins 360° through Process.
- **Shape morph**: deterministic function of timeline time. Keys `[start, shape, duration]` with power3.inOut: B(slabs) 0.3, L(logo) 1.9, A(two circles) 2.9, B/C(pills)/D(stacked circles) at each service, L at SW+0.1, B/C/D per project, R(concentric rings) WP+0.3, L at PC+0.1. Both stones have the same bezier segment counts (7 and 8) as the ellipse targets, so coordinates interpolate linearly.
- **Size multiplier per shape**: L 1, A 1.3, B .82, C 1.12, D .78, R 1.5, plus ±22% mid-transition bump (alternating).
- **Split/reform**: stones translate apart along (±0.27, ∓0.96) and rejoin at hero, services→work, contact.
- **Colour**: stone1/stone2 fills `#111/#111` → `#111/#8d9196` (services) → `#F5F5F2/#BFC3C7` (work, dark bg) → `#111/#a7a198` (process) → `#111/#8a857d` (contact/footer). Path trail follows.
- **Footer handoff**: ScrollTrigger from footer entering to ring at 80% viewport height; logo sways, morphs A→D→B→L, spins 720°, swells, lands on the footer ring logo (swap to the static ring SVG at progress 1). Reset pose when scrolling back above the start.

## Navbar
Three floating glass pills (backdrop-blur 18px): logo pill (left), section pill (centre, active section highlighted), "Start a Project →" pill (right) with circular arrow chip. Turns dark glass over the dark Work chapter. Mobile: logo pill, CTA, "Menu" pill → full-width card menu.

## Responsive / accessibility
- Mobile (<820px or portrait): shorter timeline (×0.85), fewer rocks (smaller), DPR cap 1.5, no Lenis, no hero frames, text blocks and objects stacked (objects upper area, text bottom).
- `prefers-reduced-motion`: Flow mode, static 3D frame rendered once, all content as normal sections.
- Skip link, semantic landmarks (`main`, `nav`, headings per section), 3D canvas `aria-hidden`, text always in DOM. Menu button has `aria-expanded`.

## State / data
- UI state: `dark` (header theme), `chap` (active nav index), `menu`, `webgl`, `mode`, `reduced`.
- Content lives in `stone-data.js` (services[4], process[4], projects[4], contact{email,socials[4]}). Projects accept `video` (motion display), `screen` (website/app screenshots; tall images scroll), `url` ("View project" link).

## Placeholders to replace
Email `hello@your-domain.com`, social links (`#`), all four projects (titles, summaries, media), hero frame images, card images.

## Assets
Logo supplied by the client (`logo.png`; traced as vector outlines for 3D and SVG). Fonts: Fontshare (Clash Display, Satoshi). No stock imagery.
