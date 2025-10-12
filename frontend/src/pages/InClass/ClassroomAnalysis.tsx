import { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Tag, Typography, Space, Button, Tabs, Form, Input, Select, Alert, Steps, message } from 'antd';
import type { ColumnsType, TabsProps } from 'antd';
import {
  TeamOutlined,
  CommentOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  AudioOutlined,
  StopOutlined,
  SaveOutlined,
  SoundOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import { AudioRecorder, isAudioRecordingSupported, isSpeechRecognitionSupported, requestMicrophonePermission } from '@/services/audioRecorder';
import AudioVisualizer from '@/components/AudioVisualizer';
import LiveTranscript from '@/components/LiveTranscript';
import { TranscriptSegment, SpeakerRole } from '@/types/shared';
import { request } from '@/services/api';
import './InClass.css';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

interface StudentParticipation {
  key: string;
  name: string;
  speakCount: number;
  speakTime: number;
  thinkingLevel: string;
  participation: number;
  highlights: string[];
}

const ClassroomAnalysis = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // 录音相关状态
  const [recording, setRecording] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [transcripts, setTranscripts] = useState<TranscriptSegment[]>([]);
  const [interimText, setInterimText] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);

  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioLevelTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 检查浏览器支持
  useEffect(() => {
    const checkSupport = async () => {
      if (!isAudioRecordingSupported()) {
        message.error('您的浏览器不支持音频录制功能');
        return;
      }

      if (!isSpeechRecognitionSupported()) {
        message.warning('您的浏览器不支持语音识别，将无法实时转写');
      }

      const hasPermission = await requestMicrophonePermission();
      setMicPermission(hasPermission);

      if (!hasPermission) {
        message.error('需要麦克风权限才能进行课堂采集');
      }
    };

    checkSupport();

    return () => {
      if (audioRecorderRef.current) {
        audioRecorderRef.current.cleanup();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioLevelTimerRef.current) {
        clearInterval(audioLevelTimerRef.current);
      }
    };
  }, []);

  // 开始录音
  const handleStartRecording = async () => {
    try {
      const values = await form.validateFields();

      // 创建会话
      const result = await request.post('/collection/sessions', values);

      if (!result.success) {
        message.error('创建会话失败，请重试');
        return;
      }

      const newSessionId = result.data.id;
      setSessionId(newSessionId);

      // 创建音频录制器
      audioRecorderRef.current = new AudioRecorder({
        onTranscript: async (text, isFinal) => {
          if (isFinal) {
            const segment: Omit<TranscriptSegment, 'id' | 'createdAt'> = {
              sessionId: newSessionId,
              timestamp: duration,
              speaker: SpeakerRole.TEACHER,
              text: text,
              confidence: 0.95,
            };

            setTranscripts(prev => [...prev, {
              ...segment,
              id: `temp_${Date.now()}`,
              createdAt: new Date()
            } as TranscriptSegment]);

            try {
              await request.post(`/collection/sessions/${newSessionId}/transcript`, {
                segments: [segment]
              });
            } catch (error) {
              console.error('Failed to save transcript:', error);
            }

            setInterimText('');
          } else {
            setInterimText(text);
          }
        },
        onError: (error) => {
          console.error('Recording error:', error);
          message.error('录制出错：' + error.message);
        }
      });

      await audioRecorderRef.current.start();

      const analyserNode = audioRecorderRef.current.getAnalyser();
      setAnalyser(analyserNode);

      setRecording(true);
      setCurrentStep(1);
      setDuration(0);
      setTranscripts([]);

      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      audioLevelTimerRef.current = setInterval(() => {
        if (audioRecorderRef.current) {
          const level = audioRecorderRef.current.getAudioLevel();
          setAudioLevel(level);
        }
      }, 100);

      message.success('课堂记录已开始');
    } catch (error) {
      console.error('Failed to start recording:', error);
      message.error('启动录制失败，请检查麦克风权限');
    }
  };

  // 停止录音
  const handleStopRecording = async () => {
    if (!audioRecorderRef.current || !sessionId) return;

    setRecording(false);
    setCurrentStep(2);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (audioLevelTimerRef.current) {
      clearInterval(audioLevelTimerRef.current);
    }

    message.info('正在停止录制...');

    try {
      const audioBlob = audioRecorderRef.current.stop();
      audioRecorderRef.current.cleanup();

      if (audioBlob) {
        console.log('Audio blob size:', audioBlob.size);
      }

      await request.post(`/collection/sessions/${sessionId}/stop`);
      await request.post(`/collection/sessions/${sessionId}/complete`);

      setCurrentStep(3);
      message.success('课堂记录完成！');
    } catch (error) {
      console.error('Failed to stop recording:', error);
      message.error('停止录制时出错');
      setCurrentStep(3);
    }
  };

  // 格式化时间
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 模拟学生参与数据(从转写文本中分析)
  const studentData: StudentParticipation[] = [
    {
      key: '1',
      name: '张三',
      speakCount: 8,
      speakTime: 245,
      thinkingLevel: '高阶',
      participation: 92,
      highlights: ['深度思考', '逻辑清晰'],
    },
    {
      key: '2',
      name: '李四',
      speakCount: 6,
      speakTime: 180,
      thinkingLevel: '中阶',
      participation: 78,
      highlights: ['积极参与'],
    },
  ];

  const columns: ColumnsType<StudentParticipation> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '发言次数',
      dataIndex: 'speakCount',
      key: 'speakCount',
      sorter: (a, b) => a.speakCount - b.speakCount,
    },
    {
      title: '发言时长',
      dataIndex: 'speakTime',
      key: 'speakTime',
      render: (time: number) => `${Math.floor(time / 60)}分${time % 60}秒`,
      sorter: (a, b) => a.speakTime - b.speakTime,
    },
    {
      title: '思维层级',
      dataIndex: 'thinkingLevel',
      key: 'thinkingLevel',
      render: (level: string) => {
        const color = level === '高阶' ? 'green' : level === '中阶' ? 'blue' : 'default';
        return <Tag color={color}>{level}</Tag>;
      },
    },
    {
      title: '参与度',
      dataIndex: 'participation',
      key: 'participation',
      render: (value: number) => <Progress percent={value} size="small" />,
      sorter: (a, b) => a.participation - b.participation,
    },
  ];

  // 分析图表
  const participationChart = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '参与情况',
        type: 'pie',
        radius: '60%',
        data: [
          { value: 12, name: '高度参与', itemStyle: { color: '#52c41a' } },
          { value: 18, name: '积极参与', itemStyle: { color: '#1890ff' } },
          { value: 8, name: '一般参与', itemStyle: { color: '#faad14' } },
          { value: 5, name: '较少参与', itemStyle: { color: '#ff4d4f' } },
        ],
      },
    ],
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Title level={2}>课堂记录与分析</Title>
            <Paragraph>实时记录课堂语音,自动分析学生参与度与教学效果</Paragraph>
          </div>
          <Button
            icon={<HistoryOutlined />}
            size="large"
            onClick={() => navigate('/teacher/in-class/classroom-history')}
          >
            查看历史记录
          </Button>
        </Space>
      </div>

      {/* 流程步骤 */}
      <Card>
        <Steps
          current={currentStep}
          items={[
            { title: '填写信息', icon: <AudioOutlined /> },
            { title: '课堂记录', icon: <SoundOutlined /> },
            { title: '处理数据', icon: <SaveOutlined /> },
            { title: '查看分析', icon: <CheckCircleOutlined /> },
          ]}
        />
      </Card>

      {/* 浏览器兼容性提示 */}
      {!isAudioRecordingSupported() && (
        <Alert
          message="浏览器不支持"
          description="您的浏览器不支持音频录制功能，请使用Chrome、Edge或Firefox浏览器。"
          type="error"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginTop: 16 }}
        />
      )}

      {micPermission === false && (
        <Alert
          message="需要麦克风权限"
          description="请允许浏览器访问您的麦克风，以便进行课堂语音记录。"
          type="error"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}

      {/* 第一步：填写基本信息 */}
      {currentStep === 0 && (
        <Card title="课堂基本信息" style={{ marginTop: 16 }}>
          <Form form={form} layout="vertical" size="large">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="课程主题"
                  name="courseName"
                  rules={[{ required: true, message: '请输入课程主题' }]}
                >
                  <Input placeholder="例如：公民的基本权利与义务" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="班级"
                  name="className"
                  rules={[{ required: true, message: '请输入班级' }]}
                >
                  <Input placeholder="例如：八年级(3)班" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="年级"
                  name="grade"
                  rules={[{ required: true, message: '请选择年级' }]}
                  initialValue="八年级"
                >
                  <Select>
                    <Option value="七年级">七年级</Option>
                    <Option value="八年级">八年级</Option>
                    <Option value="九年级">九年级</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button
                type="primary"
                size="large"
                icon={<AudioOutlined />}
                onClick={handleStartRecording}
                disabled={micPermission === false || !isAudioRecordingSupported()}
                block
              >
                开始课堂记录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      {/* 第二步：录制中 */}
      {(currentStep === 1 || currentStep === 2) && (
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={16}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                {recording && (
                  <div style={{ marginBottom: 24 }}>
                    <div className="recording-indicator" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span className="recording-dot" style={{
                        width: 12,
                        height: 12,
                        background: '#ff4d4f',
                        borderRadius: '50%',
                        animation: 'pulse 1.5s infinite'
                      }}></span>
                      <span style={{ color: '#ff4d4f', fontWeight: 600 }}>正在录制</span>
                    </div>
                  </div>
                )}

                <div style={{ fontSize: 48, fontWeight: 600, marginBottom: 24 }}>
                  {formatDuration(duration)}
                </div>

                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic
                      title="音频级别"
                      value={audioLevel}
                      suffix="%"
                      valueStyle={{ color: audioLevel > 30 ? '#3f8600' : '#cf1322' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="文字稿段数"
                      value={transcripts.length}
                      suffix="段"
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="录制时长"
                      value={duration}
                      suffix="秒"
                    />
                  </Col>
                </Row>

                {analyser && recording && (
                  <div style={{ marginTop: 24 }}>
                    <AudioVisualizer analyser={analyser} width={600} height={100} />
                  </div>
                )}

                {recording && (
                  <Button
                    danger
                    size="large"
                    icon={<StopOutlined />}
                    onClick={handleStopRecording}
                    style={{ marginTop: 32 }}
                    block
                  >
                    停止记录
                  </Button>
                )}

                {!recording && currentStep === 2 && (
                  <div style={{ marginTop: 24, color: '#8c8c8c' }}>
                    正在处理数据，生成课堂分析报告...
                  </div>
                )}
              </div>
            </Card>
          </Col>

          <Col span={8}>
            <LiveTranscript
              transcripts={transcripts}
              interimText={interimText}
              maxHeight={600}
            />
          </Col>
        </Row>
      )}

      {/* 第三步：分析结果 */}
      {currentStep === 3 && (
        <>
          <Card style={{ marginTop: 16, textAlign: 'center' }}>
            <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 16 }} />
            <Title level={3}>课堂记录完成</Title>
            <Paragraph>
              已成功记录 {duration}秒的课堂内容，采集了 {transcripts.length} 段对话，
              总计 {transcripts.reduce((sum, t) => sum + t.text.length, 0)} 字
            </Paragraph>
          </Card>

          <Card title="课堂概览" style={{ marginTop: 16 }}>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="总发言次数"
                  value={93}
                  prefix={<CommentOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="参与学生"
                  value={43}
                  suffix="/ 45"
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="平均参与度"
                  value={78.5}
                  suffix="%"
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="课堂时长"
                  value={Math.floor(duration / 60)}
                  suffix="分钟"
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
            </Row>
          </Card>

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card title="参与情况分布">
                <ReactECharts option={participationChart} style={{ height: 300 }} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="学生参与明细">
                <Table
                  columns={columns}
                  dataSource={studentData}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>

          <Card style={{ marginTop: 16 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  setCurrentStep(0);
                  setSessionId(null);
                  setDuration(0);
                  setTranscripts([]);
                  setInterimText('');
                  form.resetFields();
                }}
                block
              >
                开始新的记录
              </Button>
              <Button
                size="large"
                icon={<HistoryOutlined />}
                onClick={() => navigate('/teacher/in-class/classroom-history')}
                block
              >
                查看所有历史记录
              </Button>
            </Space>
          </Card>
        </>
      )}
    </div>
  );
};

export default ClassroomAnalysis;
