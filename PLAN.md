# QR Generator — Implementation Plan

## Overview
A modern, fast QR code generator with customization options. Paste any text or URL, generate a QR code instantly, customize colors, styles, and download as PNG/SVG. Fully client-side, privacy-first, no data leaves the browser.

---

## Market Research

### Competitors
| Tool | Strengths | Weaknesses |
|------|-----------|------------|
| QRCode Monkey | High customization, logos | Slow, ad-heavy, complex UI |
| GoQR.me | Fast, simple | Dated design, no download options |
| QR Tiger | Batch generation | Paid features, complex |
| Scanova | Enterprise features | Expensive, overkill for simple use |
| OpenQR | Open-source, styled dots, logo | Limited QR types |
| qr-code-styling demos | Rich visual customization | Heavy bundle, browser-only |

### Opportunity
- Most tools are ad-heavy, slow, or overly complex
- No modern, clean, instant QR generator with advanced styling exists
- Developer-friendly tool with fast generation is missing
- Privacy-first (client-side only) is a strong differentiator

### Target Users
- Developers sharing links/docs
- Marketing teams creating QR for campaigns
- Anyone needing quick, styled QR codes

---

## UI/UX Design

### Design Principles

1. **Mobile-First** — Design for 375px viewport first, scale up
2. **Instant Feedback** — QR updates as user types (debounced 150ms)
3. **Progressive Disclosure** — Show basic options first, advanced in expandable sections
4. **Error Prevention** — Validate input before generation, warn about scannability
5. **Accessibility** — WCAG 2.1 AA compliant, keyboard navigable

### Layout (Desktop)
```
┌─────────────────────────────────────────────────────────────┐
│  QR Generator                                    [🌙/☀️]    │
│  ═══════════════════════════════════════════════════════════ │
│                                                             │
│  ┌─────────────────────────────┐  ┌───────────────────────┐ │
│  │  QR Type                    │  │                       │ │
│  │  [URL] [WiFi] [vCard] ...  │  │                       │ │
│  ├─────────────────────────────┤  │      QR Preview       │ │
│  │                             │  │                       │ │
│  │  Input Fields               │  │    (Real-time SVG)    │ │
│  │  (Type-specific forms)      │  │                       │ │
│  │                             │  │                       │ │
│  │  ┌─────────────────────┐   │  │                       │ │
│  │  │ https://example.com │   │  │                       │ │
│  │  └─────────────────────┘   │  │                       │ │
│  │                             │  │                       │ │
│  ├─────────────────────────────┤  ├───────────────────────┤ │
│  │  Style                     │  │  Export                │ │
│  │  ┌─────┐ ┌─────┐ ┌─────┐  │  │  Size: [256][512][1K] │ │
│  │  │ ⬛  │ │ ◼️  │ │ ●  │  │  │  ┌──────────────────┐ │ │
│  │  │dot1 │ │dot2 │ │dot3 │  │  │  │  Download PNG    │ │ │
│  │  └─────┘ └─────┘ └─────┘  │  │  └──────────────────┘ │ │
│  │                             │  │  ┌──────────────────┐ │ │
│  │  Colors                     │  │  │  Download SVG    │ │ │
│  │  FG: [■] BG: [□] [🔄]     │  │  └──────────────────┘ │ │
│  │  Contrast: 12.5:1 ✅        │  │  ┌──────────────────┐ │ │
│  │                             │  │  │  Copy to Clipboard│ │ │
│  │  Logo Upload                │  │  └──────────────────┘ │ │
│  │  [Choose File] ≤20%         │  │                       │ │
│  │                             │  │                       │ │
│  └─────────────────────────────┘  └───────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Layout (Mobile - 375px)
```
┌───────────────────────────┐
│  QR Generator      [🌙]   │
│  ══════════════════════════ │
│                             │
│  ┌───────────────────────┐ │
│  │   QR Preview          │ │
│  │   (Sticky on scroll)  │ │
│  └───────────────────────┘ │
│                             │
│  [URL][WiFi][vCard] ←→     │
│                             │
│  ┌───────────────────────┐ │
│  │  https://example.com  │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │  Style Options  [▼]   │ │
│  ├───────────────────────┤ │
│  │  Colors        [▼]   │ │
│  ├───────────────────────┤ │
│  │  Logo Upload   [▼]   │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │     Download PNG      │ │
│  └───────────────────────┘ │
│  ┌───────────────────────┐ │
│  │     Download SVG      │ │
│  └───────────────────────┘ │
│  ┌───────────────────────┐ │
│  │   Copy to Clipboard   │ │
│  └───────────────────────┘ │
│                             │
└───────────────────────────┘
```

### Color Palette
- Background: `#0A090F` (dark)
- Primary: `#5542FF` (purple accent)
- Text: `#EFEFE6` (off-white)
- Cards: `#1A1A1E` (dark gray)
- Success: `#22C55E` (green for valid contrast)
- Warning: `#F59E0B` (amber for low contrast)
- Error: `#EF4444` (red for errors)

### Key Components
- `QRTypeSelector` — horizontal scrollable tabs (mobile-friendly)
- `QRInput` — type-specific form fields with validation
- `QRPreview` — live QR display with sticky positioning
- `ColorPicker` — foreground/background with contrast ratio display
- `StylePicker` — visual dot/corner style grid
- `LogoUploader` — drag-and-drop with preview
- `DownloadButton` — size selector + export options
- `Toast` — non-disruptive notifications

### Interaction Patterns

#### Real-Time Preview
- QR updates as user types (debounced 150ms)
- No "Generate" button needed
- Visual feedback during generation (spinner)

#### Input Validation
- Inline error messages below fields
- Real-time validation as user types
- URL auto-normalization (adds https://)
- Contrast ratio warning when < 4.5:1

#### Type Switching
- Smooth transition between QR types
- Preserve style settings across type changes
- Type-specific help text and placeholders

#### Export Flow
- Click download → instant download
- Toast notification on success
- Filename based on content type (e.g., "wifi-qr.png")

### Responsive Behavior

| Breakpoint | Layout Changes |
|------------|----------------|
| < 640px | Single column, sticky preview, collapsible sections |
| 640-1024px | Two columns, preview on right |
| > 1024px | Full two-column layout, all sections visible |

### Micro-Interactions
- Hover effects on buttons (subtle scale/color change)
- Focus ring visible on all interactive elements
- Smooth accordion animations for sections
- QR preview fade-in on first render
- Toast slide-in animation

### Dark/Light Theme
- System preference detection via `prefers-color-scheme`
- Manual toggle with localStorage persistence
- Smooth transition between themes (200ms)
- QR preview adjusts to theme (dark QR on light bg, vice versa)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| QR Generation | `qrcode.react` (React component) + `qrcode` (matrix generation) |
| Styling Engine | `qr-code-styling` (for advanced dot/corner/gradient customization) |
| Canvas | HTML5 Canvas for PNG export |
| Deployment | Vercel |

### Library Rationale
- **`qrcode.react`** — Best React integration, renders as JSX, 5.9KB gzipped, zero deps, SVG output
- **`qrcode`** — Battle-tested matrix generation for custom canvas rendering, logo overlay
- **`qr-code-styling`** — Advanced visual customization (dot shapes, corners, gradients, logos)

---

## Features

### MVP
- [x] Input text/URL → instant QR generation
- [x] Download as PNG
- [x] Copy to clipboard
- [x] Dark theme UI
- [x] Real-time preview while typing
- [x] Quiet zone (4-module margin for scannability)

### V1
- [x] Custom foreground/background colors
- [x] Download as SVG
- [x] QR size selector (256px, 512px, 1024px, 2048px)
- [x] Error correction level (L, M, Q, H)
- [x] Dark/light theme toggle
- [x] Input validation with error messages
- [x] Contrast ratio warning (< 4:1)

### V2
- [x] Logo/center image overlay (centered, ≤20% width, opaque background)
- [x] Dot shape styles (square, rounded, dots, diamond)
- [x] Corner/eye style customization
- [x] Gradient support (linear/radial)
- [x] Multiple QR types: WiFi, vCard, Email, SMS, Phone, Calendar, WhatsApp, Location
- [x] QR history (localStorage)
- [x] Style presets/templates

### V3 (Optional)
- [ ] QR scanner (camera integration)
- [ ] Batch generation
- [ ] PWA with offline support
- [ ] Keyboard shortcuts
- [ ] Export as JPEG/WebP

---

## QR Code Technical Constraints

### Scannability Rules (Must Implement)
1. **Contrast**: Dark modules on light background, minimum 4:1 ratio (7:1 recommended)
2. **Quiet zone**: 4-module white margin around QR code (part of spec)
3. **Finder patterns**: Never cover the 3 corner squares
4. **Logo placement**: Center only, ≤20% of width, opaque solid background
5. **Error correction**: Level H required when logo is present
6. **Gradients**: Only on data modules, never on finder patterns

---

## File Structure

```
qr-generator/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Main page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Tailwind imports
│   ├── components/
│   │   ├── QRGenerator.tsx    # Main orchestrator
│   │   ├── QRInput.tsx        # Type-specific input forms
│   │   ├── QRTypeSelector.tsx # QR type switcher
│   │   ├── QRPreview.tsx      # QR display
│   │   ├── ColorPicker.tsx    # Color customization
│   │   ├── StylePicker.tsx    # Dot/corner style options
│   │   ├── LogoUploader.tsx   # Logo upload component
│   │   ├── DownloadButton.tsx # Export options
│   │   ├── Toast.tsx          # Notification component
│   │   └── ui/                # shadcn components
│   ├── lib/
│   │   ├── generateQR.ts      # QR generation logic
│   │   ├── qr-types.ts        # QR type definitions
│   │   ├── constants.ts       # Color palette, defaults
│   │   └── contrast.ts        # WCAG contrast calculation
│   ├── hooks/
│   │   ├── useQRConfig.ts     # QR state management
│   │   └── useExport.ts       # Export logic
│   └── types/
│       └── index.ts           # Shared TypeScript types
├── docs/
│   ├── README.md              # Project overview
│   ├── ARCHITECTURE.md        # System architecture
│   ├── COMPONENTS.md          # Component documentation
│   ├── DEPLOYMENT.md          # Deployment guide
│   ├── CONTRIBUTING.md        # Contribution guidelines
│   └── SECURITY.md            # Security practices
├── public/                    # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── PLAN.md
```

---

## Database Schema
None — client-side only.

---

## API Routes
None — pure client-side generation.

---

## Deployment
1. Push to GitHub
2. Connect to Vercel
3. Auto-deploy on push to main
4. Environment variables: None

---

## Success Metrics
- QR generation in < 100ms
- Lighthouse score > 95
- Clean, intuitive UI
- Works offline (no API calls)
- Scannability: passes iOS + Android native camera scan
- Contrast ratio ≥ 4:1 for all color combinations
