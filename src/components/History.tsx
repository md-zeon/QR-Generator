'use client';

import { useState, useEffect } from 'react';
import { QRConfig } from '@/types';

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
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-300">Recent QR Codes</h3>
        <button
          onClick={onClear}
          className="text-xs text-zinc-500 hover:text-zinc-300"
        >
          Clear all
        </button>
      </div>
      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-800/50 p-2 transition-colors hover:bg-zinc-800"
          >
            <button
              onClick={() => onSelect(item.config)}
              className="flex-1 text-left"
            >
              <p className="truncate text-sm text-white">
                {item.config.content.slice(0, 50)}
              </p>
              <p className="text-xs text-zinc-500">
                {item.config.type.toUpperCase()} • {formatTime(item.timestamp)}
              </p>
            </button>
            <button
              onClick={() => onRemove(item.id)}
              className="text-zinc-500 hover:text-zinc-300"
              aria-label="Remove from history"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
