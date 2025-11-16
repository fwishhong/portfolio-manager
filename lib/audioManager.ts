/**
 * 音频管理系统
 * 使用简化版本，不依赖外部库
 */

export type SoundType = 'click' | 'success' | 'fail' | 'perfect' | 'tick' | 'combo' | 'levelUp';

class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterVolume: number = 0.7;
  private sfxEnabled: boolean = true;
  private musicEnabled: boolean = true;

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
   * 播放简单的音效（使用 Web Audio API 合成）
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
   * 设置主音量
   */
  setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
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
      sfxEnabled: this.sfxEnabled,
      musicEnabled: this.musicEnabled,
    };
  }
}

// 单例导出
export const audioManager = new AudioManager();
