'use client';

import { QRCodeSVG } from 'qrcode.react';
import { QRConfig } from '@/types';
import { Card } from '@/components/ui/card';

interface QRPreviewProps {
  config: QRConfig;
}

export default function QRPreview({ config }: QRPreviewProps) {
  const hasLogo = config.logo && config.logoSize > 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <Card className="relative flex items-center justify-center p-8">
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
      </Card>

      <p className="text-sm text-muted-foreground">
        {config.size} × {config.size}px • EC: {config.errorCorrection}
      </p>
    </div>
  );
}
