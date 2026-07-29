# Handoff: Betaminds Africa Website Redesign

## Overview
Full-site UI redesign for **Betaminds Africa**, a Lagos-based creative and digital
commerce agency. Six views in one prototype: Homepage, Digital Ecosystem
(Digital Commerce & Marketplace Solutions), Media Services, Betaminds Academy,
Creative Empowerment Summit, and Let's Work (contact). All navigation, tabs,
accordions, carousels and the footer envelope-flap interaction are working.

## About the Design Files
The files in this bundle are **design references created in HTML**. They are
prototypes showing intended look and behavior, **not production code to copy
directly**. `Betaminds Africa Site.dc.html` uses a proprietary template runtime
(`<x-dc>`, `{{ holes }}`, `<sc-for>`, `<sc-if>`, a `Component extends DCLogic`
logic class) that will not exist in your codebase.

The task is to **recreate these designs in the target codebase's environment**
(Next.js, Astro, WordPress, etc.) using its established patterns, routing, and
component libraries. If no environment exists yet, choose the most appropriate
framework — for a marketing site of this shape, Next.js (App Router) with
Tailwind, or Astro with static routes, are both good fits.

The prototype renders all six pages as conditional sections of a single
component with client-side page switching. **In production, each should be its
own route** (`/`, `/digital-ecosystem`, `/media-services`, `/academy`,
`/summit`, `/lets-work`).

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing and interactions.
Recreate pixel-faithfully using the codebase's libraries. Two caveats:
1. **Photography is placeholder.** All images are hotlinked Pexels stock of
   Black African professionals and communities, chosen for tone and framing.
   Replace with Betaminds' real assets at the same crop ratios.
2. **Client logos, team photos, portfolio thumbnails and press clippings** are
   stand-ins pending real assets.

## Design Tokens

### Color
| Token | Hex | Use |
|---|---|---|
| Canvas | `#FBFAF8` | page background |
| Surface | `#FFFFFF` | cards, nav solid state |
| Surface alt | `#F4F2EE` | banded sections, marquee strip |
| Surface deep | `#F1EFEA` | hero backdrop behind imagery |
| Ink | `#17171B` | body text, headings |
| Ink 84% | `rgba(23,23,27,.84)` | lead paragraphs |
| Ink 82% | `rgba(23,23,27,.82)` | body paragraphs |
| Ink 70% | `rgba(23,23,27,.7)` | captions, secondary |
| Ink 62% | `rgba(23,23,27,.62)` | eyebrow / mono meta |
| Hairline | `rgba(23,23,27,.06–.09)` | borders, dividers |
| Accent (text) | `#8A5A0F` | eyebrows, links, accent words |
| Accent hover | `#B8791A` | `a:hover` |
| Accent (fill) | `#E8A33D` | primary buttons, hover overlays, ::selection |
| On-accent | `#1A1206` | text on `#E8A33D` |
| Accent tint | `rgba(232,163,61,.07–.26)` | soft panel gradients, borders |

Accent-fill `#E8A33D` always pairs with `#1A1206` text (never white).

### Typography
- **Display / headings:** Sora — 700 for h1/h2/h3, 300 for pull-quotes and
  large supporting lines.
- **Body / UI:** DM Sans — 400 body, 500 nav & meta, 600 buttons.
- **Eyebrow / meta:** `ui-monospace, Menlo, monospace`, 10–12px, weight 500,
  `letter-spacing: .14–.20em`, uppercase.

Google Fonts: `Sora:300,400,600,700,800` and `DM Sans:300,400,500 + italic 400`.

| Role | Size | Weight | Line-height | Tracking |
|---|---|---|---|---|
| h1 (desktop) | 78px | 700 Sora | .98–1 | -.035em |
| h1 (tablet) | 56px | 700 | 1 | -.035em |
| h1 (mobile) | 40px | 700 | 1.02 | -.03em |
| h2 (desktop) | 44px | 700 Sora | 1.04–1.06 | -.03em |
| h2 (tablet) | 36px | 700 | 1.06 | -.03em |
| h2 (mobile) | 29px | 700 | 1.1 | -.025em |
| Card title | 17px | 600 Sora | 1.3 | -.01em |
| Panel heading | 26px | 700 Sora | 1.2 | -.02em |
| Pull-quote (desktop) | 34px | 300 Sora | 1.28 | -.02em |
| Pull-quote (mobile) | 22px | 300 Sora | 1.3 | -.02em |
| Lead paragraph | 17–17.5px | 400 DM Sans | 1.6–1.66 | 0 |
| Body paragraph | 16.5px | 400 DM Sans | 1.66–1.68 | 0 |
| Card body | 14.5–15.5px | 400 DM Sans | 1.55–1.6 | 0 |
| Nav link | 13px | 500 DM Sans | 1 | .01em |
| Button | 12.5–14px | 600 DM Sans | 1 | .02em |
| Eyebrow | 10.5px | 500 mono | 1 | .18–.2em |

`text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.

### Spacing & geometry
- Content max-width **1320px**; prose columns capped 520–740px.
- Horizontal page padding: **30px** desktop / **24px** tablet / **18px** mobile.
- Section rhythm: **90–104px** vertical; hero **120px** top.
- Grid gaps: **12–16px** between cards, **56–64px** between two-column halves.
- Radii: **100px** pills/buttons, **22px** large feature panels, **18–20px**
  section panels, **14px** cards, **50%** avatars.
- Borders: **1px** `rgba(23,23,27,.08)` default; accent panels
  `rgba(232,163,61,.22–.26)`.
- Shadows: **none.** Depth comes from hairline borders and surface tints only.
  Do not add shadows.
- Responsive columns collapse: 4→2→1, 3→2→1, 2→1 at tablet/mobile.
  Breakpoints in the prototype are driven by measured container width:
  **desktop > 1000px, tablet 640–1000px, mobile < 640px.**

### Motion
| Name | Spec |
|---|---|
| `bmMarquee` | `translateX(0 → -50%)`, 26s linear infinite (client logo strip, duplicated track) |
| `bmFade` | opacity 1 → 0 crossfade, used for rotating hero imagery |
| `bmRise` | `opacity 0 / translateY(18px)` → settled, entrance reveal |
| Hover overlays | `opacity` .3s ease |
| Nav solidify | background/border transition on hover, ~.3s |
| Page change | `window.scrollTo({top:0, behavior:'smooth'})` |

Respect `prefers-reduced-motion`: disable marquee and rise, keep opacity fades.

## Screens / Views

### 1. Homepage — `/`
Purpose: position the brand and route visitors to the three business lines.
Sections in order:
1. **Hero** — full-height (`100vh - 44px`), background photo `object-fit:cover`
   over `#F1EFEA`, content bottom-anchored and centered, max-width 1180px.
   Pill eyebrow (5px accent dot + mono label "Creative × Digital × Commerce"),
   h1 "We add the spark that makes brands move" with the final phrase in
   `#8A5A0F`, 640px lead paragraph, mono promise line
   "Strategy first. Craft always. Growth you can measure.", then three pill
   buttons: *Explore digital ecosystem* (accent fill), *Explore media services*
   and *Betaminds Academy* (1px `rgba(23,23,27,.46)` outline).
2. **Trusted by** — `#F4F2EE` band, 34px vertical padding, hairline top/bottom,
   centered mono label, infinite marquee of client logos.
3. **About / 01 Who we are** — two columns (`col2`, 64px gap). Left: eyebrow,
   h2 "We take the idea all the way, not just the pretty part.", two paragraphs,
   accent *Let's work* pill. Right: 16/10 photo + three pillar cards
   (white, 14px radius, 22×24px padding, mono kicker + 15.5px body).
   Below: "Brands we don't work with" panel — accent-tinted
   `linear-gradient(120deg, rgba(232,163,61,.07), transparent 60%)`, 16px radius,
   three-column bullet list with `#8A5A0F` middot markers.
4. **02 Meet the spark** — four-column portrait grid, 3/4 aspect, 14px radius.
   Name/role in a bottom scrim
   (`linear-gradient(to top, rgba(251,250,248,.96), transparent)`).
   On hover the card fills `rgba(232,163,61,.92)` and reveals two 38px circular
   `IG` / `IN` buttons (1.5px `#1A1206` border).
5. **03 Digital marketplace** — feature panel, 22px radius,
   `linear-gradient(150deg, #FFFFFF, #F4F2EE)`, 56×46px padding. Left: h2
   "Build. Scale. Sell. Grow." + copy + *Book a discovery call*. Right: three
   engagement-plan rows (name in 17px Sora 600, mono tag in accent).
6. **04 Media services** — h2 "Seven packages. Click one to see the
   deliverables." with an *All media services →* underlined link. Tabbed /
   click-to-expand cards revealing deliverable lists.
7. **05 The Summit** — 660px copy column, stat row, imagery.
8. **06 Portfolio** — grid; on hover reveals industry & service.
9. **Testimonials** — white panel, 20px radius, 52×48px padding, 34px Sora 300
   quote in curly quotes, author row with avatar, prev/next controls.
10. **07 Betaminds Academy** — h2 "Learn. Build. Earn." + *Visit academy →*
    pill, portrait image grid from masterclasses and community events.
11. **08 Final CTA** — 96px centered block, h2 "Let's add the spark to your
    vision.", accent *Let's work →* pill (16×30px padding, 14px).
12. **Footer** — see below.

### 2. Digital Ecosystem — `/digital-ecosystem`
Hero: eyebrow, h1 "Digital Commerce & Marketplace Solutions", 34px Sora 300
accent line "Build. Scale. Sell. Grow.", 660px paragraph,
*Book a discovery call →*.
Then: **Our Digital Commerce Solution** — three-column capability cards
(branding, brand strategy, content, digital marketing, social, ads, CX,
analytics). **Engagement plans** — three cards (Starter / Growth / Strategic
Partnership), middle one selected by default (`plan: 1`), accent border and
tint on the active card. **Discovery consultation** — paid-session note
("Discovery calls carry a small booking fee… never charged twice") and the
MONTHLY FREE SLOT / FIRST WORKING DAY callout. **Before you book** — four-step
explainer + the eight-part questionnaire outline (contact & brand, location,
about the business, current digital presence, team & decision-making, why now,
engagement details, how did you hear about us).

### 3. Media Services — `/media-services`
Hero: h1 "Craft that carries your brand" with accent tail word, 620px lead.
Seven packages as tabs/cards: brand identity, company profile, content creation,
website design, social media management, property photography & videography,
ads campaign placement. Clicking a card expands its deliverables. CTA *Enquire*.

### 4. Betaminds Academy — `/academy`
Hero: h1 "Learn. Build. Earn.", 34px Sora 300 subhead "Transform your creative
skills into a career.", 520px paragraph, learning-formats list (physical, live
virtual, self-paced, weekend boot camps, corporate training), *Apply Now*.
**Academy courses** — pill tab group (4px padding, `rgba(23,23,27,.05)` track,
100px radius) switching School of Creative Media / School of Digital Technology;
course cards show duration, format, certificate, *Enroll*.
**Why Betaminds Academy** (white panel) beside **From choice to employment**
(accent-tinted panel, 7-step pathway: choose course → register → learn →
projects → certification → internship → employment).
**Stats** — four columns: 100+ students trained, 50+ internships, 85%
employment rate, 50+ creative projects.
**Student quotes** — two 21px Sora 300 cards with 42px round avatars.
**FAQ** — five accordion rows in a 14px-radius stack, 1px gap on a
`rgba(23,23,27,.08)` background so dividers read as hairlines.

### 5. Summit — `/summit`
Hero: h1 "Turning creativity into careers", 680px lead.
**A movement, not a conference** two-column narrative + mission.
Editions: First Edition "Choose a passion driven career in the creative
industry" (1 May 2025, Cafeone, Ikate, Lekki, Lagos) and Second Edition
"Turning Creativity into Careers" (17 July 2026, Gracetone Studio, Yaba, Lagos),
each with a picture gallery. Press mentions (Punch, Independent).
**Event highlights** — 500+ attendees, 30+ speakers, 20+ sponsors,
15+ workshops, 10+ partner institutions.
**Why attend?** — six cards. **Summit agenda** — nine-step vertical timeline.
**Success stories** — quote cards with ★★★★★ in `#8A5A0F`, 13px, .2em tracking.
**FAQ** — five rows. **Sponsor CTA** — *Download Sponsorship Deck* /
*Speak to Our Team*. **Newsletter** — email field + *Subscribe*.

### 6. Let's Work — `/lets-work`
Full-width office photograph backdrop. Office address, email, website, phone,
social icons. CTA line "Let's add the spark to your vision. Let's work".

### Global chrome
- **Top toolbar** (prototype only) — 22px logo, device switcher. **Do not ship**;
  it is the responsive-preview control.
- **Header** — sticky at `top: 44px` (below the toolbar; `top: 0` in production),
  `backdrop-filter: blur(14px)`, transparent on load and solidifying to
  `#FFFFFF` on hover/scroll with a hairline bottom border. Max-width 1320px,
  16×30px padding. Left: 30px cropped logo mark (`aspect-ratio: 876/400`,
  overflow hidden) + 9px gap + lockup — "BETAMINDS" (Sora 700, 14.5px, .01em)
  over "AFRICA" (DM Sans 400, 9.5px, **.34em** tracking, `#8A5A0F`).
  Center: nav links, 13px DM Sans 500, `white-space: nowrap`.
  Right: hamburger (two 20px bars `#17171B` + one 13px bar `#E8A33D`, 1.5px,
  4px gap) shown below 1000px, and the *Let's Work* accent pill
  (10×19px padding, 12.5px).
- **Mobile menu** — full-width stack, 15px links, 11px vertical padding,
  hairline dividers.
- **Footer** — envelope-flap interaction. Closed face: full stacked logo at
  **156px**, tagline, social icons, quick links. Clicking the flap opens to
  reveal "You've reached the end of our story. Let's add a spark to yours."
  plus office address, email and phone.

## Interactions & Behavior
| Element | Behavior |
|---|---|
| Nav link / logo / CTA | switch page, close mobile menu, smooth-scroll to top |
| Header | transparent → solid on hover (`navSolid`) |
| Hamburger | toggles `menu`; visible under 1000px |
| Media service card | click toggles `openCard`; only one open at a time |
| Media tabs | `mediaTab` index selects package group |
| Academy school tabs | `school` index (0 = Creative Media, 1 = Digital Technology) |
| Engagement plan cards | `plan` index; default 1 (Growth), accent border + tint |
| Summit edition switch | `ed` index; default 1 (Second Edition) |
| FAQ accordions | `faq` / `afaq` / `sfaq` hold the open index per page; null = all closed |
| Testimonial carousel | `testi` index, prev/next |
| Footer flap | `flap` boolean toggles the envelope open |
| Team portrait | hover reveals accent overlay + social buttons |
| Portfolio tile | hover reveals industry & service |
| Device switcher | prototype-only responsive preview; drop in production |

Forms in the prototype are non-functional layout. Production needs: email format
validation, required-field marking on the questionnaire's starred fields,
Calendly + payment integration on *Book a discovery call*, newsletter and
volunteer/sponsor form submission handling, and success/error states for each.

## State Management
Prototype state (all client-side, all in one component):
```
page: 'home' | 'ecosystem' | 'media' | 'academy' | 'summit' | 'work'
device: 'desktop' | 'tablet' | 'mobile'   // preview only
navSolid: boolean      menu: boolean      flap: boolean
mediaTab: number       openCard: number|null
school: number         plan: number       ed: number       testi: number
faq / afaq / sfaq: number|null
```
In production: `page` becomes routing, `device` becomes CSS media queries, and
the rest stay local component state. No data fetching in the prototype — all
content is static arrays in the logic class (`PLANS`, course lists, FAQ arrays,
team, portfolio, testimonials). These are ready to move to a CMS; the Academy
courses, Summit editions and portfolio are the three most likely to want one.

## Assets
- **Logo:** `assets/BETAMINDS-AFRICA.png` (876×400 source). Header uses a
  cropped mark via `aspect-ratio: 876/400` + `overflow: hidden`; footer uses the
  full stacked lockup at 156px. Supply SVG for production.
- **Photography:** all `images.pexels.com` URLs are **placeholders**, generated
  through an `IMG(id, w)` helper:
  `https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w={w}`.
  Replace every one with Betaminds' own photography. Crops to preserve:
  hero 16/9 cover, about 16/10, team portraits 3/4, avatars 1/1 circular,
  academy grid portrait, summit galleries landscape.
- **Client logos, press clippings, portfolio thumbnails:** not yet supplied.
- **Icons:** currently text/CSS stand-ins (`IG`, `IN`, `★`, `→`, `·`). Swap for a
  real icon set (Lucide or Phosphor both suit the line weight).
- **Fonts:** Sora + DM Sans, Google Fonts. Self-host in production.

## Note on the logo palette
The Betaminds logo uses blue / green / orange. The site accent is a warm gold
(`#8A5A0F` text, `#E8A33D` fill) that reads as a deliberate neighbour to the
logo's orange rather than a match. This was left unreconciled on purpose — if
brand guidelines specify the exact orange, shifting `#E8A33D` toward it is a
single-token change. Confirm with the client before deciding.

## Files
| File | What it is |
|---|---|
| `Betaminds Africa Site.dc.html` | The full six-page prototype. Primary reference. |
| `structure.txt` | Client-supplied site architecture, section-by-section brief, and all source copy including full FAQ answers and the consultation questionnaire. Read this for exact wording. |
| `assets/BETAMINDS-AFRICA.png` | Logo. |

`Betaminds Africa Site.dc.html` will not open meaningfully outside its runtime —
read it as source. Copy, colors, spacing and interaction logic are all inline
and explicit.
