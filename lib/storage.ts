/**
 * 本地存储管理
 */

import { PlayerStats, GameSession } from '@/types/game';

const STORAGE_KEYS = {
  PLAYER_STATS: 'brain-blitz-stats',
  SESSIONS: 'brain-blitz-sessions',
  SETTINGS: 'brain-blitz-settings',
};

/**
 * 保存玩家统计数据
 */
export function savePlayerStats(stats: PlayerStats): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PLAYER_STATS, JSON.stringify(stats));
    }
  } catch (error) {
    console.error('Failed to save player stats:', error);
  }
}

/**
 * 加载玩家统计数据
 */
export function loadPlayerStats(): PlayerStats | null {
  try {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(STORAGE_KEYS.PLAYER_STATS);
      return data ? JSON.parse(data) : null;
    }
    return null;
  } catch (error) {
    console.error('Failed to load player stats:', error);
    return null;
  }
}

/**
 * 保存游戏会话
 */
export function saveSession(session: GameSession): void {
  try {
    if (typeof window !== 'undefined') {
      const sessions = loadSessions();
      sessions.push(session);

      // 只保留最近100场
      if (sessions.length > 100) {
        sessions.shift();
      }

      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    }
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

/**
 * 加载游戏会话历史
 */
export function loadSessions(): GameSession[] {
  try {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    }
    return [];
  } catch (error) {
    console.error('Failed to load sessions:', error);
    return [];
  }
}

/**
 * 清除所有数据
 */
export function clearAllData(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.PLAYER_STATS);
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    }
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
}

/**
 * 导出数据（用于备份）
 */
export function exportData(): string {
  const stats = loadPlayerStats();
  const sessions = loadSessions();

  return JSON.stringify({
    stats,
    sessions,
    exportedAt: Date.now(),
  }, null, 2);
}

/**
 * 导入数据（用于恢复）
 */
export function importData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);

    if (data.stats) {
      savePlayerStats(data.stats);
    }

    if (data.sessions && Array.isArray(data.sessions)) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(data.sessions));
      }
    }

    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
}
