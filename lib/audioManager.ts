/**
 * 增强音频管理系统
 * 支持背景音乐和高级音效
 */

export type SoundType =
  | 'click' | 'success' | 'fail' | 'perfect' | 'tick' | 'combo' | 'levelUp'
  | 'whoosh' | 'explosion' | 'star' | 'countdown' | 'warning' | 'achievement'
  | 'transition' | 'error' | 'bonus';

export type MusicTheme = 'friendly' | 'focused' | 'intense' | 'extreme' | 'master' | 'legendary' | 'transcendent';

class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterVolume: number = 0.7;
  private musicVolume: number = 0.4;
  private sfxEnabled: boolean = true;
  private musicEnabled: boolean = true;

  // 背景音乐相关
  private currentMusicTheme: MusicTheme | null = null;
  private musicNodes: OscillatorNode[] = [];
  private musicGainNode: GainNode | null = null;
  private musicLoopTimeout: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not supported');
      }
    }
  }

  /**
   * 播放音效（使用 Web Audio API 合成）
   */
  play(sound: SoundType, volume: number = 1.0): void {
    if (!this.sfxEnabled || !this.audioContext) return;

    const actualVolume = volume * this.masterVolume;

    try {
      switch (sound) {
        case 'click':
          this.playTone(800, 0.05, actualVolume * 0.3, 'sine');
          break;
        case 'success':
          this.playTone(523, 0.1, actualVolume * 0.4, 'sine');
          setTimeout(() => this.playTone(659, 0.1, actualVolume * 0.4, 'sine'), 50);
          break;
        case 'fail':
          this.playTone(200, 0.2, actualVolume * 0.5, 'sawtooth');
          break;
        case 'perfect':
          this.playTone(523, 0.1, actualVolume * 0.5, 'sine');
          setTimeout(() => this.playTone(659, 0.1, actualVolume * 0.5, 'sine'), 80);
          setTimeout(() => this.playTone(784, 0.15, actualVolume * 0.5, 'sine'), 160);
          break;
        case 'tick':
          this.playTone(1000, 0.03, actualVolume * 0.2, 'square');
          break;
        case 'combo':
          const baseFreq = 400 + Math.random() * 200;
          this.playTone(baseFreq, 0.1, actualVolume * 0.4, 'triangle');
          break;
        case 'levelUp':
          this.playTone(523, 0.08, actualVolume * 0.5, 'sine');
          setTimeout(() => this.playTone(659, 0.08, actualVolume * 0.5, 'sine'), 60);
          setTimeout(() => this.playTone(784, 0.08, actualVolume * 0.5, 'sine'), 120);
          setTimeout(() => this.playTone(1047, 0.2, actualVolume * 0.5, 'sine'), 180);
          break;
        // 新增高级音效
        case 'whoosh':
          this.playWhoosh(actualVolume);
          break;
        case 'explosion':
          this.playExplosion(actualVolume);
          break;
        case 'star':
          this.playStar(actualVolume);
          break;
        case 'countdown':
          this.playTone(440, 0.1, actualVolume * 0.5, 'sine');
          break;
        case 'warning':
          this.playTone(880, 0.15, actualVolume * 0.6, 'square');
          setTimeout(() => this.playTone(880, 0.15, actualVolume * 0.6, 'square'), 200);
          break;
        case 'achievement':
          this.playAchievement(actualVolume);
          break;
        case 'transition':
          this.playTransition(actualVolume);
          break;
        case 'error':
          this.playTone(150, 0.25, actualVolume * 0.5, 'sawtooth');
          setTimeout(() => this.playTone(100, 0.25, actualVolume * 0.5, 'sawtooth'), 100);
          break;
        case 'bonus':
          this.playBonus(actualVolume);
          break;
      }
    } catch (e) {
      console.warn('Failed to play sound:', e);
    }
  }

  /**
   * 播放单个音调
   */
  private playTone(
    frequency: number,
    duration: number,
    volume: number,
    type: OscillatorType = 'sine'
  ): void {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      // 音量包络（淡入淡出）
      const now = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (e) {
      console.warn('Failed to play tone:', e);
    }
  }

  /**
   * 高级音效 - 扫过音效
   */
  private playWhoosh(volume: number): void {
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);
    osc.type = 'sawtooth';

    gain.gain.setValueAtTime(volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  /**
   * 高级音效 - 爆炸音效
   */
  private playExplosion(volume: number): void {
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
    osc.type = 'sawtooth';

    gain.gain.setValueAtTime(volume * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * 高级音效 - 星星音效
   */
  private playStar(volume: number): void {
    const frequencies = [659, 784, 988, 1319];
    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.1, volume * 0.4, 'sine');
      }, i * 40);
    });
  }

  /**
   * 高级音效 - 成就音效
   */
  private playAchievement(volume: number): void {
    const melody = [
      { freq: 523, delay: 0 },
      { freq: 659, delay: 100 },
      { freq: 784, delay: 200 },
      { freq: 1047, delay: 300 },
      { freq: 784, delay: 400 },
      { freq: 1047, delay: 500 },
    ];
    melody.forEach(({ freq, delay }) => {
      setTimeout(() => {
        this.playTone(freq, 0.15, volume * 0.5, 'sine');
      }, delay);
    });
  }

  /**
   * 高级音效 - 过渡音效
   */
  private playTransition(volume: number): void {
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
    osc.type = 'triangle';

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume * 0.4, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * 高级音效 - 奖励音效
   */
  private playBonus(volume: number): void {
    const arpeggio = [523, 659, 784, 1047];
    arpeggio.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.12, volume * 0.45, 'triangle');
      }, i * 50);
    });
  }

  /**
   * 背景音乐 - 启动音乐主题
   */
  startMusic(theme: MusicTheme): void {
    if (!this.musicEnabled || !this.audioContext) return;

    // 如果已经在播放相同主题，不重复启动
    if (this.currentMusicTheme === theme) return;

    // 停止当前音乐
    this.stopMusic();

    this.currentMusicTheme = theme;
    this.playMusicLoop(theme);
  }

  /**
   * 播放音乐循环
   */
  private playMusicLoop(theme: MusicTheme): void {
    if (!this.audioContext || !this.musicEnabled) return;

    // 创建音乐增益节点
    if (!this.musicGainNode) {
      this.musicGainNode = this.audioContext.createGain();
      this.musicGainNode.connect(this.audioContext.destination);
      this.musicGainNode.gain.value = this.musicVolume;
    }

    // 根据主题选择音乐参数
    const musicParams = this.getMusicParams(theme);

    // 创建多层和弦
    musicParams.chords.forEach((freq, index) => {
      const osc = this.audioContext!.createOscillator();
      osc.connect(this.musicGainNode!);
      osc.frequency.value = freq;
      osc.type = musicParams.waveType;

      const now = this.audioContext!.currentTime;
      osc.start(now);
      osc.stop(now + musicParams.duration);

      this.musicNodes.push(osc);
    });

    // 循环播放
    this.musicLoopTimeout = setTimeout(() => {
      this.musicNodes = [];
      if (this.currentMusicTheme === theme) {
        this.playMusicLoop(theme);
      }
    }, musicParams.duration * 1000);
  }

  /**
   * 获取音乐主题参数
   */
  private getMusicParams(theme: MusicTheme) {
    const params = {
      friendly: {
        chords: [261.63, 329.63, 392.00, 523.25], // C E G C
        waveType: 'sine' as OscillatorType,
        duration: 4,
        tempo: 120,
      },
      focused: {
        chords: [293.66, 369.99, 440.00, 587.33], // D F# A D
        waveType: 'triangle' as OscillatorType,
        duration: 3.5,
        tempo: 130,
      },
      intense: {
        chords: [329.63, 415.30, 493.88, 659.25], // E G# B E
        waveType: 'square' as OscillatorType,
        duration: 3,
        tempo: 140,
      },
      extreme: {
        chords: [349.23, 440.00, 523.25, 698.46], // F A C F
        waveType: 'sawtooth' as OscillatorType,
        duration: 2.5,
        tempo: 150,
      },
      master: {
        chords: [392.00, 493.88, 587.33, 784.00], // G B D G
        waveType: 'triangle' as OscillatorType,
        duration: 2,
        tempo: 160,
      },
      legendary: {
        chords: [440.00, 554.37, 659.25, 880.00], // A C# E A
        waveType: 'sine' as OscillatorType,
        duration: 3,
        tempo: 145,
      },
      transcendent: {
        chords: [466.16, 587.33, 698.46, 932.33], // Bb D F Bb
        waveType: 'triangle' as OscillatorType,
        duration: 2.5,
        tempo: 155,
      },
    };

    return params[theme];
  }

  /**
   * 停止背景音乐
   */
  stopMusic(): void {
    // 清理音乐节点
    this.musicNodes.forEach(node => {
      try {
        node.stop();
      } catch (e) {
        // 已经停止的节点会抛出错误，忽略
      }
    });
    this.musicNodes = [];

    // 清理定时器
    if (this.musicLoopTimeout) {
      clearTimeout(this.musicLoopTimeout);
      this.musicLoopTimeout = null;
    }

    this.currentMusicTheme = null;
  }

  /**
   * 设置主音量
   */
  setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * 设置音乐音量
   */
  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = this.musicVolume;
    }
  }

  /**
   * 切换音效
   */
  toggleSFX(enabled: boolean): void {
    this.sfxEnabled = enabled;
  }

  /**
   * 切换音乐
   */
  toggleMusic(enabled: boolean): void {
    this.musicEnabled = enabled;
  }

  /**
   * 获取当前设置
   */
  getSettings() {
    return {
      volume: this.masterVolume,
      musicVolume: this.musicVolume,
      sfxEnabled: this.sfxEnabled,
      musicEnabled: this.musicEnabled,
      currentMusicTheme: this.currentMusicTheme,
    };
  }

  /**
   * 获取当前音乐主题
   */
  getCurrentMusicTheme(): MusicTheme | null {
    return this.currentMusicTheme;
  }
}

// 单例导出
export const audioManager = new AudioManager();
