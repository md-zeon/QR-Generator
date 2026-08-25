'use client';

import { useCallback, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QRConfig } from '@/types';
import { SIZE_OPTIONS, ERROR_CORRECTION_OPTIONS } from '@/lib/constants';

interface DownloadButtonProps {
  config: QRConfig;
  onConfigChange: (updates: Partial<QRConfig>) => void;
}

export default function DownloadButton({ config, onConfigChange }: DownloadButtonProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadPNG = useCallback(async () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const canvas = document.createElement('canvas');
    canvas.width = config.size;
    canvas.height = config.size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, config.size, config.size);
      URL.revokeObjectURL(url);

      const link = document.createElement('a');
      link.download = `qr-code-${config.type}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.src = url;
  }, [config]);

  const downloadSVG = useCallback(() => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = `qr-code-${config.type}.svg`;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
  }, [config]);

  const copyToClipboard = useCallback(async () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    await navigator.clipboard.writeText(svgData);
  }, []);

  return (
    <div className="space-y-4">
      {/* Hidden QR for export */}
      <div ref={qrRef} className="absolute -left-[9999px] -top-[9999px]">
        <QRCodeSVG
          value={config.content || ' '}
          size={config.size}
          bgColor={config.background}
          fgColor={config.foreground}
          level={config.errorCorrection}
          includeMargin={true}
        />
      </div>

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
          onClick={downloadPNG}
          className="w-full rounded-xl bg-purple-500 px-4 py-3 font-medium text-white transition-colors hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          Download PNG
        </button>
        <button
          onClick={downloadSVG}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 font-medium text-white transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          Download SVG
        </button>
        <button
          onClick={copyToClipboard}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 font-medium text-white transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
}
