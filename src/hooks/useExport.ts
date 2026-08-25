'use client';

import { useCallback, useRef } from 'react';
import { QRConfig } from '@/types';
import QRCodeStyling from 'qr-code-styling';

export function useExport(config: QRConfig, onToast: (message: string, type: 'success' | 'error') => void) {
  const qrRef = useRef<HTMLDivElement>(null);

  const getStylizedQR = useCallback(() => {
    const dotStyleMap = { square: 'square', rounded: 'rounded', dots: 'dots', diamond: 'extra-rounded' } as const;
    const cornerStyleMap = { square: 'square', rounded: 'extra-rounded', dots: 'dot' } as const;

    const qr = new QRCodeStyling({
      width: config.size,
      height: config.size,
      data: config.content || 'https://example.com',
      margin: 0,
      qrOptions: { typeNumber: 0, errorCorrectionLevel: config.errorCorrection },
      dotsOptions: { color: config.foreground, type: dotStyleMap[config.dotStyle] },
      cornersSquareOptions: { color: config.foreground, type: cornerStyleMap[config.cornerStyle] },
      cornersDotOptions: { color: config.foreground, type: cornerStyleMap[config.cornerStyle] },
      backgroundOptions: { color: config.background },
      imageOptions: { hideBackgroundDots: true, imageSize: config.logoSize / 100, margin: 4 },
    });

    if (config.gradient.enabled) {
      const gradientOpts = {
        type: config.gradient.type === 'linear' ? ('linear' as const) : ('radial' as const),
        rotation: config.gradient.rotation * (Math.PI / 180),
        colorStops: [
          { offset: 0, color: config.gradient.color1 },
          { offset: 1, color: config.gradient.color2 },
        ],
      };
      qr.update({
        dotsOptions: { color: config.gradient.color1, gradient: gradientOpts },
        cornersSquareOptions: { color: config.gradient.color1, gradient: gradientOpts },
        cornersDotOptions: { color: config.gradient.color1, gradient: gradientOpts },
      });
    }

    if (config.logo) {
      qr.update({ image: config.logo });
    }

    return qr;
  }, [config]);

  const toBlob = (data: Blob | Buffer, type: string): Blob => {
    if (data instanceof Blob) return data;
    return new Blob([new Uint8Array(data)], { type });
  };

  const downloadPNG = useCallback(async () => {
    try {
      const qr = getStylizedQR();
      const data = await qr.getRawData('png');
      if (!data) throw new Error('Failed to generate PNG');
      const blob = toBlob(data, 'image/png');

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `qr-code-${config.type}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      onToast('PNG downloaded', 'success');
    } catch {
      onToast('Failed to generate PNG', 'error');
    }
  }, [config, getStylizedQR, onToast]);

  const downloadSVG = useCallback(async () => {
    try {
      const qr = getStylizedQR();
      const data = await qr.getRawData('svg');
      if (!data) throw new Error('Failed to generate SVG');
      const blob = toBlob(data, 'image/svg+xml');

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `qr-code-${config.type}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      onToast('SVG downloaded', 'success');
    } catch {
      onToast('Failed to generate SVG', 'error');
    }
  }, [config, getStylizedQR, onToast]);

  const copyToClipboard = useCallback(async () => {
    try {
      const qr = getStylizedQR();
      const data = await qr.getRawData('svg');
      if (!data) throw new Error('Failed to generate SVG');
      const blob = toBlob(data, 'image/svg+xml');

      const text = await blob.text();
      await navigator.clipboard.writeText(text);
      onToast('Copied to clipboard', 'success');
    } catch {
      onToast('Failed to copy', 'error');
    }
  }, [getStylizedQR, onToast]);

  return {
    qrRef,
    downloadPNG,
    downloadSVG,
    copyToClipboard,
  };
}
