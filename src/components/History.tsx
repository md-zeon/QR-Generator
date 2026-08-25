'use client';

import { useState, useEffect } from 'react';
import { QRConfig } from '@/types';
import { Button } from '@/components/ui/button';

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

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function HistoryPanel({ history, onSelect, onRemove, onClear }: HistoryPanelProps) {
  if (history.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent</h3>
        <Button variant="ghost" size="sm" onClick={onClear} className="h-6 text-xs text-muted-foreground">
          Clear
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.config)}
            type="button"
            className="group flex shrink-0 flex-col items-center rounded-lg border border-border bg-card p-2 transition-all hover:border-primary/30 hover:bg-muted/50"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted/30 text-[10px] text-muted-foreground">
              {item.config.type.toUpperCase()}
            </div>
            <span className="mt-1.5 max-w-[64px] truncate text-[10px] text-muted-foreground">
              {item.config.content.slice(0, 12) || 'Empty'}
            </span>
            <span className="text-[9px] text-muted-foreground/60">
              {formatTimeAgo(item.timestamp)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
