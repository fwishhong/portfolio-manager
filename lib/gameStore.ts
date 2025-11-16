/**
 * 游戏状态管理 - Zustand Store
 */

import { create } from 'zustand';
import { GameState, Challenge, ChallengeResult, GameSession, PlayerStats } from '@/types/game';
import { savePlayerStats, loadPlayerStats, saveSession } from './storage';

interface GameStore extends GameState {
  // Actions
  startGame: (mode: string) => void;
  loadChallenge: (challenge: Challenge) => void;
  completeChallenge: (result: ChallengeResult) => void;
  failChallenge: () => void;
  updateTimer: (time: number) => void;
  resetGame: () => void;
  addScore: (points: number) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  loseLife: () => void;
  setPlaying: (playing: boolean) => void;
  setPaused: (paused: boolean) => void;
}

const initialPlayerStats: PlayerStats = {
  totalGamesPlayed: 0,
  totalChallengesCompleted: 0,
  totalScore: 0,
  highestScore: 0,
  reactionCount: 0,
  memoryCount: 0,
  mathCount: 0,
  judgmentCount: 0,
  spatialCount: 0,
  achievements: [],
  unlockedChallenges: ['CH01', 'CH02', 'CH03', 'CH04', 'CH05', 'CH06', 'CH10', 'CH14'],
  settings: {
    volume: 0.7,
    sfxEnabled: true,
    musicEnabled: true,
    difficulty: 'normal',
    vibrationEnabled: true,
    colorBlindMode: false,
  },
};

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  currentChallenge: null,
  currentSession: null,
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
  timeRemaining: 0,
  lives: 3,
  combo: 0,
  playerStats: loadPlayerStats() || initialPlayerStats,

  // Actions
  startGame: (mode) => {
    const session: GameSession = {
      sessionId: `session-${Date.now()}`,
      mode: mode as any,
      startTime: Date.now(),
      totalScore: 0,
      challengesCompleted: 0,
      perfectCount: 0,
      currentCombo: 0,
      maxCombo: 0,
      results: [],
    };

    set({
      currentSession: session,
      isPlaying: true,
      isGameOver: false,
      lives: 3,
      combo: 0,
    });
  },

  loadChallenge: (challenge) => {
    set({
      currentChallenge: challenge,
      timeRemaining: challenge.baseTimeLimit,
      isPlaying: true,
      isPaused: false,
    });
  },

  completeChallenge: (result) => {
    const { currentSession, combo, playerStats } = get();

    if (!currentSession) return;

    // 更新连击
    const newCombo = result.stars === 3 ? combo + 1 : 0;
    const maxCombo = Math.max(currentSession.maxCombo, newCombo);

    // 更新会话
    const updatedSession: GameSession = {
      ...currentSession,
      totalScore: currentSession.totalScore + result.score,
      challengesCompleted: currentSession.challengesCompleted + 1,
      perfectCount: currentSession.perfectCount + (result.stars === 3 ? 1 : 0),
      currentCombo: newCombo,
      maxCombo,
      results: [...currentSession.results, result],
    };

    // 更新玩家统计
    const updatedStats: PlayerStats = {
      ...playerStats,
      totalChallengesCompleted: playerStats.totalChallengesCompleted + 1,
      totalScore: playerStats.totalScore + result.score,
      highestScore: Math.max(playerStats.highestScore, updatedSession.totalScore),
    };

    // 保存到本地存储
    savePlayerStats(updatedStats);

    set({
      currentSession: updatedSession,
      combo: newCombo,
      playerStats: updatedStats,
    });
  },

  failChallenge: () => {
    const { lives } = get();
    const newLives = lives - 1;

    if (newLives <= 0) {
      const { currentSession } = get();
      if (currentSession) {
        const finalSession = { ...currentSession, endTime: Date.now() };
        saveSession(finalSession);
      }

      set({
        isGameOver: true,
        isPlaying: false,
        lives: 0,
        combo: 0,
      });
    } else {
      set({
        lives: newLives,
        combo: 0,
      });
    }
  },

  updateTimer: (time) => {
    set({ timeRemaining: Math.max(0, time) });
  },

  resetGame: () => {
    set({
      currentChallenge: null,
      currentSession: null,
      isPlaying: false,
      isGameOver: false,
      isPaused: false,
      lives: 3,
      combo: 0,
      timeRemaining: 0,
    });
  },

  addScore: (points) => {
    const { currentSession } = get();
    if (!currentSession) return;

    set({
      currentSession: {
        ...currentSession,
        totalScore: currentSession.totalScore + points,
      },
    });
  },

  incrementCombo: () => {
    const { combo, currentSession } = get();
    const newCombo = combo + 1;

    if (currentSession) {
      set({
        combo: newCombo,
        currentSession: {
          ...currentSession,
          currentCombo: newCombo,
          maxCombo: Math.max(currentSession.maxCombo, newCombo),
        },
      });
    } else {
      set({ combo: newCombo });
    }
  },

  resetCombo: () => {
    set({ combo: 0 });
  },

  loseLife: () => {
    const { lives } = get();
    set({ lives: Math.max(0, lives - 1) });
  },

  setPlaying: (playing) => {
    set({ isPlaying: playing });
  },

  setPaused: (paused) => {
    set({ isPaused: paused });
  },
}));
