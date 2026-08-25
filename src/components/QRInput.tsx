'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { QRType } from '@/types';

interface QRInputProps {
  type: QRType;
  fields: Record<string, string>;
  onFieldChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

const TYPE_DESCRIPTIONS: Record<QRType, string> = {
  url: 'Enter the URL you want to encode',
  text: 'Enter the text you want to encode',
  wifi: 'Enter your WiFi network details',
  vcard: 'Enter contact information',
  email: 'Enter email address and optional message',
  sms: 'Enter phone number and optional message',
  phone: 'Enter the phone number to dial',
  whatsapp: 'Enter WhatsApp number and optional message',
  location: 'Enter latitude and longitude coordinates',
  calendar: 'Enter event details',
};

export default function QRInput({ type, fields, onFieldChange, errors = {} }: QRInputProps) {
  const renderError = (field: string) => {
    if (errors[field]) {
      return <p className="text-xs text-destructive mt-1">{errors[field]}</p>;
    }
    return null;
  };

  const renderFields = () => {
    switch (type) {
      case 'url':
        return (
          <div className="space-y-2">
            <Label htmlFor="content">URL</Label>
            <Input
              id="content"
              value={fields.content || ''}
              onChange={(e) => onFieldChange('content', e.target.value)}
              placeholder="https://example.com"
              className={errors.content ? 'border-destructive' : ''}
              aria-invalid={!!errors.content}
              autoFocus
            />
            {renderError('content')}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-2">
            <Label htmlFor="content">Text Content</Label>
            <Textarea
              id="content"
              value={fields.content || ''}
              onChange={(e) => onFieldChange('content', e.target.value)}
              placeholder="Enter any text you want to encode in the QR code..."
              className={errors.content ? 'border-destructive min-h-[100px]' : 'min-h-[100px]'}
              aria-invalid={!!errors.content}
              autoFocus
            />
            {renderError('content')}
          </div>
        );

      case 'wifi':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ssid">Network Name (SSID) *</Label>
              <Input
                id="ssid"
                value={fields.ssid || ''}
                onChange={(e) => onFieldChange('ssid', e.target.value)}
                placeholder="MyWiFiNetwork"
                className={errors.ssid ? 'border-destructive' : ''}
                aria-invalid={!!errors.ssid}
                autoFocus
              />
              {renderError('ssid')}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="text"
                value={fields.password || ''}
                onChange={(e) => onFieldChange('password', e.target.value)}
                placeholder="Enter password"
              />
              <p className="text-xs text-muted-foreground">Leave empty for open networks</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="encryption">Security Type</Label>
              <select
                id="encryption"
                value={fields.encryption || 'WPA'}
                onChange={(e) => onFieldChange('encryption', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="WPA">WPA/WPA2 (most common)</option>
                <option value="WEP">WEP (legacy)</option>
                <option value="nopass">None (open network)</option>
              </select>
            </div>
          </div>
        );

      case 'vcard':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={fields.name || ''}
                onChange={(e) => onFieldChange('name', e.target.value)}
                placeholder="John Doe"
                className={errors.name ? 'border-destructive' : ''}
                aria-invalid={!!errors.name}
                autoFocus
              />
              {renderError('name')}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={fields.phone || ''}
                  onChange={(e) => onFieldChange('phone', e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={fields.email || ''}
                  onChange={(e) => onFieldChange('email', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                value={fields.organization || ''}
                onChange={(e) => onFieldChange('organization', e.target.value)}
                placeholder="Acme Inc."
              />
              <p className="text-xs text-muted-foreground">Optional</p>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="to">Recipient Email *</Label>
              <Input
                id="to"
                type="email"
                value={fields.to || ''}
                onChange={(e) => onFieldChange('to', e.target.value)}
                placeholder="recipient@example.com"
                className={errors.to ? 'border-destructive' : ''}
                aria-invalid={!!errors.to}
                autoFocus
              />
              {renderError('to')}
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={fields.subject || ''}
                onChange={(e) => onFieldChange('subject', e.target.value)}
                placeholder="What is this about?"
              />
              <p className="text-xs text-muted-foreground">Optional</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                value={fields.body || ''}
                onChange={(e) => onFieldChange('body', e.target.value)}
                placeholder="Your email message..."
                className="min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground">Optional</p>
            </div>
          </div>
        );

      case 'sms':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="number">Phone Number *</Label>
              <Input
                id="number"
                type="tel"
                value={fields.number || ''}
                onChange={(e) => onFieldChange('number', e.target.value)}
                placeholder="+1 234 567 8900"
                className={errors.number ? 'border-destructive' : ''}
                aria-invalid={!!errors.number}
                autoFocus
              />
              {renderError('number')}
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                value={fields.body || ''}
                onChange={(e) => onFieldChange('body', e.target.value)}
                placeholder="Your SMS message..."
                className="min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground">Optional</p>
            </div>
          </div>
        );

      case 'phone':
        return (
          <div className="space-y-2">
            <Label htmlFor="number">Phone Number *</Label>
            <Input
              id="number"
              type="tel"
              value={fields.number || ''}
              onChange={(e) => onFieldChange('number', e.target.value)}
              placeholder="+1 234 567 8900"
              className={errors.number ? 'border-destructive' : ''}
              aria-invalid={!!errors.number}
              autoFocus
            />
            {renderError('number')}
            <p className="text-xs text-muted-foreground">Scanning will prompt to call this number</p>
          </div>
        );

      case 'whatsapp':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="number">WhatsApp Number *</Label>
              <Input
                id="number"
                type="tel"
                value={fields.number || ''}
                onChange={(e) => onFieldChange('number', e.target.value)}
                placeholder="+1 234 567 8900"
                className={errors.number ? 'border-destructive' : ''}
                aria-invalid={!!errors.number}
                autoFocus
              />
              {renderError('number')}
              <p className="text-xs text-muted-foreground">Include country code (e.g., +1 for US)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Pre-filled Message</Label>
              <Textarea
                id="message"
                value={fields.message || ''}
                onChange={(e) => onFieldChange('message', e.target.value)}
                placeholder="Hello! I found your QR code..."
                className="min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground">Optional - the message will pre-fill in WhatsApp</p>
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  value={fields.latitude || ''}
                  onChange={(e) => onFieldChange('latitude', e.target.value)}
                  placeholder="40.7128"
                  className={errors.latitude ? 'border-destructive' : ''}
                  aria-invalid={!!errors.latitude}
                  autoFocus
                />
                {renderError('latitude')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  value={fields.longitude || ''}
                  onChange={(e) => onFieldChange('longitude', e.target.value)}
                  placeholder="-74.0060"
                  className={errors.longitude ? 'border-destructive' : ''}
                  aria-invalid={!!errors.longitude}
                />
                {renderError('longitude')}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Enter coordinates. Scanning will open in your maps app.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">{TYPE_DESCRIPTIONS[type]}</p>
      <div className="mt-3">{renderFields()}</div>
    </div>
  );
}
