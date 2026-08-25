# QR Generator

A modern, fast, privacy-first QR code generator **and scanner** built with Next.js. Generate styled QR codes instantly in your browser — no data leaves your device.

## Features

- **Instant Generation** — QR codes update in real-time as you type
- **QR Scanner** — Scan QR codes via camera, image upload, or clipboard paste
- **Privacy First** — All processing happens in your browser, nothing is uploaded
- **Customizable** — Colors, dot shapes, corner styles, gradients, logo overlay
- **Multiple Types** — URL, Text, WiFi, vCard, Email, SMS, Phone, WhatsApp, Location
- **Export Options** — Download as PNG or SVG, copy to clipboard
- **Style Presets** — One-click themes (Minimal, Modern, Playful, Bold, Neon, Sunset)
- **Dark Mode** — Beautiful dark/light theme with system preference detection
- **QR History** — Recent QR codes saved locally for quick access

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4 + [shadcn/ui](https://ui.shadcn.com/)
- **QR Generation**: [qrcode.react](https://github.com/zpao/qrcode.react) + [qr-code-styling](https://github.com/kozakdenys/qr-code-styling)
- **QR Scanning**: [qr-scanner](https://github.com/nimiq/qr-scanner) (~16KB gzipped)
- **Deployment**: [Vercel](https://vercel.com/)

## Documentation

- **[Architecture](./docs/ARCHITECTURE.md)** — System design and technical decisions
- **[Components](./docs/COMPONENTS.md)** — React component reference
- **[Deployment](./docs/DEPLOYMENT.md)** — Deploy to Vercel
- **[Security](./docs/SECURITY.md)** — Security practices and data privacy
- **[Contributing](./docs/CONTRIBUTING.md)** — Contribution guidelines
- **[Plan](./PLAN.md)** — Feature roadmap

## Development

```bash
# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## License

MIT
