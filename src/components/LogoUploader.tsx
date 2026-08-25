'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface LogoUploaderProps {
  logo: string | null;
  logoSize: number;
  onLogoChange: (logo: string | null) => void;
  onLogoSizeChange: (size: number) => void;
}

export default function LogoUploader({
  logo,
  logoSize,
  onLogoChange,
  onLogoSizeChange,
}: LogoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        onLogoChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs">Logo Image</Label>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-8"
          >
            Choose File
          </Button>
          {logo && (
            <Button variant="ghost" size="sm" onClick={() => onLogoChange(null)} className="h-8 text-destructive">
              Remove
            </Button>
          )}
        </div>
      </div>

      {logo && (
        <div className="flex items-center justify-center rounded-md border bg-muted/30 p-3">
          <img
            src={logo}
            alt="Logo preview"
            className="max-h-12 w-auto object-contain"
          />
        </div>
      )}

      {logo && (
        <div className="space-y-1.5">
          <Label className="text-xs">Logo Size: {logoSize}%</Label>
          <Slider
            value={[logoSize]}
            onValueChange={(value) => onLogoSizeChange(Array.isArray(value) ? value[0] : value)}
            min={5}
            max={30}
          />
        </div>
      )}
    </div>
  );
}
