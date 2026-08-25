'use client';

import { useMemo } from 'react';
import { useQRConfig } from '@/hooks/useQRConfig';
import { useExport } from '@/hooks/useExport';
import { useToast } from '@/components/Toast';
import ToastContainer from '@/components/Toast';
import { useHistory } from '@/components/History';
import HistoryPanel from '@/components/History';
import QRTypeSelector from './QRTypeSelector';
import QRInput from './QRInput';
import QRPreview from './QRPreview';
import QRPreviewStylized from './QRPreviewStylized';
import ColorPicker from './ColorPicker';
import GradientPicker from './GradientPicker';
import StylePicker from './StylePicker';
import StylePresets from './StylePresets';
import LogoUploader from './LogoUploader';
import DownloadButton from './DownloadButton';

export default function QRGenerator() {
  const {
    config,
    fields,
    errors,
    handleConfigChange,
    handleTypeChange,
    handleFieldChange,
    handleLogoChange,
  } = useQRConfig();

  const { toasts, addToast, removeToast } = useToast();
  const { qrRef, downloadPNG, downloadSVG, copyToClipboard } = useExport(config, addToast);
  const { history, addToHistory, removeFromHistory, clearHistory } = useHistory();

  const handleExport = (action: () => void) => {
    addToHistory(config);
    action();
  };

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
        id: 'gradient',
        title: 'Gradient',
        content: (
          <GradientPicker
            gradient={config.gradient}
            onGradientChange={(gradient) => handleConfigChange({ gradient })}
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
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

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
                errors={errors}
              />
            </section>

            {/* Customization Sections */}
            {/* Presets */}
            <details
              open
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/50"
            >
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-medium text-white">
                Presets
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
                <StylePresets onApply={handleConfigChange} />
              </div>
            </details>

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

            {/* History */}
            <HistoryPanel
              history={history}
              onSelect={(cfg) => {
                handleConfigChange(cfg);
                handleTypeChange(cfg.type);
              }}
              onRemove={removeFromHistory}
              onClear={clearHistory}
            />
          </div>

          {/* Right Column - Preview & Export */}
          <div className="space-y-6 lg:sticky lg:top-8 lg:h-fit">
            {/* Preview */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div ref={qrRef}>
                {config.gradient.enabled ? (
                  <QRPreviewStylized config={config} />
                ) : (
                  <QRPreview config={config} />
                )}
              </div>
            </section>

            {/* Export */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="mb-4 font-medium text-white">Export</h3>
              <DownloadButton
                config={config}
                onConfigChange={handleConfigChange}
                onDownloadPNG={() => handleExport(downloadPNG)}
                onDownloadSVG={() => handleExport(downloadSVG)}
                onCopy={() => handleExport(copyToClipboard)}
              />
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
