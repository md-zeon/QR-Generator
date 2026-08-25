'use client';

import { Button } from '@/components/ui/button';
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
  const hasContent = config.content.trim().length > 0;

  return (
    <div className="space-y-3">
      {/* Primary CTA */}
      <Button
        onClick={onDownloadPNG}
        disabled={!hasContent}
        className="w-full h-11 text-sm font-medium"
      >
        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Download QR Code
      </Button>

      {/* Secondary actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={onDownloadSVG} variant="outline" size="sm" disabled={!hasContent}>
          SVG
        </Button>
        <Button onClick={onCopy} variant="outline" size="sm" disabled={!hasContent}>
          <svg className="mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
          Copy
        </Button>
      </div>

      {/* Settings summary */}
      <div className="flex items-center justify-center gap-3 text-[10px] text-muted-foreground">
        <span>{config.size}px</span>
        <span className="text-border">|</span>
        <span>EC: {config.errorCorrection}</span>
        <span className="text-border">|</span>
        <span>{config.foreground === '#000000' && config.background === '#ffffff' ? 'B&W' : 'Custom'}</span>
      </div>
    </div>
  );
}
