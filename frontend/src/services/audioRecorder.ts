/**
 * 音频录制服务
 * 使用 Web Audio API 和 MediaRecorder API
 */

export interface AudioRecorderOptions {
  onDataAvailable?: (blob: Blob) => void;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: Error) => void;
  mimeType?: string;
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private recognition: any = null; // SpeechRecognition
  private isRecording = false;

  constructor(private options: AudioRecorderOptions = {}) {}

  /**
   * 开始录制音频
   */
  async start(): Promise<void> {
    try {
      // 请求麦克风权限
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // 创建 AudioContext 用于音频分析
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      source.connect(this.analyser);

      // 设置 MediaRecorder
      const mimeType = this.options.mimeType || this.getSupportedMimeType();
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });

      this.chunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
          if (this.options.onDataAvailable) {
            this.options.onDataAvailable(event.data);
          }
        }
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: mimeType });
        if (this.options.onDataAvailable) {
          this.options.onDataAvailable(blob);
        }
      };

      // 启动录制
      this.mediaRecorder.start(1000); // 每秒产生一个数据块
      this.isRecording = true;

      // 启动语音识别
      this.startSpeechRecognition();

      console.log('Audio recording started');
    } catch (error) {
      const err = error as Error;
      console.error('Failed to start recording:', err);
      if (this.options.onError) {
        this.options.onError(err);
      }
      throw err;
    }
  }

  /**
   * 停止录制
   */
  stop(): Blob | null {
    if (!this.mediaRecorder || !this.isRecording) {
      return null;
    }

    this.mediaRecorder.stop();
    this.isRecording = false;

    // 停止语音识别
    if (this.recognition) {
      this.recognition.stop();
    }

    // 停止所有音频轨道
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }

    // 关闭 AudioContext
    if (this.audioContext) {
      this.audioContext.close();
    }

    const blob = new Blob(this.chunks, {
      type: this.options.mimeType || this.getSupportedMimeType()
    });

    console.log('Audio recording stopped');
    return blob;
  }

  /**
   * 暂停录制
   */
  pause(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.pause();
      if (this.recognition) {
        this.recognition.stop();
      }
    }
  }

  /**
   * 恢复录制
   */
  resume(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.resume();
      this.startSpeechRecognition();
    }
  }

  /**
   * 获取音频分析器（用于可视化）
   */
  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  /**
   * 获取音频级别（0-100）
   */
  getAudioLevel(): number {
    if (!this.analyser) return 0;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    return Math.round((average / 255) * 100);
  }

  /**
   * 检查是否正在录制
   */
  isActive(): boolean {
    return this.isRecording;
  }

  /**
   * 启动语音识别（Web Speech API）
   */
  private startSpeechRecognition(): void {
    // 检查浏览器是否支持语音识别
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true; // 持续识别
      this.recognition.interimResults = true; // 返回临时结果
      this.recognition.lang = 'zh-CN'; // 中文识别

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (this.options.onTranscript) {
          if (finalTranscript) {
            this.options.onTranscript(finalTranscript, true);
          } else if (interimTranscript) {
            this.options.onTranscript(interimTranscript, false);
          }
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);

        // 如果是网络错误或暂时性错误，尝试重启
        if (event.error === 'network' || event.error === 'aborted') {
          setTimeout(() => {
            if (this.isRecording) {
              this.startSpeechRecognition();
            }
          }, 1000);
        }
      };

      this.recognition.onend = () => {
        // 如果还在录制状态，自动重启识别
        if (this.isRecording) {
          setTimeout(() => {
            if (this.isRecording) {
              this.startSpeechRecognition();
            }
          }, 100);
        }
      };

      this.recognition.start();
      console.log('Speech recognition started');
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
    }
  }

  /**
   * 获取支持的音频格式
   */
  private getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/mp4',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'audio/webm'; // 默认
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    this.stop();
    this.chunks = [];
    this.mediaRecorder = null;
    this.audioContext = null;
    this.analyser = null;
    this.stream = null;
    this.recognition = null;
  }
}

/**
 * 检查浏览器是否支持音频录制
 */
export function isAudioRecordingSupported(): boolean {
  return !!(
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    window.MediaRecorder
  );
}

/**
 * 检查浏览器是否支持语音识别
 */
export function isSpeechRecognitionSupported(): boolean {
  return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
}

/**
 * 请求麦克风权限
 */
export async function requestMicrophonePermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Microphone permission denied:', error);
    return false;
  }
}
