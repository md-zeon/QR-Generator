'use client';

import { useCallback, useRef } from 'react';
import { QRConfig } from '@/types';

export function useExport(config: QRConfig, onToast: (message: string, type: 'success' | 'error') => void) {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadPNG = useCallback(async () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) {
      onToast('Failed to generate PNG', 'error');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = config.size;
      canvas.height = config.size;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 0, 0, config.size, config.size);
        URL.revokeObjectURL(url);

        const link = document.createElement('a');
        link.download = `qr-code-${config.type}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        onToast('PNG downloaded successfully', 'success');
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        onToast('Failed to generate PNG', 'error');
      };

      img.src = url;
    } catch {
      onToast('Failed to generate PNG', 'error');
    }
  }, [config, onToast]);

  const downloadSVG = useCallback(() => {
    if (!qrRef.current) {
      onToast('Failed to generate SVG', 'error');
      return;
    }

    const svg = qrRef.current.querySelector('svg');
    if (!svg) {
      onToast('Failed to generate SVG', 'error');
      return;
    }

    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.download = `qr-code-${config.type}.svg`;
      link.href = url;
      link.click();

      URL.revokeObjectURL(url);
      onToast('SVG downloaded successfully', 'success');
    } catch {
      onToast('Failed to generate SVG', 'error');
    }
  }, [config, onToast]);

  const copyToClipboard = useCallback(async () => {
    if (!qrRef.current) {
      onToast('Failed to copy', 'error');
      return;
    }

    const svg = qrRef.current.querySelector('svg');
    if (!svg) {
      onToast('Failed to copy', 'error');
      return;
    }

    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      await navigator.clipboard.writeText(svgData);
      onToast('Copied to clipboard', 'success');
    } catch {
      onToast('Failed to copy to clipboard', 'error');
    }
  }, [onToast]);

  return {
    qrRef,
    downloadPNG,
    downloadSVG,
    copyToClipboard,
  };
}
