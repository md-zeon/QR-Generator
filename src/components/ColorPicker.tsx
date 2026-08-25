'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getContrastRatio, getContrastRating } from '@/lib/contrast';
import { PRESET_COLORS } from '@/lib/constants';

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
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex-1 space-y-2">
          <Label>Foreground</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={foreground}
              onChange={(e) => onForegroundChange(e.target.value)}
              className="h-9 w-9 cursor-pointer rounded-md border-0"
            />
            <Input
              value={foreground}
              onChange={(e) => onForegroundChange(e.target.value)}
              className="font-mono uppercase"
            />
          </div>
        </div>

        <Button variant="outline" size="icon" onClick={handleSwap} className="mb-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </Button>

        <div className="flex-1 space-y-2">
          <Label>Background</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={background}
              onChange={(e) => onBackgroundChange(e.target.value)}
              className="h-9 w-9 cursor-pointer rounded-md border-0"
            />
            <Input
              value={background}
              onChange={(e) => onBackgroundChange(e.target.value)}
              className="font-mono uppercase"
            />
          </div>
        </div>
      </div>

      {/* Contrast Ratio Display */}
      <Badge
        variant={contrastRating.level === 'Fail' ? 'destructive' : 'secondary'}
        className="w-full justify-center py-1.5"
      >
        Contrast: {contrastRatio.toFixed(1)}:1 — {contrastRating.level}
      </Badge>

      {/* Preset Colors */}
      <div className="space-y-2">
        <Label>Color Presets</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((preset) => (
            <Button
              key={preset.label}
              variant={foreground === preset.foreground && background === preset.background ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                onForegroundChange(preset.foreground);
                onBackgroundChange(preset.background);
              }}
              className="gap-1.5"
            >
              <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: preset.foreground }} />
              <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: preset.background }} />
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
