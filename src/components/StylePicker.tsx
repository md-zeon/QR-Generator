'use client';

import { DotStyle, CornerStyle } from '@/types';
import { DOT_STYLES, CORNER_STYLES } from '@/lib/constants';

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
      {/* Dot Styles */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">Module Shape</label>
        <div className="grid grid-cols-4 gap-2">
          {DOT_STYLES.map((style) => (
            <button
              key={style.value}
              onClick={() => onDotStyleChange(style.value)}
              className={`flex flex-col items-center gap-1 rounded-lg border px-3 py-3 text-sm transition-all ${
                dotStyle === style.value
                  ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-500'
              }`}
              aria-label={`${style.label} style`}
              aria-pressed={dotStyle === style.value}
            >
              <span className="text-xl">{style.preview}</span>
              <span className="text-xs">{style.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Corner Styles */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">Corner Style</label>
        <div className="grid grid-cols-3 gap-2">
          {CORNER_STYLES.map((style) => (
            <button
              key={style.value}
              onClick={() => onCornerStyleChange(style.value)}
              className={`flex flex-col items-center gap-1 rounded-lg border px-3 py-3 text-sm transition-all ${
                cornerStyle === style.value
                  ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-500'
              }`}
              aria-label={`${style.label} corner style`}
              aria-pressed={cornerStyle === style.value}
            >
              <span className="text-xl">{style.preview}</span>
              <span className="text-xs">{style.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
