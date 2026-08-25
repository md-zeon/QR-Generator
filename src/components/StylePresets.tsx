'use client';

import { Button } from '@/components/ui/button';
import { STYLE_PRESETS } from '@/lib/constants';
import { QRConfig } from '@/types';

interface StylePresetsProps {
  onApply: (updates: Partial<QRConfig>) => void;
}

export default function StylePresets({ onApply }: StylePresetsProps) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {STYLE_PRESETS.map((preset) => (
        <Button
          key={preset.label}
          variant="outline"
          size="sm"
          onClick={() => {
            const updates: Partial<QRConfig> = {
              dotStyle: preset.dotStyle,
              cornerStyle: preset.cornerStyle,
              foreground: preset.foreground,
              background: preset.background,
            };
            if (preset.gradient) {
              updates.gradient = preset.gradient;
            } else {
              updates.gradient = {
                enabled: false,
                type: 'linear',
                color1: '#5542FF',
                color2: '#FF5542',
                rotation: 0,
              };
            }
            onApply(updates);
          }}
          className="flex-col gap-0.5 h-auto py-2"
        >
          <div
            className="flex h-6 w-full items-center justify-center rounded"
            style={{ backgroundColor: preset.background }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" style={{ color: preset.foreground }}>
              <rect x="2" y="2" width="6" height="6" fill="currentColor" rx={preset.dotStyle === 'rounded' ? 1.5 : 0} />
              <rect x="16" y="2" width="6" height="6" fill="currentColor" rx={preset.dotStyle === 'rounded' ? 1.5 : 0} />
              <rect x="2" y="16" width="6" height="6" fill="currentColor" rx={preset.dotStyle === 'rounded' ? 1.5 : 0} />
              <rect x="10" y="10" width="4" height="4" fill="currentColor" rx={preset.dotStyle === 'rounded' ? 1 : 0} />
            </svg>
          </div>
          <span className="text-[10px] font-medium">{preset.label}</span>
        </Button>
      ))}
    </div>
  );
}
