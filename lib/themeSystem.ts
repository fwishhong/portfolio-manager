/**
 * 主题配色系统
 * 根据关卡难度动态切换主题
 */

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  backgroundGradient: string;
  text: string;
  textSecondary: string;
  success: string;
  warning: string;
  danger: string;
  border: string;
  shadow: string;
}

export interface GameTheme {
  name: string;
  displayName: string;
  colors: ThemeColors;
  challengeRange: [number, number];
  description: string;
  mood: 'friendly' | 'focused' | 'intense' | 'extreme' | 'master';
}

// 新手友好主题 (CH001-050) - 绿色系
export const friendlyTheme: GameTheme = {
  name: 'friendly',
  displayName: '新手友好',
  challengeRange: [1, 50],
  description: '温暖的绿色，营造轻松学习氛围',
  mood: 'friendly',
  colors: {
    primary: '#10B981',      // 翠绿
    secondary: '#34D399',    // 浅绿
    accent: '#6EE7B7',       // 薄荷绿
    background: '#064E3B',   // 深绿背景
    backgroundGradient: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)',
    text: '#ECFDF5',         // 浅色文字
    textSecondary: '#A7F3D0',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#EF4444',
    border: 'rgba(16, 185, 129, 0.3)',
    shadow: 'rgba(16, 185, 129, 0.2)',
  },
};

// 专注进阶主题 (CH051-100) - 蓝色系
export const focusedTheme: GameTheme = {
  name: 'focused',
  displayName: '专注进阶',
  challengeRange: [51, 100],
  description: '沉稳的蓝色，帮助集中注意力',
  mood: 'focused',
  colors: {
    primary: '#3B82F6',      // 天蓝
    secondary: '#60A5FA',    // 亮蓝
    accent: '#93C5FD',       // 淡蓝
    background: '#1E3A8A',   // 深蓝背景
    backgroundGradient: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
    text: '#EFF6FF',
    textSecondary: '#BFDBFE',
    success: '#34D399',
    warning: '#F59E0B',
    danger: '#EF4444',
    border: 'rgba(59, 130, 246, 0.3)',
    shadow: 'rgba(59, 130, 246, 0.2)',
  },
};

// 紧张挑战主题 (CH101-140) - 黄橙色系
export const intenseTheme: GameTheme = {
  name: 'intense',
  displayName: '紧张挑战',
  challengeRange: [101, 140],
  description: '温暖的橙黄色，提升警觉和反应',
  mood: 'intense',
  colors: {
    primary: '#F59E0B',      // 琥珀
    secondary: '#FBBF24',    // 金黄
    accent: '#FCD34D',       // 亮黄
    background: '#78350F',   // 深棕背景
    backgroundGradient: 'linear-gradient(135deg, #78350F 0%, #92400E 100%)',
    text: '#FFFBEB',
    textSecondary: '#FDE68A',
    success: '#34D399',
    warning: '#F59E0B',
    danger: '#DC2626',
    border: 'rgba(245, 158, 11, 0.3)',
    shadow: 'rgba(245, 158, 11, 0.2)',
  },
};

// 极限速度主题 (CH141-180) - 橙红色系
export const extremeTheme: GameTheme = {
  name: 'extreme',
  displayName: '极限速度',
  challengeRange: [141, 180],
  description: '炽热的橙红色，激发极限潜能',
  mood: 'extreme',
  colors: {
    primary: '#F97316',      // 橙色
    secondary: '#FB923C',    // 亮橙
    accent: '#FDBA74',       // 浅橙
    background: '#7C2D12',   // 深橙背景
    backgroundGradient: 'linear-gradient(135deg, #7C2D12 0%, #9A3412 100%)',
    text: '#FFF7ED',
    textSecondary: '#FED7AA',
    success: '#10B981',
    warning: '#FBBF24',
    danger: '#DC2626',
    border: 'rgba(249, 115, 22, 0.3)',
    shadow: 'rgba(249, 115, 22, 0.2)',
  },
};

// 大师终极主题 (CH181-200) - 深红紫色系
export const masterTheme: GameTheme = {
  name: 'master',
  displayName: '终极大师',
  challengeRange: [181, 200],
  description: '神秘的深红紫，象征巅峰成就',
  mood: 'master',
  colors: {
    primary: '#DC2626',      // 深红
    secondary: '#EF4444',    // 红色
    accent: '#F87171',       // 浅红
    background: '#450A0A',   // 极深红背景
    backgroundGradient: 'linear-gradient(135deg, #450A0A 0%, #7F1D1D 50%, #581C87 100%)',
    text: '#FEF2F2',
    textSecondary: '#FECACA',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#DC2626',
    border: 'rgba(220, 38, 38, 0.4)',
    shadow: 'rgba(220, 38, 38, 0.3)',
  },
};

// 所有主题
export const allThemes: GameTheme[] = [
  friendlyTheme,
  focusedTheme,
  intenseTheme,
  extremeTheme,
  masterTheme,
];

/**
 * 根据关卡编号获取对应主题
 */
export function getThemeByChallenge(challengeId: string): GameTheme {
  const num = parseInt(challengeId.replace(/\D/g, ''));

  for (const theme of allThemes) {
    if (num >= theme.challengeRange[0] && num <= theme.challengeRange[1]) {
      return theme;
    }
  }

  // 默认返回友好主题
  return friendlyTheme;
}

/**
 * 根据难度级别获取主题
 */
export function getThemeByDifficulty(difficulty: number): GameTheme {
  if (difficulty <= 2) return friendlyTheme;
  if (difficulty === 3) return focusedTheme;
  if (difficulty === 4) return intenseTheme;
  return extremeTheme;
}

/**
 * 获取主题过渡动画配置
 */
export function getThemeTransition(fromTheme: GameTheme, toTheme: GameTheme) {
  return {
    duration: 0.8,
    ease: 'easeInOut',
  };
}
