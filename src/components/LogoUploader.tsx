'use client';

import { useRef } from 'react';

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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      onLogoChange(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onLogoChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload logo"
      />

      {logo ? (
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800">
            <img src={logo} alt="Logo preview" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-zinc-300">Logo uploaded</p>
            <button
              onClick={handleRemove}
              className="mt-1 text-sm text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-800/50 px-4 py-6 text-zinc-400 transition-colors hover:border-purple-500 hover:text-purple-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <span>Upload Logo</span>
        </button>
      )}

      {logo && (
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Logo Size: {logoSize}%
          </label>
          <input
            type="range"
            min="10"
            max="25"
            value={logoSize}
            onChange={(e) => onLogoSizeChange(parseInt(e.target.value))}
            className="w-full accent-purple-500"
            aria-label="Logo size percentage"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Recommended: 15-20% for best scannability
          </p>
        </div>
      )}

      <p className="text-xs text-zinc-500">
        PNG, JPG, or SVG. Max 2MB. Logo will be centered with error correction level H.
      </p>
    </div>
  );
}
