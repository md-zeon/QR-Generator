'use client';

import { QRCodeSVG } from 'qrcode.react';
import { QRConfig } from '@/types';

interface QRPreviewProps {
  config: QRConfig;
}

export default function QRPreview({ config }: QRPreviewProps) {
  const hasContent = config.content.trim().length > 0;
  const hasLogo = config.logo && config.logoSize > 0;
  const previewSize = Math.min(config.size, 300);
  const displayValue = hasContent ? config.content : 'https://example.com';

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative flex items-center justify-center rounded-2xl p-6 sm:p-8"
        style={{ backgroundColor: config.background }}
      >
        <QRCodeSVG
          value={displayValue}
          size={previewSize}
          bgColor={config.background}
          fgColor={hasContent ? config.foreground : '#d4d4d8'}
          level={config.errorCorrection}
          includeMargin={false}
          aria-label={hasContent ? `QR code for: ${config.content}` : 'QR code preview'}
        />

        {hasLogo && (
          <div
            className="absolute flex items-center justify-center rounded-full"
            style={{
              width: `${previewSize * (config.logoSize / 100)}px`,
              height: `${previewSize * (config.logoSize / 100)}px`,
              backgroundColor: config.background,
            }}
          >
            <img
              src={config.logo!}
              alt="Logo"
              className="h-[80%] w-[80%] object-contain"
            />
          </div>
        )}
      </div>

      {!hasContent && (
        <p className="text-center text-xs text-muted-foreground">
          Start typing to replace this preview.
        </p>
      )}
    </div>
  );
}
