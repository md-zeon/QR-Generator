# QR Generator

A modern, fast, privacy-first QR code generator built with Next.js. Generate styled QR codes instantly in your browser — no data leaves your device.

## Features

- **Instant Generation** — QR codes update in real-time as you type
- **Privacy First** — All processing happens in your browser
- **Customizable** — Colors, dot shapes, corner styles, logo overlay
- **Multiple Types** — URL, WiFi, vCard, Email, SMS, Phone, and more
- **Export Options** — Download as PNG or SVG
- **Dark Mode** — Beautiful dark theme with light mode toggle

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
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **QR Generation**: [qrcode.react](https://github.com/zpao/qrcode.react) + [qrcode](https://github.com/soldair/node-qrcode) + [qr-code-styling](https://github.com/kozakdenys/qr-code-styling)
- **Deployment**: [Vercel](https://vercel.com/)

## Documentation

- **[Architecture](./docs/ARCHITECTURE.md)** — System design and technical decisions
- **[Components](./docs/COMPONENTS.md)** — React component reference
- **[Deployment](./docs/DEPLOYMENT.md)** — Deploy to Vercel
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
