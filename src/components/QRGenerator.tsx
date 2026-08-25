'use client';

import { useMemo } from 'react';
import { useQRConfig } from '@/hooks/useQRConfig';
import { useExport } from '@/hooks/useExport';
import { useToast } from '@/components/Toast';
import { useHistory } from '@/components/History';
import { Toaster } from '@/components/ui/sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
        title: 'Presets',
        content: <StylePresets onApply={handleConfigChange} />,
      },
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
      <Toaster richColors position="bottom-right" />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr,auto]">
          {/* Left Column - Input & Options */}
          <div className="space-y-4">
            {/* Type Selector */}
            <Card>
              <CardContent className="pt-6">
                <QRTypeSelector value={config.type} onChange={handleTypeChange} />
              </CardContent>
            </Card>

            {/* Input Fields */}
            <Card>
              <CardContent className="pt-6">
                <QRInput
                  type={config.type}
                  fields={fields}
                  onFieldChange={handleFieldChange}
                  errors={errors}
                />
              </CardContent>
            </Card>

            {/* Customization Sections */}
            {sections.map((section) => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle className="text-base">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>{section.content}</CardContent>
              </Card>
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
          <div className="space-y-4 lg:sticky lg:top-8 lg:h-fit">
            {/* Preview */}
            <Card>
              <CardContent className="pt-6">
                <div ref={qrRef}>
                  {config.gradient.enabled ? (
                    <QRPreviewStylized config={config} />
                  ) : (
                    <QRPreview config={config} />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Export */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Export</CardTitle>
              </CardHeader>
              <CardContent>
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
    </>
  );
}
