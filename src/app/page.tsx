import QRGenerator from '@/components/QRGenerator';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A090F]">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-[#0A090F]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
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
            <h1 className="text-xl font-bold text-white">QR Generator</h1>
          </div>
          <p className="hidden text-sm text-zinc-500 sm:block">
            Fast, private, and free. No data leaves your browser.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <QRGenerator />

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-zinc-600">
          <p>
            Built with Next.js • 100% client-side • No data collection
          </p>
        </div>
      </footer>
    </main>
  );
}
