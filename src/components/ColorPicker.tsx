'use client';

import { useState, useEffect } from 'react';
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
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-zinc-300">Foreground</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={foreground}
              onChange={(e) => onForegroundChange(e.target.value)}
              className="h-10 w-10 cursor-pointer rounded-lg border-0"
              aria-label="Foreground color"
            />
            <input
              type="text"
              value={foreground}
              onChange={(e) => onForegroundChange(e.target.value)}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white uppercase"
              aria-label="Foreground color hex"
            />
          </div>
        </div>

        <button
          onClick={handleSwap}
          className="mt-6 rounded-lg bg-zinc-700 p-2 text-zinc-300 transition-colors hover:bg-zinc-600 hover:text-white"
          aria-label="Swap colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
          </svg>
        </button>

        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-zinc-300">Background</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={background}
              onChange={(e) => onBackgroundChange(e.target.value)}
              className="h-10 w-10 cursor-pointer rounded-lg border-0"
              aria-label="Background color"
            />
            <input
              type="text"
              value={background}
              onChange={(e) => onBackgroundChange(e.target.value)}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white uppercase"
              aria-label="Background color hex"
            />
          </div>
        </div>
      </div>

      {/* Contrast Ratio Display */}
      <div
        className={`flex items-center justify-between rounded-lg px-4 py-3 ${
          contrastRating.level === 'Fail'
            ? 'bg-red-500/10 text-red-400'
            : contrastRating.level === 'AA'
            ? 'bg-amber-500/10 text-amber-400'
            : 'bg-green-500/10 text-green-400'
        }`}
        role="status"
        aria-live="polite"
      >
        <span className="text-sm font-medium">
          Contrast: {contrastRatio.toFixed(1)}:1
        </span>
        <span className="text-sm">
          {contrastRating.level} — {contrastRating.message}
        </span>
      </div>

      {/* Preset Colors */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">Presets</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                onForegroundChange(preset.foreground);
                onBackgroundChange(preset.background);
              }}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                foreground === preset.foreground && background === preset.background
                  ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-500'
              }`}
              aria-label={`Apply ${preset.label} preset`}
            >
              <div className="flex gap-1">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: preset.foreground }}
                />
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: preset.background }}
                />
              </div>
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
