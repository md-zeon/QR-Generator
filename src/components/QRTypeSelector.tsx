'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QR_TYPES } from '@/lib/constants';
import { QRType } from '@/types';

interface QRTypeSelectorProps {
  value: QRType;
  onChange: (type: QRType) => void;
}

export default function QRTypeSelector({ value, onChange }: QRTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">QR Type</label>
      <Tabs value={value} onValueChange={(v) => onChange(v as QRType)}>
        <TabsList className="w-full justify-start gap-1 overflow-x-auto p-1">
          {QR_TYPES.map((type) => (
            <TabsTrigger
              key={type.id}
              value={type.id}
              className="flex shrink-0 gap-1.5 px-3 py-1.5 text-xs sm:text-sm"
            >
              <span>{type.icon}</span>
              <span className="hidden sm:inline">{type.label}</span>
              <span className="sm:hidden">{type.label.slice(0, 4)}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
