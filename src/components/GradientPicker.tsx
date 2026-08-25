'use client';

import { GradientConfig } from '@/types';

interface GradientPickerProps {
  gradient: GradientConfig;
  onGradientChange: (gradient: GradientConfig) => void;
}

export default function GradientPicker({ gradient, onGradientChange }: GradientPickerProps) {
  const update = (updates: Partial<GradientConfig>) => {
    onGradientChange({ ...gradient, ...updates });
  };

  return (
    <div className="space-y-4">
      {/* Enable/Disable */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-300">Enable Gradient</label>
        <button
          onClick={() => update({ enabled: !gradient.enabled })}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            gradient.enabled ? 'bg-purple-500' : 'bg-zinc-700'
          }`}
          aria-label={gradient.enabled ? 'Disable gradient' : 'Enable gradient'}
          role="switch"
          aria-checked={gradient.enabled}
        >
          <span
            className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${
              gradient.enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {gradient.enabled && (
        <>
          {/* Gradient Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => update({ type: 'linear' })}
                className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                  gradient.type === 'linear'
                    ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                    : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-500'
                }`}
                aria-label="Linear gradient"
              >
                Linear
              </button>
              <button
                onClick={() => update({ type: 'radial' })}
                className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                  gradient.type === 'radial'
                    ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                    : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-500'
                }`}
                aria-label="Radial gradient"
              >
                Radial
              </button>
            </div>
          </div>

          {/* Colors */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-zinc-300">Color 1</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={gradient.color1}
                  onChange={(e) => update({ color1: e.target.value })}
                  className="h-10 w-10 cursor-pointer rounded-lg border-0"
                  aria-label="Gradient color 1"
                />
                <input
                  type="text"
                  value={gradient.color1}
                  onChange={(e) => update({ color1: e.target.value })}
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white uppercase"
                  aria-label="Gradient color 1 hex"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-zinc-300">Color 2</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={gradient.color2}
                  onChange={(e) => update({ color2: e.target.value })}
                  className="h-10 w-10 cursor-pointer rounded-lg border-0"
                  aria-label="Gradient color 2"
                />
                <input
                  type="text"
                  value={gradient.color2}
                  onChange={(e) => update({ color2: e.target.value })}
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white uppercase"
                  aria-label="Gradient color 2 hex"
                />
              </div>
            </div>
          </div>

          {/* Rotation (linear only) */}
          {gradient.type === 'linear' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Rotation: {gradient.rotation}°
              </label>
              <input
                type="range"
                min={0}
                max={360}
                value={gradient.rotation}
                onChange={(e) => update({ rotation: Number(e.target.value) })}
                className="w-full"
                aria-label="Gradient rotation angle"
              />
            </div>
          )}

          {/* Preview */}
          <div
            className="h-8 rounded-lg"
            style={{
              background:
                gradient.type === 'linear'
                  ? `linear-gradient(${gradient.rotation}deg, ${gradient.color1}, ${gradient.color2})`
                  : `radial-gradient(circle, ${gradient.color1}, ${gradient.color2})`,
            }}
            aria-label="Gradient preview"
          />
        </>
      )}
    </div>
  );
}
