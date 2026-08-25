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
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs">Dot Shape</Label>
        <div className="grid grid-cols-4 gap-1.5">
          {DOT_STYLES.map((style) => (
            <Button
              key={style.value}
              variant={dotStyle === style.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onDotStyleChange(style.value)}
              className="flex-col gap-0.5 h-auto py-2"
            >
              <span className="text-sm">{style.preview}</span>
              <span className="text-[10px]">{style.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Corner Style</Label>
        <div className="grid grid-cols-3 gap-1.5">
          {CORNER_STYLES.map((style) => (
            <Button
              key={style.value}
              variant={cornerStyle === style.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCornerStyleChange(style.value)}
              className="flex-col gap-0.5 h-auto py-2"
            >
              <span className="text-sm">{style.preview}</span>
              <span className="text-[10px]">{style.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
