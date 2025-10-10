import { useState } from 'react';
import { Card, Button, Form, Input, Select, Space, Tag, Alert, Steps, message } from 'antd';
import {
  AudioOutlined,
  StopOutlined,
  SaveOutlined,
  SoundOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { request } from '@/services/api';
import './ClassRecorder.css';

const { Option } = Select;
const { TextArea } = Input;

const ClassRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const navigate = useNavigate();

  const [form] = Form.useForm();

  // 开始采集
  const handleStartRecording = async () => {
    try {
      const values = await form.validateFields();

      // 调用后端API创建会话
      const result = await request.post('/collection/sessions', values);

      if (result.success) {
        setRecording(true);
        setCurrentStep(1);
        setSessionId(result.data.id);
        message.success('课堂采集已开始');

        // 模拟计时
        const timer = setInterval(() => {
          setDuration((prev) => prev + 1);
        }, 1000);

        // 存储计时器ID以便停止
        (window as any).recordingTimer = timer;
      } else {
        message.error('创建会话失败，请重试');
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      message.error('请填写完整信息或检查网络连接');
    }
  };

  // 停止采集
  const handleStopRecording = async () => {
    setRecording(false);
    setCurrentStep(2);
    if ((window as any).recordingTimer) {
      clearInterval((window as any).recordingTimer);
    }
    message.success('课堂采集已停止，正在处理数据...');

    try {
      // 调用后端API停止会话
      await request.post(`/collection/sessions/${sessionId}/stop`);

      // 生成模拟文字稿（演示用）
      await request.post(`/collection/sessions/${sessionId}/generate-mock-transcript`);

      // 完成会话
      await request.post(`/collection/sessions/${sessionId}/complete`);

      setCurrentStep(3);
      message.success('数据处理完成');
    } catch (error) {
      console.error('Failed to stop recording:', error);
      message.error('处理数据时出现错误');
      setCurrentStep(3); // 仍然进入完成步骤，但用户可以看到错误消息
    }
  };

  // 保存并查看文字稿
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
                block
              >
                开始课堂采集
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      {(currentStep === 1 || currentStep === 2) && (
        <Card className="card-container recording-card">
          <div className="recording-status">
            {recording && (
              <div className="recording-indicator">
                <span className="recording-dot"></span>
                <span className="recording-text">采集中</span>
              </div>
            )}

            <div className="recording-duration">{formatDuration(duration)}</div>

            <div className="recording-info">
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
                  <span className="label">采集状态:</span>
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
                <div className="stat-value">156</div>
                <div className="stat-label">对话段数</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">12</div>
                <div className="stat-label">核心指标</div>
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
            <strong>填写基本信息：</strong>
            输入课程名称、科目、班级等基本信息，帮助系统更好地理解上下文。
          </li>
          <li>
            <strong>开始采集：</strong>
            点击"开始课堂采集"后，系统将实时采集课堂语音并转写为文本。
          </li>
          <li>
            <strong>自动识别：</strong>
            系统会自动识别师生角色，提取关键对话和互动环节。
          </li>
          <li>
            <strong>结束采集：</strong>
            课程结束后点击"停止采集"，系统将生成课堂纪要和改进建议。
          </li>
          <li>
            <strong>查看报告：</strong>
            处理完成后可查看完整的课堂分析报告和指标数据。
          </li>
        </ol>
      </Card>
    </div>
  );
};

export default ClassRecorder;
