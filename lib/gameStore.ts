/**
 * 游戏状态管理 - Zustand Store
 */

import { create } from 'zustand';
import { GameState, Challenge, ChallengeResult, GameSession, PlayerStats, Achievement } from '@/types/game';
import { savePlayerStats, loadPlayerStats, saveSession } from './storage';
import { getAchievementManager } from './achievementSystem';

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
  // Achievement methods
  checkAchievements: () => Achievement[];
  unlockSpecialAchievement: (id: string) => boolean;
  getNewAchievements: () => Achievement[];
  clearNewAchievements: () => void;
  // Internal state for new achievements
  newAchievements: Achievement[];
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
  physicsCount: 0,
  logicCount: 0,
  coordinationCount: 0,
  ultimateCount: 0,
  timeCount: 0,
  dimensionCount: 0,
  perceptionCount: 0,
  transcendentCount: 0,
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
  newAchievements: [],

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
    const { currentSession, combo, playerStats, currentChallenge } = get();

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

    // 更新分类统计
    const categoryIncrement = result.success ? 1 : 0;
    const categoryUpdates: Partial<PlayerStats> = {};

    if (currentChallenge) {
      switch (currentChallenge.type) {
        case 'reaction':
          categoryUpdates.reactionCount = (playerStats.reactionCount || 0) + categoryIncrement;
          break;
        case 'memory':
          categoryUpdates.memoryCount = (playerStats.memoryCount || 0) + categoryIncrement;
          break;
        case 'math':
          categoryUpdates.mathCount = (playerStats.mathCount || 0) + categoryIncrement;
          break;
        case 'judgment':
          categoryUpdates.judgmentCount = (playerStats.judgmentCount || 0) + categoryIncrement;
          break;
        case 'spatial':
          categoryUpdates.spatialCount = (playerStats.spatialCount || 0) + categoryIncrement;
          break;
        case 'physics':
          categoryUpdates.physicsCount = (playerStats.physicsCount || 0) + categoryIncrement;
          break;
        case 'logic':
          categoryUpdates.logicCount = (playerStats.logicCount || 0) + categoryIncrement;
          break;
        case 'coordination':
          categoryUpdates.coordinationCount = (playerStats.coordinationCount || 0) + categoryIncrement;
          break;
        case 'ultimate':
          categoryUpdates.ultimateCount = (playerStats.ultimateCount || 0) + categoryIncrement;
          break;
        case 'time':
          categoryUpdates.timeCount = (playerStats.timeCount || 0) + categoryIncrement;
          break;
        case 'dimension':
          categoryUpdates.dimensionCount = (playerStats.dimensionCount || 0) + categoryIncrement;
          break;
        case 'perception':
          categoryUpdates.perceptionCount = (playerStats.perceptionCount || 0) + categoryIncrement;
          break;
        case 'transcendent':
          categoryUpdates.transcendentCount = (playerStats.transcendentCount || 0) + categoryIncrement;
          break;
      }
    }

    // 更新玩家统计
    const updatedStats: PlayerStats = {
      ...playerStats,
      ...categoryUpdates,
      totalChallengesCompleted: playerStats.totalChallengesCompleted + 1,
      totalScore: playerStats.totalScore + result.score,
      highestScore: Math.max(playerStats.highestScore, updatedSession.totalScore),
    };

    // 检查成就
    const achievementManager = getAchievementManager(playerStats.achievements);

    // 检查速度成就
    const speedAchievements = achievementManager.checkSpeedAchievement(result.timeUsed);

    // 检查其他成就
    const regularAchievements = achievementManager.checkAchievements({
      challengesCompleted: updatedStats.totalChallengesCompleted,
      perfectCount: updatedSession.perfectCount,
      maxCombo,
      highestScore: updatedStats.highestScore,
      reactionCount: updatedStats.reactionCount || 0,
      memoryCount: updatedStats.memoryCount || 0,
      mathCount: updatedStats.mathCount || 0,
      judgmentCount: updatedStats.judgmentCount || 0,
      spatialCount: updatedStats.spatialCount || 0,
      physicsCount: updatedStats.physicsCount || 0,
      logicCount: updatedStats.logicCount || 0,
      coordinationCount: updatedStats.coordinationCount || 0,
      ultimateCount: updatedStats.ultimateCount || 0,
      timeCount: updatedStats.timeCount || 0,
      dimensionCount: updatedStats.dimensionCount || 0,
      perceptionCount: updatedStats.perceptionCount || 0,
      transcendentCount: updatedStats.transcendentCount || 0,
    });

    const newUnlocked = [...speedAchievements, ...regularAchievements];

    // 更新成就列表
    updatedStats.achievements = achievementManager.serialize();

    // 保存到本地存储
    savePlayerStats(updatedStats);

    set({
      currentSession: updatedSession,
      combo: newCombo,
      playerStats: updatedStats,
      newAchievements: newUnlocked,
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

  // Achievement methods
  checkAchievements: () => {
    const { playerStats, currentSession } = get();
    const achievementManager = getAchievementManager(playerStats.achievements);

    const newAchievements = achievementManager.checkAchievements({
      challengesCompleted: playerStats.totalChallengesCompleted,
      perfectCount: currentSession?.perfectCount || 0,
      maxCombo: currentSession?.maxCombo || 0,
      highestScore: playerStats.highestScore,
      reactionCount: playerStats.reactionCount || 0,
      memoryCount: playerStats.memoryCount || 0,
      mathCount: playerStats.mathCount || 0,
      judgmentCount: playerStats.judgmentCount || 0,
      spatialCount: playerStats.spatialCount || 0,
    });

    if (newAchievements.length > 0) {
      const updatedStats = {
        ...playerStats,
        achievements: achievementManager.serialize(),
      };
      savePlayerStats(updatedStats);
      set({ playerStats: updatedStats, newAchievements });
    }

    return newAchievements;
  },

  unlockSpecialAchievement: (id) => {
    const { playerStats } = get();
    const achievementManager = getAchievementManager(playerStats.achievements);

    const unlocked = achievementManager.unlockSpecialAchievement(id);

    if (unlocked) {
      const updatedStats = {
        ...playerStats,
        achievements: achievementManager.serialize(),
      };
      savePlayerStats(updatedStats);

      const achievement = achievementManager.getAllAchievements().find(a => a.id === id);
      if (achievement) {
        set({ playerStats: updatedStats, newAchievements: [achievement] });
      }
    }

    return unlocked;
  },

  getNewAchievements: () => {
    return get().newAchievements;
  },

  clearNewAchievements: () => {
    set({ newAchievements: [] });
  },
}));
