'use client';

import { useQRConfig } from '@/hooks/useQRConfig';
import { useExport } from '@/hooks/useExport';
import { useToast } from '@/components/Toast';
import { useHistory } from '@/components/History';
import { Toaster } from '@/components/ui/sonner';
import { Card, CardContent } from '@/components/ui/card';
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

  const hasContent = config.content.trim().length > 0;

  const sections = [
    {
      id: 'presets',
      title: 'Style Presets',
      description: 'Quick-start with a preset style',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      content: <StylePresets onApply={handleConfigChange} />,
    },
    {
      id: 'colors',
      title: 'Colors',
      description: 'Customize foreground and background',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
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
      description: 'Shape of QR code dots and corners',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
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
      description: 'Add color gradient effect',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
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
      description: 'Embed a logo in the center',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      content: (
        <LogoUploader
          logo={config.logo}
          logoSize={config.logoSize}
          onLogoChange={handleLogoChange}
          onLogoSizeChange={(logoSize) => handleConfigChange({ logoSize })}
        />
      ),
    },
  ];

  return (
    <>
      <Toaster richColors position="bottom-right" />

      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        {/* Hero / Onboarding */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Create your QR code
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Choose a type, enter your content, and customize the design.{' '}
            <span className="hidden sm:inline">All processing happens in your browser — no data leaves your device.</span>
          </p>
        </div>

        {/* Step 1: Type + Content */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              1
            </span>
            Choose type & enter content
          </div>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <QRTypeSelector value={config.type} onChange={handleTypeChange} />
              <div className="mt-4">
                <QRInput
                  type={config.type}
                  fields={fields}
                  onFieldChange={handleFieldChange}
                  errors={errors}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step 2: Preview + Download */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              2
            </span>
            Preview & download
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr,400px]">
            {/* Mobile: preview on top */}
            <div className="order-1 lg:order-2">
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
            </div>

            {/* Download controls */}
            <div className="order-2 space-y-4 lg:order-1">
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
          </div>
        </div>

        {/* Step 3: Customize */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              3
            </span>
            Customize design
            <span className="text-xs text-muted-foreground font-normal">(optional)</span>
          </div>

          <Accordion defaultValue={['presets']} className="space-y-3">
            {sections.map((section) => (
              <AccordionItem key={section.id} value={section.id} className="border-none">
                <Card>
                  <CardContent className="p-0">
                    <button
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                      type="button"
                    >
                      <span className="text-muted-foreground">{section.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium block">{section.title}</span>
                        <span className="text-xs text-muted-foreground block">{section.description}</span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
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
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t py-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-muted-foreground">
          Built with Next.js &bull; 100% client-side &bull; No data collection
        </div>
      </footer>
    </>
  );
}
