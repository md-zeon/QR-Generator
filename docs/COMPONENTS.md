# Components

## Component Architecture

```
QRGenerator (orchestrator)
├── QRTypeSelector (3x3 visual grid)
├── QRInput (type-specific forms)
├── QRPreview (live SVG — qrcode.react)
├── QRPreviewStylized (gradient — qr-code-styling)
├── QRScanner (camera + image + clipboard)
├── ColorPicker (with contrast warning)
├── StylePicker (dot/corner styles)
├── GradientPicker (linear/radial config)
├── StylePresets (one-click themes)
├── LogoUploader (with preview)
├── DownloadButton (PNG/SVG/Copy)
├── HistoryPanel (horizontal scroll)
└── ThemeToggle (dark/light switch)
```

## Component Reference

### QRGenerator

Main orchestrator component. Manages all QR state, top-level Generate/Scan tabs, and two-column workspace layout.

**State hooks used:**
- `useQRConfig()` — config, fields, errors, handlers
- `useExport(config)` — downloadPNG, downloadSVG, copyToClipboard
- `useHistory()` — history, addToHistory, removeFromHistory

**Layout:**
- Desktop: Two-column grid (create left, sticky preview right)
- Mobile: Preview first, then create, then design
- Top-level: Generate / Scan tab bar
- Design section: Segmented tabs (Presets, Colors, Style, Gradient, Logo)

### QRTypeSelector

3x3 visual grid picker for switching between QR types.

**Props:**
- `value: QRType` — Current type
- `onChange: (type: QRType) => void` — Type change handler

**Accessibility:**
- `aria-pressed` on each button for selected state
- Visual ring/border for active selection

**Supported Types:**
- URL, Text, WiFi
- Contact/vCard, Email, SMS
- Phone, WhatsApp, Location

### QRInput

Type-specific input forms for entering QR content.

**Props:**
- `type: QRType` — Current QR type (determines form fields)
- `fields: Record<string, string>` — Current field values
- `onFieldChange: (field: string, value: string) => void` — Change handler
- `errors: Record<string, string>` — Validation errors

**Behavior:**
- Renders different form fields based on QR type
- Real-time validation with inline error display
- Type-specific descriptions, placeholders, and helper text
- Auto-focus on first field when type changes

**Type-Specific Forms:**
| Type | Fields |
|------|--------|
| URL | Single text input |
| Text | Textarea |
| WiFi | SSID, Password, Encryption (WPA/WEP/None) |
| vCard | Name, Phone, Email, Organization |
| Email | Address, Subject, Body |
| SMS | Phone Number, Message |
| Phone | Phone Number |
| WhatsApp | Phone Number, Message |
| Location | Latitude, Longitude |

### QRPreview

Live QR code display using `qrcode.react` (non-gradient).

**Props:**
- `config: QRConfig` — Full QR configuration object

**Behavior:**
- Renders SVG via `QRCodeSVG` from qrcode.react
- Shows demo QR (`https://example.com`) when content is empty
- Includes `aria-label` with QR content description
- Logo overlay rendered as absolute-positioned div

### QRPreviewStylized

Gradient QR code display using `qr-code-styling`.

**Props:**
- `config: QRConfig` — Full QR configuration object

**Behavior:**
- Creates `QRCodeStyling` instance and appends to container via DOM
- Supports gradients, dot shapes, corner styles, logo via image options
- Shows demo QR when content is empty
- Returns `null` when gradient is disabled (defers to QRPreview)

### QRScanner

QR code scanner with camera, image upload, and clipboard paste.

**Features:**
- Camera mode with viewfinder overlay and scan line animation
- Image upload (drag & drop + file picker)
- Clipboard paste (Ctrl+V)
- Type-aware result detection (URL, WiFi, vCard, email, SMS, phone, location)
- Action buttons per type (Open, Copy, Copy Password, etc.)
- Privacy note about client-side processing

**Detection Types:**
| Type | Detection Pattern | Actions |
|------|------------------|---------|
| URL | `https?://` | Open Link, Copy |
| WiFi | `WIFI:` | Copy Password, Copy SSID |
| vCard | `BEGIN:VCARD` | Copy |
| Email | `mailto:` | Open Email, Copy |
| SMS | `sms:` | Open SMS, Copy |
| Phone | `tel:` | Call, Copy |
| Location | `geo:` | Open Maps, Copy |
| Text | (fallback) | Copy |

### ColorPicker

Color selection with contrast ratio calculation.

**Props:**
- `foreground: string` — Current foreground color
- `background: string` — Current background color
- `onForegroundChange: (color: string) => void`
- `onBackgroundChange: (color: string) => void`

**Features:**
- Native color picker input with `aria-label`
- Hex input field for precise values
- Real-time contrast ratio calculation (AAA/AA/Fail)
- Swap button to invert colors
- 6 quick preset color combinations

### StylePicker

QR visual style customization.

**Props:**
- `dotStyle: DotStyle` — Current dot style
- `cornerStyle: CornerStyle` — Current corner style
- `onDotStyleChange: (style: DotStyle) => void`
- `onCornerStyleChange: (style: CornerStyle) => void`

**Dot Styles:**
- `square` — Classic QR (default, most scannable)
- `rounded` — Rounded corners (modern look)
- `dots` — Circular modules (decorative)
- `diamond` — Diamond-shaped (unique)

**Corner Styles:**
- `square` — Classic (default, most reliable)
- `rounded` — Rounded outer corners
- `dots` — Circular finder patterns

### GradientPicker

Gradient configuration for QR code colors.

**Props:**
- `gradient: GradientConfig` — Current gradient config
- `onGradientChange: (gradient: GradientConfig) => void`

**Features:**
- Toggle switch to enable/disable gradient
- Linear/Radial type selector
- Two color pickers (Color 1, Color 2) with hex input
- Rotation slider (0-360°) for linear gradients
- Live gradient preview bar

### StylePresets

One-click theme presets for quick styling.

**Props:**
- `onApply: (updates: Partial<QRConfig>) => void`

**Presets:**
| Name | Style | Colors | Gradient |
|------|-------|--------|----------|
| Minimal | Square dots, square corners | Black/White | No |
| Modern | Rounded dots, rounded corners | Navy/Light | No |
| Playful | Dot dots, dot corners | Purple/White | No |
| Bold | Diamond dots, square corners | Red/Light | No |
| Neon | Rounded dots, rounded corners | Green/Dark | Linear |
| Sunset | Dot dots, rounded corners | Red/Dark | Linear |

### LogoUploader

Logo image upload and preview.

**Props:**
- `logo: string | null` — Current logo data URL
- `logoSize: number` — Logo size percentage (5-30)
- `onLogoChange: (logo: string | null) => void`
- `onLogoSizeChange: (size: number) => void`

**Features:**
- File upload with image type validation
- Logo preview when uploaded
- Size slider (5-30% of QR width)
- Remove button
- Auto-sets error correction to H when logo present

### DownloadButton

Export QR code as PNG, SVG, or copy to clipboard.

**Props:**
- `config: QRConfig` — Full QR configuration
- `onDownloadPNG: () => void`
- `onDownloadSVG: () => void`
- `onCopy: () => void`

**Export Options:**
- **PNG**: Uses `qr-code-styling`'s `getRawData('png')` directly
- **SVG**: Uses `qr-code-styling`'s `getRawData('svg')` directly
- **Copy**: Copies SVG markup to clipboard

**Additional Info:**
- Settings summary showing size, error correction, color mode
- Disabled when no content is entered

### HistoryPanel

Horizontal scrollable history of recent QR codes.

**Props:**
- `history: HistoryItem[]` — List of saved QR configs
- `onSelect: (config: QRConfig) => void` — Restore config
- `onRemove: (id: string) => void` — Remove item
- `onClear: () => void` — Clear all history

**Features:**
- Stored in localStorage
- Maximum 10 items
- Shows type label, content preview, and time ago
- Horizontal scroll with hidden scrollbar
- One-click restore to full config

### ThemeToggle

Dark/light mode toggle with system preference detection.

**Behavior:**
- Detects system preference via `prefers-color-scheme`
- Manual toggle with localStorage persistence
- SSR-safe mounting (avoids hydration mismatch)
- Toggles `dark` class on `<html>` element

### Toast (useToast)

Toast notification hook using `sonner`.

**Usage:**
```typescript
const { addToast } = useToast();
addToast('QR code downloaded', 'success');
addToast('Failed to generate', 'error');
```

**Features:**
- Auto-dismiss after 3 seconds
- Supports success, error, info types
- Rich colors and icons

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
  logo: string | null;       // data URL
  logoSize: number;          // percentage (5-30)
  gradient: GradientConfig;
}

interface GradientConfig {
  enabled: boolean;
  type: 'linear' | 'radial';
  color1: string;
  color2: string;
  rotation: number;          // degrees (0-360)
}
```

## UI Component Library (shadcn/ui)

The project uses shadcn/ui components built on `@base-ui/react`:

| Component | Used In |
|-----------|---------|
| Button | Throughout all components |
| Input | QRInput, ColorPicker, GradientPicker |
| Textarea | QRInput (text type) |
| Label | ColorPicker, StylePicker, GradientPicker, LogoUploader |
| Badge | ColorPicker (contrast display) |
| Slider | GradientPicker (rotation), LogoUploader (size) |
| Switch | GradientPicker (enable toggle) |
| Tabs | QRGenerator (top-level + design section) |
| Toaster | QRGenerator (toast container) |

**Note:** The `@base-ui/react` Accordion does NOT accept a `type` prop. The Select component was replaced with native HTML `<select>` elements in DownloadButton and QRInput.

## Accessibility Checklist

### Keyboard Navigation
- [x] All interactive elements focusable
- [x] Tab order follows visual layout
- [x] Enter/Space activates buttons

### Screen Readers
- [x] Color inputs have `aria-label` attributes
- [x] QR type selector uses `aria-pressed`
- [x] QR preview has descriptive `aria-label`
- [x] Form errors announced when they appear

### Visual
- [x] Focus visible states on all controls
- [x] Minimum 4.5:1 contrast for text
- [x] No information conveyed by color alone
