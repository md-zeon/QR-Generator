'use client';

import { useState } from 'react';
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
import QRScanner from './QRScanner';

export default function QRGenerator() {
  const [activeTab, setActiveTab] = useState('generate');

  const {
    config,
    fields,
    errors,
    handleConfigChange,
    handleTypeChange,
    handleFieldChange,
    handleLogoChange,
    restoreConfig,
  } = useQRConfig();

  const { addToast } = useToast();
  const { downloadPNG, downloadSVG, copyToClipboard } = useExport(config, addToast);
  const { history, addToHistory, removeFromHistory, clearHistory } = useHistory();

  const handleExport = (action: () => void) => {
    addToHistory(config);
    action();
  };

  const hasContent = config.content.trim().length > 0;

  const qrPreview = (
    <>
      {config.gradient.enabled ? (
        <QRPreviewStylized config={config} />
      ) : (
        <QRPreview config={config} />
      )}
    </>
  );

  return (
    <>
      <Toaster richColors position="bottom-right" />

      {/* Top-level Tab Bar */}
      <div className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-11 gap-1 bg-transparent p-0">
              <TabsTrigger
                value="generate"
                className="relative h-11 rounded-none border-b-2 border-transparent px-4 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Generate
              </TabsTrigger>
              <TabsTrigger
                value="scan"
                className="relative h-11 rounded-none border-b-2 border-transparent px-4 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                </svg>
                Scan
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Generate Tab */}
      {activeTab === 'generate' && (
        <>
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
                  onSelect={(cfg) => restoreConfig(cfg)}
                  onRemove={removeFromHistory}
                  onClear={clearHistory}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Scan Tab */}
      {activeTab === 'scan' && (
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:py-8">
          <div className="space-y-1 mb-6">
            <h2 className="text-lg font-semibold tracking-tight">Scan QR Code</h2>
            <p className="text-sm text-muted-foreground">
              Upload an image or use your camera to scan a QR code.
            </p>
          </div>
          <QRScanner />
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
