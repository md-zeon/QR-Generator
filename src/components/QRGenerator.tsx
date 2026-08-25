'use client';

import { useState, useCallback, useMemo } from 'react';
import { QRConfig, QRType } from '@/types';
import { DEFAULT_QR_CONFIG } from '@/lib/constants';
import { formatQRContent, getInitialFields } from '@/lib/qr-types';
import QRTypeSelector from './QRTypeSelector';
import QRInput from './QRInput';
import QRPreview from './QRPreview';
import ColorPicker from './ColorPicker';
import StylePicker from './StylePicker';
import LogoUploader from './LogoUploader';
import DownloadButton from './DownloadButton';

export default function QRGenerator() {
  const [config, setConfig] = useState<QRConfig>(DEFAULT_QR_CONFIG);
  const [fields, setFields] = useState<Record<string, string>>(getInitialFields('url'));
  const [error, setError] = useState<string | undefined>();

  const handleConfigChange = useCallback((updates: Partial<QRConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleTypeChange = useCallback((type: QRType) => {
    const newFields = getInitialFields(type);
    setFields(newFields);
    setConfig((prev) => ({
      ...prev,
      type,
      content: formatQRContent(type, newFields),
    }));
    setError(undefined);
  }, []);

  const handleFieldChange = useCallback(
    (field: string, value: string) => {
      const newFields = { ...fields, [field]: value };
      setFields(newFields);

      const content = formatQRContent(config.type, newFields);
      setConfig((prev) => ({ ...prev, content }));

      if (content.trim()) {
        setError(undefined);
      }
    },
    [fields, config.type]
  );

  const handleLogoChange = useCallback(
    (logo: string | null) => {
      handleConfigChange({
        logo,
        errorCorrection: logo ? 'H' : config.errorCorrection,
      });
    },
    [config.errorCorrection, handleConfigChange]
  );

  const sections = useMemo(
    () => [
      {
        id: 'style',
        title: 'Style',
        content: (
          <StylePicker
            dotStyle={config.dotStyle}
            cornerStyle={config.cornerStyle}
            onDotStyleChange={(dotStyle) => handleConfigChange({ dotStyle })}
            onCornerStyleChange={(cornerStyle) => handleConfigChange({ cornerStyle })}
          />
        ),
      },
      {
        id: 'colors',
        title: 'Colors',
        content: (
          <ColorPicker
            foreground={config.foreground}
            background={config.background}
            onForegroundChange={(foreground) => handleConfigChange({ foreground })}
            onBackgroundChange={(background) => handleConfigChange({ background })}
          />
        ),
      },
      {
        id: 'logo',
        title: 'Logo',
        content: (
          <LogoUploader
            logo={config.logo}
            logoSize={config.logoSize}
            onLogoChange={handleLogoChange}
            onLogoSizeChange={(logoSize) => handleConfigChange({ logoSize })}
          />
        ),
      },
    ],
    [config, handleConfigChange, handleLogoChange]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr,auto]">
        {/* Left Column - Input & Options */}
        <div className="space-y-6">
          {/* Type Selector */}
          <section>
            <QRTypeSelector value={config.type} onChange={handleTypeChange} />
          </section>

          {/* Input Fields */}
          <section>
            <QRInput
              type={config.type}
              fields={fields}
              onFieldChange={handleFieldChange}
              error={error}
            />
          </section>

          {/* Customization Sections */}
          {sections.map((section) => (
            <details
              key={section.id}
              open
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/50"
            >
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-medium text-white">
                {section.title}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-zinc-400 transition-transform group-open:rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <div className="border-t border-zinc-800 px-4 pb-4 pt-3">
                {section.content}
              </div>
            </details>
          ))}
        </div>

        {/* Right Column - Preview & Export */}
        <div className="space-y-6 lg:sticky lg:top-8 lg:h-fit">
          {/* Preview */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <QRPreview config={config} />
          </section>

          {/* Export */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h3 className="mb-4 font-medium text-white">Export</h3>
            <DownloadButton config={config} onConfigChange={handleConfigChange} />
          </section>
        </div>
      </div>
    </div>
  );
}
