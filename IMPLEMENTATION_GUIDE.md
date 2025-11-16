# 🚀 实现指南

## 快速开始

### 1. 安装依赖

首先需要安装3D渲染和动画相关的依赖：

```bash
npm install three @react-three/fiber @react-three/drei
npm install framer-motion
npm install howler @types/howler
npm install zustand
```

### 2. 项目结构概览

```
/portfolio-manager
├── GAME_DESIGN_DOC.md          # 完整策划文档
├── IMPLEMENTATION_GUIDE.md     # 本文件
├── types/
│   └── game.d.ts               # 游戏类型定义
├── lib/
│   ├── challengeDefinitions.ts # 25个关卡配置
│   ├── difficultyManager.ts    # 难度管理系统
│   ├── scoreCalculator.ts      # 分数计算系统
│   ├── gameLogic.ts            # 核心游戏逻辑（待实现）
│   ├── challengeGenerator.ts   # 关卡生成器（待实现）
│   └── audioManager.ts         # 音频管理（待实现）
├── components/
│   ├── game/
│   │   ├── GameEngine.tsx      # 游戏引擎（待实现）
│   │   ├── Timer.tsx           # 计时器（待实现）
│   │   └── ScoreDisplay.tsx    # 分数显示（待实现）
│   └── challenges/
│       ├── ColorHunter.tsx     # 关卡组件（待实现）
│       └── ...
└── pages/
    ├── index.tsx               # 主菜单
    └── game/
        └── [mode].tsx          # 游戏页面（待实现）
```

---

## 📝 实现优先级

### Phase 1: 核心框架 (第1周)

#### 1.1 创建游戏状态管理

使用 Zustand 创建全局状态：

```typescript
// lib/gameStore.ts
import { create } from 'zustand';
import { GameState, Challenge, ChallengeResult } from '@/types/game';

interface GameStore extends GameState {
  // Actions
  startGame: (mode: string) => void;
  loadChallenge: (challenge: Challenge) => void;
  completeChallenge: (result: ChallengeResult) => void;
  failChallenge: () => void;
  updateTimer: (time: number) => void;
  resetGame: () => void;
}

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
  playerStats: {
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
    unlockedChallenges: ['CH01', 'CH02', 'CH03', 'CH04', 'CH05'],
    settings: {
      volume: 0.7,
      sfxEnabled: true,
      musicEnabled: true,
      difficulty: 'normal',
      vibrationEnabled: true,
      colorBlindMode: false,
    },
  },

  // Actions
  startGame: (mode) => {
    // 实现开始游戏逻辑
  },

  loadChallenge: (challenge) => {
    set({
      currentChallenge: challenge,
      timeRemaining: challenge.baseTimeLimit,
      isPlaying: true,
    });
  },

  completeChallenge: (result) => {
    const { combo } = get();
    set({
      combo: result.stars === 3 ? combo + 1 : 0,
    });
  },

  failChallenge: () => {
    set({ combo: 0 });
  },

  updateTimer: (time) => {
    set({ timeRemaining: time });
  },

  resetGame: () => {
    set({
      currentChallenge: null,
      isPlaying: false,
      isGameOver: false,
      combo: 0,
    });
  },
}));
```

#### 1.2 创建计时器组件

```typescript
// components/game/Timer.tsx
import { useEffect } from 'react';
import { useGameStore } from '@/lib/gameStore';

export function Timer() {
  const { timeRemaining, updateTimer, failChallenge } = useGameStore();

  useEffect(() => {
    if (timeRemaining <= 0) {
      failChallenge();
      return;
    }

    const interval = setInterval(() => {
      updateTimer(timeRemaining - 0.1);
    }, 100);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  const percentage = (timeRemaining / 10) * 100; // 假设最大10秒
  const isWarning = timeRemaining <= 3;

  return (
    <div className="timer">
      <div className="timer-bar" style={{ width: `${percentage}%` }} />
      <span className={isWarning ? 'warning' : ''}>
        {timeRemaining.toFixed(1)}s
      </span>
    </div>
  );
}
```

#### 1.3 创建基础游戏引擎

```typescript
// components/game/GameEngine.tsx
import { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/gameStore';
import { getRandomChallenge } from '@/lib/challengeDefinitions';
import { DifficultyManager } from '@/lib/difficultyManager';
import { createChallengeResult } from '@/lib/scoreCalculator';

export function GameEngine() {
  const { loadChallenge, currentChallenge, completeChallenge } = useGameStore();
  const [difficultyManager] = useState(() => new DifficultyManager());

  // 加载下一个关卡
  const loadNextChallenge = () => {
    const nextChallenge = getRandomChallenge();
    const adjusted = difficultyManager.adjustChallenge(nextChallenge);

    // 应用难度调整
    const adjustedChallenge = {
      ...nextChallenge,
      baseTimeLimit: adjusted.adjustedTimeLimit,
      config: {
        ...nextChallenge.config,
        targets: adjusted.adjustedTargets,
        distractors: adjusted.adjustedDistractors,
      },
    };

    loadChallenge(adjustedChallenge);
  };

  // 游戏开始时加载第一个关卡
  useEffect(() => {
    loadNextChallenge();
  }, []);

  return (
    <div className="game-engine">
      {currentChallenge && (
        <ChallengeRenderer
          challenge={currentChallenge}
          onComplete={(timeUsed, mistakes) => {
            const result = createChallengeResult(
              currentChallenge,
              timeUsed,
              mistakes,
              0 // combo会在store中计算
            );

            if (result.success) {
              difficultyManager.recordSuccess(timeUsed, currentChallenge.baseTimeLimit);
            } else {
              difficultyManager.recordFailure();
            }

            completeChallenge(result);
            setTimeout(loadNextChallenge, 1500); // 1.5秒后加载下一关
          }}
        />
      )}
    </div>
  );
}
```

---

### Phase 2: 第一个可玩关卡 (第2周)

#### 2.1 实现 CH01: 颜色猎手

```typescript
// components/challenges/ColorHunter.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Challenge, ChallengeComponentProps } from '@/types/game';

interface Shape {
  id: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle';
  x: number;
  y: number;
}

export function ColorHunter({ challenge, timeRemaining, onComplete, onFail }: ChallengeComponentProps) {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [targetColor, setTargetColor] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());
  const [found, setFound] = useState(0);

  // 生成形状
  useEffect(() => {
    const { targets, distractors, colors, shapes: shapeTypes } = challenge.config;
    const targetColorIndex = Math.floor(Math.random() * (colors?.length || 3));
    const target = colors?.[targetColorIndex] || '#FF6B6B';

    setTargetColor(target);

    const generatedShapes: Shape[] = [];
    const totalShapes = targets + distractors;

    for (let i = 0; i < totalShapes; i++) {
      generatedShapes.push({
        id: i,
        color: i < targets ? target : colors?.[Math.floor(Math.random() * colors.length)] || '#4ECDC4',
        shape: shapeTypes?.[Math.floor(Math.random() * shapeTypes.length)] as any || 'circle',
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 15,
      });
    }

    // 打乱顺序
    setShapes(generatedShapes.sort(() => Math.random() - 0.5));
  }, [challenge]);

  const handleClick = (shape: Shape) => {
    if (shape.color === targetColor) {
      // 正确
      setFound(found + 1);
      setShapes(shapes.filter(s => s.id !== shape.id));

      // 检查是否全部找到
      if (found + 1 >= challenge.config.targets) {
        const timeUsed = (Date.now() - startTime) / 1000;
        onComplete({ timeUsed, mistakes });
      }
    } else {
      // 错误
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);

      if (newMistakes >= 3) {
        onFail();
      }
    }
  };

  return (
    <div className="challenge-container">
      <div className="challenge-instruction">
        点击所有
        <span
          style={{
            backgroundColor: targetColor,
            padding: '4px 12px',
            borderRadius: '4px',
            margin: '0 8px',
          }}
        >
          {targetColor}
        </span>
        颜色的形状！
      </div>

      <div className="shapes-container">
        {shapes.map((shape) => (
          <motion.div
            key={shape.id}
            className={`shape shape-${shape.shape}`}
            style={{
              backgroundColor: shape.color,
              left: `${shape.x}%`,
              top: `${shape.y}%`,
            }}
            onClick={() => handleClick(shape)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, rotate: 360 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      <div className="challenge-stats">
        找到: {found}/{challenge.config.targets} | 错误: {mistakes}/3
      </div>
    </div>
  );
}
```

#### 2.2 添加样式

```css
/* styles/challenges.css */
.challenge-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.challenge-instruction {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.shapes-container {
  position: relative;
  width: 100%;
  height: 500px;
}

.shape {
  position: absolute;
  width: 60px;
  height: 60px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.shape:hover {
  transform: scale(1.1);
}

.shape-circle {
  border-radius: 50%;
}

.shape-square {
  border-radius: 8px;
}

.shape-triangle {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.challenge-stats {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 18px;
  font-weight: bold;
}
```

---

### Phase 3: 3D关卡示例 (第3周)

#### 3.1 设置 Three.js

```typescript
// components/3d/Scene3D.tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

export function Scene3D({ children }: { children: React.ReactNode }) {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      {children}
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
```

#### 3.2 实现 CH08: 3D盒子记忆

```typescript
// components/challenges/CubeMemory.tsx
import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

function RotatingCube({ onComplete }: { onComplete: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [symbols] = useState(() => ['★', '●', '■', '▲', '◆', '♥']);
  const [isRotating, setIsRotating] = useState(true);

  useFrame(() => {
    if (meshRef.current && isRotating) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.x += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} onClick={() => setIsRotating(false)}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#4ECDC4" />

      {/* 在每个面上添加符号 */}
      {symbols.map((symbol, i) => (
        <Text
          key={i}
          position={getFacePosition(i)}
          rotation={getFaceRotation(i)}
          fontSize={0.5}
          color="white"
        >
          {symbol}
        </Text>
      ))}
    </mesh>
  );
}

function getFacePosition(index: number): [number, number, number] {
  const positions: [number, number, number][] = [
    [0, 0, 1.01],  // front
    [0, 0, -1.01], // back
    [1.01, 0, 0],  // right
    [-1.01, 0, 0], // left
    [0, 1.01, 0],  // top
    [0, -1.01, 0], // bottom
  ];
  return positions[index];
}

function getFaceRotation(index: number): [number, number, number] {
  const rotations: [number, number, number][] = [
    [0, 0, 0],
    [0, Math.PI, 0],
    [0, Math.PI / 2, 0],
    [0, -Math.PI / 2, 0],
    [-Math.PI / 2, 0, 0],
    [Math.PI / 2, 0, 0],
  ];
  return rotations[index];
}
```

---

## 🎨 UI/UX实现建议

### 主菜单页面

```typescript
// pages/index.tsx
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div className="main-menu">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="game-title"
      >
        脑力闪电战
        <span className="subtitle">Brain Blitz</span>
      </motion.h1>

      <div className="menu-buttons">
        <MenuButton
          onClick={() => router.push('/game/normal')}
          label="开始游戏"
          icon="🎮"
        />
        <MenuButton
          onClick={() => router.push('/game/endless')}
          label="无尽模式"
          icon="♾️"
        />
        <MenuButton
          onClick={() => router.push('/leaderboard')}
          label="排行榜"
          icon="🏆"
        />
        <MenuButton
          onClick={() => router.push('/achievements')}
          label="成就"
          icon="🏅"
        />
      </div>
    </div>
  );
}

function MenuButton({ onClick, label, icon }: any) {
  return (
    <motion.button
      className="menu-button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="icon">{icon}</span>
      <span className="label">{label}</span>
    </motion.button>
  );
}
```

---

## 🔊 音频实现

```typescript
// lib/audioManager.ts
import { Howl } from 'howler';

class AudioManager {
  private sounds: { [key: string]: Howl } = {};
  private music: Howl | null = null;

  constructor() {
    // 预加载音效
    this.loadSounds();
  }

  private loadSounds() {
    this.sounds.click = new Howl({ src: ['/sounds/click.mp3'], volume: 0.5 });
    this.sounds.success = new Howl({ src: ['/sounds/success.mp3'], volume: 0.7 });
    this.sounds.fail = new Howl({ src: ['/sounds/fail.mp3'], volume: 0.6 });
    this.sounds.perfect = new Howl({ src: ['/sounds/perfect.mp3'], volume: 0.8 });
    this.sounds.tick = new Howl({ src: ['/sounds/tick.mp3'], volume: 0.4 });
    this.sounds.combo = new Howl({ src: ['/sounds/combo.mp3'], volume: 0.7 });
  }

  play(sound: string, volume?: number) {
    if (this.sounds[sound]) {
      if (volume !== undefined) {
        this.sounds[sound].volume(volume);
      }
      this.sounds[sound].play();
    }
  }

  playMusic(src: string, volume = 0.3) {
    if (this.music) {
      this.music.stop();
    }

    this.music = new Howl({
      src: [src],
      loop: true,
      volume,
    });

    this.music.play();
  }

  stopMusic() {
    if (this.music) {
      this.music.stop();
    }
  }

  setVolume(volume: number) {
    Object.values(this.sounds).forEach(sound => sound.volume(volume));
    if (this.music) {
      this.music.volume(volume);
    }
  }
}

export const audioManager = new AudioManager();
```

---

## 📊 数据持久化

```typescript
// lib/storage.ts
import { PlayerStats, GameSession } from '@/types/game';

const STORAGE_KEYS = {
  PLAYER_STATS: 'brain-blitz-stats',
  SESSIONS: 'brain-blitz-sessions',
  SETTINGS: 'brain-blitz-settings',
};

export function savePlayerStats(stats: PlayerStats) {
  localStorage.setItem(STORAGE_KEYS.PLAYER_STATS, JSON.stringify(stats));
}

export function loadPlayerStats(): PlayerStats | null {
  const data = localStorage.getItem(STORAGE_KEYS.PLAYER_STATS);
  return data ? JSON.parse(data) : null;
}

export function saveSession(session: GameSession) {
  const sessions = loadSessions();
  sessions.push(session);

  // 只保留最近100场
  if (sessions.length > 100) {
    sessions.shift();
  }

  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

export function loadSessions(): GameSession[] {
  const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
  return data ? JSON.parse(data) : [];
}
```

---

## ✅ 开发检查清单

### MVP版本 (2-3周)
- [ ] 项目架构搭建
- [ ] 游戏状态管理 (Zustand)
- [ ] 计时器系统
- [ ] 评分系统
- [ ] 5个基础2D关卡
  - [ ] CH01: 颜色猎手
  - [ ] CH02: 形状闪击
  - [ ] CH10: 快速算术
  - [ ] CH06: 记忆闪卡
  - [ ] CH14: 真假判断
- [ ] 基础UI (主菜单、游戏界面、结算)
- [ ] 音效集成
- [ ] 本地存储

### 完整版本 (4-6周)
- [ ] 剩余20个关卡
- [ ] 5个3D关卡
- [ ] 难度系统
- [ ] 成就系统
- [ ] 排行榜
- [ ] 粒子效果
- [ ] 过渡动画
- [ ] 移动端适配

---

## 🐛 调试建议

1. **性能监控**
```typescript
// 在开发环境中显示FPS
import Stats from 'stats.js';

const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();
  // 游戏循环
  stats.end();
  requestAnimationFrame(animate);
}
```

2. **关卡测试模式**
```typescript
// 添加快捷键直接跳转到特定关卡
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'n' && e.ctrlKey) {
      loadNextChallenge(); // Ctrl+N 跳过当前关卡
    }
  };

  window.addEventListener('keypress', handleKeyPress);
  return () => window.removeEventListener('keypress', handleKeyPress);
}, []);
```

---

## 📚 推荐资源

- **Three.js文档**: https://threejs.org/docs/
- **React Three Fiber**: https://docs.pmnd.rs/react-three-fiber/
- **Framer Motion**: https://www.framer.com/motion/
- **Howler.js**: https://howlerjs.com/
- **游戏设计模式**: https://gameprogrammingpatterns.com/

---

**下一步**: 开始实现 Phase 1 的核心框架！
