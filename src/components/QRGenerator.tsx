'use client';

import { useQRConfig } from '@/hooks/useQRConfig';
import { useExport } from '@/hooks/useExport';
import { useToast } from '@/components/Toast';
import { useHistory } from '@/components/History';
import { Toaster } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

  const hasContent = config.content.trim().length > 0;

  const qrPreview = (
    <div ref={qrRef}>
      {config.gradient.enabled ? (
        <QRPreviewStylized config={config} />
      ) : (
        <QRPreview config={config} />
      )}
    </div>
  );

  return (
    <>
      <Toaster richColors position="bottom-right" />

      {/* Mobile: Preview first */}
      <div className="lg:hidden">
        <div className="border-b bg-card/50 px-4 py-6">
          <div className="mx-auto max-w-[280px]">
            {qrPreview}
          </div>
        </div>
        <div className="border-b px-4 py-3">
          <DownloadButton
            config={config}
            onConfigChange={handleConfigChange}
            onDownloadPNG={() => handleExport(downloadPNG)}
            onDownloadSVG={() => handleExport(downloadSVG)}
            onCopy={() => handleExport(copyToClipboard)}
          />
        </div>
      </div>

      {/* Desktop: Two-column workspace */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
          {/* Left: Create */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold tracking-tight">Create</h2>
              <p className="text-sm text-muted-foreground">
                Choose a QR type and enter your content.
              </p>
            </div>

            <QRTypeSelector value={config.type} onChange={handleTypeChange} />

            <div className="rounded-xl border bg-card p-4">
              <QRInput
                type={config.type}
                fields={fields}
                onFieldChange={handleFieldChange}
                errors={errors}
              />
            </div>
          </div>

          {/* Right: Preview (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold tracking-tight">Preview</h2>
                <p className="text-sm text-muted-foreground">
                  {hasContent ? 'Your QR code updates live.' : 'Enter content to generate.'}
                </p>
              </div>

              <div className="rounded-xl border bg-card p-6">
                {qrPreview}
              </div>

              <DownloadButton
                config={config}
                onConfigChange={handleConfigChange}
                onDownloadPNG={() => handleExport(downloadPNG)}
                onDownloadSVG={() => handleExport(downloadSVG)}
                onCopy={() => handleExport(copyToClipboard)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Design Section */}
      <div className="border-t bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold tracking-tight">Design</h2>
              <p className="text-sm text-muted-foreground">
                Customize the look and feel of your QR code.
              </p>
            </div>

            <Tabs defaultValue="presets" className="space-y-4">
              <TabsList className="h-auto w-full justify-start gap-1 bg-muted/50 p-1">
                <TabsTrigger value="presets" className="gap-1.5 px-3 py-1.5 text-xs">
                  <span>✨</span> Presets
                </TabsTrigger>
                <TabsTrigger value="colors" className="gap-1.5 px-3 py-1.5 text-xs">
                  <span>🎨</span> Colors
                </TabsTrigger>
                <TabsTrigger value="style" className="gap-1.5 px-3 py-1.5 text-xs">
                  <span>◼</span> Style
                </TabsTrigger>
                <TabsTrigger value="gradient" className="gap-1.5 px-3 py-1.5 text-xs">
                  <span>🌈</span> Gradient
                </TabsTrigger>
                <TabsTrigger value="logo" className="gap-1.5 px-3 py-1.5 text-xs">
                  <span>◉</span> Logo
                </TabsTrigger>
              </TabsList>

              <TabsContent value="presets">
                <div className="rounded-xl border bg-card p-4">
                  <StylePresets onApply={handleConfigChange} />
                </div>
              </TabsContent>

              <TabsContent value="colors">
                <div className="rounded-xl border bg-card p-4">
                  <ColorPicker
                    foreground={config.foreground}
                    background={config.background}
                    onForegroundChange={(foreground) => handleConfigChange({ foreground })}
                    onBackgroundChange={(background) => handleConfigChange({ background })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="style">
                <div className="rounded-xl border bg-card p-4">
                  <StylePicker
                    dotStyle={config.dotStyle}
                    cornerStyle={config.cornerStyle}
                    onDotStyleChange={(dotStyle) => handleConfigChange({ dotStyle })}
                    onCornerStyleChange={(cornerStyle) => handleConfigChange({ cornerStyle })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="gradient">
                <div className="rounded-xl border bg-card p-4">
                  <GradientPicker
                    gradient={config.gradient}
                    onGradientChange={(gradient) => handleConfigChange({ gradient })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="logo">
                <div className="rounded-xl border bg-card p-4">
                  <LogoUploader
                    logo={config.logo}
                    logoSize={config.logoSize}
                    onLogoChange={handleLogoChange}
                    onLogoSizeChange={(logoSize) => handleConfigChange({ logoSize })}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="border-t">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
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
        </div>
      )}

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <p className="text-center text-xs text-muted-foreground">
            Built with Next.js · 100% client-side · No data collection
          </p>
        </div>
      </footer>
    </>
  );
}
