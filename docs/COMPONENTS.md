# Components

## Component Architecture

```
QRGenerator (orchestrator)
├── QRTypeSelector
├── QRInput
├── QRPreview
│   └── QRCodeSVG (from qrcode.react)
├── ColorPicker
├── StylePicker
├── LogoUploader
└── DownloadButton
    ├── PNG Export (Canvas)
    └── SVG Export
```

## Component Reference

### QRGenerator

Main orchestrator component. Manages all QR state and passes it to child components.

```tsx
// State managed by QRGenerator
interface QRState {
  content: string;
  type: QRType;
  foreground: string;
  background: string;
  size: number;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  logo: File | null;
  logoSize: number;
}
```

### QRInput

Textarea component for entering QR content.

**Props:**
- `value: string` — Current input value
- `onChange: (value: string) => void` — Change handler
- `type: QRType` — Current QR type (affects placeholder)
- `error?: string` — Validation error message

**Behavior:**
- Debounced input (150ms) for smooth preview updates
- Type-specific placeholders (URL, WiFi SSID, etc.)
- Real-time validation with error display

### QRTypeSelector

Tab-style selector for switching between QR types.

**Props:**
- `value: QRType` — Current type
- `onChange: (type: QRType) => void` — Type change handler

**Supported Types (V2):**
- URL / Text
- WiFi (SSID, password, encryption)
- vCard (name, phone, email, org)
- Email (address, subject, body)
- SMS (number, message)
- Phone (number)
- Calendar Event (title, location, start/end)
- WhatsApp (number, message)
- Location (lat, lng)

### QRPreview

Live QR code display with real-time updates.

**Props:**
- `config: QRConfig` — Full QR configuration object

**Behavior:**
- Renders SVG via `qrcode.react`
- Updates on every state change (no debounce needed for SVG)
- Shows quiet zone (4-module margin)
- Loading state while generating

### ColorPicker

Color selection with contrast ratio calculation.

**Props:**
- `foreground: string` — Current foreground color
- `background: string` — Current background color
- `onForegroundChange: (color: string) => void`
- `onBackgroundChange: (color: string) => void`

**Features:**
- Native color picker input
- Contrast ratio display (WCAG AA: 4.5:1)
- Warning when ratio < 4:1
- Swap foreground/background button

### StylePicker

QR visual style customization.

**Props:**
- `dotStyle: DotStyle` — Current dot style
- `cornerStyle: CornerStyle` — Current corner style
- `onDotStyleChange: (style: DotStyle) => void`
- `onCornerStyleChange: (style: CornerStyle) => void`

**Dot Styles:**
- `square` — Classic QR (default)
- `rounded` — Rounded corners
- `dots` — Circular modules
- `diamond` — Diamond-shaped

**Corner Styles:**
- `square` — Classic (default)
- `rounded` — Rounded outer corners
- `dots` — Circular finder patterns

### LogoUploader

Logo image upload and preview.

**Props:**
- `logo: File | null` — Current logo file
- `logoSize: number` — Logo size (0-25% of QR width)
- `onLogoChange: (file: File | null) => void`
- `onLogoSizeChange: (size: number) => void`

**Constraints:**
- Accepts: PNG, JPG, SVG
- Max file size: 2MB
- Recommended: ≤20% of QR width
- Auto-sets error correction to H when logo present

### DownloadButton

Export QR code as PNG or SVG.

**Props:**
- `config: QRConfig` — Full QR configuration
- `filename?: string` — Download filename (default: "qr-code")

**Export Options:**
- **PNG**: Renders to Canvas, exports as data URL
- **SVG**: Generates SVG string, creates Blob for download
- **Copy**: Copies SVG to clipboard

## Shared Types

```typescript
type QRType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'sms' | 'phone' | 'calendar' | 'whatsapp' | 'location';

type DotStyle = 'square' | 'rounded' | 'dots' | 'diamond';

type CornerStyle = 'square' | 'rounded' | 'dots';

type ErrorCorrection = 'L' | 'M' | 'Q' | 'H';

interface QRConfig {
  content: string;
  type: QRType;
  foreground: string;
  background: string;
  size: number;
  errorCorrection: ErrorCorrection;
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  logo: string | null; // data URL
  logoSize: number; // percentage (0-25)
}
```

## Accessibility

- All interactive elements have `aria-label` attributes
- Color picker includes contrast ratio announcement
- Keyboard navigation for type selector
- Focus visible states on all controls
- SVG output includes `title` and `desc` for screen readers
