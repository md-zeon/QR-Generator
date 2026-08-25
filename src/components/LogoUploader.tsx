'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Logo Image</Label>
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
          >
            Choose File
          </Button>
          {logo && (
            <Button variant="ghost" size="sm" onClick={() => onLogoChange(null)}>
              Remove
            </Button>
          )}
        </div>
      </div>

      {logo && (
        <Card className="flex items-center justify-center p-4">
          <img
            src={logo}
            alt="Logo preview"
            className="max-h-16 w-auto object-contain"
          />
        </Card>
      )}

      {logo && (
        <div className="space-y-2">
          <Label>Logo Size: {logoSize}%</Label>
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
