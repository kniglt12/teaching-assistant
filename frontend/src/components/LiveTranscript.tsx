import { useEffect, useRef } from 'react';
import { Card, Empty, Tag, Space } from 'antd';
import { SoundOutlined, UserOutlined } from '@ant-design/icons';
import { TranscriptSegment, SpeakerRole } from '@/types/shared';
import './LiveTranscript.css';

interface LiveTranscriptProps {
  transcripts: TranscriptSegment[];
  interimText?: string;
  maxHeight?: number;
  showTimestamp?: boolean;
}

const LiveTranscript: React.FC<LiveTranscriptProps> = ({
  transcripts,
  interimText,
  maxHeight = 400,
  showTimestamp = true,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts, interimText]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSpeakerColor = (role: SpeakerRole): string => {
    switch (role) {
      case SpeakerRole.TEACHER:
        return 'blue';
      case SpeakerRole.STUDENT:
        return 'green';
      default:
        return 'default';
    }
  };

  const getSpeakerLabel = (role: SpeakerRole): string => {
    switch (role) {
      case SpeakerRole.TEACHER:
        return '教师';
      case SpeakerRole.STUDENT:
        return '学生';
      default:
        return '未知';
    }
  };

  return (
    <Card
      className="live-transcript-card"
      title={
        <Space>
          <SoundOutlined />
          <span>实时文字稿</span>
          <Tag color="red" icon={<SoundOutlined />}>
            识别中
          </Tag>
        </Space>
      }
      size="small"
    >
      <div
        ref={scrollRef}
        className="transcript-container"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        {transcripts.length === 0 && !interimText && (
          <Empty
            description="等待语音输入..."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}

        {transcripts.map((segment) => (
          <div key={segment.id} className="transcript-segment">
            <div className="segment-header">
              <Space size="small">
                <Tag
                  color={getSpeakerColor(segment.speaker)}
                  icon={<UserOutlined />}
                >
                  {segment.speakerName || getSpeakerLabel(segment.speaker)}
                </Tag>
                {showTimestamp && (
                  <span className="segment-time">
                    {formatTime(segment.timestamp)}
                  </span>
                )}
                {segment.confidence && (
                  <span className="segment-confidence">
                    {(segment.confidence * 100).toFixed(0)}%
                  </span>
                )}
              </Space>
            </div>
            <div className="segment-text">{segment.text}</div>
            {segment.keywords && segment.keywords.length > 0 && (
              <div className="segment-keywords">
                {segment.keywords.map((keyword, idx) => (
                  <Tag key={idx} color="purple" className="keyword-tag">
                    {keyword}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        ))}

        {interimText && (
          <div className="transcript-segment interim">
            <div className="segment-header">
              <Tag color="orange">识别中...</Tag>
            </div>
            <div className="segment-text interim-text">{interimText}</div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LiveTranscript;
