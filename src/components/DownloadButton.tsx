'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
    <div className="space-y-3">
      {/* Download Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button onClick={onDownloadPNG} className="w-full">
          PNG
        </Button>
        <Button onClick={onDownloadSVG} variant="outline" className="w-full">
          SVG
        </Button>
        <Button onClick={onCopy} variant="outline" className="w-full">
          Copy
        </Button>
      </div>

      {/* Size & Error Correction */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs" htmlFor="qr-size">Size</Label>
          <select
            id="qr-size"
            value={String(config.size)}
            onChange={(e) => onConfigChange({ size: Number(e.target.value) })}
            className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {SIZE_OPTIONS.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs" htmlFor="qr-ec">Error Correction</Label>
          <select
            id="qr-ec"
            value={config.errorCorrection}
            onChange={(e) => onConfigChange({ errorCorrection: e.target.value as QRConfig['errorCorrection'] })}
            className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {ERROR_CORRECTION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
