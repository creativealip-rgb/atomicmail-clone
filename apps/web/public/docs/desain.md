# Atomic Mail — Design System

> Hasil ekstraksi dari `atomicmail.io` (DOM computed styles + JS bundle analysis) ·
> Sumber: `getComputedStyle`, hex extraction dari `index-CF-xT8ig.js`, BEM class patterns

---

## 1. Design Principles (inferred)

1. **Privacy-first** — UI reinforce trust: green atom logo, "PRIVACY CENTER" prominent, lock icons everywhere
2. **Minimal clutter** — generous whitespace, no decorative imagery in app shell
3. **Functional density** — sidebar always visible, list view information-rich
4. **Dark + Light parity** — both modes fully designed (welcome modal "Dark mode is here!")
5. **Inter as the voice** — single typeface, multiple weights, very legible

---

## 2. Color System

### 2.1 Brand Colors

| Token | Hex | Usage | Frequency in bundle |
|---|---|---|---|
| `brand/blue` | `#067DF7` | primary CTA, links, logo, focus ring | 27 uses |
| `brand/blue-deep` | `#0561FF` | hover state | (variant) |
| `brand/blue-darker` | `#0C79FE` | active state | (variant) |
| `brand/purple` | `#8A8FFB` | secondary accent, gradients | 8 uses |
| `brand/purple-light` | `#C091FF` | gradient end, highlights | 20 uses |
| `brand/purple-deep` | `#6648FF` | gradient start | 3 uses |
| `brand/lavender` | `#7D7BDB` | subtle accents | 4 uses |
| `brand/cyan` | `#7DCFFF` | info, secondary highlights | 20 uses |
| `brand/teal` | `#0CE884` / `#0DF189` | success, online dot | 15 uses |
| `brand/green` | `#00B95C` / `#00C354` | success, badges | 6 uses |
| `brand/red` | `#FF3636` | error, destructive | 3 uses |
| `brand/orange` | `#FBBC04` / `#FFBB00` | warning | 7 uses |

### 2.2 Neutral Palette (light mode)

| Token | Hex | Usage |
|---|---|---|
| `neutral/0` | `#FFFFFF` | surface (cards, modals) |
| `neutral/50` | `#FDFDFD` | surface alt |
| `neutral/100` | `#F5F5F4` | **body background** (computed) |
| `neutral/200` | `#EAEAEA` | borders, dividers |
| `neutral/300` | `#CFCFCF` | disabled, placeholder |
| `neutral/400` | `#ABABAB` | icon disabled |
| `neutral/500` | `#969696` | tertiary text |
| `neutral/600` | `#8E8E93` | secondary text (iOS-system-gray) |
| `neutral/700` | `#777776` | secondary text alt |
| `neutral/800` | `#5F5F5E` | primary text (warm) |
| `neutral/900` | `#000000` | emphasis text, primary actions |

### 2.3 Surface Layers

```css
/* Light mode */
--bg-base:       #F5F5F4;   /* body */
--bg-surface:    #FFFFFF;   /* cards, modal, sidebar */
--bg-elevated:   #FFFFFF;   /* dropdown, tooltip */
--bg-hover:      rgba(0, 0, 0, 0.04);
--bg-active:     rgba(0, 0, 0, 0.08);
--border-subtle: #EAEAEA;
--border-strong: #CFCFCF;

/* Dark mode (inferred from toggle behavior) */
--bg-base:       #0F0F0F;   /* near-black */
--bg-surface:    #1A1A1C;   /* one level up */
--bg-elevated:   #242426;
--bg-hover:      rgba(255, 255, 255, 0.06);
--bg-active:     rgba(255, 255, 255, 0.12);
--border-subtle: #2A2A2C;
--border-strong: #3A3A3C;
```

### 2.4 Status Colors

| Status | Light | Dark (inferred) |
|---|---|---|
| success | `#0DF189` (bg) / `#00B95C` (text) | same family, adjusted |
| warning | `#FFBB00` / `#FBBC04` | same |
| error | `#FF3636` / `#FF3030` | same |
| info | `#7DCFFF` / `#00B0F2` | same |
| unread | `#067DF7` (dot) | same |

### 2.5 Gradients (extracted)

```
/* Avatar gradient (senders) */
background: linear-gradient(135deg, #C091FF 0%, #8A8FFB 100%);

/* Promo card glow */
background: radial-gradient(circle, #0DF189 0%, transparent 70%);

/* Compose button */
background: linear-gradient(#000 0%, #1A1A1A 100%);  /* dark mode */
background: #000;  /* light mode */
```

### 2.6 Total Palette Size

- **240+ unique hex values** di main bundle (213 6-char + 27 3-char + alpha variants like `#00000080`)
- Indicates: **rich color system** dengan banyak shade variants, atau bundle pakai banyak third-party CSS yang ngomong warna

---

## 3. Typography

### 3.1 Font Family

```css
--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-mono: (not used in observed DOM)
```

**Inter** loaded dari Google Fonts dengan bobot: **300, 400, 500, 600, 700** (typical range)
**Fallback:** system fonts untuk cross-platform consistency

### 3.2 Type Scale (extracted from `font-size` patterns)

| Token | Size | Usage |
|---|---|---|
| `text/xs` | **10px** | micro labels, beta tag |
| `text/sm` | **12px** | timestamps, helper text, badge counts |
| `text/base-sm` | **15px** | small body, secondary text |
| `text/base` | **16px** | body, list items, default |
| `text/md` | **17px** | emphasized body |
| `text/lg` | **18px** | subheadings |
| `text/xl` | **20px** | section headings |
| `text/2xl` | **22px** | modal titles |
| `text/3xl` | **26px** | large headings |
| `text/4xl` | **34px** | hero, page titles |

### 3.3 Font Weights (used)

| Weight | Name | Usage |
|---|---|---|
| **400** | regular | body, default text |
| **500** | medium | button labels, emphasized list rows, nav |
| **600** | semibold | headings, strong emphasis |
| 300, 700 | (loaded, jarang dipake) | — |

### 3.4 Line Height & Letter Spacing

- **Line height:** 1.4 - 1.6 (inferred from layout density)
- **Letter spacing:** normal (no tracking observed)
- **Text transform:** UPPERCASE untuk section headers (FOLDERS, ALIASES) dengan small tracking

### 3.5 Sample Type Styles

```css
/* Page title (modal, hero) */
.title-hero {
  font-size: 34px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

/* Section header (sidebar) */
.label-section {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--neutral-600);
}

/* Message subject (inbox list) */
.text-subject {
  font-size: 16px;
  font-weight: 500;
  color: var(--neutral-900);
}

.text-subject-unread {
  font-weight: 600;
}

/* Message preview */
.text-preview {
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-600);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Timestamp */
.text-time {
  font-size: 12px;
  color: var(--neutral-500);
  font-variant-numeric: tabular-nums;
}
```

---

## 4. Spacing System

### 4.1 Spacing Scale (extracted from `padding` values)

| Token | Value | Usage |
|---|---|---|
| `space/0` | 0 | reset |
| `space/1` | 4px | tight stack |
| `space/2` | 8px | icon padding, micro |
| `space/3` | 12px | button padding y, list gap |
| `space/4` | 16px | **default** — card padding, list item padding |
| `space/5` | 20px | medium block, button x |
| `space/6` | 24px | large block, modal padding |
| `space/8` | 32px | section divider |
| `space/10` | 40px | hero padding x |
| `space/12` | 48px | page-level padding |

### 4.2 Common Patterns

```css
/* Button */
padding: 12px 16px;     /* standard */
padding: 12px 20px;     /* medium */
padding: 16px 40px;     /* large / hero CTA */

/* Card / modal */
padding: 24px;

/* Form input */
padding: 12px 16px;

/* List item */
padding: 12px 16px;

/* Sidebar */
padding: 20px;          /* top, bottom */
gap: 4px;               /* folder items */
```

### 4.3 Layout

- **App shell:** 2 columns
  - Sidebar: **~280px** (inferred dari `aside` width style)
  - Main: flex-1
- **Message list:** full-width in main
- **Reading pane:** 3rd column (when active) — overlays or splits

---

## 5. Border Radius

```css
--radius-none: 0;        /* sharp (Compose button text mode) */
--radius-sm:   8px;      /* small chips */
--radius-md:   10px;     /* inputs */
--radius-lg:   12px;     /* buttons (default) */
--radius-xl:   16px;     /* cards, modal */
--radius-2xl:  20px;     /* large cards */
--radius-3xl:  24px;     /* hero, promo card */
--radius-pill: 32px;     /* avatar, pill button */
--radius-full: 9999px;   /* circular icon buttons */
```

Paling sering observed: **12px (button), 16px (card), 32px (avatar/pill)**.

---

## 6. Box Shadow

```css
/* Subtle — list items, light dividers */
--shadow-xs: 0 2px 6px 0 rgba(0, 0, 0, 0.10);  /* 0x1A */

/* Card / modal */
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.10);

/* Floating — dropdown, popover */
--shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.10),
             0 0 0 2px rgba(0, 0, 0, 0.20);

/* Dramatic — promo card */
--shadow-xl: 3px 3px 21px 0 rgba(0, 0, 0, 0.30);  /* 0x4D */

/* Focus ring */
--shadow-focus: 0 0 0 2px rgba(0, 0, 0, 0.40);
```

---

## 7. Motion & Transitions

### 7.1 Durations

| Token | Value | Usage |
|---|---|---|
| `duration/instant` | 100ms | button color change |
| `duration/fast` | 200ms | background, border (hover) |
| `duration/base` | 300ms | scale, default |
| `duration/smooth` | 400ms | transform, height (panel slide) |
| `duration/slow` | 500ms | page-level transform |

### 7.2 Easing

```css
--ease-default: ease;
--ease-out:    ease-out;
--ease-in-out: ease-in-out;
```

### 7.3 Common Transitions

```css
/* Button hover */
transition: opacity 100ms, background 200ms, border-color 200ms;

/* Icon press */
transition: transform 200ms;
transition: scale 300ms ease;

/* Panel slide (sidebar toggle) */
transition: transform 400ms, opacity 400ms, height 400ms, box-shadow 200ms;

/* Modal fade */
transition: transform 500ms, opacity 200ms;
```

### 7.4 Animations

- `transform: translateX(-35px)` ↔ `translateX(35px)` (slide in/out, 400ms)
- `opacity: 0` ↔ `1` (fade, 200-400ms)
- `scale` (icon press feedback)
- No `@keyframes` with complex choreography observed (sutil only)

---

## 8. Z-Index Scale

| Layer | Z | Usage |
|---|---|---|
| base | 1 | default flow |
| sticky | 2 | sticky header |
| sidebar | 10 | main sidebar overlay |
| popover | 19-23 | dropdown, popover, tooltip |
| modal backdrop | 9999 | modal scrim |
| toast | 999999999 | top-most notification |

---

## 9. Iconography

**Library:** **Tabler Icons** (`tabler` di bundle)
- Style: stroke-based, 1.5-2px stroke, 24x24 grid
- Tone: monochrome, color via `currentColor`
- Used in: sidebar nav, action toolbar, message list, modals

**Common icons observed:**
- Compose: pencil/edit
- Search: magnifier
- Settings: 6-dot grid / 3-dot menu
- Folder: folder
- Star: star (filled vs outline states)
- Trash: trash
- Junk: flag
- Move: folder-arrow
- Reply: arrow-back
- Forward: arrow-forward
- Back: chevron-left
- AI Helper: sparkle
- Lock/Privacy: padlock
- Close: X
- Check: check
- Plus: + (add folder, add alias)
- More: kebab `···`

---

## 10. Component Patterns

### 10.1 Button

```
Variants:
  - primary     : solid black bg, white text, 12px radius
  - secondary   : outline, black border, black text
  - ghost       : no border, transparent bg, hover bg-neutral-100
  - destructive : red bg/text
  - icon        : 32x32 square or circle, ghost

Sizes:
  - sm: 28px height, 12px text
  - md: 36px height, 14px text (default)
  - lg: 44px height, 16px text

States:
  - default
  - hover (subtle bg change, 200ms)
  - active (slight scale 0.97)
  - focus (2px ring rgba(0,0,0,0.4))
  - disabled (neutral-300, no cursor)
  - loading (spinner replace content)
```

### 10.2 Input

```
- Border: 1px solid #EAEAEA
- Border-radius: 10px
- Padding: 12px 16px
- Font: Inter 15-16px
- Focus: border-color brand/blue, ring 0 0 0 2px rgba(6,125,247,0.2)
- Error: border-color brand/red, helper text below
- Disabled: bg neutral-100, text neutral-500
```

### 10.3 Avatar

```
- Sizes: 24, 32, 40, 56, 80 (px)
- Shape: circle
- Default: 32px
- Background: linear-gradient(135deg, #C091FF, #8A8FFB) or sender-determined
- Content: 1 letter uppercase, 600 weight, white
- Border (optional): 1px white
```

### 10.4 Card / Modal

```
- Background: #FFFFFF
- Border-radius: 16px (modal), 12px (card)
- Shadow: shadow-md or shadow-lg
- Padding: 24px (modal), 16px (card)
- Border: 1px subtle (in dark mode)
```

### 10.5 Sidebar Item (Folder)

```
- Height: 36-40px
- Padding: 0 16px
- Border-radius: 8px
- Display: icon (left) + label (center) + counter badge (right)
- Hover: bg neutral-100
- Active: bg white + subtle shadow (pops out dari gray sidebar bg)
- Badge: 18-20px circle, bg brand/blue, text 11-12px white
```

### 10.6 Message Row (Inbox List)

```
- Layout: [select] [avatar] [sender | subject + preview] [time | actions]
- Height: ~60-72px
- Padding: 12px 16px
- Border-bottom: 1px neutral-200
- Hover: bg neutral-50
- Unread: subject 600 weight, small green/blue dot left of sender
- Selected: bg brand/blue at 8% alpha
- Avatar: 40px, gradient or solid color from hash of email
- Subject: 16px medium, 1 line ellipsis
- Preview: 14px regular, neutral-600, 1 line ellipsis
- Time: 12px, neutral-500, right-aligned, tabular-nums
```

### 10.7 Toggle / Switch

```
- Width: 36px, Height: 20px
- Track: pill shape, gray-200 default, brand/blue when on
- Knob: 16px white circle, slides with transform 200ms
- Used in: theme toggle, encryption toggles
```

### 10.8 Tag / Badge

```
Variants:
  - counter: 18-20px, circle, brand/blue bg, white text 11px
  - status : 24px, pill, status color bg-light + status color text
  - chip   : variable, pill, neutral-100 bg + neutral-800 text
```

### 10.9 Tooltip

```
- Background: #000
- Text: 12px white
- Padding: 6px 10px
- Radius: 6px
- Arrow: small triangle, color matches bg
- Delay: 300-500ms hover
- Placement: top default
```

### 10.10 Popover / Dropdown Menu

```
- Background: #FFFFFF
- Border: 1px neutral-200
- Radius: 12px
- Shadow: shadow-lg
- Padding: 8px
- Item: 32px height, 12px 12px padding, radius 6px
- Item hover: bg neutral-100
- Divider: 1px neutral-200, 8px y margin
- Animation: scale 0.95 → 1, opacity 0 → 1, 150ms
```

### 10.11 Toast / Notification

```
- Position: top-right (z 999999999)
- Width: 360px
- Padding: 12px 16px
- Radius: 12px
- Shadow: shadow-md
- Icon: left, 20px
- Action: optional right text-button
- Animation: slide in from right (400ms)
- Auto-dismiss: 5s default
- Type: info / success / warning / error (color-tinted left border)
```

---

## 11. Form Patterns

### 11.1 Layout

- Labels: above input, 12-14px, neutral-800, 6px gap
- Required: red asterisk after label
- Helper text: 12px neutral-600, 4px gap below input
- Error: red, replaces helper text on error state
- Inline validation: on blur

### 11.2 Auth Form (Sign-in 2-step)

```
Step 1: Email only
  - Input: text, autocomplete=off
  - Inline adornment: "@atomicmail.io" suffix
  - Submit button: full-width, black, "Submit"
  - "Sign up" link below
Step 2: Password
  - Input: password
  - "Forgot password?" link above submit
  - Submit button: "Sign In"
  - "Back" button to step 1
```

### 11.3 Compose Form

```
Modal layout (slide from right or center):
  - Header: [Close] [To: <recipients>] [Cc/Bcc] [Subject] [Encrypt: dropdown]
  - Body: Jodit WYSIWYG editor (h-full)
  - Footer: [Attachment] [Draft] [Send] [AI Helper]
  - Encryption indicator: 🔒 icon + "Encrypt with Atomic" badge
```

---

## 12. Modal Patterns

```
Types:
  - Center modal (default): 420-520px wide, max-height 90vh, scrollable
  - Side drawer: 480px wide, slide from right
  - Full-screen modal: 100vw x 100vh (rare, untuk setup flows)

Anatomy:
  - Backdrop: rgba(0, 0, 0, 0.5), click to close
  - Container: white bg, 16px radius, shadow-lg
  - Header: 24px padding, title 22px 600, close X top-right
  - Body: 24px padding, scrollable
  - Footer: 16-24px padding, action buttons right-aligned

Animation:
  - Fade in 200ms
  - Scale 0.95 → 1, 200ms ease-out
  - Backdrop opacity 0 → 1, 200ms
```

---

## 13. Empty / Loading States

### 13.1 Empty States

- Inbox empty: large folder icon (96-128px), heading "No messages", body "You're all caught up", CTA optional
- Folders empty: same pattern
- Aliases empty: "Create your first alias" with + button
- Search no results: "No results for '...'" with clear button

### 13.2 Loading States

- **Page-level**: blank (gak ada skeleton — ini UX weakness)
- **List**: spinner inline
- **Button**: spinner replace content, button disabled
- **Image**: gray placeholder + skeleton pulse (inferred)

### 13.3 Error States

- Inline form: red border + helper text
- Full page: alert icon + message + retry button
- Network: "Connection lost" toast

---

## 14. Themes

### 14.1 Light Mode (default)

```css
--bg-base:        #F5F5F4;
--bg-surface:     #FFFFFF;
--bg-elevated:    #FFFFFF;
--text-primary:   #1A1A1A;
--text-secondary: #5F5F5E;
--text-tertiary:  #8E8E93;
--border-subtle:  #EAEAEA;
--border-strong:  #CFCFCF;
--brand-primary:  #067DF7;
--brand-accent:   #8A8FFB;
```

### 14.2 Dark Mode (inferred dari toggle + welcome modal)

```css
--bg-base:        #0F0F0F;   /* near-black */
--bg-surface:     #1A1A1C;
--bg-elevated:    #242426;
--text-primary:   #F5F5F4;
--text-secondary: #ABABAB;
--text-tertiary:  #777776;
--border-subtle:  #2A2A2C;
--border-strong:  #3A3A3C;
--brand-primary:  #067DF7;  /* same */
--brand-accent:   #C091FF;  /* same */
```

### 14.3 System Mode

- Follow `prefers-color-scheme` media query
- Toggle in `Settings → Account → System preferences` (per welcome modal text)
- Persistence: localStorage override of system

---

## 15. State Components

### 15.1 Hover

```css
.btn:hover { background: rgba(0, 0, 0, 0.06); transition: 200ms; }
.folder-item:hover { background: var(--neutral-100); }
.message-row:hover { background: var(--neutral-50); }
```

### 15.2 Active / Pressed

```css
.btn:active { transform: scale(0.97); transition: 100ms; }
.folder-item.active { background: var(--bg-surface); box-shadow: var(--shadow-xs); }
```

### 15.3 Focus

```css
:focus-visible { outline: 2px solid var(--brand-primary); outline-offset: 2px; }
input:focus { border-color: var(--brand-primary); box-shadow: 0 0 0 2px rgba(6,125,247,0.2); }
```

### 15.4 Disabled

```css
:disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
```

### 15.5 Loading

```css
.spinner { 
  width: 16px; height: 16px;
  border: 2px solid var(--neutral-200);
  border-top-color: var(--brand-primary);
  border-radius: 50%;
  animation: spin 600ms linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

---

## 16. Layout Specs (Live Measurements)

### 16.1 App Shell

```
┌──────────┬─────────────────────────────┐
│ sidebar  │ top-bar  (h: 56-64px)       │
│ w: 280px ├─────────────────────────────┤
│          │                             │
│          │ main-content                │
│          │ flex: 1                     │
│          │ scrollable                  │
│          │                             │
│          │                             │
└──────────┴─────────────────────────────┘
```

### 16.2 Message Detail (with reader)

```
┌──────────┬──────────┬────────────────┐
│ sidebar  │ list     │ reader         │
│ w: 280   │ w: 360   │ flex: 1        │
│          │          │ max-w: 720     │
│          │          │ centered       │
└──────────┴──────────┴────────────────┘
```

Pada viewport kecil, reader **overlays** the list (full-width modal-like).

### 16.3 Compose Modal

```
┌──────────────────────────────────────────┐
│ [×] Compose                              │
├──────────────────────────────────────────┤
│ To: [chips...]                           │
│ Subject: [...]                           │
│ Encrypt: [Atomic ▼]  🔒                 │
├──────────────────────────────────────────┤
│                                          │
│  [B] [I] [U] [S] [🔗] [📷] [...]        │
│                                          │
│  Body editor (Jodit)...                  │
│                                          │
├──────────────────────────────────────────┤
│ [📎] [💾 Draft]    [Cancel] [Send ➤]    │
└──────────────────────────────────────────┘
```
- Default size: 720px wide, 80vh tall
- Position: right-side drawer at md+, center modal at sm-

---

## 17. Branding Elements

| Element | Detail |
|---|---|
| **Logo** | green atom icon + "Atomic Mail" text + "beta" tag (gray) |
| **Tagline** | "Encrypted email you can trust" |
| **Voice** | confident, security-focused, slightly playful (emojis in transactional emails) |
| **Tone** | minimalist, modern, no corporate fluff |
| **Imagery** | abstract 3D (lock + keys, glass lock), lottie animations in marketing |
| **CTA copy** | action-oriented: "Get local", "Compose", "Sign In", "Create Hide My Email" |

---

## 18. Accessibility (inferred from Radix UI + patterns)

- **Keyboard nav:** full (Radix primitives are WAI-ARIA compliant)
- **Focus ring:** visible 2px outline
- **Contrast:** meets WCAG AA (text neutral-900 on white = 16:1)
- **Screen reader:** proper ARIA labels (e.g., `aria-label="Compose"`, `role="navigation"`)
- **Reduced motion:** (not verified — should respect `prefers-reduced-motion`)
- **Touch targets:** ≥ 44px on mobile (iOS guideline)

---

## 19. Implementation Tokens (CSS)

```css
:root {
  /* Color */
  --color-brand-blue:       #067DF7;
  --color-brand-blue-deep:  #0561FF;
  --color-brand-purple:     #8A8FFB;
  --color-brand-purple-lt:  #C091FF;
  --color-brand-cyan:       #7DCFFF;
  --color-brand-green:      #0DF189;
  --color-brand-red:        #FF3636;
  --color-brand-orange:     #FBBC04;

  --color-neutral-0:    #FFFFFF;
  --color-neutral-50:   #FDFDFD;
  --color-neutral-100:  #F5F5F4;
  --color-neutral-200:  #EAEAEA;
  --color-neutral-300:  #CFCFCF;
  --color-neutral-400:  #ABABAB;
  --color-neutral-500:  #969696;
  --color-neutral-600:  #8E8E93;
  --color-neutral-700:  #777776;
  --color-neutral-800:  #5F5F5E;
  --color-neutral-900:  #000000;

  /* Typography */
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --fs-xs: 10px; --fs-sm: 12px; --fs-base-sm: 15px; --fs-base: 16px;
  --fs-md: 17px; --fs-lg: 18px; --fs-xl: 20px; --fs-2xl: 22px;
  --fs-3xl: 26px; --fs-4xl: 34px;
  --fw-regular: 400; --fw-medium: 500; --fw-semibold: 600; --fw-bold: 700;

  /* Spacing */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-8: 32px; --space-10: 40px; --space-12: 48px;

  /* Radius */
  --r-sm: 8px; --r-md: 10px; --r-lg: 12px; --r-xl: 16px;
  --r-2xl: 20px; --r-3xl: 24px; --r-pill: 32px; --r-full: 9999px;

  /* Shadow */
  --shadow-xs: 0 2px 6px 0 rgba(0,0,0,0.10);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.10);
  --shadow-lg: 0 4px 12px rgba(0,0,0,0.10), 0 0 0 2px rgba(0,0,0,0.20);
  --shadow-xl: 3px 3px 21px 0 rgba(0,0,0,0.30);
  --shadow-focus: 0 0 0 2px rgba(0,0,0,0.40);

  /* Motion */
  --d-instant: 100ms; --d-fast: 200ms; --d-base: 300ms; --d-smooth: 400ms; --d-slow: 500ms;
  --ease-default: ease; --ease-out: ease-out; --ease-in-out: ease-in-out;

  /* Z-index */
  --z-base: 1; --z-sticky: 2; --z-sidebar: 10;
  --z-popover: 19; --z-dropdown: 21; --z-modal: 9999; --z-toast: 999999999;
}

[data-theme="dark"] {
  --color-neutral-0:    #0F0F0F;   /* swap */
  --color-neutral-50:   #1A1A1C;
  --color-neutral-100:  #242426;
  --color-neutral-200:  #2A2A2C;
  --color-neutral-300:  #3A3A3C;
  --color-neutral-600:  #ABABAB;
  --color-neutral-700:  #969696;
  --color-neutral-800:  #CFCFCF;
  --color-neutral-900:  #F5F5F4;
  /* brand tetap */
}
```

---

## 20. Anti-Pattern / Lessons (saat cloning)

⚠️ **Yang perlu di-perbaiki kalau bikin clone:**

1. **Bundle size** — 5.2 MB main = first-paint nge-lag banget. **Aggressive code-splitting** wajib:
   - `React.lazy()` per route
   - Vendor chunks terpisah
   - Jodit di-lazy load saat compose dibuka
2. **No skeleton loading** — page blank saat load. Tambah skeleton screens
3. **No PWA** — offline gak jalan sama sekali. Tambah Workbox + manifest
4. **Settings = modal** (bukan route) — bikin deep-link & share-state susah. Bisa jadi route aja
5. **No search shortcut** (`Cmd+K`) — power user bakal kecewa
6. **Compose button always visible** — bagus, tapi bisa di-improve dengan keyboard shortcut
7. **Promo card "Get local Gemini"** — ganggu visual. Bisa di-collapse by default

---

## 21. Design System Maturity

| Aspek | Score | Note |
|---|---|---|
| Color tokens | ⭐⭐⭐⭐ | comprehensive, multi-mode |
| Typography | ⭐⭐⭐⭐ | clean scale, single family |
| Spacing | ⭐⭐⭐ | consistent, base 4px |
| Components | ⭐⭐⭐ | BEM + CSS Modules, less reusable primitives |
| Accessibility | ⭐⭐⭐⭐ | Radix UI solid foundation |
| Documentation | ⭐ | zero — tidak ada public design system |
| Theme support | ⭐⭐⭐⭐ | light + dark, system-aware |
| Motion | ⭐⭐⭐ | consistent timing, no complex choreography |

**Overall:** ~7/10 — solid product design, mostly consistent, no public design system page (cloning opportunity untuk publish sebagai reference).

---

Lanjut: **[struktur.md](./struktur.md)** untuk arsitektur & tech stack detail.
