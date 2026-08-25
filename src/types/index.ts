export type QRType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'sms' | 'phone' | 'calendar' | 'whatsapp' | 'location';

export type DotStyle = 'square' | 'rounded' | 'dots' | 'diamond';

export type CornerStyle = 'square' | 'rounded' | 'dots';

export type ErrorCorrection = 'L' | 'M' | 'Q' | 'H';

export type ToastType = 'success' | 'error' | 'info';

export interface QRConfig {
  content: string;
  type: QRType;
  foreground: string;
  background: string;
  size: number;
  errorCorrection: ErrorCorrection;
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  logo: string | null;
  logoSize: number;
  gradient: GradientConfig;
}

export interface GradientConfig {
  enabled: boolean;
  type: 'linear' | 'radial';
  color1: string;
  color2: string;
  rotation: number;
}

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface QRTypeOption {
  id: QRType;
  label: string;
  icon: string;
}
