'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="gradient-toggle" className="text-xs">Enable Gradient</Label>
        <Switch
          id="gradient-toggle"
          checked={gradient.enabled}
          onCheckedChange={(checked) => update({ enabled: checked })}
        />
      </div>

      {gradient.enabled && (
        <>
          <div className="flex gap-1.5">
            <Button
              variant={gradient.type === 'linear' ? 'default' : 'outline'}
              size="sm"
              onClick={() => update({ type: 'linear' })}
              className="flex-1"
            >
              Linear
            </Button>
            <Button
              variant={gradient.type === 'radial' ? 'default' : 'outline'}
              size="sm"
              onClick={() => update({ type: 'radial' })}
              className="flex-1"
            >
              Radial
            </Button>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs">Color 1</Label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={gradient.color1}
                  onChange={(e) => update({ color1: e.target.value })}
                  aria-label="Gradient color 1"
                  className="h-8 w-8 cursor-pointer rounded border-0"
                />
                <Input
                  value={gradient.color1}
                  onChange={(e) => update({ color1: e.target.value })}
                  className="h-8 font-mono text-xs uppercase"
                />
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs">Color 2</Label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={gradient.color2}
                  onChange={(e) => update({ color2: e.target.value })}
                  aria-label="Gradient color 2"
                  className="h-8 w-8 cursor-pointer rounded border-0"
                />
                <Input
                  value={gradient.color2}
                  onChange={(e) => update({ color2: e.target.value })}
                  className="h-8 font-mono text-xs uppercase"
                />
              </div>
            </div>
          </div>

          {gradient.type === 'linear' && (
            <div className="space-y-1.5">
              <Label className="text-xs">Rotation: {gradient.rotation}°</Label>
              <Slider
                value={[gradient.rotation]}
                onValueChange={(value) => update({ rotation: Array.isArray(value) ? value[0] : value })}
                min={0}
                max={360}
              />
            </div>
          )}

          <div
            className="h-6 rounded-md border"
            style={{
              background:
                gradient.type === 'linear'
                  ? `linear-gradient(${gradient.rotation}deg, ${gradient.color1}, ${gradient.color2})`
                  : `radial-gradient(circle, ${gradient.color1}, ${gradient.color2})`,
            }}
          />
        </>
      )}
    </div>
  );
}
