import { QRConfig, DotStyle, CornerStyle } from '@/types';

export function getQRValue(config: QRConfig): string {
  return config.content || ' ';
}

export function getDotStyleValue(dotStyle: DotStyle): string {
  const styles: Record<DotStyle, string> = {
    square: 'square',
    rounded: 'rounded',
    dots: 'dots',
    diamond: 'diamond',
  };
  return styles[dotStyle] || 'square';
}

export function getCornerStyleValue(cornerStyle: CornerStyle): string {
  const styles: Record<CornerStyle, string> = {
    square: 'square',
    rounded: 'rounded',
    dots: 'dots',
  };
  return styles[cornerStyle] || 'square';
}

export function getErrorCorrectionValue(level: string): number {
  const levels: Record<string, number> = {
    L: 1,
    M: 0,
    Q: 3,
    H: 2,
  };
  return levels[level] ?? 0;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function generateFilename(type: string, format: string): string {
  const timestamp = new Date().toISOString().split('T')[0];
  return `qr-${type}-${timestamp}.${format}`;
}
