import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Space,
  Tag,
  Timeline,
  Spin,
  Empty,
  Descriptions,
  message,
  Input,
  Select,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  ArrowLeftOutlined,
  UserOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  DownloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { ClassSessionWithTranscript, SpeakerRole, TranscriptSegment } from '../../../../shared/types';
import { request } from '@/services/api';
import './TranscriptViewer.css';

const { Option } = Select;

const TranscriptViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<ClassSessionWithTranscript | null>(null);
  const [filteredTranscript, setFilteredTranscript] = useState<TranscriptSegment[]>([]);
  const [searchText, setSearchText] = useState('');
  const [speakerFilter, setSpeakerFilter] = useState<SpeakerRole | 'all'>('all');

  useEffect(() => {
    fetchSessionData();
  }, [id]);

  useEffect(() => {
    if (session) {
      filterTranscript();
    }
  }, [session, searchText, speakerFilter]);

  const fetchSessionData = async () => {
    try {
      setLoading(true);
      const result = await request.get(`/collection/sessions/${id}/full`);

      if (result.success) {
        setSession(result.data);
      } else {
        message.error('获取会话数据失败');
      }
    } catch (error) {
      console.error('Failed to fetch session:', error);
      message.error('加载失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const filterTranscript = () => {
    if (!session) return;

    let filtered = session.transcript;

    // 按说话人筛选
    if (speakerFilter !== 'all') {
      filtered = filtered.filter(seg => seg.speaker === speakerFilter);
    }

    // 按文本搜索
    if (searchText.trim()) {
      filtered = filtered.filter(seg =>
        seg.text.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredTranscript(filtered);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hrs > 0
      ? `${hrs}小时${mins}分钟`
      : `${mins}分钟${secs}秒`;
  };

  const getSpeakerIcon = (role: SpeakerRole) => {
    switch (role) {
      case SpeakerRole.TEACHER:
        return <UserOutlined />;
      case SpeakerRole.STUDENT:
        return <TeamOutlined />;
      default:
        return <UserOutlined />;
    }
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

  const handleExport = () => {
    if (!session) return;

    let content = `课堂文字稿\n`;
    content += `课程：${session.courseName}\n`;
    content += `班级：${session.className}\n`;
    content += `时间：${new Date(session.startTime).toLocaleString()}\n`;
    content += `时长：${formatDuration(session.duration)}\n`;
    content += `\n${'='.repeat(50)}\n\n`;

    session.transcript.forEach(seg => {
      const time = formatTime(seg.timestamp);
      const speaker = seg.speakerName || getSpeakerLabel(seg.speaker);
      content += `[${time}] ${speaker}: ${seg.text}\n`;
      if (seg.keywords && seg.keywords.length > 0) {
        content += `  关键词: ${seg.keywords.join(', ')}\n`;
      }
      content += '\n';
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.courseName}_文字稿_${new Date().toLocaleDateString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    message.success('文字稿已导出');
  };

  const calculateStats = () => {
    if (!session || !session.transcript) {
      return { teacherCount: 0, studentCount: 0, totalWords: 0 };
    }

    let teacherCount = 0;
    let studentCount = 0;
    let totalWords = 0;

    session.transcript.forEach(seg => {
      totalWords += seg.text.length;
      if (seg.speaker === SpeakerRole.TEACHER) {
        teacherCount++;
      } else if (seg.speaker === SpeakerRole.STUDENT) {
        studentCount++;
      }
    });

    return { teacherCount, studentCount, totalWords };
  };

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" tip="加载中..." />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="page-container">
        <Card>
          <Empty description="未找到会话数据" />
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Button type="primary" onClick={() => navigate('/m1/recorder')}>
              返回采集器
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="page-container transcript-viewer">
      <div className="page-header">
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/m1/sessions')}
          >
            返回列表
          </Button>
          <h1 className="page-title">{session.courseName} - 课堂文字稿</h1>
        </Space>
      </div>

      {/* 课堂信息 */}
      <Card className="card-container">
        <Descriptions title="课堂基本信息" column={3}>
          <Descriptions.Item label="课程名称">{session.courseName}</Descriptions.Item>
          <Descriptions.Item label="班级">{session.className}</Descriptions.Item>
          <Descriptions.Item label="科目">{session.subject}</Descriptions.Item>
          <Descriptions.Item label="年级">{session.grade}</Descriptions.Item>
          <Descriptions.Item label="开始时间">
            {new Date(session.startTime).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="课堂时长">
            {formatDuration(session.duration)}
          </Descriptions.Item>
          {session.objectives && (
            <Descriptions.Item label="课堂目标" span={3}>
              {session.objectives}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* 统计数据 */}
      <Card className="card-container">
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="总对话数"
              value={session.transcript.length}
              prefix={<FileTextOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="教师发言"
              value={stats.teacherCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="学生发言"
              value={stats.studentCount}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总字数"
              value={stats.totalWords}
              suffix="字"
            />
          </Col>
        </Row>
      </Card>

      {/* 筛选和搜索 */}
      <Card className="card-container">
        <Space style={{ width: '100%' }} direction="vertical" size="middle">
          <Space style={{ width: '100%' }}>
            <Input
              placeholder="搜索文字稿内容..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
            <Select
              value={speakerFilter}
              onChange={setSpeakerFilter}
              style={{ width: 150 }}
            >
              <Option value="all">全部角色</Option>
              <Option value={SpeakerRole.TEACHER}>教师</Option>
              <Option value={SpeakerRole.STUDENT}>学生</Option>
            </Select>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              导出文字稿
            </Button>
          </Space>
          <div style={{ color: '#666' }}>
            显示 {filteredTranscript.length} / {session.transcript.length} 条对话
          </div>
        </Space>
      </Card>

      {/* 文字稿时间线 */}
      <Card className="card-container" title="课堂对话记录">
        {filteredTranscript.length === 0 ? (
          <Empty description="没有符合条件的对话记录" />
        ) : (
          <Timeline mode="left" className="transcript-timeline">
            {filteredTranscript.map((segment) => (
              <Timeline.Item
                key={segment.id}
                label={
                  <Space>
                    <ClockCircleOutlined />
                    {formatTime(segment.timestamp)}
                  </Space>
                }
                color={getSpeakerColor(segment.speaker)}
              >
                <div className="transcript-item">
                  <div className="transcript-header">
                    <Space>
                      <Tag
                        color={getSpeakerColor(segment.speaker)}
                        icon={getSpeakerIcon(segment.speaker)}
                      >
                        {segment.speakerName || getSpeakerLabel(segment.speaker)}
                      </Tag>
                      {segment.confidence && (
                        <span className="confidence">
                          置信度: {(segment.confidence * 100).toFixed(0)}%
                        </span>
                      )}
                    </Space>
                  </div>
                  <div className="transcript-text">{segment.text}</div>
                  {segment.keywords && segment.keywords.length > 0 && (
                    <div className="transcript-keywords">
                      <Space size="small" wrap>
                        {segment.keywords.map((keyword, idx) => (
                          <Tag key={idx} color="purple">
                            {keyword}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  )}
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Card>
    </div>
  );
};

export default TranscriptViewer;
