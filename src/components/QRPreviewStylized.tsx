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

    const qr = new QRCodeStyling({
      width: config.size,
      height: config.size,
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
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative flex items-center justify-center rounded-2xl bg-white p-8 shadow-lg"
        style={{ minWidth: config.size + 64, minHeight: config.size + 64 }}
      >
        <div ref={containerRef} />
      </div>

      <div className="text-center text-sm text-zinc-500">
        {config.size} × {config.size}px • EC: {config.errorCorrection} • Gradient
      </div>
    </div>
  );
}
