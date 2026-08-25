'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getContrastRatio, getContrastRating } from '@/lib/contrast';
import { PRESET_COLORS } from '@/lib/constants';
import { useState, useEffect } from 'react';

interface ContrastRating {
  level: 'AAA' | 'AA' | 'Fail';
  message: string;
}

interface ColorPickerProps {
  foreground: string;
  background: string;
  onForegroundChange: (color: string) => void;
  onBackgroundChange: (color: string) => void;
}

export default function ColorPicker({
  foreground,
  background,
  onForegroundChange,
  onBackgroundChange,
}: ColorPickerProps) {
  const [contrastRatio, setContrastRatio] = useState(21);
  const [contrastRating, setContrastRating] = useState<ContrastRating>({ level: 'AAA', message: '' });

  useEffect(() => {
    const ratio = getContrastRatio(foreground, background);
    setContrastRatio(ratio);
    setContrastRating(getContrastRating(ratio));
  }, [foreground, background]);

  const handleSwap = () => {
    onForegroundChange(background);
    onBackgroundChange(foreground);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1.5">
          <Label className="text-xs">Foreground</Label>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={foreground}
              onChange={(e) => onForegroundChange(e.target.value)}
              className="h-8 w-8 cursor-pointer rounded border-0"
            />
            <Input
              value={foreground}
              onChange={(e) => onForegroundChange(e.target.value)}
              className="h-8 font-mono text-xs uppercase"
            />
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={handleSwap} className="h-8 w-8 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </Button>

        <div className="flex-1 space-y-1.5">
          <Label className="text-xs">Background</Label>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={background}
              onChange={(e) => onBackgroundChange(e.target.value)}
              className="h-8 w-8 cursor-pointer rounded border-0"
            />
            <Input
              value={background}
              onChange={(e) => onBackgroundChange(e.target.value)}
              className="h-8 font-mono text-xs uppercase"
            />
          </div>
        </div>
      </div>

      {/* Contrast Ratio */}
      <Badge
        variant={contrastRating.level === 'Fail' ? 'destructive' : 'secondary'}
        className="w-full justify-center py-1 text-xs"
      >
        Contrast: {contrastRatio.toFixed(1)}:1 — {contrastRating.level}
      </Badge>

      {/* Color Presets */}
      <div className="space-y-1.5">
        <Label className="text-xs">Quick Presets</Label>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_COLORS.map((preset) => (
            <Button
              key={preset.label}
              variant={foreground === preset.foreground && background === preset.background ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                onForegroundChange(preset.foreground);
                onBackgroundChange(preset.background);
              }}
              className="h-7 gap-1 px-2 text-xs"
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: preset.foreground }} />
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: preset.background }} />
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
