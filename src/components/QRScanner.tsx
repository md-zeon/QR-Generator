'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import QrScanner from 'qr-scanner';
import { Button } from '@/components/ui/button';

interface ScanResult {
  raw: string;
  type: string;
  timestamp: number;
}

function detectQRType(raw: string): { type: string; label: string; actions: { label: string; action: string; icon: string }[] } {
  if (/^https?:\/\//i.test(raw)) {
    return { type: 'url', label: 'URL', actions: [
      { label: 'Open Link', action: 'open', icon: '🔗' },
      { label: 'Copy', action: 'copy', icon: '📋' },
    ]};
  }
  if (/^WIFI:/i.test(raw)) {
    return { type: 'wifi', label: 'WiFi', actions: [
      { label: 'Copy Password', action: 'copy-password', icon: '🔑' },
      { label: 'Copy SSID', action: 'copy-ssid', icon: '📶' },
    ]};
  }
  if (/^BEGIN:VCARD/i.test(raw)) {
    return { type: 'vcard', label: 'Contact', actions: [
      { label: 'Copy', action: 'copy', icon: '📋' },
    ]};
  }
  if (/^mailto:/i.test(raw)) {
    return { type: 'email', label: 'Email', actions: [
      { label: 'Open Email', action: 'open', icon: '✉️' },
      { label: 'Copy', action: 'copy', icon: '📋' },
    ]};
  }
  if (/^sms:/i.test(raw)) {
    return { type: 'sms', label: 'SMS', actions: [
      { label: 'Open SMS', action: 'open', icon: '💬' },
      { label: 'Copy', action: 'copy', icon: '📋' },
    ]};
  }
  if (/^tel:/i.test(raw)) {
    return { type: 'phone', label: 'Phone', actions: [
      { label: 'Call', action: 'open', icon: '📞' },
      { label: 'Copy', action: 'copy', icon: '📋' },
    ]};
  }
  if (/^geo:/i.test(raw)) {
    return { type: 'location', label: 'Location', actions: [
      { label: 'Open Maps', action: 'open', icon: '📍' },
      { label: 'Copy', action: 'copy', icon: '📋' },
    ]};
  }
  return { type: 'text', label: 'Text', actions: [
    { label: 'Copy', action: 'copy', icon: '📋' },
  ]};
}

function parseWiFi(raw: string) {
  const ssid = raw.match(/S:([^;]*)/)?.[1] || '';
  const password = raw.match(/P:([^;]*)/)?.[1] || '';
  const security = raw.match(/T:([^;]*)/)?.[1] || '';
  return { ssid, password, security };
}

function parseGeo(raw: string) {
  const match = raw.match(/geo:([-\d.]+),([-\d.]+)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  return null;
}

export default function QRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [mode, setMode] = useState<'image' | 'camera'>('image');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState(false);

  const stopCamera = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setCameraReady(false);
    setScanning(false);
  }, []);

  const handleScan = useCallback((data: string) => {
    const typeInfo = detectQRType(data);
    setResult({ raw: data, type: typeInfo.label, timestamp: Date.now() });
    setScanning(false);
    if (navigator.vibrate) navigator.vibrate(50);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    setResult(null);
    setScanning(true);

    try {
      const video = videoRef.current;
      if (!video) return;

      const scanner = new QrScanner(
        video,
        (result) => handleScan(result.data),
        {
          highlightScanRegion: false,
          highlightCodeOutline: false,
          preferredCamera: 'environment',
        }
      );

      scannerRef.current = scanner;
      await scanner.start();
      setCameraReady(true);
    } catch (err) {
      setScanning(false);
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          setError('Camera access denied. Please enable camera in your browser settings.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found on this device.');
        } else {
          setError('Could not access camera. Try uploading an image instead.');
        }
      } else {
        setError('Camera error. Try uploading an image instead.');
      }
    }
  }, [handleScan]);

  const scanImage = useCallback(async (file: File) => {
    setError(null);
    setResult(null);
    setScanning(true);

    try {
      const result = await QrScanner.scanImage(file) as string | { data: string };
      const data = typeof result === 'string' ? result : result.data;
      handleScan(data);
    } catch {
      setScanning(false);
      setError('No QR code found in this image. Try a clearer image.');
    }
  }, [handleScan]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) scanImage(file);
  }, [scanImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      scanImage(file);
    }
  }, [scanImage]);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) scanImage(file);
        break;
      }
    }
  }, [scanImage]);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const handleAction = useCallback(async (action: string, raw: string) => {
    const typeInfo = detectQRType(raw);

    if (action === 'copy' || action === 'copy-ssid' || action === 'copy-password') {
      let textToCopy = raw;
      if (action === 'copy-ssid' && typeInfo.type === 'wifi') {
        textToCopy = parseWiFi(raw).ssid;
      } else if (action === 'copy-password' && typeInfo.type === 'wifi') {
        textToCopy = parseWiFi(raw).password;
      }
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback for non-secure contexts
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      return;
    }

    if (action === 'open') {
      try {
        const url = new URL(raw);
        if (url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'mailto:' || url.protocol === 'tel:' || url.protocol === 'sms:' || url.protocol === 'geo:') {
          window.open(raw, '_blank');
        }
      } catch {
        // Not a valid URL, ignore
      }
    }
  }, []);

  const typeInfo = result ? detectQRType(result.raw) : null;
  const wifiData = result && typeInfo?.type === 'wifi' ? parseWiFi(result.raw) : null;
  const geoData = result && typeInfo?.type === 'location' ? parseGeo(result.raw) : null;

  return (
    <div className="space-y-4">
      {/* Mode Tabs */}
      <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
        <button
          type="button"
          onClick={() => { stopCamera(); setMode('image'); setResult(null); setError(null); }}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === 'image' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="mr-1.5">📁</span> Image
        </button>
        <button
          type="button"
          onClick={() => { setMode('camera'); setResult(null); setError(null); }}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === 'camera' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="mr-1.5">📷</span> Camera
        </button>
      </div>

      {/* Image Upload Mode */}
      {mode === 'image' && !result && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all ${
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-muted-foreground/30 hover:bg-muted/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <p className="text-sm font-medium">
            {scanning ? 'Processing...' : 'Drop an image or click to browse'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PNG, JPG, WEBP · or paste from clipboard (Ctrl+V)
          </p>
        </div>
      )}

      {/* Camera Mode */}
      {mode === 'camera' && !result && (
        <div className="space-y-3">
          {!scanning && !cameraReady && (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-8">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </div>
              <p className="text-sm font-medium">Camera Access</p>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                Your camera feed stays on your device. Nothing is uploaded.
              </p>
              <Button onClick={startCamera} className="mt-4" size="sm">
                Enable Camera
              </Button>
            </div>
          )}

          <div className={`relative overflow-hidden rounded-xl bg-black ${scanning && cameraReady ? 'block' : 'hidden'}`}>
            <video ref={videoRef} className="w-full" playsInline muted />
            {/* Viewfinder overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative h-[250px] w-[250px] sm:h-[300px] sm:w-[300px]">
                {/* Dimmed overlay */}
                <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_0_9999px_rgba(0,0,0,0.5)]" />
                {/* Corner brackets */}
                <div className="absolute left-0 top-0 h-7 w-7 rounded-tl-xl border-l-[3px] border-t-[3px] border-primary" />
                <div className="absolute right-0 top-0 h-7 w-7 rounded-tr-xl border-r-[3px] border-t-[3px] border-primary" />
                <div className="absolute bottom-0 left-0 h-7 w-7 rounded-bl-xl border-b-[3px] border-l-[3px] border-primary" />
                <div className="absolute bottom-0 right-0 h-7 w-7 rounded-br-xl border-b-[3px] border-r-[3px] border-primary" />
                {/* Scan line */}
                <div className="scan-line absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
              </div>
            </div>
            <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/70">
              Align QR code inside the frame
            </p>
          </div>

          {scanning && cameraReady && (
            <Button onClick={stopCamera} variant="outline" size="sm" className="w-full">
              Stop Camera
            </Button>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            onClick={() => { setError(null); setMode('image'); }}
            variant="ghost"
            size="sm"
            className="mt-2"
          >
            Upload an image instead
          </Button>
        </div>
      )}

      {/* Result */}
      {result && typeInfo && (
        <div className="space-y-3 rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 items-center rounded-full bg-primary/10 px-2 text-xs font-medium text-primary">
              {typeInfo.label}
            </span>
            <span className="text-xs text-muted-foreground">QR Code Detected</span>
          </div>

          {/* Content display */}
          <div className="rounded-lg bg-muted/50 p-3">
            {typeInfo.type === 'wifi' && wifiData ? (
              <div className="space-y-1 text-sm">
                <div><span className="text-muted-foreground">Network:</span> {wifiData.ssid}</div>
                {wifiData.password && (
                  <div><span className="text-muted-foreground">Password:</span> {wifiData.password}</div>
                )}
                {wifiData.security && (
                  <div><span className="text-muted-foreground">Security:</span> {wifiData.security}</div>
                )}
              </div>
            ) : typeInfo.type === 'location' && geoData ? (
              <div className="space-y-1 text-sm">
                <div><span className="text-muted-foreground">Latitude:</span> {geoData.lat}</div>
                <div><span className="text-muted-foreground">Longitude:</span> {geoData.lng}</div>
              </div>
            ) : (
              <p className="break-all text-sm font-mono">{result.raw}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {typeInfo.actions.map((act) => (
              <Button
                key={act.action}
                onClick={() => handleAction(act.action, result.raw)}
                variant={act === typeInfo.actions[0] ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
              >
                {act.action === 'copy' || act.action === 'copy-ssid' || act.action === 'copy-password'
                  ? (copied ? 'Copied!' : act.label)
                  : act.label
                }
              </Button>
            ))}
          </div>

          <Button
            onClick={() => { setResult(null); setError(null); if (mode === 'camera') startCamera(); }}
            variant="ghost"
            size="sm"
            className="w-full"
          >
            Scan another
          </Button>
        </div>
      )}

      {/* Privacy note */}
      <p className="text-center text-[10px] text-muted-foreground">
        100% client-side · Your data never leaves this device
      </p>
    </div>
  );
}
