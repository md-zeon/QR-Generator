'use client';

import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { QRConfig } from '@/types';

interface QRPreviewStylizedProps {
  config: QRConfig;
}

export default function QRPreviewStylized({ config }: QRPreviewStylizedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);

  const hasContent = config.content.trim().length > 0;

  useEffect(() => {
    if (!config.gradient.enabled || !hasContent) return;

    const dotStyleMap = {
      square: 'square',
      rounded: 'rounded',
      dots: 'dots',
      diamond: 'extra-rounded',
    } as const;

    const cornerStyleMap = {
      square: 'square',
      rounded: 'extra-rounded',
      dots: 'dot',
    } as const;

    const previewSize = Math.min(config.size, 280);

    const qr = new QRCodeStyling({
      width: previewSize,
      height: previewSize,
      data: config.content,
      margin: 0,
      qrOptions: {
        typeNumber: 0,
        errorCorrectionLevel: config.errorCorrection,
      },
      dotsOptions: {
        color: config.foreground,
        type: dotStyleMap[config.dotStyle],
      },
      cornersSquareOptions: {
        color: config.foreground,
        type: cornerStyleMap[config.cornerStyle],
      },
      cornersDotOptions: {
        color: config.foreground,
        type: cornerStyleMap[config.cornerStyle],
      },
      backgroundOptions: {
        color: config.background,
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: config.logoSize / 100,
        margin: 4,
      },
    });

    if (config.gradient.enabled) {
      qr.update({
        dotsOptions: {
          color: config.gradient.color1,
          gradient: {
            type: config.gradient.type === 'linear' ? 'linear' : 'radial',
            rotation: config.gradient.rotation * (Math.PI / 180),
            colorStops: [
              { offset: 0, color: config.gradient.color1 },
              { offset: 1, color: config.gradient.color2 },
            ],
          },
        },
        cornersSquareOptions: {
          color: config.gradient.color1,
          gradient: {
            type: config.gradient.type === 'linear' ? 'linear' : 'radial',
            rotation: config.gradient.rotation * (Math.PI / 180),
            colorStops: [
              { offset: 0, color: config.gradient.color1 },
              { offset: 1, color: config.gradient.color2 },
            ],
          },
        },
        cornersDotOptions: {
          color: config.gradient.color1,
          gradient: {
            type: config.gradient.type === 'linear' ? 'linear' : 'radial',
            rotation: config.gradient.rotation * (Math.PI / 180),
            colorStops: [
              { offset: 0, color: config.gradient.color1 },
              { offset: 1, color: config.gradient.color2 },
            ],
          },
        },
      });
    }

    if (config.logo) {
      qr.update({
        image: config.logo,
      });
    }

    setQrCode(qr);

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      qr.append(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [config, hasContent]);

  if (!config.gradient.enabled) {
    return null;
  }

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
        className="flex items-center justify-center rounded-xl p-4 sm:p-6"
        style={{ backgroundColor: config.background }}
      >
        <div ref={containerRef} />
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{config.size} x {config.size}px</span>
        <span className="text-border">|</span>
        <span>EC: {config.errorCorrection}</span>
        <span className="text-border">|</span>
        <span className="text-primary">Gradient</span>
      </div>
    </div>
  );
}
