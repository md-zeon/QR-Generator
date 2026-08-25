import QRGenerator from '@/components/QRGenerator';
import ThemeToggle from '@/components/ThemeToggle';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold">QR Generator</h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Fast, private, and free
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="hidden sm:inline-flex">
              100% Client-Side
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <QRGenerator />

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          Built with Next.js &bull; No data collection &bull; Open Source
        </div>
      </footer>
    </main>
  );
}
