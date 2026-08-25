'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QRConfig } from '@/types';
import { SIZE_OPTIONS, ERROR_CORRECTION_OPTIONS } from '@/lib/constants';

interface DownloadButtonProps {
  config: QRConfig;
  onConfigChange: (updates: Partial<QRConfig>) => void;
  onDownloadPNG: () => void;
  onDownloadSVG: () => void;
  onCopy: () => void;
}

export default function DownloadButton({
  config,
  onConfigChange,
  onDownloadPNG,
  onDownloadSVG,
  onCopy,
}: DownloadButtonProps) {
  return (
    <div className="space-y-3">
      {/* Download Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button onClick={onDownloadPNG} className="w-full">
          PNG
        </Button>
        <Button onClick={onDownloadSVG} variant="outline" className="w-full">
          SVG
        </Button>
        <Button onClick={onCopy} variant="outline" className="w-full">
          Copy
        </Button>
      </div>

      {/* Size & Error Correction */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Size</Label>
          <Select
            value={String(config.size)}
            onValueChange={(value) => onConfigChange({ size: Number(value) })}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SIZE_OPTIONS.map((size) => (
                <SelectItem key={size.value} value={String(size.value)}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Error Correction</Label>
          <Select
            value={config.errorCorrection}
            onValueChange={(value) => onConfigChange({ errorCorrection: value as QRConfig['errorCorrection'] })}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ERROR_CORRECTION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
