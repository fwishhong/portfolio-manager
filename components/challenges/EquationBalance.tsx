/**
 * CH13: 等式平衡 - 选择正确的数字使等式成立
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface EquationBalanceProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

type Operator = '+' | '-' | '×';

export function EquationBalance({ challenge, onComplete, onMistake }: EquationBalanceProps) {
  const [equation, setEquation] = useState({ a: 0, op: '+' as Operator, result: 0, answer: 0 });
  const [options, setOptions] = useState<number[]>([]);

  useEffect(() => {
    const operators: Operator[] = ['+', '-', '×'];
    const op = operators[Math.floor(Math.random() * operators.length)];

    let a: number, answer: number, result: number;

    switch (op) {
      case '+':
        a = Math.floor(Math.random() * 20) + 1;
        answer = Math.floor(Math.random() * 20) + 1;
        result = a + answer;
        break;
      case '-':
        result = Math.floor(Math.random() * 30) + 10;
        a = Math.floor(Math.random() * (result - 5)) + 5;
        answer = result - a;
        break;
      case '×':
        a = Math.floor(Math.random() * 9) + 2;
        answer = Math.floor(Math.random() * 9) + 2;
        result = a * answer;
        break;
    }

    setEquation({ a, op, result, answer });

    // 生成选项（包括正确答案和3个干扰项）
    const opts = [answer];
    while (opts.length < 4) {
      const distractor = answer + (Math.floor(Math.random() * 10) - 5);
      if (distractor > 0 && !opts.includes(distractor)) {
        opts.push(distractor);
      }
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
  }, [challenge]);

  const handleOptionClick = (option: number) => {
    audioManager.play('click');

    if (option === equation.answer) {
      audioManager.play('perfect');
      setTimeout(() => onComplete(true), 300);
    } else {
      onMistake();
    }
  };

  const getOperatorSymbol = (op: Operator) => {
    switch (op) {
      case '×': return '×';
      case '+': return '+';
      case '-': return '-';
    }
  };

  return (
    <div className="challenge-container equation-balance">
      <div className="challenge-instruction">
        使等式成立
      </div>

      <div className="equation-display" style={{
        fontSize: '48px',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: '40px 0',
        color: '#fff'
      }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            padding: '24px 40px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
          }}
        >
          <span>{equation.a}</span>
          <span style={{ color: '#F59E0B' }}>{getOperatorSymbol(equation.op)}</span>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{
              color: '#10B981',
              width: '80px',
              height: '80px',
              background: 'rgba(16, 185, 129, 0.2)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px dashed #10B981'
            }}
          >
            ?
          </motion.span>
          <span style={{ color: '#F59E0B' }}>=</span>
          <span>{equation.result}</span>
        </motion.div>
      </div>

      <div className="options-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        {options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleOptionClick(option)}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '32px 24px',
              fontSize: '36px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: '#fff',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            {option}
          </motion.button>
        ))}
      </div>

      <style jsx>{`
        .equation-balance {
          padding: 40px 20px;
        }
      `}</style>
    </div>
  );
}
