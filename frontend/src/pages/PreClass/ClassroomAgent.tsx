import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Select,
  Button,
  Input,
  List,
  Typography,
  Space,
  Spin,
  Avatar,
  Row,
  Col,
  Divider,
  App,
} from 'antd';
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  LeftOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { request } from '@/services/api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Unit {
  id: string;
  name: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  name: string;
  topics: string[];
}

interface ClassroomData {
  grade: string;
  semester: string;
  subject: string;
  units: Unit[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const ClassroomAgent: React.FC = () => {
  const [step, setStep] = useState<'select' | 'chat'>('select');
  const [classroomData, setClassroomData] = useState<ClassroomData | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [selectedLesson, setSelectedLesson] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingClassrooms, setLoadingClassrooms] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { message: messageApi } = App.useApp();

  useEffect(() => {
    fetchClassrooms();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchClassrooms = async () => {
    setLoadingClassrooms(true);
    try {
      const response = await request.get('/agent/classrooms', {
        params: { grade: '8', semester: '1' },
      });

      if (response.success && response.data) {
        setClassroomData(response.data);
      }
    } catch (error) {
      console.error('获取课堂列表失败:', error);
    } finally {
      setLoadingClassrooms(false);
    }
  };

  const handleStartChat = () => {
    if (!selectedLesson) {
      messageApi.warning('请选择课堂');
      return;
    }

    setStep('chat');
    setMessages([
      {
        role: 'assistant',
        content: `您好!我是课堂助手。我已加载了"${getLessonName()}"的知识点,您可以向我提问关于这节课的任何问题,比如:

- 这节课有什么合适的案例?
- 重点和难点是什么?
- 应该采用什么教学方法?
- 如何设计课堂活动?

请随时向我提问!`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const getLessonName = (): string => {
    if (!classroomData || !selectedUnit || !selectedLesson) return '';

    const unit = classroomData.units.find((u) => u.id === selectedUnit);
    const lesson = unit?.lessons.find((l) => l.id === selectedLesson);
    return lesson ? lesson.name : '';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await request.post('/agent/chat', {
        lessonId: selectedLesson,
        question: inputMessage,
        conversationHistory: messages,
      });

      if (response.success && response.data) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: response.data.answer,
          timestamp: response.data.timestamp,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: '抱歉,发生了错误,请稍后重试。',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBack = () => {
    setStep('select');
    setMessages([]);
  };

  const getAvailableLessons = (): Lesson[] => {
    if (!classroomData || !selectedUnit) return [];
    const unit = classroomData.units.find((u) => u.id === selectedUnit);
    return unit?.lessons || [];
  };

  if (loadingClassrooms) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  // 选择课堂界面
  if (step === 'select') {
    return (
      <App>
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
          <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RobotOutlined style={{ fontSize: '40px', color: '#1890ff', marginRight: '16px' }} />
              <Title level={2} style={{ margin: 0 }}>课堂助手</Title>
            </div>

            <Paragraph type="secondary">
              选择年级和课堂,与AI助手对话,获取教学建议、案例推荐等帮助。
            </Paragraph>

            <Card style={{ backgroundColor: '#f5f5f5' }}>
              <Space>
                <BookOutlined />
                <Text strong>
                  {classroomData?.grade}年级 {classroomData?.subject}
                </Text>
                <Text type="secondary">第{classroomData?.semester}学期</Text>
              </Space>
            </Card>

            <div>
              <Text strong>选择单元</Text>
              <Select
                style={{ width: '100%', marginTop: '8px' }}
                placeholder="请选择单元"
                value={selectedUnit || undefined}
                onChange={(value) => {
                  setSelectedUnit(value);
                  setSelectedLesson('');
                }}
              >
                {classroomData?.units.map((unit) => (
                  <Select.Option key={unit.id} value={unit.id}>
                    {unit.name}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div>
              <Text strong>选择课堂</Text>
              <Select
                style={{ width: '100%', marginTop: '8px' }}
                placeholder="请先选择单元"
                disabled={!selectedUnit}
                value={selectedLesson || undefined}
                onChange={setSelectedLesson}
                optionLabelProp="label"
              >
                {getAvailableLessons().map((lesson) => (
                  <Select.Option
                    key={lesson.id}
                    value={lesson.id}
                    label={lesson.name}
                  >
                    <div>
                      <div style={{ fontWeight: 500 }}>{lesson.name}</div>
                      <div style={{ marginTop: '4px', fontSize: '12px', color: '#888' }}>
                        {lesson.topics.join(' · ')}
                      </div>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </div>

            <Button
              type="primary"
              size="large"
              block
              icon={<BookOutlined />}
              onClick={handleStartChat}
              disabled={!selectedLesson}
            >
              开始对话
            </Button>
          </Space>
        </Card>
      </div>
    </App>
    );
  }

  // 对话界面
  return (
    <App>
      <div style={{ padding: '16px', height: 'calc(100vh - 130px)' }}>
        <Card
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}
      >
        {/* 头部 */}
        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
          <Space>
            <Button icon={<LeftOutlined />} onClick={handleBack} />
            <RobotOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <div>
              <Title level={5} style={{ margin: 0 }}>{getLessonName()}</Title>
              <Text type="secondary" style={{ fontSize: '12px' }}>课堂助手 - AI驱动</Text>
            </div>
          </Space>
        </div>

        {/* 消息列表 */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            backgroundColor: '#fafafa',
          }}
        >
          <List
            dataSource={messages}
            renderItem={(msg) => (
              <div
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    maxWidth: '70%',
                  }}
                >
                  <Avatar
                    icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                    style={{
                      backgroundColor: msg.role === 'user' ? '#1890ff' : '#52c41a',
                      margin: msg.role === 'user' ? '0 0 0 8px' : '0 8px 0 0',
                      flexShrink: 0,
                    }}
                    size={40}
                  />
                  <Card
                    size="small"
                    style={{
                      backgroundColor: msg.role === 'user' ? '#e6f7ff' : '#fff',
                    }}
                  >
                    <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                      {msg.content}
                    </Paragraph>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Text>
                  </Card>
                </div>
              </div>
            )}
          />
          {loading && (
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <Spin />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <Divider style={{ margin: 0 }} />

        {/* 输入区域 */}
        <div style={{ padding: '16px' }}>
          <Row gutter={8}>
            <Col flex="auto">
              <TextArea
                rows={3}
                placeholder="输入您的问题..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
              />
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<SendOutlined />}
                size="large"
                onClick={handleSendMessage}
                disabled={loading || !inputMessage.trim()}
                style={{ height: '100%' }}
              >
                发送
              </Button>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
    </App>
  );
};

export default ClassroomAgent;
