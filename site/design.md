# Big Vision — Master Design Document
> The complete blueprint for the Big Vision landing page: a night gallery above the clouds.
> Every value in this document is normative. If the build and this document disagree, this document wins.

**Theme:** dark · **Stack:** static HTML/CSS/JS · Three.js (WebGL scene) · GSAP + ScrollTrigger (choreography) · Lenis (smooth scroll)
**Branch:** `redesign-3d` · **Files:** `site/index.html` · `site/css/style.css` · `site/js/scene.js` · `site/js/main.js`

---

## 1 · Concept

Big Vision's landing page is a **night-time observatory**. The interface is a quiet, near-achromatic
gallery chrome; the WebGL scene — storm clouds, the floating wing sigil, a rising signal beam — is the
artwork and supplies every drop of color and drama. The visitor's scroll is a **cinematic journey**:

> Arrive above the clouds → dive through the storm (the problem) → surface into the gallery
> (services, proof, fit, voices) → rise back above the clouds to act ("Now be seen").

### Design pillars
1. **The scene is the artwork; the UI is the frame.** UI chrome stays achromatic: white ink, slate body, one blue accent.
2. **Objects, not cards.** Pills (999px), scene windows (48px), panels (16px). Nothing else.
3. **One source of energy.** The signal gradient #31A2F3→#2213C4 appears only as punctuation.
4. **Whisper elevation.** One shadow token; separation by contrast and spacing, never borders + glows stacked.
5. **Typographic confidence.** Tight tracking, capped weights, hierarchy from size only.
6. **Gallery rhythm.** 96px between acts, hairline dividers, no background bands.

---

## 2 · Tokens

### 2.1 Colors
| Token | Value | Role |
|---|---|---|
| `--color-void` | `#07090f` | Page canvas. Also the WebGL scene background/fog (must match exactly) |
| `--color-panel` | `#11141c` | Object surfaces (form, inputs at 85% alpha) |
| `--color-panel-deep` | `#1a1e29` | Recessed wells |
| `--color-ink` | `#ffffff` | Headings, primary text |
| `--color-slate-muted` | `#adb4c2` | Body copy |
| `--color-slate-faint` | `#6b7280` | Captions, labels at rest, ticks |
| `--color-signal-light` | `#31a2f3` | Accent punctuation, focus rings |
| `--color-signal-deep` | `#2213c4` | Gradient end only — never alone |
| `--gradient-signal` | `90deg, #31a2f3 → #2213c4` | CTA fill, underline reveals, rail fill |
| `--gradient-signal-text` | `135deg, #7dd3fc → #31a2f3 45% → #4f46e5` | Text-clipped accent (headline accent line, numerals, quote marks, + markers) |
| `--color-sky-glow` | `#7dd3fc` | Inside the 3D scene + tiny captions only |
| `--color-edge` | `rgba(255,255,255,0.07)` | All hairlines |

### 2.2 Typography
| Use | Family | Weight | Case | Tracking |
|---|---|---|---|---|
| Display & headings | 'Integral CF' → Montserrat | 800 (900 banned) | UPPER | -0.01em / 0 |
| Subheads, quotes | Montserrat | 500–700 | sentence | -0.02em |
| Body | Roboto Mono | 400 | sentence | -0.02em |
| Labels / nav / buttons / kickers | Roboto Mono | 500 | UPPER | +0.18em (+0.22em kickers) |

Scale: caption 11 · label 12 · body-sm 14 · body 16 · subhead 20 · h-sm 26 · h 40 · h-lg 56 · display `clamp(64px, 9vw, 128px)` (line-height 0.95–0.98 at display).

### 2.3 Shape, spacing, elevation
- Radii: **999px** pills · **48px** scene windows (28px <768px) · **16px** panels · **4px** details. No other values.
- Spacing scale: 4 / 12 / 16 / 24 / 48 / 96 / 160. Acts separated by 96px padding.
- Max widths: page 1400px, text columns 720px, CTA column 640px.
- Elevation: `--shadow-whisper: rgba(0,0,0,0.35) 0 8px 24px -12px`. Only `.btn-primary` may glow (`0 0 32px rgba(49,162,243,.3)`).
- Film grain: fixed overlay, 3% opacity, steps(4) shuffle — the one permitted texture.

---

## 3 · The WebGL scene (`scene.js`)

One scene serves the whole page, rendered to a **fixed full-viewport canvas at z-0**.
Sections decide how much of it is visible.

| Element | Spec |
|---|---|
| Background/fog | `#07090f`, Fog(14, 46) — identical to canvas token |
| Stars | 2200 points (900 mobile), additive, 0.16 size, slow y-rotation 0.004 rad/s |
| Sparkles | 140 points near logo, additive sky-glow, drift + bob |
| Cloud deck | 44 wide-flat sprites (1.9:0.8 ratio), y ≈ −6.6±0.9, scale 5–9, tints #10182c→#24365c, opacity 0.38–0.6; fake-lit by distance to source (lerp toward #3a6cc0, pulsing with glow) |
| High wisps | 8 sprites, y 10–18, far z, opacity 0.2 |
| Logo | Brand SVG path extruded (depth 5, bevel 1.1/0.85), scale 0.085, at (0, 3.1, 0); metalness 0.9, roughness 0.24; emissive #1d4ed8 base 0.08 |
| Signal beam | Two textured trapezoid shafts (gaussian horizontal falloff), source point (0,−5.6,0.4) → logo; outer 0.18→1.5 wide, core 0.07→0.7; additive; yaw-billboarded to camera |
| Source orb | 0.16 sphere at beam source, breathing 0.85±0.15 |
| Light pulse | Every 3.2s an orb travels source→logo (62% of cycle); on arrival logo emissive flares to ~0.5 then decays; beam, fill light and cloud glow ride the same pulse |
| Camera | fov 44 at (0, 0.8, 13.5); mouse parallax ±1.3 x / ±0.5 y, lerp 0.08–0.1 |
| Scroll drive | `S.dive` 0→1: camera y 0.8→−36, z 13.5→10 (through the deck). `S.rise` 0→1: returns to y 1.6, z 15.5, lookAt logo |
| Post | UnrealBloom strength 0.55 (0.4 mobile), radius 0.7, threshold 0.3 + Output pass. DPR cap 1.75 |

---

## 4 · Page architecture

```
PRELOADER
NAV (fixed, typographic)            RAIL (right, scroll progress)   GRAIN   CURSOR
└── MAIN
    ACT 1  #hero      100vh   transparent + SCENE WINDOW frame
    ACT 2  #dive      100vh   pinned +260%, full-bleed scene (cinematic exception)
    ───────  marquee strip  ───────
    ACT 3  #services  solid   index list + cursor-follow preview
    ACT 4  #proof     solid   bare numerals + scene-window banner
    ACT 5  #different solid   editorial fit columns
    ACT 6  #voices    solid   typographic quotes
    ACT 7  #contact   100vh   transparent + SCENE WINDOW frame (camera risen)
FOOTER  giant outlined wordmark
```

**Scene Window** = `.scene-frame`: absolute, inset 16px, radius 48px,
`box-shadow: 0 0 0 4000px var(--color-void)` painting everything outside the window in Void.
**The parent section must have `overflow: hidden`** (`.has-scene-frame`) or the shadow floods the page.

`.act-solid` sections use opaque Void background (the canvas itself), 96px vertical padding,
6vw horizontal (clamped 20–80px), inner content capped at 1400px.

---

## 5 · Section specifications

### 5.0 Preloader
- Fullscreen Void. Centered: 84px gradient wing SVG (20px blue drop-shadow), "BIG VISION" 12px display-800 at 0.45em tracking, mono counter 0→100% (1.6s, power2.inOut).
- Holds until the WebGL scene has produced a frame (max 2.5s safeguard), then: inner fades/scales out 0.5s → whole layer slides up (`yPercent:-100`, 0.9s power4.inOut) → `display:none`, hero intro plays.

### 5.1 Nav
- Fixed, transparent, max 1400px, padding 22px / clamp(20,4vw,48px). **No bar, border, blur, or shadow.**
- Left: 38px wing + "BIG VISION" display-800 17px. Center: 4 mono labels 12px, slate-muted; hover → white + gradient underline growing left→right 0.35s. Right: primary pill "Book a Call" (11px mono label, magnetic).
- After 60px scroll: background `rgba(7,9,15,0.88)`, vertical padding shrinks to 14px. Nothing else changes.
- <900px: links and pill hide; burger (two 24px lines → ×) opens fullscreen Void menu, links display-800 24px, staggered fade-in.

### 5.2 Act 1 — Hero
- 100vh flex-center; `.scene-frame` + nav above it; content z2 inside the window.
- Stack (centered, 70px top padding): eyebrow → headline → sub → pills. Scroll cue at bottom 36px (clear of the 16px window inset).
- **Eyebrow:** mono 11px +0.24em sky-glow, pulsing 6px dot, flanked by `+` ticks in slate-faint. No box.
- **Headline:** display-800, `clamp(32px, 5.6vw, 72px)`, line-height 0.98, three lines each in an `overflow:hidden` line wrapper. Lines 1/3 pure white; line 2 (`.accent`) gradient-text. Char-split **grouped by word** (words never break).
- **Sub:** mono body, slate-muted, max 540px, 28px above-gap.
- **Pills:** primary "Book a Strategy Call" + ghost "See What We Do", both magnetic, 16px gap, 36px above-gap.
- **Scroll cue:** `+ SCROLL TO DIVE +` mono 10px slate-faint over a 20×32 hairline mouse pill with animated dot. Label hides under 820px viewport height.
- **Intro timeline** (after preloader): chars rise `yPercent:120→0` 1.05s power4, stagger 0.022 → eyebrow (−0.7 overlap) → sub (−0.55) → pills stagger 0.1 (−0.5) → cue → nav slides down (−0.8). 
- **Exit:** scrolling hero→dive drifts content `y:−140, opacity→0` (scrub 0.5); cue gone by 12% scroll.

### 5.3 Act 2 — The dive
- 100vh section pinned for +260%, scrub 0.6; `onUpdate` writes `S.dive` (drives camera through the cloud deck).
- Three lines fade through center stage, sequential: in (opacity 0→1, scale .94→1, blur 6→0, 1u) → hold 0.45u → out (scale→1.05, blur back). Montserrat 600 `clamp(22px,3.2vw,42px)`, slate-muted with gradient `<em>` words:
  1. "Your factory makes *world-class* products."
  2. "But online — *you're invisible.*"
  3. "Let's *change* that."
- `.dive-veil` (fixed, radial darkening) rises to 0.9 inside the cloud whiteout and **returns to 0** by dive end.
- Reduced motion: no pin; lines stacked statically; `S.dive = 1`.

### 5.4 Marquee
- Hairline top/bottom, Void fill, 24px padding; track duplicated in JS, 32s linear loop, masked edge fade 8%.
- Items: industries (Automotive … Factory Tech) mono 12px +0.28em slate-faint, separated by 10px `+` glyph ticks built from two gradient strokes at 70%.

### 5.5 Act 3 — Services (index list)
- Head: kicker `01 — What we do` (mono 12px +0.22em signal-light) + H2 word-split "Built to make you unmissable".
- **Index:** hairline-top list of three `.service-row`s, hairline-bottom each. Grid `64px | 1.1fr | 220px | 1.2fr | 48px` (num / title / media / body / arrow), 40px vertical padding.
  - num: mono 13px slate-faint → signal-light on hover.
  - title: display-800 `clamp(24px,3.4vw,46px)`.
  - media: always-visible 220×120 thumbnail, 16px radius, rest state `saturate(.7) brightness(.85)`; hover scales 1.06 + full color. **No cursor-follow popups.**
  - body: tag (mono 11px +0.18em signal-light) + desc (body-sm slate-muted, max 480px).
  - arrow `→` slate-faint, slides +8px and whitens on hover. Row indents 24px on hover (padding transition 0.45s).
- Rows reveal on scroll: y40 fade, 0.9s, 0.08 stagger.
- ≤1100px: media + arrow hidden (3-col grid).
- Close: `.end-statement` centered display-800 `clamp(24px,3vw,42px)`: "One partner. One plan. *All execution.*"
- <860px: grid collapses to `48px | 1fr` two rows; arrow hidden; float hidden.

### 5.6 Act 4 — Proof (bare numerals)
- Head: `02 — The numbers` + "Proof, not promises".
- **Stat row:** hairline-top 3-col grid, hairline left dividers between columns (no boxes, no fills). Numeral: display-800 `clamp(56px,7.5vw,112px)` gradient-text, counts 0→target over 2s power3.out on entering 85% viewport (`4,000+` en-IN grouping / `12+` / `75%+`). Caption mono 11px +0.22em slate-faint.
- **Banner:** Scene Window (48px radius) image `image15.png`, height clamp(320px,48vw,540px), parallax `yPercent −12→0` scrub; cooled grade (saturate .8, brightness .9); bottom gradient to Void; text bottom-left: Montserrat 700 `clamp(22px,2.8vw,36px)` "We make social media work like sales." + sky-glow caption "Strategic · Targeted · Results-driven".
- <860px: stats stack vertically, dividers become hairline tops.

### 5.7 Act 5 — Fit (editorial columns)
- Head: `03 — The fit` + "Manufacturing is our language".
- Hairline-top 2-col grid (gap clamp 32–96px), **no boxes**: each column h3 display-800 17–24px (right column gradient-text), then list items 14px slate-muted, 18px padding, hairline-bottom between items, gradient `+` marker at left.
- Left: who we work with (4 items). Right: what makes us different (4 items).
- <860px: single column.

### 5.8 Act 6 — Voices (typographic quotes)
- Head: `04 — Client wins` + "Real results, real leaders".
- Hairline-top 3-col grid (gap 32–64px), no cards. Each `.voice`: 64px gradient `“` → quote Montserrat 500 16–19px/1.65 #d7dbe4 → caption row: 44px round avatar (1px signal outline, 2px offset) + name (Montserrat 700 13.5px white) + role (11.5px slate-faint).
- <960px: single column, 48px gaps.

### 5.9 Act 7 — CTA
- 100vh flex-center, `.scene-frame` window; `S.rise` driven by ScrollTrigger (top 85% → top 5%) so the camera surfaces back above the clouds behind the content.
- Column 640px centered: kicker `05 — Next step` → title (display-800 clamp(30px,4.8vw,60px), line 1 white "You built the company.", line 2 gradient "Now be seen.", char-rise reveal) → sub (mono 14, max 460px) → form → WhatsApp link.
- **Form:** two 2-col rows (name/company, email/phone) + full-width primary pill "Request My Strategy Call".
  Inputs: rgba(panel,.85), 12px radius, hairline border, mono 14, slate-faint placeholder; focus = signal border only; invalid = red border only. Note line: "Submits via WhatsApp — we reply within 24 hours."
  Submit → validate → open `wa.me/919579662005` prefilled with the four fields.
- Link: "or message us directly on WhatsApp →" sky-glow 12px underline-hairline.

### 5.10 Footer
- Hairline top, Void, 80px top padding.
- Row 1 (1400px, grid 2fr/1fr/1fr): brand block (wing + wordmark + tagline ≤320px) · Navigate column · Contact column. Column links mono 12px +0.18em slate-muted → signal on hover; column labels 10px +0.26em slate-faint.
- Row 2: **giant outlined wordmark** "BIG VISION" — display-800 `clamp(64px,12.5vw,190px)`, transparent fill, 1px white stroke at 12%, nudged 12% below baseline so it crops slightly (gallery signature).
- Centered copyright caption 10.5px #3f4654.

### 5.11 Global interactions
- **Lenis** lerp 0.085 (disabled by reduced-motion), synced to ScrollTrigger via gsap.ticker; `data-scrollto` anchors use `lenis.scrollTo` 1.6s.
- **Cursor:** 5px signal dot (instant) + 34px ring (lerp 0.16); ring grows to 58px over links/buttons. Hidden on touch.
- **Magnetic** elements translate toward cursor ×0.25/0.3, elastic release.
- **Rail:** right-side 38vh hairline, gradient fill = page progress (scrub 0.4).
- **Reveals:** `.split-words .w` rise-stagger on 86% entry; kickers/stats/columns/quotes/banner/form fade-rise y44 1s on 88% entry, all `once`.
- **Reduced motion:** no pin, no grain shuffle, no smooth-wheel; content statically visible.

---

## 6 · Responsive matrix
| Breakpoint | Changes |
|---|---|
| ≤900px | Nav links + pill → burger menu |
| ≤860px | Service rows 2-col; stats stack; fit single col; footer single col |
| ≤960px | Voices single column |
| ≤768px | Scene frame inset 10px radius 28px; mobile scene: 22 clouds, 900 stars, bloom 0.4 |
| ≤640px | Form rows single column |
| height ≤820px | Scroll-cue label hidden |
| touch | Cursor, float preview, tilt and magnetics disabled |

## 7 · Performance budget
- JS: three.js (CDN module) + GSAP/ScrollTrigger + Lenis only. No frameworks.
- One canvas, one composer pass chain; DPR ≤1.75; render skipped when `document.hidden`.
- Procedural textures only (clouds, beam) — zero texture downloads.
- Images: existing brand PNG/JPEGs, `saturate` filters instead of duplicated assets.
- Target: 60fps desktop, 30+fps mid-tier mobile; preloader ≤2.5s.

---

## 8 · Step-by-step build guide

> The repo already implements steps 1–9; use this as the canonical order for any rebuild or audit.

1. **Scaffold** — `site/{index.html, css/style.css, js/scene.js, js/main.js, assets/}`. Copy brand assets (Vector.svg, image 14*.png, image15.png, headshots). CDN: three importmap, gsap, ScrollTrigger, lenis. Version-stamp every local asset URL (`?v=…`) and bump on every change.
2. **Tokens first** — write the `:root` block (§2) before any component CSS. No literal colors/radii below the fold of the file.
3. **Fixed layers** — canvas #webgl (z0), grain (z60), cursor (z200), rail (z90), preloader (z500). Body = Void.
4. **Scene** (§3) — build in order: renderer/camera/fog → lights → stars/sparkles → cloud sprites (+fake lighting data) → extruded logo → beam shafts + orbs → bloom composer → pointer/scroll state (`window.__SCENE`) → tick. Verify a lone frame renders before wiring UI.
5. **Nav + hero markup** (§5.1–5.2) — semantic `<header> + <section id=hero>`; scene-frame div first child; split-chars wrappers in the headline. Style, then wire the intro timeline and exit scrub.
6. **Dive** (§5.3) — pin + timeline + veil + `S.dive`. Tune cloud-pass whiteout against veil opacities.
7. **Gallery acts** (§5.4–5.8) — marquee, services index (+float preview), proof numerals + banner, fit columns, voices. Hairlines from `--color-edge` only. Wire reveals + counters + parallax.
8. **CTA + footer** (§5.9–5.10) — scene-frame again, `S.rise` trigger, form → WhatsApp handler, giant wordmark.
9. **Global polish** (§5.11) — Lenis, cursor, magnetics, rail, reduced-motion guards.
10. **QA pass** (§9) — run the checklist in Chrome at 1440/1024/390 widths; fix before shipping.

## 9 · QA checklist
- [ ] Preloader counts, exits, never traps scroll; hero intro plays once
- [ ] Headline/CTA titles: gradient visible, **no mid-word line breaks**, no invisible text (token-level clipping only)
- [ ] Scene Window frames clip their shadow (nothing past hero/CTA goes black) and corners match Void exactly
- [ ] Dive: pins smoothly, 3 lines legible against veil, veil returns to 0, no scroll jam
- [ ] Services: rows reveal, hover indents + arrow slides, float preview follows and swaps images, none of it on touch
- [ ] Counters fire once, format `4,000+`; banner parallax has no seams
- [ ] CTA: camera rises behind content, form validates, WhatsApp opens prefilled
- [ ] Footer wordmark crops elegantly at all widths
- [ ] Nav: underlines, scrolled state, burger menu cycle
- [ ] No horizontal scrollbar at any width; 60fps while scrubbing the dive
- [ ] prefers-reduced-motion: everything readable with no pinning
