'use client';

import { STYLE_PRESETS } from '@/lib/constants';
import { QRConfig } from '@/types';

interface StylePresetsProps {
  onApply: (updates: Partial<QRConfig>) => void;
}

export default function StylePresets({ onApply }: StylePresetsProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {STYLE_PRESETS.map((preset) => (
          <button
            key={preset.label}
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
            className="group rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-left transition-all hover:border-zinc-500"
            aria-label={`Apply ${preset.label} style preset`}
          >
            {/* Mini QR Preview */}
            <div
              className="mb-2 flex h-12 items-center justify-center rounded-lg"
              style={{ backgroundColor: preset.background }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8"
                style={{ color: preset.foreground }}
              >
                {/* Simplified QR icon */}
                <rect x="2" y="2" width="6" height="6" fill="currentColor" rx={preset.dotStyle === 'rounded' ? 1.5 : 0} />
                <rect x="16" y="2" width="6" height="6" fill="currentColor" rx={preset.dotStyle === 'rounded' ? 1.5 : 0} />
                <rect x="2" y="16" width="6" height="6" fill="currentColor" rx={preset.dotStyle === 'rounded' ? 1.5 : 0} />
                <rect x="10" y="10" width="4" height="4" fill="currentColor" rx={preset.dotStyle === 'rounded' ? 1 : 0} />
                <rect x="16" y="16" width="2" height="2" fill="currentColor" rx={preset.dotStyle === 'dots' ? 1 : 0} />
                <rect x="20" y="16" width="2" height="2" fill="currentColor" rx={preset.dotStyle === 'dots' ? 1 : 0} />
                <rect x="16" y="20" width="2" height="2" fill="currentColor" rx={preset.dotStyle === 'dots' ? 1 : 0} />
                <rect x="20" y="20" width="2" height="2" fill="currentColor" rx={preset.dotStyle === 'dots' ? 1 : 0} />
              </svg>
            </div>

            {/* Label & Details */}
            <p className="text-sm font-medium text-white group-hover:text-purple-400">
              {preset.label}
            </p>
            <p className="text-xs text-zinc-500">
              {preset.dotStyle} • {preset.cornerStyle}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
