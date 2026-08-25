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

### Layout
```
┌─────────────────────────────────────────┐
│  QR Generator                           │
│  ─────────────────────────────────────  │
│                                         │
│  ┌──────────────────┐  ┌─────────────┐ │
│  │                  │  │             │ │
│  │  Input Area      │  │  QR Preview │ │
│  │  (textarea)      │  │             │ │
│  │                  │  │             │ │
│  └──────────────────┘  └─────────────┘ │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │  Customization Options           │   │
│  │  • QR Type (URL, WiFi, vCard..) │   │
│  │  • Foreground/Background Color   │   │
│  │  • Dot Shape & Corner Style      │   │
│  │  • Size                          │   │
│  │  • Error Correction Level        │   │
│  │  • Logo Upload                   │   │
│  └──────────────────────────────────┘   │
│                                         │
│  [Download PNG] [Download SVG] [Copy]   │
│                                         │
└─────────────────────────────────────────┘
```

### Color Palette
- Background: `#0A090F` (dark)
- Primary: `#5542FF` (purple accent)
- Text: `#EFEFE6` (off-white)
- Cards: `#1A1A1E` (dark gray)

### Key Components
- `QRInput` — textarea for text/URL with validation
- `QRTypeSelector` — switch between QR types (URL, WiFi, vCard, etc.)
- `QRPreview` — live QR display with real-time updates
- `ColorPicker` — foreground/background color with contrast warning
- `StylePicker` — dot shape, corner style, gradient options
- `LogoUploader` — upload and position center logo
- `DownloadButton` — PNG/SVG export with size options
- `CopyButton` — clipboard copy

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
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
- [ ] Custom foreground/background colors
- [ ] Download as SVG
- [ ] QR size selector (256px, 512px, 1024px, 2048px)
- [ ] Error correction level (L, M, Q, H)
- [ ] Dark/light theme toggle
- [ ] Input validation with error messages
- [ ] Contrast ratio warning (< 4:1)

### V2
- [ ] Logo/center image overlay (centered, ≤20% width, opaque background)
- [ ] Dot shape styles (square, rounded, dots, diamond)
- [ ] Corner/eye style customization
- [ ] Gradient support (linear/radial)
- [ ] Multiple QR types: WiFi, vCard, Email, SMS, Phone, Calendar, WhatsApp, Location
- [ ] QR history (localStorage)
- [ ] Style presets/templates

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
├── app/
│   ├── page.tsx           # Main page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Tailwind imports
├── components/
│   ├── QRInput.tsx        # Text input area
│   ├── QRTypeSelector.tsx # QR type switcher
│   ├── QRPreview.tsx      # QR display
│   ├── ColorPicker.tsx    # Color customization
│   ├── StylePicker.tsx    # Dot/corner style options
│   ├── LogoUploader.tsx   # Logo upload component
│   ├── DownloadButton.tsx # Export options
│   └── ui/                # shadcn components
├── lib/
│   ├── generateQR.ts      # QR generation logic
│   ├── qr-types.ts        # QR type definitions (URL, WiFi, vCard, etc.)
│   └── constants.ts       # Color palette, defaults
├── docs/
│   ├── README.md          # Project overview
│   ├── ARCHITECTURE.md    # System architecture
│   ├── COMPONENTS.md      # Component documentation
│   ├── API.md             # API reference (if any)
│   ├── DEPLOYMENT.md      # Deployment guide
│   └── CONTRIBUTING.md    # Contribution guidelines
├── package.json
├── tailwind.config.ts
├── tsconfig.json
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
