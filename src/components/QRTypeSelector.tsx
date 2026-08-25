'use client';

import { QR_TYPES } from '@/lib/constants';
import { QRType } from '@/types';

interface QRTypeSelectorProps {
  value: QRType;
  onChange: (type: QRType) => void;
}

const TYPE_DESCRIPTIONS: Record<QRType, string> = {
  url: 'Open a website',
  text: 'Plain text',
  wifi: 'WiFi network',
  vcard: 'Contact info',
  email: 'Send email',
  sms: 'Send SMS',
  phone: 'Dial number',
  whatsapp: 'WhatsApp chat',
  location: 'Map location',
  calendar: 'Event details',
};

export default function QRTypeSelector({ value, onChange }: QRTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">QR Type</label>
      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-3">
        {QR_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => onChange(type.id)}
            type="button"
            className={`flex flex-col items-center gap-1 rounded-lg border p-2.5 text-center transition-all ${
              value === type.id
                ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary/20'
                : 'border-border bg-card hover:border-muted-foreground/30 hover:bg-muted/50'
            }`}
          >
            <span className="text-lg leading-none">{type.icon}</span>
            <span className="text-xs font-medium leading-tight">{type.label}</span>
            <span className="hidden text-[10px] text-muted-foreground sm:block">{TYPE_DESCRIPTIONS[type.id]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
