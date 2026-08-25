# QR Generator — Implementation Plan

## Overview
A modern, fast QR code generator **and scanner** with customization options. Paste any text or URL, generate a QR code instantly, customize colors, styles, and download as PNG/SVG. Scan QR codes via camera or image upload. Fully client-side, privacy-first, no data leaves the browser.

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
2. **Instant Feedback** — QR updates as user types
3. **Progressive Disclosure** — Show basic options first, advanced in expandable sections
4. **Error Prevention** — Validate input before generation, warn about scannability
5. **Accessibility** — WCAG 2.1 AA compliant, keyboard navigable

### Layout (Desktop — QR Studio Workspace)
```
┌─────────────────────────────────────────────────────────────┐
│  QR Studio                                    [🌙/☀️]       │
│  ═══════════════════════════════════════════════════════════ │
│  [Generate]  [Scan]                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────┐  ┌───────────────────────┐ │
│  │  Create                     │  │  Preview              │ │
│  │                             │  │                       │ │
│  │  ┌───────────────────────┐  │  │  ┌─────────────────┐ │ │
│  │  │ QR Type Grid (3x3)   │  │  │  │                 │ │ │
│  │  │ [URL] [Text] [WiFi]  │  │  │  │   Live QR Code  │ │ │
│  │  │ [Contact] [Email]... │  │  │  │   (SVG/Canvas)  │ │ │
│  │  └───────────────────────┘  │  │  │                 │ │ │
│  │                             │  │  └─────────────────┘ │ │
│  │  ┌───────────────────────┐  │  │                       │ │
│  │  │ Input Fields          │  │  │  [Download PNG]       │ │
│  │  │ (Type-specific forms) │  │  │  [SVG] [Copy]        │ │
│  │  └───────────────────────┘  │  │                       │ │
│  │                             │  │                       │ │
│  └─────────────────────────────┘  └───────────────────────┘ │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Design                                                     │
│  [✨ Presets] [🎨 Colors] [◼ Style] [🌈 Gradient] [◉ Logo] │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  (Tab content for selected design option)              ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Recent                                                     │
│  [QR1] [QR2] [QR3] [QR4] ←→ (horizontal scroll)           │
└─────────────────────────────────────────────────────────────┘
```

### Layout (Mobile — QR Studio Workspace)
```
┌───────────────────────────┐
│  QR Studio      [🌙]     │
│  ══════════════════════════│
│  [Generate]  [Scan]       │
├───────────────────────────┤
│                           │
│  ┌───────────────────────┐│
│  │   QR Preview          ││
│  │   (Above the fold)    ││
│  └───────────────────────┘│
│  ┌───────────────────────┐│
│  │   Download Buttons    ││
│  └───────────────────────┘│
│                           │
│  QR Type Grid (3x3)      │
│                           │
│  ┌───────────────────────┐│
│  │  Input Fields         ││
│  └───────────────────────┘│
│                           │
│  Design Tabs              │
│  [Presets][Colors][Style] │
│  [Gradient][Logo]         │
│                           │
└───────────────────────────┘
```

### Key Components
- `QRTypeSelector` — 3x3 visual grid picker with type descriptions
- `QRInput` — Type-specific form fields with validation
- `QRPreview` — Live QR display (qrcode.react for non-gradient)
- `QRPreviewStylized` — Gradient QR display (qr-code-styling)
- `QRScanner` — Camera + image upload + clipboard paste scanner
- `ColorPicker` — Foreground/background with contrast ratio display
- `StylePicker` — Visual dot/corner style grid
- `GradientPicker` — Linear/radial gradient with color pickers
- `StylePresets` — One-click theme presets
- `LogoUploader` — File upload with preview
- `DownloadButton` — PNG/SVG/Copy export options
- `HistoryPanel` — Horizontal scroll recent QR codes
- `ThemeToggle` — Dark/light mode switch

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| QR Generation | `qrcode.react` (React SVG) + `qr-code-styling` (advanced styling) |
| QR Scanning | `qr-scanner` (nimiq) — camera + image decode |
| Toast | `sonner` |
| Deployment | Vercel |

### Library Rationale
- **`qrcode.react`** — Best React integration, renders as JSX, zero deps, SVG output
- **`qr-code-styling`** — Advanced visual customization (dot shapes, corners, gradients, logos)
- **`qr-scanner`** — Lightweight (~16KB gzipped), supports camera + image + clipboard paste

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

### V3
- [x] QR scanner (camera integration)
- [x] Image upload scanning
- [x] Clipboard paste scanning
- [x] Type-aware result detection (URL, WiFi, vCard, etc.)
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
│   │   ├── page.tsx              # Main page with header
│   │   ├── layout.tsx            # Root layout with providers
│   │   └── globals.css           # Tailwind imports + theme tokens
│   ├── components/
│   │   ├── QRGenerator.tsx       # Main orchestrator (Generate/Scan tabs)
│   │   ├── QRInput.tsx           # Type-specific input forms
│   │   ├── QRTypeSelector.tsx    # 3x3 visual grid picker
│   │   ├── QRPreview.tsx         # Live QR display (qrcode.react)
│   │   ├── QRPreviewStylized.tsx # Gradient QR display (qr-code-styling)
│   │   ├── QRScanner.tsx         # Camera + image + clipboard scanner
│   │   ├── ColorPicker.tsx       # Colors + contrast ratio
│   │   ├── StylePicker.tsx       # Dot/corner style grid
│   │   ├── GradientPicker.tsx    # Gradient config (linear/radial)
│   │   ├── StylePresets.tsx      # One-click theme presets
│   │   ├── LogoUploader.tsx      # Logo upload with preview
│   │   ├── DownloadButton.tsx    # Export options (PNG/SVG/Copy)
│   │   ├── History.tsx           # Horizontal scroll history
│   │   ├── ThemeToggle.tsx       # Dark/light mode switch
│   │   ├── Toast.tsx             # Toast notification hook
│   │   └── ui/                   # shadcn/ui components
│   ├── lib/
│   │   ├── qr-types.ts           # QR type formatters & initial fields
│   │   ├── constants.ts          # Defaults, presets, options
│   │   ├── contrast.ts           # WCAG contrast calculation
│   │   └── utils.ts              # cn() utility
│   ├── hooks/
│   │   ├── useQRConfig.ts        # QR state management hook
│   │   └── useExport.ts          # Export logic hook (qr-code-styling)
│   └── types/
│       └── index.ts              # Shared TypeScript types
├── docs/
│   ├── README.md                 # Documentation index
│   ├── ARCHITECTURE.md           # System architecture
│   ├── COMPONENTS.md             # Component documentation
│   ├── DEPLOYMENT.md             # Deployment guide
│   ├── CONTRIBUTING.md           # Contribution guidelines
│   └── SECURITY.md               # Security practices
├── public/                       # Static assets
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
