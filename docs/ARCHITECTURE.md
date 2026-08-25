# Architecture

## Overview

QR Generator is a fully client-side application. All QR code generation happens in the browser — no data is sent to any server. This ensures privacy and enables offline functionality.

## System Diagram

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐    ┌─────────────────────────────┐ │
│  │   Input     │───>│     QR Generation Engine     │ │
│  │  Component  │    │  ┌───────────────────────┐  │ │
│  └─────────────┘    │  │  qrcode.react         │  │ │
│                     │  │  (React SVG output)    │  │ │
│  ┌─────────────┐    │  └───────────────────────┘  │ │
│  │   Style     │───>│  ┌───────────────────────┐  │ │
│  │  Component  │    │  │  qrcode (matrix)       │  │ │
│  └─────────────┘    │  └───────────────────────┘  │ │
│                     │  ┌───────────────────────┐  │ │
│  ┌─────────────┐    │  │  qr-code-styling      │  │ │
│  │   Logo      │───>│  │  (dot/corner/gradient) │  │ │
│  │  Upload     │    │  └───────────────────────┘  │ │
│  └─────────────┘    └─────────────────────────────┘ │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │              QR Preview                      │    │
│  │         (Real-time SVG rendering)            │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │              Export Engine                   │    │
│  │    PNG (Canvas)  │  SVG (Direct)  │ Copy    │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Data Flow

```
User Input ──> QR Type Parser ──> Matrix Generator ──> Style Renderer ──> Preview
                                                                      │
                                                                      v
                                                               Export (PNG/SVG)
```

1. **Input**: User enters text/URL or fills type-specific form (WiFi, vCard, etc.)
2. **Parsing**: Input is validated and formatted according to QR type
3. **Matrix**: QR code matrix is generated using `qrcode` library
4. **Styling**: Matrix is styled with colors, dot shapes, corners via `qr-code-styling`
5. **Preview**: Styled QR is rendered as SVG in React component tree
6. **Export**: User downloads as PNG (via Canvas) or SVG (direct)

## Key Technical Decisions

### Client-Side Only
- No backend, no API routes, no database
- All processing happens in browser via Web APIs
- Privacy guarantee: no data leaves the device
- Works offline after initial load

### Library Selection
| Library | Purpose | Why |
|---------|---------|-----|
| `qrcode.react` | React SVG rendering | Zero deps, 5.9KB, native JSX integration |
| `qrcode` | Matrix generation | Battle-tested, 22M+ weekly downloads |
| `qr-code-styling` | Visual customization | Dot shapes, corners, gradients, logo support |

### Styling Architecture
- Tailwind CSS v4 for utility classes
- shadcn/ui for accessible base components
- CSS custom properties for theme colors
- Dark/light mode via class strategy

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Main page (server component shell)
│   ├── layout.tsx            # Root layout with providers
│   └── globals.css           # Tailwind imports + custom properties
├── components/
│   ├── QRGenerator.tsx       # Main orchestrator component
│   ├── QRInput.tsx           # Text/URL input with validation
│   ├── QRTypeSelector.tsx    # QR type switcher
│   ├── QRPreview.tsx         # Live QR display
│   ├── ColorPicker.tsx       # Foreground/background colors
│   ├── StylePicker.tsx       # Dot shape, corner style
│   ├── LogoUploader.tsx      # Logo upload with preview
│   ├── DownloadButton.tsx    # Export options
│   └── ui/                   # shadcn/ui primitives
├── lib/
│   ├── generateQR.ts         # QR generation logic
│   ├── qr-types.ts           # QR type definitions
│   └── constants.ts          # Defaults, color palette
└── types/
    └── index.ts              # Shared TypeScript types
```

## Performance Considerations

- QR generation is synchronous and fast (< 10ms typical)
- SVG rendering is declarative via React (no manual DOM manipulation)
- PNG export uses OffscreenCanvas when available
- Bundle size target: < 50KB gzipped total

## Security

- No external API calls at runtime
- No user data collection
- Logo images processed locally (FileReader API)
- No analytics or tracking scripts
