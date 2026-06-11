# Big Vision v3 — Master Design Document
> **"WE ENGINEER ATTENTION."** — A precision-manufacturing landing page where the brand is a machined part:
> it enters as a CAD wireframe and gets *built* — layer by layer — into solid metal as you scroll.
> Every value here is normative. If code and document disagree, the document wins.

**Theme:** dark industrial / engineering-blueprint · **Stack:** static HTML/CSS/JS · Three.js (CDN) · GSAP + ScrollTrigger · Lenis
**Branch:** `v3-machine` · **Files:** `v3/index.html` · `v3/css/style.css` · `v3/js/scene.js` · `v3/js/main.js`
**Carried over from brand (ONLY these):** color palette (#31A2F3 → #2213C4 on dark) · wing logo (Vector.svg path) · name "Big Vision".

---

## 1 · Concept

Big Vision's clients build world-class machines. This page speaks their language: **the website is a CAD
viewer / digital factory**, and the thing being manufactured is *attention itself*. The wing logo sits on a
blueprint grid as a glowing wireframe — precise but immaterial, like a great factory brand nobody sees online.
As the visitor scrolls, a scan-ring sweeps upward and the part **materializes into solid machined metal**:
engineering excellence made visible. That is the pitch, told without a single marketing cliché.

Inspiration channels (Awwwards 3D/WebGL gallery patterns): scroll-driven object assembly, technical-HUD
overlays, oversized engineering type, monospaced telemetry, and single-object hero scenes — translated into a
blueprint-blue identity that no competitor in this space uses.

### Design pillars
1. **Everything is fabricated.** UI elements look measured and machined: corner brackets, dimension ticks, crosshairs, part numbers, dashed construction lines. Decoration must look like *instrumentation*, never ornament.
2. **One object, one story.** A single 3D part (the wing) carries the whole narrative: wireframe → building → built → energized. No second 3D set-piece.
3. **Blueprint blue is structural, signal gradient is energy.** Grid/construction lines use dim blueprint blue; the #31A2F3→#2213C4 gradient is reserved for energy: the scan ring, CTAs, live numbers, completed states.
4. **Mono is the voice of the machine.** All labels, telemetry, captions and data speak IBM Plex Mono. Human statements speak Space Grotesk.
5. **Left-anchored engineering layout.** Text columns anchor left against the grid (like a drawing title block) — a deliberate break from centered-hero convention.
6. **Performance is part of the aesthetic.** A CAD tool never stutters: DPR cap, one mesh, one composer-free renderer, zero texture downloads.

---

## 2 · Tokens

### 2.1 Colors
| Token | Value | Role |
|---|---|---|
| `--c-bg` | `#0a0d12` | Canvas — graphite black with a blue undertone |
| `--c-bg-raised` | `#0f131a` | Raised blocks, table rows |
| `--c-line` | `rgba(86,139,255,0.13)` | Blueprint construction lines, grid, hairlines |
| `--c-line-strong` | `rgba(86,139,255,0.28)` | Active construction lines, brackets |
| `--c-ink` | `#eef2f7` | Headings, primary text (soft white) |
| `--c-body` | `#9aa7b8` | Body copy |
| `--c-dim` | `#5a6577` | Captions, units, labels at rest |
| `--c-signal` | `#31a2f3` | Accent: live values, links, scan elements |
| `--c-signal-deep` | `#2213c4` | Gradient end — never alone |
| `--g-signal` | `linear-gradient(90deg,#31a2f3,#2213c4)` | CTA fill, progress bars |
| `--g-signal-text` | `linear-gradient(120deg,#7dd3fc,#31a2f3 55%,#4f46e5)` | Clipped text accents, big numerals |
| `--c-ok` | `#39d98a` | "PASS/ONLINE" status ticks only (tiny, rare) |

### 2.2 Typography (new for v3)
| Use | Family | Weight | Case | Notes |
|---|---|---|---|---|
| Display / headings | **Space Grotesk** | 700 (500 for subheads) | UPPER for display | tracking -0.02em, display line-height 0.92 |
| Machine voice: labels, telemetry, buttons, data, captions | **IBM Plex Mono** | 400 / 600 | UPPER for labels | tracking +0.08em labels, 0 for data |
| Body | IBM Plex Mono 400 | sentence | 15px/1.7 — the whole page reads like a technical document |

Scale: label 11 · data 13 · body 15 · sub 20 · h3 28 · h2 `clamp(34px,4.4vw,58px)` · display `clamp(56px,8.4vw,124px)`.

### 2.3 Geometry & texture
- Radii: **2px** everywhere (machined chamfer), **0** on tables/rules, **999px** never (no pills in v3 — buttons are rectangles with corner brackets).
- Hairlines: 1px `--c-line`; active 1px `--c-line-strong`.
- Brackets: 10×10px corner strokes on interactive blocks (CSS ::before/::after).
- Page grid: blueprint background = 64px major / 8px minor lines at `--c-line` ~40% strength, fixed (doesn't scroll) for depth.
- Max width 1320px; gutters clamp(20px, 5vw, 72px); section rhythm 112px.
- Shadows: none. Depth comes from line-weight and the 3D scene.
- Cursor: default hidden on fine pointers; replaced by a **crosshair** (two 1px lines + center dot, signal color over interactives).

---

## 3 · The scene (`scene.js`)

Fixed full-viewport canvas, z-0, one object on a blueprint stage.

| Element | Spec |
|---|---|
| Stage | bg `#0a0d12`, fog (12 → 34). Floor: two GridHelpers (8×0.5 spacing fine @ 0.06 opacity, 4 coarse @ 0.14), blueprint blue, y=0 |
| Part | Wing SVG path (inline) extruded: depth 6, bevel 0.9/0.7, scale 0.075, centered at (LOGO_X, 1.45, 0). LOGO_X = +1.55 desktop (clears the left text column), 0 on mobile |
| Wireframe pass | `EdgesGeometry(11°)` → LineSegments, `#31a2f3`, additive, opacity 0.55 |
| Solid pass | MeshStandardMaterial steel `#39414f`, metalness 0.92, roughness 0.3, **clipped** by world plane `y ≤ buildHeight`; renderer.localClippingEnabled |
| Build mapping | `S.build` is pinned at **1.0 — the part is always fully solid/opaque**. `S.scan` ∈ [0,1] (SPEC act) sweeps the QC ring + sparks along the part instead. `S.dock` ∈ [0,1] travels the part: hero pose → shrunk (×0.38) bottom-right **watermark** during A2–A4 (lamp dims 82%, part self-illuminates +0.24 emissive), and back for A5. Solid sections are rgba(10,13,18,.93) so the stage stays faintly visible behind content |
| Scan ring | Thin torus (r 2.35, tube 0.012) + flat ring sprite glow at clip height, gradient-blue, opacity pulses 0.5–1; hides when build ≥ 0.995 |
| Sparks | 90 additive points jittering ±0.45 around the clip height ring; fade out with the ring |
| Energize | `S.glow` ∈ [0,1] (CTA act): solid emissive `#1d4ed8` 0 → 0.5, wireframe opacity ↑, point light under part intensifies |
| **Work lamp (bat-signal reveal)** | **Floor projector** at bottom-right (LOGO_X+3.1, 0.42, 2.1): searchlight drum on a grid-mounted base + yoke, beaming **upward** at the part. SpotLight (0→70) + volumetric cone (0.1 at lamp → 1.7 at part, additive, ≤0.085) + bulb face + glare sprite. Scene boots near-black (`S.lamp=0`); on preloader exit main.js flickers it on (0.85→0.08→0.95→0.25→1, ~0.6s) — the part appears IN the up-thrown light. Base lights, grid and wire brightness slaved to the lamp; constant ±4% hum |
| Part pose | **Opaque brand-blue** (color #2e7fe6, metalness 0.5, roughness 0.32, slight emissive so it reads logo-blue in shadow). Wireframe reduced to a faint construction accent (≤0.16). **No turntable** — front-facing, gentle cursor lean ±0.26 + idle sway ±0.03 only |
| Camera | fov 38, pos (0.4, 2.1, 7.2) lookAt (LOGO_X·0.7, 1.35, 0); mouse parallax ±0.5/±0.25 lerp 0.07 |
| Lights | ambient 0.25 cool · key directional (−4, 6, 5) 0.9 `#cfe0ff` · rim point (3, 2.5, −3) `#31a2f3` 6 · under-glow point (LOGO_X, 0.25, 1) `#2244cc` 3→14 with glow |
| Perf | DPR ≤ 1.75; no post-processing (bloom faked via additive sprites); pause on `document.hidden`; mobile: grid fine pass off, sparks 40 |
| Bridge | `window.__SCENE = { build, glow, ready }` written by main.js ScrollTriggers |

---

## 4 · Page architecture

```
PRELOADER  "CALIBRATING / BV-OS v3.0" boot log → wipe up
HUD (fixed): crosshair cursor · top status bar · bottom telemetry strip
└── MAIN
    A0  #hero     100vh    headline left · 3D part right · telemetry
    A1  #spec     pinned +240%   the BUILD: wireframe→solid scrub + 3 spec lines
    ───  ticker: part-number strip  ───
    A2  #process  3 stations (01 Brand Engineering · 02 Content Machining · 03 Lead Assembly)
    A3  #output   measured results: 3 gauge numerals + tolerance table
    A4  #reports  field reports (terminal-log testimonials)
    A5  #commission  CTA: "BUILT? NOW BE SEEN." + order form (→ WhatsApp)
FOOTER  title block (like an engineering drawing) + giant outlined BIG VISION
```

Acts A2–A4 are opaque (`--c-bg` + blueprint grid); the scene shows through A0/A1/A5 only.

---

## 5 · Section specifications

### 5.0 Preloader
Black screen, mono boot log types 4 lines ("BV-OS v3.0 … LOADING PART: WING-01 … CALIBRATING GRID … READY"), progress bar 0→100 in gradient, then the whole layer wipes upward 0.8s power4. Max 2.6s; waits for first scene frame.

### 5.1 HUD chrome (fixed)
- **Top bar:** logo mark + "BIG VISION" Space Grotesk 700 16px left · center mono nav links (PROCESS / OUTPUT / REPORTS / COMMISSION) with `[ ]` bracket hover · right rectangle CTA "START A BUILD" (gradient fill, corner brackets, mono 12px). Bar is transparent; after 40px scroll gains `rgba(10,13,18,.9)` + bottom hairline.
- **Bottom telemetry strip** (desktop only): mono 10px dim — `BUILD 042% · ROT 128.4° · GRID 64/8 · LAT 18.52N 73.85E · STATUS NOMINAL`; BUILD % and ROT update live from the scene. Hidden ≤900px.
- **Crosshair cursor:** 18px cross + 3px dot; expands to 28px and turns signal-blue over links/buttons/rows. Hidden on touch.

### 5.2 A0 — Hero (100vh)
- Layout: 12-col grid; text occupies cols 1–6, the 3D part lives right-of-center (LOGO_X). Left column, top-aligned 22vh:
  - mono label `BV/INDEX 001 — B2B GROWTH SYSTEMS FOR MANUFACTURERS`
  - Display: **"WE ENGINEER ATTENTION."** (3 lines: WE ENGINEER / ATTENTION / — period in gradient). Line-mask rise reveal, 0.08 stagger, power4 1.1s.
  - body (max 440px): "Big Vision turns manufacturing excellence into LinkedIn authority — personal brands, content systems and lead pipelines, machined to spec."
  - buttons: `▮ START A BUILD` (gradient rect) + `VIEW THE PROCESS` (outline rect), corner brackets, magnetic ±4px.
- Right: DOM annotation layer over the part: dimension line with `Ø ATTENTION`, bracket corners, small `PART: WING-01 / MAT: REPUTATION-GRADE STEEL` data card bottom-right. Annotations fade in after intro, parallax-drift 6px with cursor.
- Bottom-left scroll cue: `▼ SCROLL TO BUILD` mono 10px + animated 24px vertical rule.

### 5.3 A1 — The build (pinned, +240%, scrub 0.6)
- Drives `S.build` 0.42 → 1.0 (eased). HUD BUILD % mirrors it.
- Left column swaps three statements (mask-rise in, fade out), mono label above each (`SPEC 01/03` …):
  1. "World-class on the factory floor." — label `CONDITION: VERIFIED`
  2. "Invisible on the feed." — label `VISIBILITY: 004% — FAIL` (FAIL in signal blue)
  3. "We close that gap." — label `CORRECTIVE ACTION: ENGAGED`
- At build = 1.0: stamp animation — a bracketed `[ BUILD COMPLETE ]` chip scales in 0.3s with one screen-flash of the scan ring.
- Reduced motion: no pin; statements stacked; `S.build = 1`.

### 5.4 Ticker
Hairline-bound strip, mono 11px dim, 28s loop, duplicated track:
`BV-001 PERSONAL BRANDING ▸ BV-002 CONTENT SYSTEMS ▸ BV-003 LEAD PIPELINE ▸ AUTOMOTIVE ▸ AEROSPACE ▸ TOOLING ▸ ROBOTICS ▸ X-RAY ▸ CNC ▸ SaaS ▸` (▸ separators in signal).

### 5.5 A2 — Process (three stations)
Mono kicker `SECTION A2 — THE LINE` + H2 "THREE STATIONS. ONE MACHINE."
Stations are full-width rows (not cards): hairline-top, 96px padding, 12-col grid alternating (text 6 cols / diagram 5 cols, swap sides per station).
- Text: giant outlined station numeral (01) behind, Space Grotesk h3 title, mono body ≤ 420px, 3 spec bullets prefixed `▸`.
  1. **Brand Engineering** — "Your profile rebuilt as a lead-generating asset. Positioning, narrative, proof — torqued to spec." bullets: profile architecture / founder positioning / authority signals.
  2. **Content Machining** — "Scroll-stopping content milled weekly from your real work — reels, carousels, war stories from the floor." bullets: weekly cadence / decision-maker targeting / zero generic posts.
  3. **Lead Assembly** — "Conversations qualified and routed to your inbox. Likes are scrap; orders are output." bullets: ICP filtering / DM systems / pipeline handoff.
- Visual: **animated product mockups** — each station shows the literal deliverable, built in DOM/CSS/JS (no external media, always loads), inside a measured frame (hairline, corner brackets, faux window chrome, `ST.0X` tag strip):
  1. **Profile assembly** — LinkedIn-style profile card: banner, logo avatar, name/headline ("I build X-ray systems that ship to 14 countries"), follower counter ticking 0→12.4K, three labelled gauge bars (POSITIONING / NARRATIVE / PROOF) filling in sequence, `AUTHORITY ✓` badge pops last.
  2. **Weekly feed** — three post cards (REEL / CAROUSEL / CASE STUDY) with manufacturing-specific copy; posts go "live" one at a time on a 2.6s loop while ▲/✉ counters tick up; loop pauses off-screen.
  3. **Qualified inbox** — DM thread: two inbound buyer messages → outbound "call scheduled" reply → green `▣ QUALIFIED — ROUTED TO PIPELINE` stamp, sequenced on entry.

### 5.6 A3 — Output (measured results)
Kicker `SECTION A3 — MEASURED OUTPUT` + H2 "TOLERANCES WE HOLD."
- Gauge row: 3 numerals (Space Grotesk 700, clamp 64–128px, gradient-text) counting on entry: `4,000+` B2B LEADS · `12+` BRANDS SCALED · `75%` LEAD→CALL CONVERSION. Beneath each: mono unit line + thin gradient progress bar that fills on reveal.
- Tolerance table (mono, hairline rows): RESPONSE TIME ≤ 24H · CONTENT CADENCE WEEKLY · TARGET ICP DECISION-MAKERS · GENERIC POSTS 0 — each row ends with a green `▣ PASS`.

### 5.7 A4 — Field reports (testimonials as logs)
Kicker `SECTION A4 — FIELD REPORTS` + H2 "FROM THE FLOOR."
Three terminal blocks (bg raised, 2px radius, hairline, corner brackets): header `LOG 001 — KARMA INNOVATIONS — VERIFIED ✓` mono 10px dim; body quote Space Grotesk 500 18px ink; footer `— KARTHIKEYAN JAWAHAR, DIRECTOR` mono dim. Quotes:
1. "Fresh content every week — without lifting a finger. I stopped worrying about what to post." (Karma Innovations)
2. "They turn raw ideas into strong content that brings real leads. That's the difference." (Renuka Tools, Anand Mulay, MD)
3. "Now it works quietly in the background — like a good machine should." (Vibex Machines, Dinesh Alone, Director)
Blocks reveal with a 1-line-at-a-time type-on of the header (CSS steps), body fades.

### 5.8 A5 — Commission (CTA)
Scene visible again (part fully built, `S.glow` scrubs 0→1 as section enters).
- Left: kicker `SECTION A5 — COMMISSION` · Display "BUILT? NOW BE SEEN." ("NOW BE SEEN." gradient) · body "Free 30-minute build review. We map exactly how LinkedIn becomes your best salesperson. No retainer talk, no deck."
- Right: **order form** styled as a job ticket (raised bg, corner brackets, header `WORK ORDER — BV/NEW`): fields NAME / COMPANY / EMAIL / PHONE (mono inputs, hairline bottom-border only, signal on focus) + gradient rect `SUBMIT WORK ORDER` → opens WhatsApp (+91 95796 62005) prefilled. Under it: `or message the line directly → WHATSAPP / LINKEDIN` mono links.

### 5.9 Footer — title block
An engineering drawing title block: hairline-boxed grid with cells `DRAWN BY: BIG VISION · SCALE: 1:1 · SHEET: 1 OF 1 · REV: v3.0 · DATE: <year> · APPROVED: YOU` (mono 10px), columns of nav + contact links, then the giant outlined **BIG VISION** wordmark (1px stroke `--c-line-strong`, fill transparent, clamp 64–180px, bottom-cropped 10%). Copyright caption.

---

## 6 · Motion system
| Trigger | Animation |
|---|---|
| Preloader exit | wipe up 0.8s power4.inOut |
| Hero intro | label type-in → display lines mask-rise (1.1s, 0.08 stagger) → body/buttons fade-rise → annotations fade (1.6s total) |
| #spec pin | scrub 0.6: S.build 0.42→1 (power1.inOut map), 3 statements sequenced, telemetry % live, complete-stamp at p≥0.98 |
| Reveals | one pattern only: y 32 → 0 + fade, 0.8s power3, once, start 'top 87%' |
| Diagrams | SVG stroke-dashoffset draw 1.2s on reveal |
| Counters | 0→target 1.8s power3.out + bar fill |
| Ticker | 28s linear infinite, pause on hover |
| Magnetic | buttons only, ±4px, elastic release |
| Reduced motion | no pin, no ticker animation, all visible, build=1 |

## 7 · Responsive
- ≤1100px: LOGO_X→0 (part behind content, opacity 0.5 in solid acts); hero text full-width; telemetry strip hidden.
- ≤900px: nav links→burger (fullscreen mono menu); stations stack (diagram above text); gauge row vertical.
- ≤640px: display clamp floor 44px; form full-width; footer title block 2-col.
- Touch: crosshair off, magnetic off, annotations static.

## 8 · Build plan (step order)
1. Scaffold `v3/` + CDN imports + version-stamped URLs (`?v=`); inline wing path constant shared by scene + favicon.
2. Tokens + blueprint grid background + base type (`style.css` top).
3. `scene.js`: stage → part (wireframe+clipped solid) → scan ring + sparks → lights → camera/parallax → `__SCENE` bridge → tick. Verify frame.
4. HUD chrome: top bar, telemetry strip, crosshair, preloader.
5. Hero (layout, intro timeline, annotations).
6. #spec pinned act wired to S.build + statements + stamp.
7. Ticker, Process stations + SVG diagrams, Output gauges + table, Field reports.
8. Commission + form→WhatsApp + footer title block + wordmark.
9. Responsive + reduced-motion + perf pass.
10. QA: §9.

## 9 · QA checklist
- [ ] Boot log ≤2.6s, never traps scroll; hero intro once
- [ ] Build scrub: solid rises smoothly with ring+sparks at the cut; never reverses below act; stamp fires once
- [ ] Telemetry BUILD/ROT live-update and match the scene
- [ ] No mid-word breaks; gradient text clips per-token
- [ ] Stations: diagrams draw, alternate sides, stack on mobile
- [ ] Counters/bars once; table PASS ticks aligned
- [ ] Form validates → WhatsApp prefilled; focus states signal-blue
- [ ] Footer wordmark crops cleanly; title block reads at 360px
- [ ] 60fps during pin; no horizontal scroll anywhere; reduced-motion readable
