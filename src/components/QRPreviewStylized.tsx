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

  useEffect(() => {
    if (!config.gradient.enabled) return;

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

    const previewSize = Math.min(config.size, 320);

    const qr = new QRCodeStyling({
      width: previewSize,
      height: previewSize,
      data: config.content || ' ',
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
  }, [config]);

  if (!config.gradient.enabled) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="flex items-center justify-center rounded-xl p-6"
        style={{ backgroundColor: config.background }}
      >
        <div ref={containerRef} />
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{config.size} × {config.size}px</span>
        <span className="text-border">•</span>
        <span>EC: {config.errorCorrection}</span>
        <span className="text-border">•</span>
        <span className="text-primary">Gradient</span>
      </div>
    </div>
  );
}
