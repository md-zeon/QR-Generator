'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    <div className="space-y-4">
      {/* Size Selector */}
      <div className="space-y-2">
        <Label>Size</Label>
        <div className="grid grid-cols-4 gap-2">
          {SIZE_OPTIONS.map((size) => (
            <Button
              key={size.value}
              variant={config.size === size.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onConfigChange({ size: size.value })}
            >
              {size.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Error Correction */}
      <div className="space-y-2">
        <Label>Error Correction</Label>
        <Select
          value={config.errorCorrection}
          onValueChange={(value) => onConfigChange({ errorCorrection: value as QRConfig['errorCorrection'] })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ERROR_CORRECTION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label} — {option.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Download Buttons */}
      <div className="space-y-2">
        <Button onClick={onDownloadPNG} className="w-full">
          Download PNG
        </Button>
        <Button onClick={onDownloadSVG} variant="outline" className="w-full">
          Download SVG
        </Button>
        <Button onClick={onCopy} variant="outline" className="w-full">
          Copy to Clipboard
        </Button>
      </div>
    </div>
  );
}
