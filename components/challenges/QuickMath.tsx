/**
 * CH10: 快速算术 - 完成加减乘除运算
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface QuickMathProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

export function QuickMath({ challenge, onComplete, onMistake }: QuickMathProps) {
  const [question, setQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [options, setOptions] = useState<number[]>([]);

  useEffect(() => {
    generateQuestion();
  }, [challenge]);

  const generateQuestion = () => {
    const operations = ['+', '-', '×'];
    const op = operations[Math.floor(Math.random() * operations.length)];

    let num1: number, num2: number, answer: number;

    switch (op) {
      case '+':
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        answer = num1 + num2;
        setQuestion(`${num1} + ${num2} = ?`);
        break;
      case '-':
        num1 = Math.floor(Math.random() * 30) + 10;
        num2 = Math.floor(Math.random() * num1);
        answer = num1 - num2;
        setQuestion(`${num1} - ${num2} = ?`);
        break;
      case '×':
        num1 = Math.floor(Math.random() * 10) + 2;
        num2 = Math.floor(Math.random() * 10) + 2;
        answer = num1 * num2;
        setQuestion(`${num1} × ${num2} = ?`);
        break;
      default:
        answer = 0;
    }

    setCorrectAnswer(answer);

    // 生成选项
    const wrongAnswers = new Set<number>();
    while (wrongAnswers.size < 3) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const wrong = answer + offset;
      if (wrong !== answer && wrong > 0) {
        wrongAnswers.add(wrong);
      }
    }

    const allOptions = [answer, ...Array.from(wrongAnswers)];
    setOptions(allOptions.sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (selected: number) => {
    audioManager.play('click');

    if (selected === correctAnswer) {
      audioManager.play('success');
      setTimeout(() => onComplete(true), 300);
    } else {
      onMistake();
    }
  };

  return (
    <div className="challenge-container quick-math">
      <div className="math-board">
        <motion.div
          className="math-question"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {question}
        </motion.div>

        <div className="math-options">
          {options.map((option, index) => (
            <motion.button
              key={index}
              className="math-option"
              onClick={() => handleAnswer(option)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
