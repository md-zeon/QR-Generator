'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
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
        <Label htmlFor="gradient-toggle">Enable Gradient</Label>
        <Switch
          id="gradient-toggle"
          checked={gradient.enabled}
          onCheckedChange={(checked) => update({ enabled: checked })}
        />
      </div>

      {gradient.enabled && (
        <>
          {/* Gradient Type */}
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={gradient.type === 'linear' ? 'default' : 'outline'}
                size="sm"
                onClick={() => update({ type: 'linear' })}
              >
                Linear
              </Button>
              <Button
                variant={gradient.type === 'radial' ? 'default' : 'outline'}
                size="sm"
                onClick={() => update({ type: 'radial' })}
              >
                Radial
              </Button>
            </div>
          </div>

          {/* Colors */}
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-2">
              <Label>Color 1</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={gradient.color1}
                  onChange={(e) => update({ color1: e.target.value })}
                  className="h-9 w-9 cursor-pointer rounded-md border-0"
                />
                <Input
                  value={gradient.color1}
                  onChange={(e) => update({ color1: e.target.value })}
                  className="font-mono uppercase"
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <Label>Color 2</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={gradient.color2}
                  onChange={(e) => update({ color2: e.target.value })}
                  className="h-9 w-9 cursor-pointer rounded-md border-0"
                />
                <Input
                  value={gradient.color2}
                  onChange={(e) => update({ color2: e.target.value })}
                  className="font-mono uppercase"
                />
              </div>
            </div>
          </div>

          {/* Rotation (linear only) */}
          {gradient.type === 'linear' && (
            <div className="space-y-2">
              <Label>Rotation: {gradient.rotation}°</Label>
              <Slider
                value={[gradient.rotation]}
                onValueChange={(value) => update({ rotation: Array.isArray(value) ? value[0] : value })}
                min={0}
                max={360}
              />
            </div>
          )}

          {/* Preview */}
          <div
            className="h-8 rounded-md border"
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
