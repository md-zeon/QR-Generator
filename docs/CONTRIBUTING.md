# Contributing

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/qr-generator.git
cd qr-generator

# Install dependencies
npm install

# Start dev server
npm run dev
```

## Code Style

### TypeScript

- Use TypeScript for all new files
- Prefer interfaces over types for object shapes
- Use `type` for unions and primitives
- Export types from `types/index.ts`

```typescript
// Good
interface QRConfig {
  content: string;
  foreground: string;
}

type DotStyle = 'square' | 'rounded' | 'dots';

// Avoid
type QRConfig = {
  content: string;
  foreground: string;
};
```

### React Components

- Use functional components with hooks
- One component per file
- Export as default from file
- Co-locate styles with component

```tsx
// Good: QRInput.tsx
import { useState } from 'react';

interface QRInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function QRInput({ value, onChange }: QRInputProps) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} />;
}
```

### Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `QRPreview.tsx` |
| Utilities | camelCase | `generateQR.ts` |
| Types | PascalCase | `QRConfig` |
| Constants | UPPER_SNAKE | `DEFAULT_SIZE` |
| CSS classes | kebab-case | `qr-preview` |

### File Structure

```
src/
├── components/
│   ├── ComponentName.tsx    # One component per file
│   └── ui/                  # shadcn primitives (don't modify)
├── lib/
│   └── utility.ts           # Helper functions
├── types/
│   └── index.ts             # Shared types
└── app/
    └── page.tsx             # Route pages
```

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add logo upload component
fix: correct contrast ratio calculation
docs: update deployment guide
style: format QRPreview.tsx
refactor: extract QR generation logic
test: add unit tests for qr-types
chore: update dependencies
```

## Pull Request Process

1. **Update documentation** if adding features
2. **Add tests** for new functionality
3. **Run linter** before submitting:
   ```bash
   npm run lint
   ```
4. **Keep PRs focused** — one feature/fix per PR
5. **Write clear PR description** explaining changes

## QR Code Guidelines

When working on QR generation:

### Scannability Rules

1. **Contrast**: Minimum 4:1 ratio (7:1 recommended)
2. **Quiet zone**: 4-module margin required
3. **Finder patterns**: Never cover corner squares
4. **Logo**: Center only, ≤20% width, opaque background
5. **Error correction**: Level H when logo present

### Testing QR Codes

Always test generated QR codes:
1. iOS native camera
2. Android native camera
3. At intended print size
4. With multiple QR scanner apps

## Bug Reports

Include in bug reports:
- Browser and version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- QR code that fails (if relevant)

## Feature Requests

Include:
- Use case description
- Mockups or examples if applicable
- How it fits with existing features
- Willingness to contribute

## Questions?

Open a GitHub Discussion for questions that aren't bugs or feature requests.
