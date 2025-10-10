import { useEffect, useRef } from 'react';
import './AudioVisualizer.css';

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  width?: number;
  height?: number;
  barColor?: string;
  backgroundColor?: string;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  analyser,
  width = 600,
  height = 100,
  barColor = '#1890ff',
  backgroundColor = 'transparent',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * height * 0.8;

        // 渐变色
        const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
        gradient.addColorStop(0, barColor);
        gradient.addColorStop(1, barColor + '80');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, width, height, barColor, backgroundColor]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="audio-visualizer"
    />
  );
};

export default AudioVisualizer;
