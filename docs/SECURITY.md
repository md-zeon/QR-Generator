# Security

## Overview

QR Generator is a fully client-side application with both QR generation and scanning capabilities. All processing happens in the browser — no data is sent to any server.

## Data Privacy

### What We Don't Collect
- No user data or analytics
- No cookies or tracking
- No server-side processing
- No account or authentication
- No IP logging

### What Stays on Your Device
- All QR code content you enter
- Logo images you upload
- Generated QR code data
- Scanned QR code data
- Your style preferences (localStorage)

## Input Safety

### XSS Prevention
- User input is never inserted via `innerHTML`
- All dynamic content is properly escaped
- SVG output is sanitized before rendering
- No `eval()` or dynamic code execution

### URL Validation
- External links validated before opening
- Only `http:`, `https:`, `mailto:`, `tel:`, `sms:`, `geo:` protocols allowed
- `javascript:` and other dangerous URIs blocked

### File Upload Safety
- Logo uploads processed client-side only
- File type validation (image/*)
- No file upload to servers
- Files read via FileReader API (not executed)

## SVG Security

### Sanitization
- SVG output is validated before rendering
- No `<script>` tags allowed in SVG
- No event handlers in SVG elements
- No external resource loading

### Safe Rendering
```tsx
// Safe: Using React's JSX (automatically escapes)
<QRCodeSVG value={userInput} />

// Unsafe: Never do this
<div dangerouslySetInnerHTML={{ __html: unsanitizedSvg }} />
```

## Browser Security

### Content Security Policy
Recommended CSP headers for deployment:
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  connect-src 'none';
```

### Permissions
- Camera access required only when using QR scanner feature
- Camera feed stays on-device (no streaming to servers)
- No microphone access
- No location access
- No notification permissions

## API Security

### No External APIs
- All QR generation is client-side
- All QR scanning is client-side
- No third-party API calls at runtime
- No CDN dependencies after initial load
- No analytics or tracking scripts

### If Adding Features
If future features require external APIs:
1. Use HTTPS only
2. Validate all inputs server-side
3. Implement rate limiting
4. Add CORS restrictions
5. Document all data flows

## localStorage Security

### What's Stored
- Theme preference (dark/light)
- Recent QR history (optional)

### Security Measures
- No sensitive data in localStorage
- Data is not synced across devices
- User can clear data via browser settings
- No third-party access to localStorage

## Clipboard Security

### Clipboard API Usage
- Clipboard API called only on explicit user action
- Fallback to `document.execCommand('copy')` for non-secure contexts
- No silent clipboard access

## QR Scanner Security

### Camera Access
- Camera permission requested only when user clicks "Enable Camera"
- Camera feed processed entirely on-device
- No images or video sent to any server
- Camera stream stopped when scanner is closed or tab is switched

### Image Scanning
- Images processed entirely in-browser
- No image data uploaded or stored
- QR decode happens via Web Workers on-device

## Accessibility Security

### Keyboard Navigation
- All interactive elements keyboard accessible
- No keyboard traps
- Focus visible on all controls

### Screen Reader Security
- ARIA labels on all interactive elements
- Status announcements via `aria-live`
- Form errors announced when they appear
- No information conveyed by color alone

## Deployment Security

### Vercel Configuration
- Enable HTTPS only
- Set security headers
- Enable HSTS

### Environment Variables
- No secrets in client-side code
- No API keys exposed
- No database credentials

## Reporting Vulnerabilities

If you discover a security vulnerability:

1. **Don't** open a public GitHub issue
2. Email security@your-domain.com (if applicable)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you to resolve the issue.

## Security Checklist

### Before Deployment
- [ ] No sensitive data in code
- [ ] All inputs validated
- [ ] SVG output sanitized
- [ ] No `dangerouslySetInnerHTML` with user content
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] No external API calls
- [ ] URL validation before opening external links

### For Contributors
- [ ] Never commit secrets or API keys
- [ ] Use environment variables for config
- [ ] Validate all user inputs
- [ ] Sanitize any HTML/SVG output
- [ ] Follow OWASP guidelines
