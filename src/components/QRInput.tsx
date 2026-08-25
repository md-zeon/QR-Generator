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

export default function QRInput({ type, fields, onFieldChange, errors = {} }: QRInputProps) {
  const renderError = (field: string) => {
    if (errors[field]) {
      return <p className="text-xs text-destructive">{errors[field]}</p>;
    }
    return null;
  };

  const renderFields = () => {
    switch (type) {
      case 'url':
      case 'text':
        return (
          <div className="space-y-2">
            <Label htmlFor="content">{type === 'url' ? 'URL' : 'Text'}</Label>
            <Textarea
              id="content"
              value={fields.content || ''}
              onChange={(e) => onFieldChange('content', e.target.value)}
              placeholder={type === 'url' ? 'https://example.com' : 'Enter your text here...'}
              className={errors.content ? 'border-destructive' : ''}
              aria-invalid={!!errors.content}
            />
            {renderError('content')}
          </div>
        );

      case 'wifi':
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="ssid">Network Name (SSID)</Label>
              <Input
                id="ssid"
                value={fields.ssid || ''}
                onChange={(e) => onFieldChange('ssid', e.target.value)}
                placeholder="My WiFi Network"
                className={errors.ssid ? 'border-destructive' : ''}
                aria-invalid={!!errors.ssid}
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="encryption">Encryption</Label>
              <select
                id="encryption"
                value={fields.encryption || 'WPA'}
                onChange={(e) => onFieldChange('encryption', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </div>
          </div>
        );

      case 'vcard':
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={fields.name || ''}
                onChange={(e) => onFieldChange('name', e.target.value)}
                placeholder="John Doe"
                className={errors.name ? 'border-destructive' : ''}
                aria-invalid={!!errors.name}
              />
              {renderError('name')}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
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
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                value={fields.organization || ''}
                onChange={(e) => onFieldChange('organization', e.target.value)}
                placeholder="Acme Inc. (optional)"
              />
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="to">To Email</Label>
              <Input
                id="to"
                type="email"
                value={fields.to || ''}
                onChange={(e) => onFieldChange('to', e.target.value)}
                placeholder="recipient@example.com"
                className={errors.to ? 'border-destructive' : ''}
                aria-invalid={!!errors.to}
              />
              {renderError('to')}
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={fields.subject || ''}
                onChange={(e) => onFieldChange('subject', e.target.value)}
                placeholder="Email subject (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Message Body</Label>
              <Textarea
                id="body"
                value={fields.body || ''}
                onChange={(e) => onFieldChange('body', e.target.value)}
                placeholder="Your message (optional)"
                className="min-h-[80px]"
              />
            </div>
          </div>
        );

      case 'sms':
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="number">Phone Number</Label>
              <Input
                id="number"
                type="tel"
                value={fields.number || ''}
                onChange={(e) => onFieldChange('number', e.target.value)}
                placeholder="+1 234 567 8900"
                className={errors.number ? 'border-destructive' : ''}
                aria-invalid={!!errors.number}
              />
              {renderError('number')}
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                value={fields.body || ''}
                onChange={(e) => onFieldChange('body', e.target.value)}
                placeholder="Your message (optional)"
                className="min-h-[80px]"
              />
            </div>
          </div>
        );

      case 'phone':
        return (
          <div className="space-y-2">
            <Label htmlFor="number">Phone Number</Label>
            <Input
              id="number"
              type="tel"
              value={fields.number || ''}
              onChange={(e) => onFieldChange('number', e.target.value)}
              placeholder="+1 234 567 8900"
              className={errors.number ? 'border-destructive' : ''}
              aria-invalid={!!errors.number}
            />
            {renderError('number')}
          </div>
        );

      case 'whatsapp':
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="number">WhatsApp Number</Label>
              <Input
                id="number"
                type="tel"
                value={fields.number || ''}
                onChange={(e) => onFieldChange('number', e.target.value)}
                placeholder="+1 234 567 8900"
                className={errors.number ? 'border-destructive' : ''}
                aria-invalid={!!errors.number}
              />
              {renderError('number')}
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={fields.message || ''}
                onChange={(e) => onFieldChange('message', e.target.value)}
                placeholder="Your message (optional)"
                className="min-h-[80px]"
              />
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                value={fields.latitude || ''}
                onChange={(e) => onFieldChange('latitude', e.target.value)}
                placeholder="e.g., 40.7128"
                className={errors.latitude ? 'border-destructive' : ''}
                aria-invalid={!!errors.latitude}
              />
              {renderError('latitude')}
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                value={fields.longitude || ''}
                onChange={(e) => onFieldChange('longitude', e.target.value)}
                placeholder="e.g., -74.0060"
                className={errors.longitude ? 'border-destructive' : ''}
                aria-invalid={!!errors.longitude}
              />
              {renderError('longitude')}
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={fields.title || ''}
                onChange={(e) => onFieldChange('title', e.target.value)}
                placeholder="Team Meeting"
                className={errors.title ? 'border-destructive' : ''}
                aria-invalid={!!errors.title}
              />
              {renderError('title')}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={fields.location || ''}
                onChange={(e) => onFieldChange('location', e.target.value)}
                placeholder="Conference Room A (optional)"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="start">Start</Label>
                <input
                  id="start"
                  type="datetime-local"
                  value={fields.start || ''}
                  onChange={(e) => onFieldChange('start', e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  aria-invalid={!!errors.start}
                />
                {renderError('start')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End</Label>
                <input
                  id="end"
                  type="datetime-local"
                  value={fields.end || ''}
                  onChange={(e) => onFieldChange('end', e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  aria-invalid={!!errors.end}
                />
                {renderError('end')}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="space-y-2">{renderFields()}</div>;
}
