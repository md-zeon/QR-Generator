# Architecture

## Overview

QR Generator is a fully client-side application. All QR code generation happens in the browser — no data is sent to any server. This ensures privacy and enables offline functionality.

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
│                     │  │  qrcode (matrix generation)        │  │ │
│  ┌─────────────┐    │  └───────────────────────────────────┘  │ │
│  │   Style     │───>│  ┌───────────────────────────────────┐  │ │
│  │  Component  │    │  │  qr-code-styling                   │  │ │
│  │  (Colors,   │    │  │  (dot shapes, corners, gradients)  │  │ │
│  │   dots,     │    │  └───────────────────────────────────┘  │ │
│  │   corners)  │    └─────────────────────────────────────────┘ │
│  └─────────────┘                                                │
│                     ┌─────────────────────────────────────────┐ │
│  ┌─────────────┐    │           State Management              │ │
│  │   Logo      │───>│  ┌───────────────────────────────────┐  │ │
│  │  Upload     │    │  │  React useState + useReducer       │  │ │
│  │  (File API) │    │  │  (no external state library)       │  │ │
│  └─────────────┘    │  └───────────────────────────────────┘  │ │
│                     └─────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    QR Preview                            │    │
│  │           (Real-time SVG rendering)                      │    │
│  │           (Debounced input updates)                      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   Export Engine                          │    │
│  │  PNG (Canvas)  │  SVG (Blob)  │  Copy (Clipboard API)   │    │
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
5. **Matrix**: QR code matrix is generated using `qrcode` library
6. **Styling**: Matrix is styled with colors, dot shapes, corners via `qr-code-styling`
7. **Preview**: Styled QR is rendered as SVG in React component tree
8. **Export**: User downloads as PNG (via Canvas), SVG (Blob), or copies to clipboard

## State Management

### Why No External State Library
- App state is simple and local to one page
- React's built-in hooks (`useState`, `useReducer`, `useCallback`) are sufficient
- Avoids bundle size overhead of Redux/Zustand
- State is not shared across routes

### State Structure

```typescript
interface QRState {
  // Content
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
  logoSize: number; // percentage (0-25)

  // UI state
  isGenerating: boolean;
  error: string | null;
}
```

### State Flow Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                     QRGenerator                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  useState<QRState>({...defaults})                     │  │
│  │                                                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │  QRInput    │  │ QRPreview   │  │ ColorPicker  │   │  │
│  │  │             │  │             │  │              │   │  │
│  │  │  props ↓    │  │  config ↓   │  │  colors ↓    │   │  │
│  │  │  onChange ↑ │  │             │  │  onChange ↑   │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  │                                                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │ StylePicker │  │LogoUploader │  │DownloadBtn   │   │  │
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
│   ├── Toast.tsx             # Notification component
│   └── ui/                   # shadcn/ui primitives
├── lib/
│   ├── generateQR.ts         # QR generation logic
│   ├── qr-types.ts           # QR type definitions & formatters
│   ├── constants.ts          # Defaults, color palette
│   └── contrast.ts           # WCAG contrast ratio calculation
├── hooks/
│   ├── useQRConfig.ts        # QR state management hook
│   └── useExport.ts          # Export logic hook
└── types/
    └── index.ts              # Shared TypeScript types
```

## Performance Considerations

- QR generation is synchronous and fast (< 10ms typical)
- SVG rendering is declarative via React (no manual DOM manipulation)
- Debounced input (150ms) prevents excessive re-renders during typing
- PNG export uses OffscreenCanvas when available
- Bundle size target: < 50KB gzipped total

### Performance Targets
| Metric | Target | Why |
|--------|--------|-----|
| LCP | < 2.5s | Core Web Vital for loading |
| INP | < 200ms | Core Web Vital for interaction |
| CLS | < 0.1 | Core Web Vital for visual stability |
| QR Generation | < 100ms | User perception of "instant" |
| Bundle Size | < 50KB gzipped | Fast initial load |

## Accessibility

### WCAG 2.1 AA Compliance
- Minimum contrast ratio 4.5:1 for text
- Minimum contrast ratio 3:1 for UI components
- All interactive elements keyboard accessible
- Focus visible states on all controls
- ARIA labels on non-text elements

### Screen Reader Support
- QR preview includes `aria-label` describing the QR content
- Status announcements via `aria-live="polite"`
- Form errors announced when they appear
- Type selector has proper `role="tablist"` pattern

### Keyboard Navigation
- Tab order follows visual layout
- Type selector navigable with arrow keys
- Escape key closes modals/dropdowns
- Enter/Space activates buttons

## Security

### Data Privacy
- No external API calls at runtime
- No user data collection or analytics
- Logo images processed locally (FileReader API)
- No cookies or tracking

### Input Safety
- User input is never inserted via `innerHTML`
- All dynamic content is properly escaped
- SVG output is sanitized before rendering
- No eval() or dynamic code execution

### File Handling
- Logo uploads processed client-side only
- File type validation (PNG, JPG, SVG only)
- File size limit (2MB max)
- No file upload to servers

## Offline Support

### Current
- App works offline after initial load (static assets cached by browser)
- All QR generation is client-side (no network required)

### Future (V3)
- Service worker for offline caching
- PWA manifest for installability
- Cache-first strategy for static assets
