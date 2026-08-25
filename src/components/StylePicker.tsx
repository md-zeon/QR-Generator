'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DOT_STYLES, CORNER_STYLES } from '@/lib/constants';
import { DotStyle, CornerStyle } from '@/types';

interface StylePickerProps {
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  onDotStyleChange: (style: DotStyle) => void;
  onCornerStyleChange: (style: CornerStyle) => void;
}

export default function StylePicker({
  dotStyle,
  cornerStyle,
  onDotStyleChange,
  onCornerStyleChange,
}: StylePickerProps) {
  return (
    <div className="space-y-4">
      {/* Dot Style */}
      <div className="space-y-2">
        <Label>Dot Style</Label>
        <div className="grid grid-cols-4 gap-2">
          {DOT_STYLES.map((style) => (
            <Button
              key={style.value}
              variant={dotStyle === style.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onDotStyleChange(style.value)}
              className="flex-col gap-1 h-auto py-3"
            >
              <span className="text-lg">{style.preview}</span>
              <span className="text-xs">{style.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Corner Style */}
      <div className="space-y-2">
        <Label>Corner Style</Label>
        <div className="grid grid-cols-3 gap-2">
          {CORNER_STYLES.map((style) => (
            <Button
              key={style.value}
              variant={cornerStyle === style.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCornerStyleChange(style.value)}
              className="flex-col gap-1 h-auto py-3"
            >
              <span className="text-lg">{style.preview}</span>
              <span className="text-xs">{style.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
