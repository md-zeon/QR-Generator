'use client';

import { useState, useCallback } from 'react';
import { QRConfig, QRType } from '@/types';
import { DEFAULT_QR_CONFIG } from '@/lib/constants';
import { formatQRContent, getInitialFields } from '@/lib/qr-types';

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

const VALIDATION_RULES: Record<QRType, Record<string, ValidationRule[]>> = {
  url: {
    content: [
      { test: (v) => v.trim().length > 0, message: 'URL is required' },
      {
        test: (v) => {
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: 'Please enter a valid URL',
      },
    ],
  },
  text: {
    content: [
      { test: (v) => v.trim().length > 0, message: 'Text is required' },
      { test: (v) => v.length <= 4296, message: 'Text is too long (max 4296 characters)' },
    ],
  },
  wifi: {
    ssid: [{ test: (v) => v.trim().length > 0, message: 'Network name is required' }],
  },
  vcard: {
    name: [{ test: (v) => v.trim().length > 0, message: 'Name is required' }],
  },
  email: {
    to: [
      { test: (v) => v.trim().length > 0, message: 'Email is required' },
      { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Please enter a valid email' },
    ],
  },
  sms: {
    number: [{ test: (v) => v.trim().length > 0, message: 'Phone number is required' }],
  },
  phone: {
    number: [{ test: (v) => v.trim().length > 0, message: 'Phone number is required' }],
  },
  whatsapp: {
    number: [{ test: (v) => v.trim().length > 0, message: 'Phone number is required' }],
  },
  calendar: {
    title: [{ test: (v) => v.trim().length > 0, message: 'Event title is required' }],
    start: [{ test: (v) => v.length > 0, message: 'Start time is required' }],
    end: [{ test: (v) => v.length > 0, message: 'End time is required' }],
  },
  location: {
    latitude: [
      { test: (v) => v.trim().length > 0, message: 'Latitude is required' },
      { test: (v) => !isNaN(Number(v)) && Number(v) >= -90 && Number(v) <= 90, message: 'Invalid latitude (-90 to 90)' },
    ],
    longitude: [
      { test: (v) => v.trim().length > 0, message: 'Longitude is required' },
      { test: (v) => !isNaN(Number(v)) && Number(v) >= -180 && Number(v) <= 180, message: 'Invalid longitude (-180 to 180)' },
    ],
  },
};

export function useQRConfig() {
  const [config, setConfig] = useState<QRConfig>(DEFAULT_QR_CONFIG);
  const [fields, setFields] = useState<Record<string, string>>(getInitialFields('url'));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(
    (type: QRType, currentFields: Record<string, string>): Record<string, string> => {
      const newErrors: Record<string, string> = {};
      const rules = VALIDATION_RULES[type] || {};

      for (const [field, fieldRules] of Object.entries(rules)) {
        const value = currentFields[field] || '';
        for (const rule of fieldRules) {
          if (!rule.test(value)) {
            newErrors[field] = rule.message;
            break;
          }
        }
      }

      return newErrors;
    },
    []
  );

  const handleConfigChange = useCallback((updates: Partial<QRConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleTypeChange = useCallback(
    (type: QRType) => {
      const newFields = getInitialFields(type);
      setFields(newFields);
      setConfig((prev) => ({
        ...prev,
        type,
        content: formatQRContent(type, newFields),
      }));
      setErrors({});
    },
    []
  );

  const handleFieldChange = useCallback(
    (field: string, value: string) => {
      const newFields = { ...fields, [field]: value };
      setFields(newFields);

      const content = formatQRContent(config.type, newFields);
      setConfig((prev) => ({ ...prev, content }));

      const newErrors = validate(config.type, newFields);
      setErrors((prev) => {
        if (newErrors[field]) {
          return { ...prev, [field]: newErrors[field] };
        }
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    },
    [fields, config.type, validate]
  );

  const handleLogoChange = useCallback(
    (logo: string | null) => {
      handleConfigChange({
        logo,
        errorCorrection: logo ? 'H' : config.errorCorrection,
      });
    },
    [config.errorCorrection, handleConfigChange]
  );

  const isValid = Object.keys(errors).length === 0;

  const restoreConfig = useCallback((cfg: QRConfig) => {
    setConfig(cfg);
    setFields(getInitialFields(cfg.type));
    setErrors({});
  }, []);

  return {
    config,
    fields,
    errors,
    isValid,
    handleConfigChange,
    handleTypeChange,
    handleFieldChange,
    handleLogoChange,
    restoreConfig,
  };
}
