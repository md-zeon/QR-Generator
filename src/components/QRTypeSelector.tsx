'use client';

import { QRType } from '@/types';
import { QR_TYPES } from '@/lib/constants';

interface QRTypeSelectorProps {
  value: QRType;
  onChange: (type: QRType) => void;
}

export default function QRTypeSelector({ value, onChange }: QRTypeSelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="QR code type"
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
    >
      {QR_TYPES.map((type) => (
        <button
          key={type.id}
          role="tab"
          aria-selected={value === type.id}
          onClick={() => onChange(type.id)}
          className={`flex flex-col items-center gap-1 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
            value === type.id
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
          }`}
        >
          <span className="text-lg">{type.icon}</span>
          <span>{type.label}</span>
        </button>
      ))}
    </div>
  );
}
