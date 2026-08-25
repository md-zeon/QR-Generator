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
    <Tabs value={value} onValueChange={(v) => onChange(v as QRType)}>
      <TabsList className="w-full justify-start overflow-x-auto">
        {QR_TYPES.map((type) => (
          <TabsTrigger key={type.id} value={type.id} className="gap-1.5 px-3">
            <span className="text-sm">{type.icon}</span>
            <span>{type.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
