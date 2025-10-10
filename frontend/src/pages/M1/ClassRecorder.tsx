import { useState, useEffect, useRef } from 'react';
import { Card, Button, Form, Input, Select, Space, Tag, Alert, Steps, message, Row, Col, Statistic } from 'antd';
import {
  AudioOutlined,
  StopOutlined,
  SaveOutlined,
  SoundOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { request } from '@/services/api';
import { AudioRecorder, isAudioRecordingSupported, isSpeechRecognitionSupported, requestMicrophonePermission } from '@/services/audioRecorder';
import AudioVisualizer from '@/components/AudioVisualizer';
import LiveTranscript from '@/components/LiveTranscript';
import { TranscriptSegment, SpeakerRole } from '../../../../shared/types';
import './ClassRecorder.css';

const { Option } = Select;
const { TextArea } = Input;

const ClassRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [transcripts, setTranscripts] = useState<TranscriptSegment[]>([]);
  const [interimText, setInterimText] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);

  const navigate = useNavigate();
  const [form] = Form.useForm();
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

      // 请求麦克风权限
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

  // 开始采集
  const handleStartRecording = async () => {
    try {
      const values = await form.validateFields();

      // 调用后端API创建会话
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
            // 最终文本，保存到服务器
            const segment: Omit<TranscriptSegment, 'id' | 'createdAt'> = {
              sessionId: newSessionId,
              timestamp: duration,
              speaker: SpeakerRole.TEACHER, // 默认教师，后续可以通过AI识别
              text: text,
              confidence: 0.95,
            };

            setTranscripts(prev => [...prev, {
              ...segment,
              id: `temp_${Date.now()}`,
              createdAt: new Date()
            } as TranscriptSegment]);

            // 保存到服务器
            try {
              await request.post(`/collection/sessions/${newSessionId}/transcript`, {
                segments: [segment]
              });
            } catch (error) {
              console.error('Failed to save transcript:', error);
            }

            setInterimText('');
          } else {
            // 临时文本
            setInterimText(text);
          }
        },
        onError: (error) => {
          console.error('Recording error:', error);
          message.error('录制出错：' + error.message);
        }
      });

      // 启动录制
      await audioRecorderRef.current.start();

      // 获取分析器用于可视化
      const analyserNode = audioRecorderRef.current.getAnalyser();
      setAnalyser(analyserNode);

      // 开始计时
      setRecording(true);
      setCurrentStep(1);
      setDuration(0);
      setTranscripts([]);

      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      // 更新音频级别
      audioLevelTimerRef.current = setInterval(() => {
        if (audioRecorderRef.current) {
          const level = audioRecorderRef.current.getAudioLevel();
          setAudioLevel(level);
        }
      }, 100);

      message.success('课堂采集已开始');
    } catch (error) {
      console.error('Failed to start recording:', error);
      message.error('启动录制失败，请检查麦克风权限');
    }
  };

  // 停止采集
  const handleStopRecording = async () => {
    if (!audioRecorderRef.current || !sessionId) return;

    setRecording(false);
    setCurrentStep(2);

    // 停止计时器
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (audioLevelTimerRef.current) {
      clearInterval(audioLevelTimerRef.current);
    }

    message.info('正在停止录制...');

    try {
      // 停止录制
      const audioBlob = audioRecorderRef.current.stop();
      audioRecorderRef.current.cleanup();

      // TODO: 上传音频文件到服务器
      // 这里可以实现音频文件上传到OSS或服务器
      if (audioBlob) {
        console.log('Audio blob size:', audioBlob.size);
        // 可以使用 FormData 上传
        // const formData = new FormData();
        // formData.append('audio', audioBlob, 'recording.webm');
        // await request.post(`/collection/sessions/${sessionId}/audio`, formData);
      }

      // 停止会话
      await request.post(`/collection/sessions/${sessionId}/stop`);

      // 完成会话
      await request.post(`/collection/sessions/${sessionId}/complete`);

      setCurrentStep(3);
      message.success('课堂采集完成！');
    } catch (error) {
      console.error('Failed to stop recording:', error);
      message.error('停止录制时出错');
      setCurrentStep(3);
    }
  };

  // 查看文字稿
  const handleViewTranscript = () => {
    navigate(`/m1/transcript/${sessionId}`);
  };

  // 查看报告
  const handleViewReport = () => {
    navigate(`/m1/report/${sessionId}`);
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

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">课堂采集器</h1>
        <p className="page-description">
          实时采集课堂语音，自动转写文本并进行角色识别
        </p>
      </div>

      {/* 流程步骤 */}
      <Card className="card-container">
        <Steps
          current={currentStep}
          items={[
            {
              title: '填写信息',
              icon: <AudioOutlined />,
            },
            {
              title: '采集中',
              icon: <SoundOutlined />,
            },
            {
              title: '处理数据',
              icon: <SaveOutlined />,
            },
            {
              title: '完成',
              icon: <CheckCircleOutlined />,
            },
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
          style={{ marginBottom: 24 }}
        />
      )}

      {!isSpeechRecognitionSupported() && isAudioRecordingSupported() && (
        <Alert
          message="语音识别不可用"
          description="您的浏览器不支持实时语音识别，但仍可进行音频录制。建议使用Chrome或Edge浏览器以获得最佳体验。"
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {micPermission === false && (
        <Alert
          message="需要麦克风权限"
          description="请允许浏览器访问您的麦克风，以便进行课堂语音采集。"
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* 数据安全提示 */}
      <Alert
        message="数据安全保障"
        description="所有采集数据将进行自动脱敏处理、AES-256加密存储，并支持随时删除。采集过程完全透明可控。"
        type="info"
        showIcon
        closable
        style={{ marginBottom: 24 }}
      />

      {currentStep === 0 && (
        <Card className="card-container" title="课堂基本信息">
          <Form form={form} layout="vertical" size="large">
            <Form.Item
              label="课程名称"
              name="courseName"
              rules={[{ required: true, message: '请输入课程名称' }]}
            >
              <Input placeholder="例如：《红楼梦》人物分析" />
            </Form.Item>

            <Form.Item
              label="科目"
              name="subject"
              rules={[{ required: true, message: '请选择科目' }]}
            >
              <Select placeholder="选择科目">
                <Option value="chinese">语文</Option>
                <Option value="math">数学</Option>
                <Option value="english">英语</Option>
                <Option value="physics">物理</Option>
                <Option value="chemistry">化学</Option>
                <Option value="biology">生物</Option>
                <Option value="politics">政治</Option>
                <Option value="history">历史</Option>
                <Option value="geography">地理</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="班级"
              name="className"
              rules={[{ required: true, message: '请输入班级' }]}
            >
              <Input placeholder="例如：高一（3）班" />
            </Form.Item>

            <Form.Item
              label="年级"
              name="grade"
              rules={[{ required: true, message: '请选择年级' }]}
            >
              <Select placeholder="选择年级">
                <Option value="grade1">高一</Option>
                <Option value="grade2">高二</Option>
                <Option value="grade3">高三</Option>
              </Select>
            </Form.Item>

            <Form.Item label="课堂目标" name="objectives">
              <TextArea
                rows={3}
                placeholder="本节课的教学目标和重点（可选）"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                size="large"
                icon={<AudioOutlined />}
                onClick={handleStartRecording}
                disabled={micPermission === false || !isAudioRecordingSupported()}
                block
              >
                开始课堂采集
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      {(currentStep === 1 || currentStep === 2) && (
        <>
          <Row gutter={16}>
            <Col span={16}>
              <Card className="card-container recording-card">
                <div className="recording-status">
                  {recording && (
                    <div className="recording-indicator">
                      <span className="recording-dot"></span>
                      <span className="recording-text">正在录制</span>
                    </div>
                  )}

                  <div className="recording-duration">{formatDuration(duration)}</div>

                  <Row gutter={16} style={{ marginTop: 24 }}>
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

                  {/* 音频可视化 */}
                  {analyser && recording && (
                    <div style={{ marginTop: 24 }}>
                      <AudioVisualizer analyser={analyser} width={600} height={100} />
                    </div>
                  )}

                  <div className="recording-info" style={{ marginTop: 24 }}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <div className="info-item">
                        <span className="label">课程:</span>
                        <span className="value">{form.getFieldValue('courseName')}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">班级:</span>
                        <span className="value">{form.getFieldValue('className')}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">状态:</span>
                        <Tag color={recording ? 'red' : 'blue'}>
                          {recording ? '进行中' : '处理中'}
                        </Tag>
                      </div>
                    </Space>
                  </div>

                  {recording && (
                    <Button
                      danger
                      size="large"
                      icon={<StopOutlined />}
                      onClick={handleStopRecording}
                      style={{ marginTop: 32 }}
                      block
                    >
                      停止采集
                    </Button>
                  )}

                  {!recording && currentStep === 2 && (
                    <div className="processing-message">
                      正在处理采集数据，生成课堂纪要和分析报告...
                    </div>
                  )}
                </div>
              </Card>
            </Col>

            <Col span={8}>
              {/* 实时文字稿 */}
              <LiveTranscript
                transcripts={transcripts}
                interimText={interimText}
                maxHeight={600}
              />
            </Col>
          </Row>
        </>
      )}

      {currentStep === 3 && (
        <Card className="card-container completion-card">
          <div className="completion-content">
            <CheckCircleOutlined className="completion-icon" />
            <h2>课堂采集完成</h2>
            <p>
              课堂数据已成功采集并完成处理，生成了课堂纪要和改进清单。
            </p>
            <div className="completion-stats">
              <div className="stat-item">
                <div className="stat-value">{duration}s</div>
                <div className="stat-label">采集时长</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{transcripts.length}</div>
                <div className="stat-label">对话段数</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {transcripts.reduce((sum, t) => sum + t.text.length, 0)}
                </div>
                <div className="stat-label">总字数</div>
              </div>
            </div>
            <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: 32 }}>
              <Button
                type="primary"
                size="large"
                icon={<FileTextOutlined />}
                onClick={handleViewTranscript}
                block
              >
                查看课堂文字稿
              </Button>
              <Button
                size="large"
                icon={<FileTextOutlined />}
                onClick={handleViewReport}
                block
              >
                查看分析报告
              </Button>
              <Button
                size="large"
                onClick={() => navigate('/m1/sessions')}
                block
              >
                查看历史记录
              </Button>
              <Button
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
                开始新的采集
              </Button>
            </Space>
          </div>
        </Card>
      )}

      {/* 使用说明 */}
      <Card className="card-container" title="使用说明">
        <ol className="instructions-list">
          <li>
            <strong>准备工作：</strong>
            确保使用Chrome或Edge浏览器，并授予麦克风权限。
          </li>
          <li>
            <strong>填写基本信息：</strong>
            输入课程名称、科目、班级等基本信息，帮助系统更好地理解上下文。
          </li>
          <li>
            <strong>开始采集：</strong>
            点击"开始课堂采集"后，系统将实时采集课堂语音并转写为文本。
          </li>
          <li>
            <strong>实时转写：</strong>
            右侧面板会实时显示语音识别结果，您可以看到课堂对话的文字内容。
          </li>
          <li>
            <strong>音频可视化：</strong>
            音频波形会实时显示当前的音频信号强度。
          </li>
          <li>
            <strong>结束采集：</strong>
            课程结束后点击"停止采集"，系统将生成课堂纪要和改进建议。
          </li>
          <li>
            <strong>查看结果：</strong>
            处理完成后可查看完整的课堂分析报告和文字稿。
          </li>
        </ol>
      </Card>
    </div>
  );
};

export default ClassRecorder;
