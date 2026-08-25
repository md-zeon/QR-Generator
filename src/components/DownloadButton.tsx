'use client';

import { QRConfig } from '@/types';
import { SIZE_OPTIONS, ERROR_CORRECTION_OPTIONS } from '@/lib/constants';

interface DownloadButtonProps {
  config: QRConfig;
  onConfigChange: (updates: Partial<QRConfig>) => void;
  onDownloadPNG: () => void;
  onDownloadSVG: () => void;
  onCopy: () => void;
}

export default function DownloadButton({
  config,
  onConfigChange,
  onDownloadPNG,
  onDownloadSVG,
  onCopy,
}: DownloadButtonProps) {
  return (
    <div className="space-y-4">
      {/* Size Selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">Size</label>
        <div className="grid grid-cols-4 gap-2">
          {SIZE_OPTIONS.map((size) => (
            <button
              key={size.value}
              onClick={() => onConfigChange({ size: size.value })}
              className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                config.size === size.value
                  ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-500'
              }`}
              aria-label={`Size ${size.label}`}
              aria-pressed={config.size === size.value}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Correction */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">Error Correction</label>
        <select
          value={config.errorCorrection}
          onChange={(e) => onConfigChange({ errorCorrection: e.target.value as QRConfig['errorCorrection'] })}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white transition-colors focus:border-purple-500 focus:outline-none"
          aria-label="Error correction level"
        >
          {ERROR_CORRECTION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} — {option.description}
            </option>
          ))}
        </select>
      </div>

      {/* Download Buttons */}
      <div className="space-y-2">
        <button
          onClick={onDownloadPNG}
          className="w-full rounded-xl bg-purple-500 px-4 py-3 font-medium text-white transition-colors hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          Download PNG
        </button>
        <button
          onClick={onDownloadSVG}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 font-medium text-white transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          Download SVG
        </button>
        <button
          onClick={onCopy}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 font-medium text-white transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
}
