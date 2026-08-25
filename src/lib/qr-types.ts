import { QRType } from '@/types';

export function formatQRContent(type: QRType, fields: Record<string, string>): string {
  switch (type) {
    case 'url':
    case 'text':
      return fields.content || '';

    case 'wifi':
      const encryption = fields.encryption || 'WPA';
      const ssid = fields.ssid || '';
      const password = fields.password || '';
      return `WIFI:T:${encryption};S:${ssid};P:${password};;`;

    case 'vcard':
      const name = fields.name || '';
      const phone = fields.phone || '';
      const email = fields.email || '';
      const org = fields.organization || '';
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${name}`,
        `TEL:${phone}`,
        `EMAIL:${email}`,
        `ORG:${org}`,
        'END:VCARD',
      ].join('\n');

    case 'email':
      const to = fields.to || '';
      const subject = fields.subject || '';
      const body = fields.body || '';
      return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    case 'sms':
      const smsNumber = fields.number || '';
      const smsBody = fields.body || '';
      return `sms:${smsNumber}?body=${encodeURIComponent(smsBody)}`;

    case 'phone':
      return `tel:${fields.number || ''}`;

    case 'whatsapp':
      const waNumber = fields.number || '';
      const waMessage = fields.message || '';
      return `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

    case 'calendar':
      const title = fields.title || '';
      const location = fields.location || '';
      const start = fields.start || '';
      const end = fields.end || '';
      return [
        'BEGIN:VEVENT',
        `SUMMARY:${title}`,
        `LOCATION:${location}`,
        `DTSTART:${formatCalendarDate(start)}`,
        `DTEND:${formatCalendarDate(end)}`,
        'END:VEVENT',
      ].join('\n');

    case 'location':
      const lat = fields.latitude || '0';
      const lng = fields.longitude || '0';
      return `geo:${lat},${lng}`;

    default:
      return fields.content || '';
  }
}

function formatCalendarDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function getInitialFields(type: QRType): Record<string, string> {
  switch (type) {
    case 'url':
      return { content: 'https://github.com/md-zeon/QR-Generator' };
    case 'text':
      return { content: '' };
    case 'wifi':
      return { ssid: '', password: '', encryption: 'WPA' };
    case 'vcard':
      return { name: '', phone: '', email: '', organization: '' };
    case 'email':
      return { to: '', subject: '', body: '' };
    case 'sms':
      return { number: '', body: '' };
    case 'phone':
      return { number: '' };
    case 'whatsapp':
      return { number: '', message: '' };
    case 'calendar':
      return { title: '', location: '', start: '', end: '' };
    case 'location':
      return { latitude: '', longitude: '' };
    default:
      return { content: '' };
  }
}

export function getPlaceholder(type: QRType): string {
  switch (type) {
    case 'url':
      return 'https://example.com';
    case 'text':
      return 'Enter your text here...';
    case 'wifi':
      return 'Network name';
    case 'vcard':
      return 'John Doe';
    case 'email':
      return 'email@example.com';
    case 'sms':
      return '+1 234 567 8900';
    case 'phone':
      return '+1 234 567 8900';
    case 'whatsapp':
      return '+1 234 567 8900';
    case 'calendar':
      return 'Event name';
    case 'location':
      return '40.7128';
    default:
      return 'Enter content...';
  }
}
