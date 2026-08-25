import { QRTypeOption, QRConfig, DotStyle, CornerStyle } from '@/types';

export const QR_TYPES: QRTypeOption[] = [
  { id: 'url', label: 'URL', icon: '🔗' },
  { id: 'text', label: 'Text', icon: '📝' },
  { id: 'wifi', label: 'WiFi', icon: '📶' },
  { id: 'vcard', label: 'Contact', icon: '👤' },
  { id: 'email', label: 'Email', icon: '📧' },
  { id: 'sms', label: 'SMS', icon: '💬' },
  { id: 'phone', label: 'Phone', icon: '📞' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { id: 'location', label: 'Location', icon: '📍' },
];

export const DEFAULT_QR_CONFIG: QRConfig = {
  content: '',
  type: 'url',
  foreground: '#000000',
  background: '#ffffff',
  size: 256,
  errorCorrection: 'M',
  dotStyle: 'square',
  cornerStyle: 'square',
  logo: null,
  logoSize: 20,
  gradient: {
    enabled: false,
    type: 'linear',
    color1: '#5542FF',
    color2: '#FF5542',
    rotation: 0,
  },
};

export const SIZE_OPTIONS = [
  { value: 256, label: '256px' },
  { value: 512, label: '512px' },
  { value: 1024, label: '1024px' },
  { value: 2048, label: '2048px' },
];

export const ERROR_CORRECTION_OPTIONS = [
  { value: 'L', label: 'Low (7%)', description: 'Best for clean environments' },
  { value: 'M', label: 'Medium (15%)', description: 'Default, good balance' },
  { value: 'Q', label: 'Quartile (25%)', description: 'Good for outdoor use' },
  { value: 'H', label: 'High (30%)', description: 'Required for logos' },
] as const;

export const DOT_STYLES: { value: DotStyle; label: string; preview: string }[] = [
  { value: 'square', label: 'Square', preview: '⬛' },
  { value: 'rounded', label: 'Rounded', preview: '◼️' },
  { value: 'dots', label: 'Dots', preview: '●' },
  { value: 'diamond', label: 'Diamond', preview: '◆' },
];

export const CORNER_STYLES: { value: CornerStyle; label: string; preview: string }[] = [
  { value: 'square', label: 'Square', preview: '⬛' },
  { value: 'rounded', label: 'Rounded', preview: '🔲' },
  { value: 'dots', label: 'Dots', preview: '⭕' },
];

export const PRESET_COLORS = [
  { foreground: '#000000', background: '#ffffff', label: 'Classic' },
  { foreground: '#1a1a2e', background: '#eef2f7', label: 'Navy' },
  { foreground: '#2d5016', background: '#f0f7e6', label: 'Forest' },
  { foreground: '#7c2d12', background: '#fef3c7', label: 'Amber' },
  { foreground: '#5542FF', background: '#ffffff', label: 'Purple' },
  { foreground: '#0f766e', background: '#f0fdfa', label: 'Teal' },
];

export interface StylePreset {
  label: string;
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  foreground: string;
  background: string;
  gradient?: QRConfig['gradient'];
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    label: 'Minimal',
    dotStyle: 'square',
    cornerStyle: 'square',
    foreground: '#000000',
    background: '#ffffff',
  },
  {
    label: 'Modern',
    dotStyle: 'rounded',
    cornerStyle: 'rounded',
    foreground: '#1a1a2e',
    background: '#f8fafc',
  },
  {
    label: 'Playful',
    dotStyle: 'dots',
    cornerStyle: 'dots',
    foreground: '#5542FF',
    background: '#ffffff',
  },
  {
    label: 'Bold',
    dotStyle: 'diamond',
    cornerStyle: 'square',
    foreground: '#dc2626',
    background: '#fef2f2',
  },
  {
    label: 'Neon',
    dotStyle: 'rounded',
    cornerStyle: 'rounded',
    foreground: '#00ff88',
    background: '#0a0a0a',
    gradient: {
      enabled: true,
      type: 'linear',
      color1: '#00ff88',
      color2: '#0088ff',
      rotation: 135,
    },
  },
  {
    label: 'Sunset',
    dotStyle: 'dots',
    cornerStyle: 'rounded',
    foreground: '#ff6b6b',
    background: '#1a1a2e',
    gradient: {
      enabled: true,
      type: 'linear',
      color1: '#ff6b6b',
      color2: '#ffd93d',
      rotation: 90,
    },
  },
];
