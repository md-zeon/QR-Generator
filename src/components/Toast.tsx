'use client';

import { toast as sonnerToast } from 'sonner';

export function useToast() {
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    switch (type) {
      case 'success':
        sonnerToast.success(message);
        break;
      case 'error':
        sonnerToast.error(message);
        break;
      default:
        sonnerToast.info(message);
    }
  };

  return { addToast };
}
