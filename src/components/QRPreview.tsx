'use client';

import { QRCodeSVG } from 'qrcode.react';
import { QRConfig } from '@/types';

interface QRPreviewProps {
  config: QRConfig;
}

export default function QRPreview({ config }: QRPreviewProps) {
  const hasContent = config.content.trim().length > 0;
  const hasLogo = config.logo && config.logoSize > 0;
  const previewSize = Math.min(config.size, 280);

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-muted/50">
          <svg className="h-10 w-10 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">No content yet</p>
          <p className="text-xs text-muted-foreground/70">Enter a URL, text, or other content above to generate your QR code</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative flex items-center justify-center rounded-xl p-4 sm:p-6"
        style={{ backgroundColor: config.background }}
      >
        <QRCodeSVG
          value={config.content}
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
        <span>{config.size} x {config.size}px</span>
        <span className="text-border">|</span>
        <span>EC: {config.errorCorrection}</span>
      </div>
    </div>
  );
}
