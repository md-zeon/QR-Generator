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
      <TabsList className="flex w-full flex-wrap gap-1">
        {QR_TYPES.map((type) => (
          <TabsTrigger key={type.id} value={type.id} className="gap-1.5">
            <span>{type.icon}</span>
            <span className="hidden sm:inline">{type.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
