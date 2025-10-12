import { Card, Row, Col, Statistic, Progress, Table, Tag, Typography, Space, Button, Tabs, Descriptions, Timeline } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TabsProps } from 'antd';
import { ArrowLeftOutlined, TeamOutlined, CommentOutlined, TrophyOutlined, ClockCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import './InClass.css';

const { Title, Paragraph, Text } = Typography;

interface StudentParticipation {
  key: string;
  name: string;
  speakCount: number;
  speakTime: number;
  thinkingLevel: string;
  participation: number;
  highlights: string[];
}

interface TranscriptItem {
  time: string;
  speaker: string;
  content: string;
  type: 'teacher' | 'student';
}

const ClassroomDetail = () => {
  const navigate = useNavigate();

  // 模拟课堂详情数据
  const classInfo = {
    courseName: '公民的基本权利与义务',
    className: '八年级(3)班',
    grade: '八年级',
    date: '2024-01-15 14:00-14:40',
    duration: 2400,
    teacher: '张老师',
    objectives: '理解权利与义务的关系，培养法治意识',
  };

  // 学生参与数据
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
    {
      key: '3',
      name: '王五',
      speakCount: 3,
      speakTime: 90,
      thinkingLevel: '中阶',
      participation: 58,
      highlights: [],
    },
  ];

  // 文字稿数据
  const transcripts: TranscriptItem[] = [
    { time: '00:02', speaker: '张老师', content: '同学们好，今天我们来学习公民的基本权利与义务', type: 'teacher' },
    { time: '00:15', speaker: '张三', content: '老师，权利和义务是什么关系？', type: 'student' },
    { time: '00:25', speaker: '张老师', content: '很好的问题！权利和义务是相互依存的...', type: 'teacher' },
    { time: '01:30', speaker: '李四', content: '我认为权利和义务就像硬币的两面', type: 'student' },
    { time: '02:00', speaker: '张老师', content: '李四同学总结得很好！', type: 'teacher' },
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
      sorter: (a: StudentParticipation, b: StudentParticipation) => a.speakCount - b.speakCount,
    },
    {
      title: '发言时长',
      dataIndex: 'speakTime',
      key: 'speakTime',
      render: (time: number) => `${Math.floor(time / 60)}分${time % 60}秒`,
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
    },
    {
      title: '亮点',
      dataIndex: 'highlights',
      key: 'highlights',
      render: (highlights: string[]) => (
        <Space size={4} wrap>
          {highlights.map((h) => (
            <Tag key={h} color="gold">{h}</Tag>
          ))}
        </Space>
      ),
    },
  ];

  // 参与分布图
  const participationChart = {
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
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

  // 思维层级分布
  const thinkingLevelChart = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'category', data: ['记忆理解', '分析应用', '评价创造'] },
    yAxis: { type: 'value', name: '次数' },
    series: [
      {
        name: '思维层级',
        type: 'bar',
        data: [
          { value: 23, itemStyle: { color: '#91d5ff' } },
          { value: 35, itemStyle: { color: '#1890ff' } },
          { value: 15, itemStyle: { color: '#0050b3' } },
        ],
        barWidth: '50%',
      },
    ],
  };

  const tabItems: TabsProps['items'] = [
    {
      key: 'overview',
      label: '概览',
      children: (
        <div>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="总发言次数"
                  value={93}
                  prefix={<CommentOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="参与学生"
                  value={43}
                  suffix="/ 45"
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="平均参与度"
                  value={78.5}
                  suffix="%"
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="课堂时长"
                  value={40}
                  suffix="分钟"
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card title="参与情况分布">
                <ReactECharts option={participationChart} style={{ height: 300 }} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="思维层级分布">
                <ReactECharts option={thinkingLevelChart} style={{ height: 300 }} />
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'students',
      label: '学生明细',
      children: (
        <Card>
          <Table
            columns={columns}
            dataSource={studentData}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ),
    },
    {
      key: 'transcript',
      label: '课堂文字稿',
      children: (
        <Card>
          <Timeline
            items={transcripts.map((item) => ({
              color: item.type === 'teacher' ? 'blue' : 'green',
              children: (
                <div>
                  <div style={{ marginBottom: 4 }}>
                    <Tag color={item.type === 'teacher' ? 'blue' : 'green'}>
                      {item.speaker}
                    </Tag>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.time}
                    </Text>
                  </div>
                  <Paragraph style={{ marginBottom: 0 }}>{item.content}</Paragraph>
                </div>
              ),
            }))}
          />
        </Card>
      ),
    },
    {
      key: 'analysis',
      label: '教学分析',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title="高质量回答提炼">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Card size="small" style={{ background: '#e6f7ff' }}>
                <Text strong>张三 - 关于权利与义务的关系</Text>
                <Paragraph style={{ marginTop: 8 }}>
                  "我认为权利和义务是相互依存的，就像硬币的两面。比如我们有受教育的权利，
                  同时也有接受规定年限教育的义务..."
                </Paragraph>
                <Space>
                  <Tag color="green">逻辑清晰</Tag>
                  <Tag color="green">举例恰当</Tag>
                </Space>
              </Card>
            </Space>
          </Card>

          <Card title="教学建议">
            <Paragraph>
              <Text strong>优点：</Text>
              <ul>
                <li>课堂互动积极，学生参与度较高</li>
                <li>启发式提问运用得当，引导学生深度思考</li>
                <li>及时肯定学生的精彩回答，增强学习信心</li>
              </ul>
            </Paragraph>
            <Paragraph>
              <Text strong>改进建议：</Text>
              <ul>
                <li>关注座位后排学生，提高整体参与均衡度</li>
                <li>适当增加小组讨论环节，促进生生互动</li>
                <li>可以增加更多生活化案例，帮助学生理解抽象概念</li>
              </ul>
            </Paragraph>
          </Card>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/teacher/in-class/classroom-history')}
            >
              返回列表
            </Button>
            <div>
              <Title level={2} style={{ margin: 0 }}>{classInfo.courseName}</Title>
              <Text type="secondary">{classInfo.date}</Text>
            </div>
          </Space>
          <Button type="primary" icon={<DownloadOutlined />}>
            导出报告
          </Button>
        </Space>
      </div>

      <Card>
        <Descriptions column={3} bordered>
          <Descriptions.Item label="课程主题">{classInfo.courseName}</Descriptions.Item>
          <Descriptions.Item label="班级">{classInfo.className}</Descriptions.Item>
          <Descriptions.Item label="年级">{classInfo.grade}</Descriptions.Item>
          <Descriptions.Item label="授课教师">{classInfo.teacher}</Descriptions.Item>
          <Descriptions.Item label="课堂时长">{Math.floor(classInfo.duration / 60)}分钟</Descriptions.Item>
          <Descriptions.Item label="记录时间">{classInfo.date}</Descriptions.Item>
          <Descriptions.Item label="教学目标" span={3}>
            {classInfo.objectives}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Tabs items={tabItems} />
      </Card>
    </div>
  );
};

export default ClassroomDetail;
