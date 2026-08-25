'use client';

import { useState, useEffect } from 'react';
import { QRConfig } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface HistoryItem {
  id: string;
  config: QRConfig;
  timestamp: number;
}

const STORAGE_KEY = 'qr-history';
const MAX_ITEMS = 10;

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const addToHistory = (config: QRConfig) => {
    const item: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      config,
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      const newHistory = [item, ...prev].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const removeFromHistory = (id: string) => {
    setHistory((prev) => {
      const newHistory = prev.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { history, addToHistory, removeFromHistory, clearHistory };
}

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (config: QRConfig) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function HistoryPanel({ history, onSelect, onRemove, onClear }: HistoryPanelProps) {
  if (history.length === 0) return null;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium">Recent QR Codes</h3>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear all
        </Button>
      </div>
      <div className="space-y-2">
        {history.map((item, index) => (
          <div key={item.id}>
            <div className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted">
              <button
                onClick={() => onSelect(item.config)}
                className="flex-1 text-left"
              >
                <p className="truncate text-sm font-medium">
                  {item.config.content.slice(0, 50)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.config.type.toUpperCase()} • {formatTime(item.timestamp)}
                </p>
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item.id)}
                className="h-6 w-6"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </Button>
            </div>
            {index < history.length - 1 && <Separator className="my-1" />}
          </div>
        ))}
      </div>
    </Card>
  );
}
