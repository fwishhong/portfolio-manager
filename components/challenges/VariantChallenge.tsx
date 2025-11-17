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
      opacity: isClicked ? 0.3 : 1,
    };

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

    return (
      <motion.div
        key={item.id}
        onClick={() => handleItemClick(item, index)}
        whileHover={{ scale: isClicked ? 1 : 1.2 }}
        whileTap={{ scale: isClicked ? 1 : 0.9 }}
        style={{
          ...baseStyle,
          width: '60px',
          height: '60px',
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
        }}
      >
        {target?.type === 'innovative' && item.value}
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
