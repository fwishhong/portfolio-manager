/**
 * 主题提供者
 * 根据当前关卡动态切换主题
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameTheme, getThemeByChallenge, friendlyTheme } from '@/lib/themeSystem';
import { Challenge } from '@/types/game';
import { audioManager, MusicTheme } from '@/lib/audioManager';

interface ThemeContextType {
  currentTheme: GameTheme;
  setThemeByChallenge: (challenge: Challenge) => void;
  setThemeByName: (themeName: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
  initialChallenge?: Challenge;
}

export function ThemeProvider({ children, initialChallenge }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<GameTheme>(
    initialChallenge ? getThemeByChallenge(initialChallenge.id) : friendlyTheme
  );

  const setThemeByChallenge = (challenge: Challenge) => {
    const newTheme = getThemeByChallenge(challenge.id);
    if (newTheme.name !== currentTheme.name) {
      setCurrentTheme(newTheme);
    }
  };

  const setThemeByName = (themeName: string) => {
    const { allThemes } = require('@/lib/themeSystem');
    const theme = allThemes.find((t: GameTheme) => t.name === themeName);
    if (theme) {
      setCurrentTheme(theme);
    }
  };

  // 应用CSS变量到document root
  useEffect(() => {
    const root = document.documentElement;
    const colors = currentTheme.colors;

    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-bg-gradient', colors.backgroundGradient);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-success', colors.success);
    root.style.setProperty('--color-warning', colors.warning);
    root.style.setProperty('--color-danger', colors.danger);
    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--color-shadow', colors.shadow);

    // 添加过渡效果
    root.style.transition = 'background-color 0.8s ease-in-out';
  }, [currentTheme]);

  // 启动匹配主题的背景音乐
  useEffect(() => {
    // 播放过渡音效
    audioManager.play('transition', 0.5);

    // 启动对应主题的背景音乐
    const musicTheme = currentTheme.name as MusicTheme;
    audioManager.startMusic(musicTheme);

    // 组件卸载时停止音乐
    return () => {
      audioManager.stopMusic();
    };
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setThemeByChallenge, setThemeByName }}>
      {children}
    </ThemeContext.Provider>
  );
}
