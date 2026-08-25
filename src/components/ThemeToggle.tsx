'use client';

import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type Theme = 'light' | 'dark';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
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

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="theme-toggle" className="text-muted-foreground">
        {theme === 'dark' ? '🌙' : '☀️'}
      </Label>
      <Switch
        id="theme-toggle"
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
      />
    </div>
  );
}
