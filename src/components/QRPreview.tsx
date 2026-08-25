'use client';

import { QRCodeSVG } from 'qrcode.react';
import { QRConfig } from '@/types';

interface QRPreviewProps {
  config: QRConfig;
}

export default function QRPreview({ config }: QRPreviewProps) {
  const hasLogo = config.logo && config.logoSize > 0;
  const previewSize = Math.min(config.size, 320);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative flex items-center justify-center rounded-xl p-6"
        style={{ backgroundColor: config.background }}
      >
        <QRCodeSVG
          value={config.content || ' '}
          size={previewSize}
          bgColor={config.background}
          fgColor={config.foreground}
          level={config.errorCorrection}
          includeMargin={false}
          aria-label={`QR code for: ${config.content}`}
          title={`QR Code: ${config.content}`}
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

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{config.size} × {config.size}px</span>
        <span className="text-border">•</span>
        <span>EC: {config.errorCorrection}</span>
      </div>
    </div>
  );
}
