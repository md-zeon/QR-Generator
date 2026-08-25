'use client';

import { QRType } from '@/types';

interface QRInputProps {
  type: QRType;
  fields: Record<string, string>;
  onFieldChange: (field: string, value: string) => void;
  error?: string;
}

export default function QRInput({ type, fields, onFieldChange, error }: QRInputProps) {
  const renderFields = () => {
    switch (type) {
      case 'url':
      case 'text':
        return (
          <textarea
            value={fields.content || ''}
            onChange={(e) => onFieldChange('content', e.target.value)}
            placeholder={type === 'url' ? 'https://example.com' : 'Enter your text here...'}
            className="h-32 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none"
            aria-label={type === 'url' ? 'URL' : 'Text content'}
          />
        );

      case 'wifi':
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={fields.ssid || ''}
              onChange={(e) => onFieldChange('ssid', e.target.value)}
              placeholder="Network name (SSID)"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none"
              aria-label="WiFi network name"
            />
            <input
              type="text"
              value={fields.password || ''}
              onChange={(e) => onFieldChange('password', e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none"
              aria-label="WiFi password"
            />
            <select
              value={fields.encryption || 'WPA'}
              onChange={(e) => onFieldChange('encryption', e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white transition-colors focus:border-purple-500 focus:outline-none"
              aria-label="WiFi encryption type"
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None</option>
            </select>
          </div>
        );

      case 'vcard':
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={fields.name || ''}
              onChange={(e) => onFieldChange('name', e.target.value)}
              placeholder="Full name"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none"
              aria-label="Full name"
            />
            <input
              type="tel"
              value={fields.phone || ''}
              onChange={(e) => onFieldChange('phone', e.target.value)}
              placeholder="Phone number"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none"
              aria-label="Phone number"
            />
            <input
              type="email"
              value={fields.email || ''}
              onChange={(e) => onFieldChange('email', e.target.value)}
              placeholder="Email address"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none"
              aria-label="Email address"
            />
            <input
              type="text"
              value={fields.organization || ''}
              onChange={(e) => onFieldChange('organization', e.target.value)}
              placeholder="Organization (optional)"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none"
              aria-label="Organization"
            />
          </div>
        );

      case 'email':
        return (
          <div className="space-y-3">
            <input
              type="email"
              value={fields.to || ''}
              onChange={(e) => onFieldChange('to', e.target.value)}
              placeholder="To email"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none"
              aria-label="To email"
            />
            <input
              type="text"
              value={fields.subject || ''}
              onChange={(e) => onFieldChange('subject', e.target.value)}
              placeholder="Subject (optional)"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none"
              aria-label="Email subject"
            />
            <textarea
              value={fields.body || ''}
              onChange={(e) => onFieldChange('body', e.target.value)}
              placeholder="Message body (optional)"
              className="h-24 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none"
              aria-label="Email body"
            />
          </div>
        );

      case 'sms':
        return (
          <div className="space-y-3">
            <input
              type="tel"
              value={fields.number || ''}
              onChange={(e) => onFieldChange('number', e.target.value)}
              placeholder="Phone number"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none"
              aria-label="Phone number"
            />
            <textarea
              value={fields.body || ''}
              onChange={(e) => onFieldChange('body', e.target.value)}
              placeholder="Message (optional)"
              className="h-24 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none"
              aria-label="SMS message"
            />
          </div>
        );

      case 'phone':
        return (
          <input
            type="tel"
            value={fields.number || ''}
            onChange={(e) => onFieldChange('number', e.target.value)}
            placeholder="+1 234 567 8900"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none"
            aria-label="Phone number"
          />
        );

      case 'whatsapp':
        return (
          <div className="space-y-3">
            <input
              type="tel"
              value={fields.number || ''}
              onChange={(e) => onFieldChange('number', e.target.value)}
              placeholder="+1 234 567 8900"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none"
              aria-label="WhatsApp number"
            />
            <textarea
              value={fields.message || ''}
              onChange={(e) => onFieldChange('message', e.target.value)}
              placeholder="Message (optional)"
              className="h-24 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none"
              aria-label="WhatsApp message"
            />
          </div>
        );

      case 'location':
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={fields.latitude || ''}
              onChange={(e) => onFieldChange('latitude', e.target.value)}
              placeholder="Latitude (e.g., 40.7128)"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none"
              aria-label="Latitude"
            />
            <input
              type="text"
              value={fields.longitude || ''}
              onChange={(e) => onFieldChange('longitude', e.target.value)}
              placeholder="Longitude (e.g., -74.0060)"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none"
              aria-label="Longitude"
            />
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={fields.title || ''}
              onChange={(e) => onFieldChange('title', e.target.value)}
              placeholder="Event title"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none"
              aria-label="Event title"
            />
            <input
              type="text"
              value={fields.location || ''}
              onChange={(e) => onFieldChange('location', e.target.value)}
              placeholder="Location (optional)"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none"
              aria-label="Event location"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Start</label>
                <input
                  type="datetime-local"
                  value={fields.start || ''}
                  onChange={(e) => onFieldChange('start', e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white transition-colors focus:border-purple-500 focus:outline-none"
                  aria-label="Event start time"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-400">End</label>
                <input
                  type="datetime-local"
                  value={fields.end || ''}
                  onChange={(e) => onFieldChange('end', e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white transition-colors focus:border-purple-500 focus:outline-none"
                  aria-label="Event end time"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {renderFields()}
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
