# Components

## Component Architecture

```
QRGenerator (orchestrator)
├── QRTypeSelector (tab pattern)
├── QRInput (type-specific forms)
├── QRPreview (live SVG rendering)
│   └── QRCodeSVG (from qrcode.react)
├── ColorPicker (with contrast warning)
├── StylePicker (dot/corner styles)
├── LogoUploader (with preview)
├── DownloadButton (PNG/SVG/Copy)
└── Toast (notification system)
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

**Behavior:**
- Uses `useReducer` for complex state transitions
- Debounces input changes (150ms) before updating preview
- Auto-adjusts error correction to H when logo is present
- Validates contrast ratio on color changes

### QRTypeSelector

Tab-style selector for switching between QR types.

**Props:**
- `value: QRType` — Current type
- `onChange: (type: QRType) => void` — Type change handler

**Accessibility:**
- Uses `role="tablist"` on container
- Each tab has `role="tab"` and `aria-selected`
- Arrow keys navigate between tabs
- Tab panel has `role="tabpanel"`

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

### QRInput

Type-specific input forms for entering QR content.

**Props:**
- `type: QRType` — Current QR type (determines form fields)
- `value: string` — Current input value
- `onChange: (value: string) => void` — Change handler
- `error?: string` — Validation error message

**Behavior:**
- Renders different form fields based on QR type
- Real-time validation with inline error display
- Auto-normalizes URLs (adds https:// if missing)
- Type-specific placeholders and help text

**Type-Specific Forms:**
| Type | Fields |
|------|--------|
| URL | Single text input |
| WiFi | SSID, Password, Encryption (WPA/WEP/None) |
| vCard | Name, Phone, Email, Organization |
| Email | Address, Subject, Body |
| SMS | Phone Number, Message |
| Phone | Phone Number |
| Calendar | Title, Location, Start, End |
| WhatsApp | Phone Number, Message |
| Location | Latitude, Longitude |

### QRPreview

Live QR code display with real-time updates.

**Props:**
- `config: QRConfig` — Full QR configuration object

**Behavior:**
- Renders SVG via `qrcode.react`
- Updates on every state change (no debounce needed for SVG)
- Shows quiet zone (4-module margin)
- Loading state while generating
- Includes `aria-label` with QR content description

**Accessibility:**
```tsx
<QRCodeSVG
  value={config.content}
  aria-label={`QR code for: ${config.content}`}
  title={`QR Code: ${config.content}`}
/>
```

### ColorPicker

Color selection with contrast ratio calculation.

**Props:**
- `foreground: string` — Current foreground color
- `background: string` — Current background color
- `onForegroundChange: (color: string) => void`
- `onBackgroundChange: (color: string) => void`

**Features:**
- Native color picker input
- Real-time contrast ratio calculation
- Visual warning when ratio < 4.5:1
- "Swap" button to invert colors
- Preset color combinations

**Contrast Ratio Display:**
```
┌─────────────────────────────────────┐
│  Foreground: [#1a1a1e]              │
│  Background: [#ffffff]              │
│                                     │
│  Contrast Ratio: 12.5:1 ✅          │
│  WCAG AA: Pass  |  WCAG AAA: Pass   │
└─────────────────────────────────────┘
```

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

**Accessibility:**
- Each style option has visual preview + text label
- Keyboard navigable with arrow keys
- Current selection announced to screen readers

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

**Logo Placement Rules:**
1. Center only (never near corners)
2. Opaque solid background (not transparent)
3. ≤20% of QR width (25% absolute max)
4. Error correction level H required

### DownloadButton

Export QR code as PNG or SVG.

**Props:**
- `config: QRConfig` — Full QR configuration
- `filename?: string` — Download filename (default: "qr-code")

**Export Options:**
- **PNG**: Renders to Canvas, exports as data URL
- **SVG**: Generates SVG string, creates Blob for download
- **Copy**: Copies SVG to clipboard

**Accessibility:**
- Clear button labels ("Download PNG", "Download SVG", "Copy to Clipboard")
- Loading state during export
- Success toast after action

### Toast

Non-disruptive notification system.

**Props:**
- `message: string` — Toast message
- `type: 'success' | 'error' | 'info'` — Toast type
- `onClose: () => void` — Close handler

**Behavior:**
- Auto-dismiss after 3 seconds
- Stacks multiple toasts
- Accessible via `aria-live="polite"`
- Animates in/out

## Shared Types

```typescript
type QRType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'sms' | 'phone' | 'calendar' | 'whatsapp' | 'location';

type DotStyle = 'square' | 'rounded' | 'dots' | 'diamond';

type CornerStyle = 'square' | 'rounded' | 'dots';

type ErrorCorrection = 'L' | 'M' | 'Q' | 'H';

type ToastType = 'success' | 'error' | 'info';

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

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
```

## Accessibility Checklist

### Keyboard Navigation
- [ ] All interactive elements focusable
- [ ] Tab order follows visual layout
- [ ] Type selector navigable with arrow keys
- [ ] Escape key closes dropdowns/modals
- [ ] Enter/Space activates buttons

### Screen Readers
- [ ] All images have alt text
- [ ] Form fields have labels
- [ ] Errors announced via `aria-live`
- [ ] QR preview has descriptive `aria-label`
- [ ] Status changes announced

### Visual
- [ ] Focus visible states on all controls
- [ ] Minimum 4.5:1 contrast for text
- [ ] Minimum 3:1 contrast for UI components
- [ ] No information conveyed by color alone
- [ ] Text resizable up to 200% without loss

### Motion
- [ ] Respects `prefers-reduced-motion`
- [ ] No auto-playing animations
- [ ] Animations can be disabled
- [ ] No flashing content

## Component Patterns

### Controlled Components
All form components use controlled pattern:
```tsx
interface ControlledInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  error?: string;
}
```

### Compound Components
Type selector uses compound pattern:
```tsx
<TypeSelector value={type} onChange={setType}>
  <TypeSelector.Tab value="url">URL</TypeSelector.Tab>
  <TypeSelector.Tab value="wifi">WiFi</TypeSelector.Tab>
  {/* ... */}
</TypeSelector>
```

### Render Props
Preview uses render props for flexibility:
```tsx
<QRPreview config={config}>
  {({ qrElement, isGenerating }) => (
    <div className="preview-container">
      {isGenerating ? <Spinner /> : qrElement}
    </div>
  )}
</QRPreview>
```
