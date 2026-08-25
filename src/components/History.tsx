'use client';

import { useState, useEffect } from 'react';
import { QRConfig } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Recent</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClear} className="h-6 text-xs text-muted-foreground">
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {history.map((item, index) => (
            <div key={item.id}>
              <button
                onClick={() => onSelect(item.config)}
                className="flex w-full items-center gap-2 rounded-md p-1.5 text-left transition-colors hover:bg-muted"
              >
                <span className="text-xs">{item.config.type.toUpperCase()}</span>
                <span className="flex-1 truncate text-xs text-muted-foreground">
                  {item.config.content.slice(0, 40)}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {formatTime(item.timestamp)}
                </span>
              </button>
              {index < history.length - 1 && <Separator className="my-0.5" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
