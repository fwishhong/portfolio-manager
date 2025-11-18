/**
 * 游戏引擎核心组件
 */

import { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/gameStore';
import { getRandomChallenge, getChallengeById } from '@/lib/challengeDefinitions';
import { DifficultyManager } from '@/lib/difficultyManager';
import { createChallengeResult } from '@/lib/scoreCalculator';
import { audioManager } from '@/lib/audioManager';
import { Challenge, Achievement } from '@/types/game';
import { AchievementNotification } from './AchievementNotification';

// 导入2D关卡组件 (CH01-CH25)
import { ColorHunter } from '@/components/challenges/ColorHunter';
import { ShapeBlitz } from '@/components/challenges/ShapeBlitz';
import { QuickMath } from '@/components/challenges/QuickMath';
import { MemoryFlash } from '@/components/challenges/MemoryFlash';
import { TrueFalse } from '@/components/challenges/TrueFalse';
import { NumberSniper } from '@/components/challenges/NumberSniper';
import { FlashDodge } from '@/components/challenges/FlashDodge';
import { ColorSequence } from '@/components/challenges/ColorSequence';
import { NumberCompare } from '@/components/challenges/NumberCompare';
import { OddEvenSort } from '@/components/challenges/OddEvenSort';
import { DirectionGuide } from '@/components/challenges/DirectionGuide';
import { ReverseThinking } from '@/components/challenges/ReverseThinking';
import { StroopEffect } from '@/components/challenges/StroopEffect';
import { ChainReaction } from '@/components/challenges/ChainReaction';
import { MissingItem } from '@/components/challenges/MissingItem';
import { MultipleHunter } from '@/components/challenges/MultipleHunter';
import { EquationBalance } from '@/components/challenges/EquationBalance';
import { PatternRule } from '@/components/challenges/PatternRule';
import { ShadowMatch } from '@/components/challenges/ShadowMatch';
import { Multitask } from '@/components/challenges/Multitask';
import { RhythmClick } from '@/components/challenges/RhythmClick';

// 3D关卡
import { CubeMemory } from '@/components/challenges/CubeMemory';

// 变体关卡组件 (CH26-CH100)
import { VariantChallenge } from '@/components/challenges/VariantChallenge';

interface GameEngineProps {
  onGameOver?: () => void;
}

export function GameEngine({ onGameOver }: GameEngineProps) {
  const { loadChallenge, currentChallenge, completeChallenge, combo, isGameOver, currentSession, getNewAchievements, clearNewAchievements } = useGameStore();
  const [difficultyManager] = useState(() => new DifficultyManager());
  const [startTime, setStartTime] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);

  // 加载下一个关卡
  const loadNextChallenge = () => {
    console.log('🎮 loadNextChallenge called, currentSession:', currentSession);

    setMistakes(0);
    setStartTime(Date.now());

    // 随机选择一个关卡（所有400个关卡）
    // 可以通过配置控制开放的关卡范围
    const totalChallenges = 400;
    const challengeNumber = Math.floor(Math.random() * totalChallenges) + 1;
    // CH001-CH025使用2位数，CH026+使用3位数
    const randomId = challengeNumber <= 99
      ? `CH${challengeNumber.toString().padStart(2, '0')}`
      : `CH${challengeNumber.toString().padStart(3, '0')}`;

    console.log('🎯 Attempting to load challenge:', randomId);
    const nextChallenge = getChallengeById(randomId);

    if (!nextChallenge) {
      console.error('❌ Challenge not found:', randomId);
      return;
    }

    console.log('✅ Challenge found:', nextChallenge.name);

    const adjusted = difficultyManager.adjustChallenge(nextChallenge);

    // 应用难度调整
    const adjustedChallenge: Challenge = {
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

  // 游戏开始时加载第一个关卡 - 只在 currentSession 存在时加载
  useEffect(() => {
    if (currentSession) {
      console.log('🚀 Session exists, loading first challenge');
      loadNextChallenge();
    } else {
      console.log('⏳ Waiting for session to be created...');
    }
  }, [currentSession]);

  // 游戏结束处理
  useEffect(() => {
    if (isGameOver && onGameOver) {
      onGameOver();
    }
  }, [isGameOver, onGameOver]);

  // 成就通知处理
  useEffect(() => {
    const newAchievements = getNewAchievements();
    if (newAchievements.length > 0 && achievementQueue.length === 0) {
      setAchievementQueue(newAchievements);
      clearNewAchievements();
    }
  }, [getNewAchievements, achievementQueue.length, clearNewAchievements]);

  // 显示成就队列中的下一个成就
  useEffect(() => {
    if (!currentAchievement && achievementQueue.length > 0) {
      setCurrentAchievement(achievementQueue[0]);
      setAchievementQueue(prev => prev.slice(1));
    }
  }, [currentAchievement, achievementQueue]);

  // 处理关卡完成
  const handleChallengeComplete = (success: boolean) => {
    if (!currentChallenge) return;

    console.log('🎯 Challenge complete called, success:', success);

    const timeUsed = (Date.now() - startTime) / 1000;
    const result = createChallengeResult(
      currentChallenge,
      timeUsed,
      mistakes,
      combo
    );

    console.log('📊 Challenge result:', result);

    if (success && result.success) {
      difficultyManager.recordSuccess(timeUsed, currentChallenge.baseTimeLimit);

      // 播放音效
      if (result.stars === 3) {
        audioManager.play('perfect');
      } else {
        audioManager.play('success');
      }

      completeChallenge(result);

      console.log('⏭️ Loading next challenge in 1 second...');

      // 延迟加载下一关
      setTimeout(() => {
        console.log('🔄 Now loading next challenge');
        loadNextChallenge();
      }, 1000);
    } else {
      console.log('❌ Challenge failed');
      difficultyManager.recordFailure();
      audioManager.play('fail');
    }
  };

  const handleMistake = () => {
    setMistakes(prev => prev + 1);
    audioManager.play('fail', 0.5);
  };

  if (!currentChallenge) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>加载关卡中...</p>
      </div>
    );
  }

  return (
    <>
      <div className="game-engine">
        {renderChallenge(currentChallenge, handleChallengeComplete, handleMistake)}
      </div>
      <AchievementNotification
        achievement={currentAchievement}
        onClose={() => setCurrentAchievement(null)}
      />
    </>
  );
}

function renderChallenge(
  challenge: Challenge,
  onComplete: (success: boolean) => void,
  onMistake: () => void
) {
  const commonProps = {
    challenge,
    onComplete,
    onMistake,
  };

  // 获取关卡编号
  const challengeNum = parseInt(challenge.id.replace('CH', ''));

  // CH26-CH100使用通用变体组件
  if (challengeNum >= 26) {
    return <VariantChallenge {...commonProps} />;
  }

  // CH01-CH25使用专用组件
  switch (challenge.id) {
    // 反应速度型
    case 'CH01':
      return <ColorHunter {...commonProps} />;
    case 'CH02':
      return <ShapeBlitz {...commonProps} />;
    case 'CH03':
      return <NumberSniper {...commonProps} />;
    case 'CH04':
      return <FlashDodge {...commonProps} />;
    case 'CH05':
      return <ChainReaction {...commonProps} />;

    // 记忆力型
    case 'CH06':
      return <MemoryFlash {...commonProps} />;
    case 'CH07':
      return <ColorSequence {...commonProps} />;
    case 'CH08':
      return <CubeMemory {...commonProps} />;
    case 'CH09':
      return <MissingItem {...commonProps} />;

    // 数学计算型
    case 'CH10':
      return <QuickMath {...commonProps} />;
    case 'CH11':
      return <NumberCompare {...commonProps} />;
    case 'CH12':
      return <MultipleHunter {...commonProps} />;
    case 'CH13':
      return <EquationBalance {...commonProps} />;

    // 判断力型
    case 'CH14':
      return <TrueFalse {...commonProps} />;
    case 'CH15':
      return <OddEvenSort {...commonProps} />;
    case 'CH16':
      return <ShadowMatch {...commonProps} />;
    case 'CH17':
      return <DirectionGuide {...commonProps} />;
    case 'CH18':
      return <PatternRule {...commonProps} />;

    // 空间感知型 (暂时使用占位符)
    case 'CH19':
    case 'CH20':
    case 'CH21':
      return <VariantChallenge {...commonProps} />;

    // 综合挑战型
    case 'CH22':
      return <Multitask {...commonProps} />;
    case 'CH23':
      return <ReverseThinking {...commonProps} />;
    case 'CH24':
      return <StroopEffect {...commonProps} />;
    case 'CH25':
      return <RhythmClick {...commonProps} />;

    default:
      return (
        <div className="challenge-not-found">
          <p>关卡 {challenge.id} 尚未实现</p>
        </div>
      );
  }
}
