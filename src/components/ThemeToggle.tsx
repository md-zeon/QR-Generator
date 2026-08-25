'use client';

import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';

type Theme = 'light' | 'dark';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as Theme | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initial = stored || systemTheme;
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
    document.documentElement.classList.toggle('light', initial === 'light');
  }, []);

  const toggleTheme = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  if (!mounted) {
    return <div className="h-8 w-8" />;
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground">
        {theme === 'dark' ? '🌙' : '☀️'}
      </span>
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      />
    </div>
  );
}
