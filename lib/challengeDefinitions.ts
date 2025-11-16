/**
 * 关卡定义库
 * 包含所有25种关卡类型的配置
 */

import { Challenge } from '@/types/game';

// ============ 颜色配置 ============
const COLORS = {
  primary: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#A8E6CF'],
  similar: ['#FF4757', '#FF6348', '#FF7979', '#FF5252'],
  neon: ['#00F5FF', '#00FF41', '#FF073A', '#FFFF00', '#FF00FF'],
};

// ============ 第一类：反应速度型 ============

export const CH01_ColorHunter: Challenge = {
  id: 'CH01',
  name: '颜色猎手',
  description: '快速点击指定颜色的形状',
  type: 'reaction',
  dimension: '2D',
  difficulty: 1,
  baseTimeLimit: 5,
  config: {
    targets: 1,
    distractors: 7,
    colors: COLORS.primary,
    shapes: ['circle', 'square', 'triangle'],
  },
  tags: ['颜色', '点击', '简单'],
};

export const CH02_ShapeBlitz: Challenge = {
  id: 'CH02',
  name: '形状闪击',
  description: '点击所有指定形状',
  type: 'reaction',
  dimension: '2D',
  difficulty: 1,
  baseTimeLimit: 5,
  config: {
    targets: 3,
    distractors: 5,
    shapes: ['circle', 'square', 'triangle', 'star'],
    colors: COLORS.primary,
  },
  tags: ['形状', '多目标'],
};

export const CH03_NumberSniper: Challenge = {
  id: 'CH03',
  name: '数字狙击',
  description: '找出最大/最小的数字',
  type: 'reaction',
  dimension: '2D',
  difficulty: 1,
  baseTimeLimit: 4,
  config: {
    targets: 1,
    distractors: 8,
    numbers: [1, 9],
  },
  tags: ['数字', '比较'],
};

export const CH04_FlashDodge: Challenge = {
  id: 'CH04',
  name: '闪光躲避',
  description: '点击空白区域，避开闪烁的危险区',
  type: 'reaction',
  dimension: '2D',
  difficulty: 2,
  baseTimeLimit: 3,
  config: {
    targets: 5,
    distractors: 0,
  },
  tags: ['反应', '躲避'],
};

export const CH05_ChainReaction: Challenge = {
  id: 'CH05',
  name: '连锁反应',
  description: '按照颜色序列快速点击',
  type: 'reaction',
  dimension: '2D',
  difficulty: 2,
  baseTimeLimit: 6,
  config: {
    targets: 3,
    distractors: 0,
    colors: COLORS.primary,
  },
  tags: ['序列', '记忆'],
};

// ============ 第二类：记忆力型 ============

export const CH06_MemoryFlash: Challenge = {
  id: 'CH06',
  name: '记忆闪卡',
  description: '记住图案位置并复现',
  type: 'memory',
  dimension: '2D',
  difficulty: 2,
  baseTimeLimit: 8,
  config: {
    targets: 3,
    distractors: 6,
    shapes: ['circle', 'square', 'triangle'],
    colors: COLORS.primary,
  },
  tags: ['记忆', '位置'],
};

export const CH07_ColorSequence: Challenge = {
  id: 'CH07',
  name: '颜色序列',
  description: '记住颜色闪烁顺序，重复点击',
  type: 'memory',
  dimension: '2D',
  difficulty: 2,
  baseTimeLimit: 10,
  config: {
    targets: 4,
    distractors: 0,
    colors: COLORS.primary,
  },
  tags: ['记忆', 'Simon'],
};

export const CH08_CubeMemory: Challenge = {
  id: 'CH08',
  name: '3D盒子记忆',
  description: '记住旋转立方体上的符号位置',
  type: 'memory',
  dimension: '3D',
  difficulty: 3,
  baseTimeLimit: 10,
  config: {
    targets: 1,
    distractors: 0,
    rotationSpeed: 30,
  },
  tags: ['3D', '旋转', '记忆'],
};

export const CH09_MissingItem: Challenge = {
  id: 'CH09',
  name: '消失的物品',
  description: '找出被移除的物品',
  type: 'memory',
  dimension: '2D',
  difficulty: 2,
  baseTimeLimit: 6,
  config: {
    targets: 1,
    distractors: 4,
  },
  tags: ['记忆', '对比'],
};

// ============ 第三类：数学计算型 ============

export const CH10_QuickMath: Challenge = {
  id: 'CH10',
  name: '快速算术',
  description: '完成加减乘除运算',
  type: 'math',
  dimension: '2D',
  difficulty: 1,
  baseTimeLimit: 5,
  config: {
    targets: 1,
    distractors: 3,
    numbers: [1, 20],
    complexity: 1,
  },
  tags: ['数学', '算术'],
};

export const CH11_NumberCompare: Challenge = {
  id: 'CH11',
  name: '数字比较',
  description: '选择更大/更小的数字',
  type: 'math',
  dimension: '2D',
  difficulty: 1,
  baseTimeLimit: 4,
  config: {
    targets: 1,
    distractors: 1,
    numbers: [1, 99],
  },
  tags: ['数学', '比较'],
};

export const CH12_MultipleHunter: Challenge = {
  id: 'CH12',
  name: '倍数猎手',
  description: '点击所有3的倍数',
  type: 'math',
  dimension: '2D',
  difficulty: 2,
  baseTimeLimit: 8,
  config: {
    targets: 5,
    distractors: 10,
    numbers: [1, 50],
  },
  tags: ['数学', '倍数'],
};

export const CH13_EquationBalance: Challenge = {
  id: 'CH13',
  name: '等式平衡',
  description: '选择正确的数字使等式成立',
  type: 'math',
  dimension: '3D',
  difficulty: 2,
  baseTimeLimit: 6,
  config: {
    targets: 1,
    distractors: 3,
    numbers: [1, 20],
  },
  tags: ['3D', '等式', '数学'],
};

// ============ 第四类：判断力型 ============

export const CH14_TrueFalse: Challenge = {
  id: 'CH14',
  name: '真假判断',
  description: '判断陈述是否正确',
  type: 'judgment',
  dimension: '2D',
  difficulty: 1,
  baseTimeLimit: 4,
  config: {
    targets: 1,
    distractors: 0,
  },
  tags: ['逻辑', '判断'],
};

export const CH15_OddEvenSort: Challenge = {
  id: 'CH15',
  name: '奇偶分类',
  description: '将数字拖到奇数/偶数区域',
  type: 'judgment',
  dimension: '2D',
  difficulty: 2,
  baseTimeLimit: 6,
  config: {
    targets: 6,
    distractors: 0,
    numbers: [1, 50],
  },
  tags: ['分类', '拖拽'],
};

export const CH16_ShadowMatch: Challenge = {
  id: 'CH16',
  name: '影子匹配',
  description: '根据影子判断3D物体形状',
  type: 'judgment',
  dimension: '3D',
  difficulty: 3,
  baseTimeLimit: 5,
  config: {
    targets: 1,
    distractors: 3,
    shapes: ['cube', 'sphere', 'pyramid', 'cylinder'],
  },
  tags: ['3D', '影子', '空间'],
};

export const CH17_DirectionGuide: Challenge = {
  id: 'CH17',
  name: '方向指南',
  description: '根据箭头指示选择最终方向',
  type: 'judgment',
  dimension: '2D',
  difficulty: 2,
  baseTimeLimit: 5,
  config: {
    targets: 1,
    distractors: 3,
  },
  tags: ['方向', '逻辑'],
};

export const CH18_PatternLogic: Challenge = {
  id: 'CH18',
  name: '图案规律',
  description: '找出序列中的下一个图案',
  type: 'judgment',
  dimension: '2D',
  difficulty: 3,
  baseTimeLimit: 6,
  config: {
    targets: 1,
    distractors: 3,
    shapes: ['circle', 'square', 'triangle'],
    colors: COLORS.primary,
  },
  tags: ['规律', '逻辑'],
};

// ============ 第五类：空间感知型 ============

export const CH19_MazeSprint: Challenge = {
  id: 'CH19',
  name: '3D迷宫冲刺',
  description: '在限定时间内到达终点',
  type: 'spatial',
  dimension: '3D',
  difficulty: 3,
  baseTimeLimit: 8,
  config: {
    targets: 1,
    distractors: 0,
    complexity: 1,
  },
  tags: ['3D', '迷宫', '导航'],
};

export const CH20_CubeRotation: Challenge = {
  id: 'CH20',
  name: '立方体旋转',
  description: '将3D形状旋转到指定角度',
  type: 'spatial',
  dimension: '3D',
  difficulty: 3,
  baseTimeLimit: 8,
  config: {
    targets: 1,
    distractors: 0,
    rotationSpeed: 45,
  },
  tags: ['3D', '旋转', '空间'],
};

export const CH21_DepthJudgment: Challenge = {
  id: 'CH21',
  name: '深度判断',
  description: '选择距离最近/最远的物体',
  type: 'spatial',
  dimension: '3D',
  difficulty: 2,
  baseTimeLimit: 5,
  config: {
    targets: 1,
    distractors: 4,
  },
  tags: ['3D', '深度', '距离'],
};

// ============ 第六类：综合挑战型 ============

export const CH22_Multitask: Challenge = {
  id: 'CH22',
  name: '多任务狂潮',
  description: '同时完成2-3个简单任务',
  type: 'reaction',
  dimension: '2D',
  difficulty: 4,
  baseTimeLimit: 10,
  config: {
    targets: 3,
    distractors: 5,
    colors: COLORS.primary,
    shapes: ['circle', 'square'],
  },
  tags: ['综合', '多任务'],
};

export const CH23_ReverseThinking: Challenge = {
  id: 'CH23',
  name: '逆向思维',
  description: '做出与指令相反的操作',
  type: 'judgment',
  dimension: '2D',
  difficulty: 3,
  baseTimeLimit: 4,
  config: {
    targets: 1,
    distractors: 3,
    colors: COLORS.primary,
  },
  tags: ['逆向', '抑制'],
};

export const CH24_StroopEffect: Challenge = {
  id: 'CH24',
  name: '颜色文字混淆',
  description: 'Stroop效应测试',
  type: 'judgment',
  dimension: '2D',
  difficulty: 3,
  baseTimeLimit: 3,
  config: {
    targets: 1,
    distractors: 3,
    colors: COLORS.primary,
  },
  tags: ['Stroop', '干扰'],
};

export const CH25_RhythmClick: Challenge = {
  id: 'CH25',
  name: '节奏点击',
  description: '按照节奏准确点击',
  type: 'reaction',
  dimension: '2D',
  difficulty: 3,
  baseTimeLimit: 8,
  config: {
    targets: 6,
    distractors: 0,
  },
  tags: ['节奏', '音乐'],
};

// ============ 导出所有关卡 ============

export const ALL_CHALLENGES: Challenge[] = [
  // 反应速度型
  CH01_ColorHunter,
  CH02_ShapeBlitz,
  CH03_NumberSniper,
  CH04_FlashDodge,
  CH05_ChainReaction,

  // 记忆力型
  CH06_MemoryFlash,
  CH07_ColorSequence,
  CH08_CubeMemory,
  CH09_MissingItem,

  // 数学计算型
  CH10_QuickMath,
  CH11_NumberCompare,
  CH12_MultipleHunter,
  CH13_EquationBalance,

  // 判断力型
  CH14_TrueFalse,
  CH15_OddEvenSort,
  CH16_ShadowMatch,
  CH17_DirectionGuide,
  CH18_PatternLogic,

  // 空间感知型
  CH19_MazeSprint,
  CH20_CubeRotation,
  CH21_DepthJudgment,

  // 综合挑战型
  CH22_Multitask,
  CH23_ReverseThinking,
  CH24_StroopEffect,
  CH25_RhythmClick,
];

// ============ 工具函数 ============

/**
 * 根据类型获取关卡
 */
export function getChallengesByType(type: string): Challenge[] {
  return ALL_CHALLENGES.filter(c => c.type === type);
}

/**
 * 根据难度获取关卡
 */
export function getChallengesByDifficulty(difficulty: number): Challenge[] {
  return ALL_CHALLENGES.filter(c => c.difficulty === difficulty);
}

/**
 * 根据维度获取关卡
 */
export function getChallengesByDimension(dimension: '2D' | '3D'): Challenge[] {
  return ALL_CHALLENGES.filter(c => c.dimension === dimension);
}

/**
 * 随机获取关卡
 */
export function getRandomChallenge(exclude?: string[]): Challenge {
  const available = exclude
    ? ALL_CHALLENGES.filter(c => !exclude.includes(c.id))
    : ALL_CHALLENGES;

  return available[Math.floor(Math.random() * available.length)];
}

/**
 * 根据ID获取关卡
 */
export function getChallengeById(id: string): Challenge | undefined {
  return ALL_CHALLENGES.find(c => c.id === id);
}
