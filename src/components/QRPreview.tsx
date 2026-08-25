'use client';

import { QRCodeSVG } from 'qrcode.react';
import { QRConfig } from '@/types';

interface QRPreviewProps {
  config: QRConfig;
}

export default function QRPreview({ config }: QRPreviewProps) {
  const hasLogo = config.logo && config.logoSize > 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative flex items-center justify-center rounded-2xl bg-white p-8 shadow-lg"
        style={{ minWidth: config.size + 64, minHeight: config.size + 64 }}
      >
        <QRCodeSVG
          value={config.content || ' '}
          size={config.size}
          bgColor={config.background}
          fgColor={config.foreground}
          level={config.errorCorrection}
          includeMargin={false}
          aria-label={`QR code for: ${config.content}`}
          title={`QR Code: ${config.content}`}
        />

        {hasLogo && (
          <div
            className="absolute flex items-center justify-center rounded-full bg-white"
            style={{
              width: `${config.size * (config.logoSize / 100)}px`,
              height: `${config.size * (config.logoSize / 100)}px`,
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

      <div className="text-center text-sm text-zinc-500">
        {config.size} × {config.size}px • EC: {config.errorCorrection}
      </div>
    </div>
  );
}
