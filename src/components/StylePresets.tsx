'use client';

import { Button } from '@/components/ui/button';
import { STYLE_PRESETS } from '@/lib/constants';
import { QRConfig } from '@/types';

interface StylePresetsProps {
  onApply: (updates: Partial<QRConfig>) => void;
}

export default function StylePresets({ onApply }: StylePresetsProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
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
          className="flex-col gap-1 h-auto py-3"
        >
          <div
            className="flex h-8 w-full items-center justify-center rounded-md"
            style={{ backgroundColor: preset.background }}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" style={{ color: preset.foreground }}>
              <rect x="2" y="2" width="6" height="6" fill="currentColor" rx={preset.dotStyle === 'rounded' ? 1.5 : 0} />
              <rect x="16" y="2" width="6" height="6" fill="currentColor" rx={preset.dotStyle === 'rounded' ? 1.5 : 0} />
              <rect x="2" y="16" width="6" height="6" fill="currentColor" rx={preset.dotStyle === 'rounded' ? 1.5 : 0} />
              <rect x="10" y="10" width="4" height="4" fill="currentColor" rx={preset.dotStyle === 'rounded' ? 1 : 0} />
            </svg>
          </div>
          <span className="text-xs font-medium">{preset.label}</span>
          <span className="text-[10px] text-muted-foreground">
            {preset.dotStyle} • {preset.cornerStyle}
          </span>
        </Button>
      ))}
    </div>
  );
}
