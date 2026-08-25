'use client';

import { useMemo } from 'react';
import { useQRConfig } from '@/hooks/useQRConfig';
import { useExport } from '@/hooks/useExport';
import { useToast } from '@/components/Toast';
import { useHistory } from '@/components/History';
import { Toaster } from '@/components/ui/sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
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
import HistoryPanel from './History';

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

  const { addToast } = useToast();
  const { qrRef, downloadPNG, downloadSVG, copyToClipboard } = useExport(config, addToast);
  const { history, addToHistory, removeFromHistory, clearHistory } = useHistory();

  const handleExport = (action: () => void) => {
    addToHistory(config);
    action();
  };

  const sections = useMemo(
    () => [
      {
        id: 'presets',
        title: 'Style Presets',
        icon: '🎨',
        content: <StylePresets onApply={handleConfigChange} />,
      },
      {
        id: 'colors',
        title: 'Colors',
        icon: '🎯',
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
        id: 'style',
        title: 'Dot & Corner Style',
        icon: '✨',
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
        id: 'gradient',
        title: 'Gradient',
        icon: '🌈',
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
        icon: '🖼️',
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
      <Toaster richColors position="bottom-right" />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Mobile: Preview first */}
        <div className="mb-6 lg:hidden">
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div ref={qrRef}>
                {config.gradient.enabled ? (
                  <QRPreviewStylized config={config} />
                ) : (
                  <QRPreview config={config} />
                )}
              </div>
            </CardContent>
          </Card>
          <div className="mt-3">
            <DownloadButton
              config={config}
              onConfigChange={handleConfigChange}
              onDownloadPNG={() => handleExport(downloadPNG)}
              onDownloadSVG={() => handleExport(downloadSVG)}
              onCopy={() => handleExport(copyToClipboard)}
            />
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-6 lg:grid-cols-[1fr,380px]">
          {/* Left Column - Controls */}
          <div className="space-y-4">
            {/* URL Input - Prominent */}
            <Card>
              <CardContent className="p-4">
                <QRInput
                  type={config.type}
                  fields={fields}
                  onFieldChange={handleFieldChange}
                  errors={errors}
                />
              </CardContent>
            </Card>

            {/* Type Selector */}
            <Card>
              <CardContent className="p-3">
                <QRTypeSelector value={config.type} onChange={handleTypeChange} />
              </CardContent>
            </Card>

            {/* Customization Sections - Accordion */}
            <Accordion defaultValue={['presets']} className="space-y-3">
              {sections.map((section) => (
                <AccordionItem key={section.id} value={section.id} className="border-none">
                  <Card>
                    <CardContent className="p-0">
                      <button
                        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-muted/50 [&[data-state=open]>svg]:rotate-180"
                        type="button"
                      >
                        <span className="text-base">{section.icon}</span>
                        <span className="flex-1">{section.title}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-muted-foreground transition-transform duration-200"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>
                      <AccordionContent>
                        <div className="border-t px-4 pb-4 pt-3">
                          {section.content}
                        </div>
                      </AccordionContent>
                    </CardContent>
                  </Card>
                </AccordionItem>
              ))}
            </Accordion>

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

          {/* Right Column - Preview (Desktop only) */}
          <div className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div ref={qrRef}>
                    {config.gradient.enabled ? (
                      <QRPreviewStylized config={config} />
                    ) : (
                      <QRPreview config={config} />
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <DownloadButton
                    config={config}
                    onConfigChange={handleConfigChange}
                    onDownloadPNG={() => handleExport(downloadPNG)}
                    onDownloadSVG={() => handleExport(downloadSVG)}
                    onCopy={() => handleExport(copyToClipboard)}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-muted-foreground">
          Built with Next.js &bull; No data collection &bull; Open Source
        </div>
      </footer>
    </>
  );
}
