# Architecture

## Overview

QR Generator is a fully client-side application with both QR generation and scanning capabilities. All processing happens in the browser — no data is sent to any server. This ensures privacy and enables offline functionality.

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          Browser                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────────────────────────────────┐ │
│  │   Input     │───>│         QR Generation Engine            │ │
│  │  Component  │    │  ┌───────────────────────────────────┐  │ │
│  │  (Type-     │    │  │  qrcode.react                     │  │ │
│  │   specific  │    │  │  (React SVG component)            │  │ │
│  │   forms)    │    │  └───────────────────────────────────┘  │ │
│  └─────────────┘    │  ┌───────────────────────────────────┐  │ │
│                     │  │  qr-code-styling                   │  │ │
│  ┌─────────────┐    │  │  (dot shapes, corners, gradients)  │  │ │
│  │   Style     │───>│  └───────────────────────────────────┘  │ │
│  │  Components │    └─────────────────────────────────────────┘ │
│  └─────────────┘                                                │
│                     ┌─────────────────────────────────────────┐ │
│  ┌─────────────┐    │           QR Scanner Engine             │ │
│  │   QR        │    │  ┌───────────────────────────────────┐  │ │
│  │  Scanner    │───>│  │  qr-scanner (nimiq)               │  │ │
│  │  (Camera/   │    │  │  Camera + Image + Clipboard        │  │ │
│  │   Upload)   │    │  └───────────────────────────────────┘  │ │
│  └─────────────┘    └─────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           State Management (useQRConfig)                │    │
│  │  ┌───────────────────────────────────┐                  │    │
│  │  │  React useState + useCallback     │                  │    │
│  │  │  (no external state library)      │                  │    │
│  │  └───────────────────────────────────┘                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    QR Preview                            │    │
│  │  QRPreview (qrcode.react)  │  QRPreviewStylized         │    │
│  │  (non-gradient SVG)        │  (qr-code-styling canvas)  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   Export Engine                          │    │
│  │  PNG (qr-code-styling)  │  SVG  │  Copy (Clipboard API) │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                 Theme Provider                           │    │
│  │           (dark/light via class strategy)                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Generation
```
User Input ──> Input Parser ──> Validation ──> QR Config ──> Matrix Generator ──> Style Renderer ──> Preview
                                                                                               │
                                                                                               v
                                                                                        Export (PNG/SVG/Copy)
```

1. **Input**: User enters text/URL or fills type-specific form (WiFi, vCard, etc.)
2. **Parsing**: Input is validated and formatted according to QR type
3. **Validation**: Check contrast ratio, input length, required fields
4. **Config**: QRConfig object is assembled with all parameters
5. **Matrix**: QR code matrix is generated using `qrcode.react` (SVG) or `qr-code-styling` (gradient)
6. **Preview**: Live QR is rendered in React component tree
7. **Export**: User downloads as PNG/SVG or copies to clipboard

### Scanning
```
Camera/Image ──> qr-scanner ──> Type Detection ──> Action Buttons
```

1. **Capture**: Camera feed, image file, or clipboard paste
2. **Decode**: `qr-scanner` library decodes QR data
3. **Detect**: Type-aware regex matching identifies content type (URL, WiFi, vCard, etc.)
4. **Act**: Context-aware action buttons (Open, Copy, Copy Password, etc.)

## State Management

### Why No External State Library
- App state is simple and local to one page
- React's built-in hooks (`useState`, `useCallback`) are sufficient
- Avoids bundle size overhead of Redux/Zustand
- State is not shared across routes

### State Structure

```typescript
interface QRConfig {
  content: string;
  type: QRType;

  // Styling
  foreground: string;
  background: string;
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;

  // Output
  size: number;
  errorCorrection: ErrorCorrection;

  // Logo
  logo: string | null; // data URL after FileReader
  logoSize: number; // percentage (5-30)

  // Gradient
  gradient: GradientConfig;
}
```

### State Flow Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                     QRGenerator                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  useQRConfig() → config, fields, errors               │  │
│  │  useExport(config) → downloadPNG, downloadSVG, copy    │  │
│  │  useHistory() → history, addToHistory                  │  │
│  │                                                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │  QRInput    │  │ QRPreview   │  │ ColorPicker  │   │  │
│  │  │             │  │             │  │              │   │  │
│  │  │  props ↓    │  │  config ↓   │  │  colors ↓    │   │  │
│  │  │  onChange ↑ │  │             │  │  onChange ↑   │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  │                                                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │StylePicker  │  │LogoUploader │  │DownloadBtn   │   │  │
│  │  │GradientPick │  │StylePresets │  │HistoryPanel  │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Key Technical Decisions

### Client-Side Only
- No backend, no API routes, no database
- All processing happens in browser via Web APIs
- Privacy guarantee: no data leaves the device
- Works offline after initial load

### Library Selection
| Library | Purpose | Why |
|---------|---------|-----|
| `qrcode.react` | React SVG rendering | Zero deps, native JSX integration |
| `qr-code-styling` | Visual customization + export | Dot shapes, corners, gradients, logos, direct PNG/SVG export |
| `qr-scanner` | QR code scanning | ~16KB gzipped, camera + image + clipboard support |
| `sonner` | Toast notifications | Lightweight, accessible, animated |

### Dual Preview System
- `QRPreview` uses `qrcode.react` for fast SVG rendering (non-gradient)
- `QRPreviewStylized` uses `qr-code-styling` for gradient support
- Switching based on `config.gradient.enabled`

### Export via qr-code-styling
- Exports use `qr-code-styling`'s `getRawData()` directly
- Handles Buffer→Blob conversion with `new Uint8Array(data)`
- Works for both gradient and non-gradient QR codes

### Styling Architecture
- Tailwind CSS v4 for utility classes
- shadcn/ui (via `@base-ui/react`) for accessible base components
- oklch color tokens for theme consistency
- Dark/light mode via class strategy with system preference detection

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Main page with header
│   ├── layout.tsx            # Root layout with providers
│   └── globals.css           # Tailwind imports + theme tokens
├── components/
│   ├── QRGenerator.tsx       # Main orchestrator (Generate/Scan tabs)
│   ├── QRInput.tsx           # Type-specific input forms
│   ├── QRTypeSelector.tsx    # 3x3 visual grid picker
│   ├── QRPreview.tsx         # Live QR display (qrcode.react)
│   ├── QRPreviewStylized.tsx # Gradient QR display (qr-code-styling)
│   ├── QRScanner.tsx         # Camera + image + clipboard scanner
│   ├── ColorPicker.tsx       # Colors + contrast ratio
│   ├── StylePicker.tsx       # Dot/corner style grid
│   ├── GradientPicker.tsx    # Gradient config (linear/radial)
│   ├── StylePresets.tsx      # One-click theme presets
│   ├── LogoUploader.tsx      # Logo upload with preview
│   ├── DownloadButton.tsx    # Export options (PNG/SVG/Copy)
│   ├── History.tsx           # Horizontal scroll history
│   ├── ThemeToggle.tsx       # Dark/light mode switch
│   ├── Toast.tsx             # Toast notification hook
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── qr-types.ts           # QR type formatters & initial fields
│   ├── constants.ts          # Defaults, presets, options
│   ├── contrast.ts           # WCAG contrast calculation
│   └── utils.ts              # cn() utility
├── hooks/
│   ├── useQRConfig.ts        # QR state management hook
│   └── useExport.ts          # Export logic hook
└── types/
    └── index.ts              # Shared TypeScript types
```

## Performance Considerations

- QR generation is synchronous and fast (< 10ms typical)
- SVG rendering is declarative via React (no manual DOM manipulation)
- Export uses `qr-code-styling`'s `getRawData()` for direct binary output
- Bundle size kept small by avoiding unnecessary dependencies

### Performance Targets
| Metric | Target | Why |
|--------|--------|-----|
| LCP | < 2.5s | Core Web Vital for loading |
| INP | < 200ms | Core Web Vital for interaction |
| CLS | < 0.1 | Core Web Vital for visual stability |
| QR Generation | < 100ms | User perception of "instant" |

## Accessibility

### WCAG 2.1 AA Compliance
- Minimum contrast ratio 4.5:1 for text
- Minimum contrast ratio 3:1 for UI components
- All interactive elements keyboard accessible
- Focus visible states on all controls
- ARIA labels on color inputs and QR type selector

### Screen Reader Support
- QR preview includes `aria-label` describing the QR content
- QR type selector uses `aria-pressed` for selected state
- Color inputs have `aria-label` attributes
- Form errors announced when they appear

### Keyboard Navigation
- Tab order follows visual layout
- Enter/Space activates buttons
- Color pickers accessible via keyboard

## Security

### Data Privacy
- No external API calls at runtime
- No user data collection or analytics
- Logo images processed locally (FileReader API)
- QR history stored in localStorage only

### Input Safety
- User input is never inserted via `innerHTML`
- All dynamic content is properly escaped
- No eval() or dynamic code execution
- URL validation before opening external links

### File Handling
- Logo uploads processed client-side only
- File type validation (image/*)
- No file upload to servers

## Offline Support

### Current
- App works offline after initial load (static assets cached by browser)
- All QR generation and scanning is client-side (no network required)

### Future
- Service worker for offline caching
- PWA manifest for installability
- Cache-first strategy for static assets
