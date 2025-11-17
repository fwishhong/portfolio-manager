/**
 * CH25: 节奏点击 - 按照节奏准确点击
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface RhythmClickProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

interface Note {
  id: number;
  position: number;
  hit: boolean;
}

export function RhythmClick({ challenge, onComplete, onMistake }: RhythmClickProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(8);
  const [gameStarted, setGameStarted] = useState(false);
  const noteIdRef = useRef(0);

  useEffect(() => {
    // 生成节奏模式
    const pattern = [500, 1000, 500, 1500, 500, 1000, 500, 1500];
    let delay = 1000;

    pattern.forEach((interval, index) => {
      setTimeout(() => {
        if (index < pattern.length) {
          setNotes(prev => [...prev, {
            id: noteIdRef.current++,
            position: 0,
            hit: false
          }]);
          audioManager.play('click', 0.3);
        }
      }, delay);
      delay += interval;
    });

    setGameStarted(true);
  }, [challenge]);

  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setNotes(prev => {
        const updated = prev.map(note => ({
          ...note,
          position: note.position + 2
        })).filter(note => note.position < 100 || note.hit);

        // 检查是否有音符超出范围未点击
        const missed = prev.filter(note => note.position >= 100 && !note.hit);
        if (missed.length > 0) {
          // 允许几次失误
        }

        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameStarted]);

  useEffect(() => {
    if (score >= targetScore) {
      audioManager.play('perfect');
      setTimeout(() => onComplete(true), 500);
    }
  }, [score, targetScore, onComplete]);

  const handleClick = () => {
    // 检查是否有音符在击打区域
    const hitZone = notes.find(note =>
      !note.hit &&
      note.position >= 75 &&
      note.position <= 95
    );

    if (hitZone) {
      audioManager.play('success', 0.5);
      setScore(prev => prev + 1);
      setNotes(prev => prev.map(note =>
        note.id === hitZone.id ? { ...note, hit: true } : note
      ));
    } else {
      audioManager.play('fail', 0.3);
      onMistake();
    }
  };

  return (
    <div className="challenge-container rhythm-click">
      <div className="challenge-instruction">
        在圆环到达目标时点击！({score}/{targetScore})
      </div>

      <div className="rhythm-game" style={{
        position: 'relative',
        width: '100%',
        maxWidth: '600px',
        height: '400px',
        margin: '40px auto',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
        borderRadius: '24px',
        overflow: 'hidden'
      }}>
        {/* 音符轨道 */}
        <div className="note-track" style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '4px',
          background: 'rgba(255,255,255,0.2)',
          transform: 'translateY(-50%)'
        }} />

        {/* 击打区域 */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{
            position: 'absolute',
            top: '50%',
            right: '80px',
            width: '80px',
            height: '80px',
            border: '4px solid #10B981',
            borderRadius: '50%',
            transform: 'translateY(-50%)',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)'
          }}
        />

        {/* 音符 */}
        <AnimatePresence>
          {notes.map(note => (
            <motion.div
              key={note.id}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: `${note.position}%`,
                width: note.hit ? '0' : '60px',
                height: note.hit ? '0' : '60px',
                background: note.hit
                  ? 'transparent'
                  : 'linear-gradient(135deg, #F59E0B, #FBBF24)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: note.hit ? 'none' : '0 4px 12px rgba(245, 158, 11, 0.5)',
                transition: note.hit ? 'all 0.3s' : 'none'
              }}
            >
              {note.hit && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '48px'
                  }}
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 点击按钮 */}
        <motion.button
          onClick={handleClick}
          whileTap={{ scale: 0.9 }}
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '20px 60px',
            fontSize: '24px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            color: '#fff',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
          }}
        >
          点击！
        </motion.button>
      </div>

      <div className="score-display" style={{
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#fff'
      }}>
        连击: {score}
      </div>

      <style jsx>{`
        .rhythm-click {
          padding: 40px 20px;
        }
      `}</style>
    </div>
  );
}
