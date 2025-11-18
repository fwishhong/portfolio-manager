/**
 * 通用变体关卡组件
 * 处理CH26-CH200的所有变体关卡
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface VariantChallengeProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

export function VariantChallenge({ challenge, onComplete, onMistake }: VariantChallengeProps) {
  const [items, setItems] = useState<any[]>([]);
  const [target, setTarget] = useState<any>(null);
  const [clickedItems, setClickedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const variant = challenge.config.variant as string;

    // 根据变体类型生成内容
    if (variant?.startsWith('color_v')) {
      generateColorChallenge();
    } else if (variant?.startsWith('shape_v')) {
      generateShapeChallenge();
    } else if (variant?.startsWith('number_v')) {
      generateNumberChallenge();
    } else if (variant?.startsWith('memory_v')) {
      generateMemoryChallenge();
    } else if (variant?.startsWith('extreme_v')) {
      generateExtremeChallenge();
    } else if (variant?.startsWith('hybrid_v')) {
      generateHybridChallenge();
    } else if (variant?.startsWith('innovative_v')) {
      generateInnovativeChallenge();
    } else if (variant?.startsWith('super_v')) {
      generateSuperChallenge();
    } else if (variant?.startsWith('combo_plus_v')) {
      generateComboPlusChallenge();
    } else if (variant?.startsWith('speed_precision_v')) {
      generateSpeedPrecisionChallenge();
    } else if (variant?.startsWith('strategy_v')) {
      generateStrategyChallenge();
    } else if (variant?.startsWith('master_v')) {
      generateMasterChallenge();
    } else if (variant?.startsWith('physics_v')) {
      generatePhysicsChallenge();
    } else if (variant?.startsWith('logic_v')) {
      generateLogicChallenge();
    } else if (variant?.startsWith('coord_v')) {
      generateCoordinationChallenge();
    } else if (variant?.startsWith('ultimate_v')) {
      generateUltimateChallenge();
    } else if (variant?.startsWith('time_v')) {
      generateTimeChallenge();
    } else if (variant?.startsWith('dimension_v')) {
      generateDimensionChallenge();
    } else if (variant?.startsWith('perception_v')) {
      generatePerceptionChallenge();
    } else if (variant?.startsWith('transcendent_v')) {
      generateTranscendentChallenge();
    } else {
      // 默认：颜色挑战
      generateColorChallenge();
    }
  }, [challenge]);

  const generateColorChallenge = () => {
    const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    setTarget({ type: 'color', value: targetColor });

    const count = (challenge.config.targets || 1) + (challenge.config.distractors || 7);
    const newItems = Array.from({ length: count }, (_, i) => ({
      id: i,
      color: i < (challenge.config.targets || 1) ? targetColor : colors[Math.floor(Math.random() * colors.length)],
      shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)],
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 10,
    }));
    setItems(newItems.sort(() => Math.random() - 0.5));
  };

  const generateShapeChallenge = () => {
    const shapes = ['circle', 'square', 'triangle', 'star', 'hexagon'];
    const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
    setTarget({ type: 'shape', value: targetShape });

    const count = (challenge.config.targets || 2) + (challenge.config.distractors || 5);
    const newItems = Array.from({ length: count }, (_, i) => ({
      id: i,
      shape: i < (challenge.config.targets || 2) ? targetShape : shapes[Math.floor(Math.random() * shapes.length)],
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 10,
    }));
    setItems(newItems.sort(() => Math.random() - 0.5));
  };

  const generateNumberChallenge = () => {
    const complexity = challenge.config.complexity || 1;
    const a = Math.floor(Math.random() * (10 * complexity)) + 1;
    const b = Math.floor(Math.random() * (10 * complexity)) + 1;
    const operations = ['+', '-', '×'];
    const op = operations[Math.floor(Math.random() * operations.length)];

    let answer = 0;
    switch(op) {
      case '+': answer = a + b; break;
      case '-': answer = a - b; break;
      case '×': answer = a * b; break;
    }

    setTarget({ type: 'math', question: `${a} ${op} ${b}`, answer });

    const options = [answer];
    while (options.length < 4) {
      const distractor = answer + (Math.floor(Math.random() * 10) - 5);
      if (!options.includes(distractor)) options.push(distractor);
    }
    setItems(options.sort(() => Math.random() - 0.5).map((num, i) => ({ id: i, value: num })));
  };

  const generateMemoryChallenge = () => {
    const itemCount = challenge.config.items || 3;
    const emojis = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍑', '🍒', '🍍', '🥝', '🍉'];
    const selected = emojis.sort(() => Math.random() - 0.5).slice(0, itemCount);

    setTarget({ type: 'memory', items: selected });
    setItems(selected.map((emoji, i) => ({ id: i, emoji, visible: true })));

    // 3秒后隐藏
    setTimeout(() => {
      setItems(prev => prev.map(item => ({ ...item, visible: false })));
      // 再2秒后显示并移除一个
      setTimeout(() => {
        const removeIndex = Math.floor(Math.random() * selected.length);
        setTarget({ type: 'memory', missingIndex: removeIndex, items: selected });
        setItems(selected.map((emoji, i) => ({
          id: i,
          emoji,
          visible: i !== removeIndex
        })));
      }, 2000);
    }, 3000);
  };

  const generateExtremeChallenge = () => {
    setTarget({ type: 'extreme', clicks: 0, targetClicks: 10 });
    setItems([{ id: 0, x: 50, y: 50 }]);

    const interval = setInterval(() => {
      setItems([{
        id: Math.random(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 10
      }]);
    }, 500);

    return () => clearInterval(interval);
  };

  const generateHybridChallenge = () => {
    // 混合：颜色 + 形状
    const colors = ['#EF4444', '#3B82F6', '#10B981'];
    const shapes = ['circle', 'square', 'triangle'];
    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    const targetShape = shapes[Math.floor(Math.random() * shapes.length)];

    setTarget({ type: 'hybrid', color: targetColor, shape: targetShape });

    const count = 9;
    const newItems = Array.from({ length: count }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 10,
      isTarget: i === 0 // 第一个是目标
    }));
    newItems[0].color = targetColor;
    newItems[0].shape = targetShape;

    setItems(newItems.sort(() => Math.random() - 0.5));
  };

  const generateInnovativeChallenge = () => {
    // 创新：点击递增/递减序列
    const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
    setTarget({ type: 'innovative', sequence: numbers, currentIndex: 0 });
    setItems(numbers.sort(() => Math.random() - 0.5).map((num, i) => ({
      id: i,
      value: num,
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 10,
    })));
  };

  const generateSuperChallenge = () => {
    // 超级挑战：更多目标和干扰项
    const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#F97316', '#06B6D4'];
    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    setTarget({ type: 'color', value: targetColor });

    const targets = challenge.config.targets || 5;
    const distractors = challenge.config.distractors || 15;
    const count = targets + distractors;

    const newItems = Array.from({ length: count }, (_, i) => ({
      id: i,
      color: i < targets ? targetColor : colors[Math.floor(Math.random() * colors.length)],
      shape: ['circle', 'square', 'triangle', 'star'][Math.floor(Math.random() * 4)],
      x: Math.random() * 85 + 5,
      y: Math.random() * 75 + 5,
      size: 30 + Math.random() * 20,
    }));
    setItems(newItems.sort(() => Math.random() - 0.5));
  };

  const generateComboPlusChallenge = () => {
    // 组合Plus：多机制混合
    const colors = ['#EF4444', '#3B82F6', '#10B981'];
    const shapes = ['circle', 'square', 'triangle'];
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    setTarget({
      type: 'combo_plus',
      color: colors[0],
      shape: shapes[0],
      number: 5,
      needsAll: true
    });

    const newItems = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      number: numbers[Math.floor(Math.random() * numbers.length)],
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 10,
    }));

    newItems[0] = { ...newItems[0], color: colors[0], shape: shapes[0], number: 5 };
    setItems(newItems.sort(() => Math.random() - 0.5));
  };

  const generateSpeedPrecisionChallenge = () => {
    // 速度精度：快速移动目标
    setTarget({ type: 'speed_precision', hits: 0, required: challenge.config.targets || 8 });

    const item = {
      id: 0,
      x: 50,
      y: 50,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
    };

    setItems([item]);

    // 移动目标
    const interval = setInterval(() => {
      setItems(prev => {
        const updated = prev.map(p => {
          let newX = p.x + p.vx;
          let newY = p.y + p.vy;
          let newVx = p.vx;
          let newVy = p.vy;

          if (newX < 5 || newX > 95) newVx = -newVx;
          if (newY < 5 || newY > 95) newVy = -newVy;

          newX = Math.max(5, Math.min(95, newX));
          newY = Math.max(5, Math.min(95, newY));

          return { ...p, x: newX, y: newY, vx: newVx, vy: newVy };
        });
        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  };

  const generateStrategyChallenge = () => {
    // 策略思考：需要规划步骤
    const steps = challenge.config.steps || 4;
    const sequence = Array.from({ length: steps }, (_, i) => ({
      id: i,
      value: i + 1,
      color: `hsl(${i * 60}, 70%, 50%)`,
      completed: false
    }));

    setTarget({ type: 'strategy', sequence, currentStep: 0 });
    setItems(sequence.sort(() => Math.random() - 0.5).map((item, i) => ({
      ...item,
      x: (i % 3) * 30 + 10,
      y: Math.floor(i / 3) * 30 + 20,
    })));
  };

  const generateMasterChallenge = () => {
    // 大师级：所有机制组合
    const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B'];
    const shapes = ['circle', 'square', 'triangle', 'star'];
    const numbers = Array.from({ length: 20 }, (_, i) => i + 1);

    setTarget({
      type: 'master',
      phase: 1,
      totalPhases: 3,
      requirements: {
        phase1: { type: 'color', value: colors[0], count: 3 },
        phase2: { type: 'shape', value: shapes[1], count: 2 },
        phase3: { type: 'number', value: 15, comparison: 'greater' }
      },
      progress: { phase1: 0, phase2: 0, phase3: 0 }
    });

    const count = challenge.config.targets || 10;
    const newItems = Array.from({ length: count }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      number: numbers[Math.floor(Math.random() * numbers.length)],
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 10,
    }));

    setItems(newItems);
  };

  const generatePhysicsChallenge = () => {
    // 物理引擎：轨迹预测与碰撞
    const mechanicType = challenge.config.mechanicType || 'trajectory';
    const projectiles = challenge.config.projectiles || 3;
    const gravity = challenge.config.gravity || 0.5;

    setTarget({
      type: 'physics',
      mechanicType,
      hits: 0,
      required: projectiles,
      gravity
    });

    const newItems = Array.from({ length: projectiles }, (_, i) => ({
      id: i,
      x: Math.random() * 60 + 20,
      y: 20 + i * 15,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 2,
      radius: 25,
      active: true
    }));

    setItems(newItems);

    // 物理模拟
    const interval = setInterval(() => {
      setItems(prev => prev.map(item => {
        if (!item.active) return item;

        let newVy = item.vy + gravity * 0.1;
        let newX = item.x + item.vx;
        let newY = item.y + newVy;
        let newVx = item.vx;

        // 边界碰撞
        if (newX < 10 || newX > 90) {
          newVx = -newVx * (challenge.config.friction || 0.95);
          newX = Math.max(10, Math.min(90, newX));
        }
        if (newY > 85) {
          newY = 85;
          newVy = -newVy * 0.7;
        }

        return { ...item, x: newX, y: newY, vx: newVx, vy: newVy };
      }));
    }, 50);

    return () => clearInterval(interval);
  };

  const generateLogicChallenge = () => {
    // 逻辑推理：模式识别与推理
    const logicType = challenge.config.logicType || 'pattern';
    const gridSize = challenge.config.gridSize || 3;

    if (logicType === 'pattern') {
      // 模式识别
      const patterns = ['🔴', '🔵', '🟢', '🟡'];
      const sequence = [0, 1, 0, 2, 0, 3]; // 间隔模式
      const missing = 4; // 缺失位置

      setTarget({ type: 'logic', logicType, answer: sequence[missing], missing });
      setItems(patterns.map((p, i) => ({ id: i, pattern: p, value: i })));
    } else {
      // 数独简化版
      const grid = Array.from({ length: gridSize * gridSize }, (_, i) => ({
        id: i,
        value: null,
        fixed: Math.random() > 0.6,
        x: (i % gridSize) * 25 + 15,
        y: Math.floor(i / gridSize) * 25 + 15
      }));

      setTarget({ type: 'logic', logicType: 'sudoku', gridSize, completed: 0 });
      setItems(grid);
    }
  };

  const generateCoordinationChallenge = () => {
    // 协调控制：多任务协同
    const controllers = challenge.config.controllers || 2;
    const simultaneousActions = challenge.config.simultaneousActions || 3;

    setTarget({
      type: 'coordination',
      controllers,
      activeController: 0,
      completedActions: 0,
      required: simultaneousActions
    });

    const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B'];
    const newItems = Array.from({ length: controllers }, (_, i) => ({
      id: i,
      controller: i,
      color: colors[i],
      x: 20 + i * 30,
      y: 50,
      targetX: 50,
      targetY: 50,
      active: i === 0
    }));

    setItems(newItems);

    // 定时切换控制器
    const interval = setInterval(() => {
      setTarget((prev: any) => ({
        ...prev,
        activeController: (prev.activeController + 1) % controllers
      }));
    }, 3000);

    return () => clearInterval(interval);
  };

  const generateUltimateChallenge = () => {
    // 终极融合：全机制融合
    const fusionLevel = challenge.config.fusionLevel || 1;
    const phases = challenge.config.multiPhase ? 3 : 1;

    setTarget({
      type: 'ultimate',
      phase: 1,
      totalPhases: phases,
      fusionLevel,
      requirements: {
        phase1: { color: true, shape: true, math: true },
        phase2: { memory: true, speed: true },
        phase3: { all: true }
      },
      progress: 0
    });

    const colors = ['#EF4444', '#3B82F6', '#10B981'];
    const shapes = ['circle', 'square', 'triangle'];

    const newItems = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      number: Math.floor(Math.random() * 10) + 1,
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 10,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5
    }));

    setItems(newItems);

    // 移动元素
    const interval = setInterval(() => {
      setItems(prev => prev.map(item => ({
        ...item,
        x: Math.max(5, Math.min(95, item.x + item.vx)),
        y: Math.max(5, Math.min(95, item.y + item.vy)),
        vx: item.x <= 5 || item.x >= 95 ? -item.vx : item.vx,
        vy: item.y <= 5 || item.y >= 95 ? -item.vy : item.vy
      })));
    }, 50);

    return () => clearInterval(interval);
  };

  const generateTimeChallenge = () => {
    // 时间操控：时间流动掌控
    const timeType = challenge.config.timeType || 'slowmo';
    const timeScale = challenge.config.timeScale || 0.5;

    setTarget({
      type: 'time',
      timeType,
      timeScale,
      rewinds: challenge.config.freezeCount || 3,
      usedRewinds: 0,
      hits: 0,
      required: 5
    });

    const newItems = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 10,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      isTarget: i < 5,
      color: i < 5 ? '#10B981' : '#EF4444'
    }));

    setItems(newItems);

    // 时间流动（可调速）
    const interval = setInterval(() => {
      setItems(prev => prev.map(item => {
        const speed = timeType === 'slowmo' ? timeScale : timeType === 'speedup' ? 2 : 1;
        let newX = item.x + item.vx * speed;
        let newY = item.y + item.vy * speed;

        if (newX < 5 || newX > 95) item.vx = -item.vx;
        if (newY < 5 || newY > 95) item.vy = -item.vy;

        return {
          ...item,
          x: Math.max(5, Math.min(95, newX)),
          y: Math.max(5, Math.min(95, newY))
        };
      }));
    }, 50);

    return () => clearInterval(interval);
  };

  const generateDimensionChallenge = () => {
    // 维度穿梭：空间维度穿越
    const dimensionType = challenge.config.dimensionType || 'portal';
    const portals = challenge.config.portals || 2;

    setTarget({
      type: 'dimension',
      dimensionType,
      currentDimension: 0,
      portalsUsed: 0,
      targetDimension: 2,
      collected: 0,
      required: 5
    });

    const dimensions = [
      { color: '#EF4444', name: '红色维度' },
      { color: '#3B82F6', name: '蓝色维度' },
      { color: '#10B981', name: '绿色维度' }
    ];

    const newItems = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 10,
      dimension: Math.floor(Math.random() * 3),
      isPortal: i < portals,
      targetDimension: (i % 3),
      color: dimensions[i % 3].color
    }));

    setItems(newItems);
  };

  const generatePerceptionChallenge = () => {
    // 感知挑战：突破感知极限
    const perceptionType = challenge.config.perceptionType || 'illusion';
    const illusionStrength = challenge.config.illusionStrength || 0.5;

    setTarget({
      type: 'perception',
      perceptionType,
      illusionStrength,
      correct: 0,
      required: 5
    });

    const colors = ['#EF4444', '#3B82F6', '#10B981'];
    const newItems = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 10,
      realColor: colors[Math.floor(Math.random() * colors.length)],
      illusionColor: colors[Math.floor(Math.random() * colors.length)],
      size: 40 + Math.random() * 20 * (perceptionType === 'size_illusion' ? 2 : 1),
      opacity: perceptionType === 'fade' ? 0.3 + Math.random() * 0.7 : 1,
      isTarget: i < 5
    }));

    setItems(newItems);

    // 闪烁效果
    if (perceptionType === 'blink') {
      const interval = setInterval(() => {
        setItems(prev => prev.map(item => ({
          ...item,
          opacity: Math.random() > 0.5 ? 1 : 0.3
        })));
      }, 300);
      return () => clearInterval(interval);
    }
  };

  const generateTranscendentChallenge = () => {
    // 超越试炼：史诗级Boss战
    const bossLevel = challenge.config.bossLevel || 1;
    const phases = challenge.config.phases || 3;
    const patterns = challenge.config.bossPatterns || 5;

    setTarget({
      type: 'transcendent',
      bossLevel,
      currentPhase: 1,
      totalPhases: phases,
      bossHealth: 100,
      playerHealth: 100,
      currentPattern: 0,
      patterns,
      hits: 0
    });

    // Boss攻击模式
    const bossPatterns = [
      { type: 'spread', count: 8 },
      { type: 'spiral', count: 12 },
      { type: 'laser', count: 3 },
      { type: 'random', count: 15 }
    ];

    const pattern = bossPatterns[Math.floor(Math.random() * bossPatterns.length)];
    const newItems: any[] = Array.from({ length: pattern.count }, (_, i) => ({
      id: i,
      x: 50,
      y: 20,
      vx: Math.cos(i * Math.PI * 2 / pattern.count) * 2,
      vy: Math.sin(i * Math.PI * 2 / pattern.count) * 2 + 1,
      isBossAttack: true,
      damage: 10
    }));

    // 添加可点击的弱点
    newItems.push({
      id: pattern.count,
      x: 50,
      y: 20,
      vx: 0,
      vy: 0,
      isBossAttack: false,
      isWeakPoint: true,
      damage: 0
    });

    setItems(newItems);

    // Boss攻击移动
    const interval = setInterval(() => {
      setItems(prev => prev.map(item => {
        if (item.isBossAttack) {
          const newX = item.x + item.vx;
          const newY = item.y + item.vy;

          if (newY > 100) return { ...item, active: false };

          return { ...item, x: newX, y: newY };
        }
        return item;
      }).filter(item => item.active !== false));
    }, 50);

    return () => clearInterval(interval);
  };

  const handleItemClick = (item: any, index: number) => {
    if (clickedItems.has(index)) return;

    audioManager.play('click');
    let success = false;

    switch (target?.type) {
      case 'color':
        success = item.color === target.value;
        if (success) {
          const newClicked = new Set(clickedItems);
          newClicked.add(index);
          setClickedItems(newClicked);

          const targetCount = challenge.config.targets || 1;
          if (newClicked.size >= targetCount) {
            setTimeout(() => onComplete(true), 300);
          }
        } else {
          onMistake();
        }
        break;

      case 'shape':
        success = item.shape === target.value;
        if (success) {
          const newClicked = new Set(clickedItems);
          newClicked.add(index);
          setClickedItems(newClicked);

          const targetCount = challenge.config.targets || 2;
          if (newClicked.size >= targetCount) {
            setTimeout(() => onComplete(true), 300);
          }
        } else {
          onMistake();
        }
        break;

      case 'math':
        success = item.value === target.answer;
        if (success) {
          setTimeout(() => onComplete(true), 300);
        } else {
          onMistake();
        }
        break;

      case 'memory':
        if (!item.visible) {
          success = index === target.missingIndex;
          if (success) {
            setTimeout(() => onComplete(true), 300);
          } else {
            onMistake();
          }
        }
        break;

      case 'extreme':
        setTarget((prev: any) => ({ ...prev, clicks: prev.clicks + 1 }));
        if ((target.clicks + 1) >= target.targetClicks) {
          setTimeout(() => onComplete(true), 300);
        }
        break;

      case 'hybrid':
        success = item.color === target.color && item.shape === target.shape;
        if (success) {
          setTimeout(() => onComplete(true), 300);
        } else {
          onMistake();
        }
        break;

      case 'innovative':
        success = item.value === target.currentIndex + 1;
        if (success) {
          const nextIndex = target.currentIndex + 1;
          setTarget((prev: any) => ({ ...prev, currentIndex: nextIndex }));
          if (nextIndex >= target.sequence.length) {
            setTimeout(() => onComplete(true), 300);
          }
        } else {
          onMistake();
        }
        break;

      case 'physics':
        if (item.active) {
          const newHits = target.hits + 1;
          setTarget((prev: any) => ({ ...prev, hits: newHits }));
          setItems(prev => prev.map(p => p.id === item.id ? { ...p, active: false } : p));
          if (newHits >= target.required) {
            setTimeout(() => onComplete(true), 300);
          }
        }
        break;

      case 'logic':
        if (target.logicType === 'pattern') {
          success = item.value === target.answer;
          if (success) {
            setTimeout(() => onComplete(true), 300);
          } else {
            onMistake();
          }
        }
        break;

      case 'coordination':
        if (item.controller === target.activeController) {
          const newCompleted = target.completedActions + 1;
          setTarget((prev: any) => ({ ...prev, completedActions: newCompleted }));
          if (newCompleted >= target.required) {
            setTimeout(() => onComplete(true), 300);
          }
        } else {
          onMistake();
        }
        break;

      case 'ultimate':
        // 简化版：点击正确颜色和形状
        success = item.color === '#EF4444' && item.shape === 'circle';
        if (success) {
          const newProgress = target.progress + 1;
          setTarget((prev: any) => ({ ...prev, progress: newProgress }));
          if (newProgress >= 5) {
            setTimeout(() => onComplete(true), 300);
          }
        } else {
          onMistake();
        }
        break;

      case 'time':
        if (item.isTarget) {
          const newHits = target.hits + 1;
          setTarget((prev: any) => ({ ...prev, hits: newHits }));
          setItems(prev => prev.filter(p => p.id !== item.id));
          if (newHits >= target.required) {
            setTimeout(() => onComplete(true), 300);
          }
        } else {
          onMistake();
        }
        break;

      case 'dimension':
        if (item.isPortal) {
          const newDimension = (target.currentDimension + 1) % 3;
          setTarget((prev: any) => ({ ...prev, currentDimension: newDimension, portalsUsed: prev.portalsUsed + 1 }));
        } else if (item.dimension === target.currentDimension) {
          const newCollected = target.collected + 1;
          setTarget((prev: any) => ({ ...prev, collected: newCollected }));
          setItems(prev => prev.filter(p => p.id !== item.id));
          if (newCollected >= target.required) {
            setTimeout(() => onComplete(true), 300);
          }
        }
        break;

      case 'perception':
        if (item.isTarget) {
          const newCorrect = target.correct + 1;
          setTarget((prev: any) => ({ ...prev, correct: newCorrect }));
          setItems(prev => prev.filter(p => p.id !== item.id));
          if (newCorrect >= target.required) {
            setTimeout(() => onComplete(true), 300);
          }
        } else {
          onMistake();
        }
        break;

      case 'transcendent':
        if (item.isWeakPoint) {
          const newHits = target.hits + 1;
          const newBossHealth = Math.max(0, target.bossHealth - 20);
          setTarget((prev: any) => ({ ...prev, hits: newHits, bossHealth: newBossHealth }));
          if (newBossHealth <= 0) {
            setTimeout(() => onComplete(true), 300);
          }
        }
        break;
    }
  };

  const renderInstruction = () => {
    if (!target) return '加载中...';

    switch (target.type) {
      case 'color':
        return <span>点击 <span style={{ color: target.value, fontWeight: 'bold' }}>这个颜色</span></span>;
      case 'shape':
        return `点击所有 ${target.value}`;
      case 'math':
        return `${target.question} = ?`;
      case 'memory':
        return target.missingIndex !== undefined ? '哪个消失了？' : '记住这些！';
      case 'extreme':
        return `快速点击！(${target.clicks}/${target.targetClicks})`;
      case 'hybrid':
        return <span>点击 <span style={{ color: target.color }}>这个颜色</span> 的 {target.shape}</span>;
      case 'innovative':
        return `按顺序点击 1→10 (当前: ${target.currentIndex + 1})`;
      case 'physics':
        return `⚛️ 点击移动的物体 (${target.hits}/${target.required})`;
      case 'logic':
        return target.logicType === 'pattern' ? '🧩 找出缺失的图案' : '🎯 完成数独谜题';
      case 'coordination':
        return `🎮 控制器 ${target.activeController + 1} - 点击它！(${target.completedActions}/${target.required})`;
      case 'ultimate':
        return `🔥 终极挑战：点击红色圆形 (${target.progress}/5)`;
      case 'time':
        return `⏰ ${target.timeType === 'slowmo' ? '慢动作' : '加速'}模式 - 点击绿色目标 (${target.hits}/${target.required})`;
      case 'dimension':
        return `🌀 维度 ${target.currentDimension + 1} - 收集物品 (${target.collected}/${target.required})`;
      case 'perception':
        return `👁️ 感知挑战 - 点击真实目标 (${target.correct}/${target.required})`;
      case 'transcendent':
        return `👹 Boss战 阶段${target.currentPhase}/${target.totalPhases} - Boss生命: ${target.bossHealth}%`;
      default:
        return challenge.description;
    }
  };

  const renderItem = (item: any, index: number) => {
    const isClicked = clickedItems.has(index);
    const baseStyle = {
      position: 'absolute' as const,
      left: `${item.x}%`,
      top: `${item.y}%`,
      cursor: isClicked ? 'not-allowed' : 'pointer',
      opacity: isClicked ? 0.3 : (item.opacity || 1),
    };

    // Math challenge - buttons
    if (target?.type === 'math') {
      return (
        <motion.button
          key={item.id}
          onClick={() => handleItemClick(item, index)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '20px 32px',
            fontSize: '28px',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontWeight: 'bold'
          }}
        >
          {item.value}
        </motion.button>
      );
    }

    // Memory challenge
    if (target?.type === 'memory') {
      if (!item.visible && target.missingIndex === undefined) return null;

      return (
        <motion.div
          key={item.id}
          onClick={() => handleItemClick(item, index)}
          style={{
            ...baseStyle,
            fontSize: '48px',
            padding: '16px',
            background: item.visible ? 'transparent' : 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
          }}
        >
          {item.visible ? item.emoji : '?'}
        </motion.div>
      );
    }

    // Logic challenge - patterns
    if (target?.type === 'logic' && item.pattern) {
      return (
        <motion.button
          key={item.id}
          onClick={() => handleItemClick(item, index)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '16px 24px',
            fontSize: '40px',
            background: 'white',
            border: '3px solid #6366F1',
            borderRadius: '12px',
            cursor: 'pointer'
          }}
        >
          {item.pattern}
        </motion.button>
      );
    }

    // Coordination challenge - controllers
    if (target?.type === 'coordination') {
      return (
        <motion.div
          key={item.id}
          onClick={() => handleItemClick(item, index)}
          animate={{
            scale: item.active ? [1, 1.1, 1] : 1,
            boxShadow: item.active ? ['0 0 20px rgba(99, 102, 241, 0.5)', '0 0 40px rgba(99, 102, 241, 0.8)', '0 0 20px rgba(99, 102, 241, 0.5)'] : 'none'
          }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{
            ...baseStyle,
            width: '70px',
            height: '70px',
            background: item.color,
            borderRadius: '50%',
            border: item.active ? '4px solid white' : '2px solid rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#fff',
          }}
        >
          {item.controller + 1}
        </motion.div>
      );
    }

    // Dimension challenge - portals and items
    if (target?.type === 'dimension') {
      const isVisible = item.dimension === target.currentDimension || item.isPortal;
      return (
        <motion.div
          key={item.id}
          onClick={() => handleItemClick(item, index)}
          animate={item.isPortal ? {
            rotate: 360,
            scale: [1, 1.2, 1]
          } : {}}
          transition={item.isPortal ? { duration: 2, repeat: Infinity } : {}}
          style={{
            ...baseStyle,
            width: item.isPortal ? '80px' : '50px',
            height: item.isPortal ? '80px' : '50px',
            background: item.isPortal
              ? 'radial-gradient(circle, #8B5CF6, #6366F1)'
              : item.color,
            borderRadius: '50%',
            border: item.isPortal ? '3px solid white' : '2px solid rgba(255,255,255,0.5)',
            opacity: isVisible ? 1 : 0.2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
          }}
        >
          {item.isPortal ? '🌀' : '💎'}
        </motion.div>
      );
    }

    // Transcendent challenge - boss attacks and weak point
    if (target?.type === 'transcendent') {
      if (item.isBossAttack) {
        return (
          <motion.div
            key={item.id}
            style={{
              ...baseStyle,
              width: '30px',
              height: '30px',
              background: 'radial-gradient(circle, #EF4444, #DC2626)',
              borderRadius: '50%',
              border: '2px solid #FCA5A5',
              pointerEvents: 'none',
            }}
          />
        );
      }

      if (item.isWeakPoint) {
        return (
          <motion.div
            key={item.id}
            onClick={() => handleItemClick(item, index)}
            animate={{
              scale: [1, 1.3, 1],
              boxShadow: ['0 0 20px #FBBF24', '0 0 40px #F59E0B', '0 0 20px #FBBF24']
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{
              ...baseStyle,
              width: '60px',
              height: '60px',
              background: 'radial-gradient(circle, #FBBF24, #F59E0B)',
              borderRadius: '50%',
              border: '3px solid #FDE68A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              cursor: 'pointer',
            }}
          >
            ⭐
          </motion.div>
        );
      }
    }

    // Perception challenge - illusions
    if (target?.type === 'perception') {
      const displayColor = target.perceptionType === 'illusion' ? item.illusionColor : item.realColor;
      return (
        <motion.div
          key={item.id}
          onClick={() => handleItemClick(item, index)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            ...baseStyle,
            width: `${item.size || 50}px`,
            height: `${item.size || 50}px`,
            background: displayColor,
            borderRadius: '50%',
            border: item.isTarget ? '3px solid white' : 'none',
            opacity: item.opacity,
          }}
        />
      );
    }

    // Default rendering (color, shape, physics, time, ultimate, etc.)
    return (
      <motion.div
        key={item.id}
        onClick={() => handleItemClick(item, index)}
        whileHover={{ scale: isClicked ? 1 : 1.2 }}
        whileTap={{ scale: isClicked ? 1 : 0.9 }}
        style={{
          ...baseStyle,
          width: item.radius ? `${item.radius * 2}px` : '60px',
          height: item.radius ? `${item.radius * 2}px` : '60px',
          background: item.color || '#6366F1',
          borderRadius: item.shape === 'circle' ? '50%' : item.shape === 'triangle' ? '0' : '8px',
          clipPath: item.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' :
                    item.shape === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' :
                    undefined,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#fff',
          border: (target?.type === 'physics' && item.active) ? '3px solid #FBBF24' :
                  (target?.type === 'time' && item.isTarget) ? '3px solid white' : 'none',
          opacity: item.active === false ? 0.3 : (item.opacity || 1),
        }}
      >
        {target?.type === 'innovative' && item.value}
        {target?.type === 'physics' && item.active && '⚛️'}
      </motion.div>
    );
  };

  return (
    <div className="challenge-container variant-challenge">
      <div className="challenge-instruction">
        {renderInstruction()}
      </div>

      <div style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        margin: '40px auto',
        maxWidth: '700px'
      }}>
        {target?.type === 'math' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            {items.map((item, index) => renderItem(item, index))}
          </div>
        ) : target?.type === 'memory' ? (
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {items.map((item, index) => renderItem(item, index))}
          </div>
        ) : (
          items.map((item, index) => renderItem(item, index))
        )}
      </div>

      <style jsx>{`
        .variant-challenge {
          padding: 40px 20px;
        }
      `}</style>
    </div>
  );
}
