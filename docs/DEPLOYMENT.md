# Deployment

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- GitHub account
- Vercel account (free tier works)

## Local Development

```bash
# Clone the repository
git clone https://github.com/md-zeon/QR-Generator.git
cd qr-generator

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

## Build

```bash
# Create production build
npm run build

# Preview production build locally
npm run start
```

## Deploy to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option 2: GitHub Integration

1. Push repository to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Configure settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Click "Deploy"

### Option 3: Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Connect your GitHub repository
4. Vercel auto-detects Next.js configuration
5. Click "Deploy"

## Environment Variables

None required. This is a client-side only application.

## Custom Domain

1. Go to project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS as instructed by Vercel

## Performance Checklist

- [ ] Run `npm run build` without errors
- [ ] Lighthouse score > 95 (Performance, Accessibility, Best Practices, SEO)
- [ ] No console errors in production
- [ ] QR codes scan on iOS and Android
- [ ] QR scanner works on mobile devices with camera

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### QR Not Generating

- Check browser console for errors
- Ensure JavaScript is enabled
- Test with simple text first (e.g., "hello")

### QR Scanner Not Working

- Ensure camera permission is granted
- Test on HTTPS (camera requires secure context)
- Try image upload as fallback

### Slow Generation

- QR generation should be < 100ms
- If slow, check for unnecessary re-renders
- Use React DevTools Profiler to identify bottlenecks

## Rollback

Vercel keeps all deployments. To rollback:

1. Go to project in Vercel dashboard
2. Click "Deployments" tab
3. Find previous working deployment
4. Click "..." → "Promote to Production"
