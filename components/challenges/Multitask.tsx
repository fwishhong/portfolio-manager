/**
 * CH22: 多任务狂潮 - 同时完成2-3个简单任务
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface MultitaskProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

export function Multitask({ challenge, onComplete, onMistake }: MultitaskProps) {
  // 任务1: 点击目标颜色
  const [targetColor, setTargetColor] = useState({ name: '红', color: '#EF4444' });
  const [colorClicked, setColorClicked] = useState(false);

  // 任务2: 记住数字总和
  const [numbers, setNumbers] = useState<number[]>([]);
  const [sumAnswer, setSumAnswer] = useState(0);
  const [sumInput, setSumInput] = useState('');

  // 任务3: 避开危险区
  const [dangerZoneActive, setDangerZoneActive] = useState(false);

  const COLORS = [
    { name: '红', color: '#EF4444' },
    { name: '蓝', color: '#3B82F6' },
    { name: '绿', color: '#10B981' },
  ];

  useEffect(() => {
    // 初始化任务
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTargetColor(color);

    const nums = Array.from({ length: 3 }, () => Math.floor(Math.random() * 9) + 1);
    setNumbers(nums);
    setSumAnswer(nums.reduce((a, b) => a + b, 0));

    // 危险区随机激活
    const dangerInterval = setInterval(() => {
      setDangerZoneActive(Math.random() > 0.5);
    }, 800);

    return () => clearInterval(dangerInterval);
  }, [challenge]);

  const handleColorClick = (color: typeof COLORS[0]) => {
    audioManager.play('click');
    if (color.name === targetColor.name && !colorClicked) {
      setColorClicked(true);
      checkCompletion(true, sumInput);
    } else if (color.name !== targetColor.name) {
      onMistake();
    }
  };

  const handleSumSubmit = () => {
    checkCompletion(colorClicked, sumInput);
  };

  const checkCompletion = (colorDone: boolean, sum: string) => {
    if (colorDone && parseInt(sum) === sumAnswer) {
      audioManager.play('perfect');
      setTimeout(() => onComplete(true), 300);
    }
  };

  return (
    <div className="challenge-container multitask">
      <div className="challenge-instruction" style={{ fontSize: '18px' }}>
        同时完成所有任务！
      </div>

      <div className="tasks-container" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginTop: '30px'
      }}>
        {/* 任务1: 点击颜色 */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '16px',
            border: colorClicked ? '2px solid #10B981' : '2px solid rgba(255,255,255,0.2)'
          }}
        >
          <div style={{ fontSize: '16px', marginBottom: '12px', color: '#fff' }}>
            任务1: 点击 <span style={{ color: targetColor.color, fontWeight: 'bold' }}>{targetColor.name}色</span>
            {colorClicked && ' ✓'}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {COLORS.map((color, index) => (
              <motion.button
                key={index}
                onClick={() => handleColorClick(color)}
                disabled={colorClicked}
                whileHover={{ scale: colorClicked ? 1 : 1.1 }}
                whileTap={{ scale: colorClicked ? 1 : 0.95 }}
                style={{
                  width: '60px',
                  height: '60px',
                  background: color.color,
                  border: 'none',
                  borderRadius: '12px',
                  cursor: colorClicked ? 'not-allowed' : 'pointer',
                  opacity: colorClicked ? 0.5 : 1
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* 任务2: 计算总和 */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '16px',
            border: parseInt(sumInput) === sumAnswer ? '2px solid #10B981' : '2px solid rgba(255,255,255,0.2)'
          }}
        >
          <div style={{ fontSize: '16px', marginBottom: '12px', color: '#fff' }}>
            任务2: 计算总和
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '12px', color: '#F59E0B' }}>
            {numbers.join(' + ')} = ?
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="number"
              value={sumInput}
              onChange={(e) => {
                setSumInput(e.target.value);
                if (parseInt(e.target.value) === sumAnswer && colorClicked) {
                  handleSumSubmit();
                }
              }}
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '24px',
                background: 'rgba(0,0,0,0.3)',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                color: '#fff',
                textAlign: 'center'
              }}
              placeholder="?"
            />
          </div>
        </motion.div>
      </div>

      {/* 危险区提示 */}
      <motion.div
        animate={{
          opacity: dangerZoneActive ? 1 : 0.3,
          scale: dangerZoneActive ? 1.05 : 1
        }}
        style={{
          marginTop: '24px',
          padding: '16px',
          background: dangerZoneActive ? '#EF4444' : 'rgba(239,68,68,0.2)',
          borderRadius: '12px',
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#fff'
        }}
      >
        {dangerZoneActive ? '⚠️ 危险区激活中！' : '安全区域'}
      </motion.div>

      <style jsx>{`
        .multitask {
          padding: 40px 20px;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
