import { Row, Col, Card, Statistic, Progress, Timeline, Button, Space, Table, Tag } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  AudioOutlined,
  FileTextOutlined,
  FormOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { request } from '@/services/api';
import ReactECharts from 'echarts-for-react';
import { ClassSession, SessionStatus } from '../../../../shared/types';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  // 获取统计数据
  const { data: _stats } = useQuery('dashboardStats', async () => {
    const response = await request.get('/dashboard/stats');
    return response.data;
  });

  // 获取最近的录音会话
  const { data: recentSessions, isLoading: sessionsLoading } = useQuery(
    'recentSessions',
    async () => {
      const response = await request.get('/collection/sessions', {
        params: { page: 1, limit: 5, sortBy: 'startTime', sortOrder: 'desc' },
      });
      return response.data?.sessions || [];
    }
  );

  // 趋势图配置
  const trendChartOption = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['课堂数', '生成内容', '报告数'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '课堂数',
        type: 'line',
        data: [12, 15, 10, 18, 22, 8, 5],
        smooth: true,
        itemStyle: { color: '#1890ff' },
      },
      {
        name: '生成内容',
        type: 'line',
        data: [8, 12, 14, 15, 18, 6, 4],
        smooth: true,
        itemStyle: { color: '#52c41a' },
      },
      {
        name: '报告数',
        type: 'line',
        data: [10, 13, 11, 16, 20, 7, 5],
        smooth: true,
        itemStyle: { color: '#faad14' },
      },
    ],
  };

  // 格式化时长
  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}小时${mins}分钟`;
    if (mins > 0) return `${mins}分钟${secs}秒`;
    return `${secs}秒`;
  };

  // 获取状态标签
  const getStatusTag = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.RECORDING:
        return <Tag color="processing">录制中</Tag>;
      case SessionStatus.PROCESSING:
        return <Tag color="processing">处理中</Tag>;
      case SessionStatus.COMPLETED:
        return <Tag color="success">已完成</Tag>;
      case SessionStatus.FAILED:
        return <Tag color="error">失败</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
      width: 150,
    },
    {
      title: '班级',
      dataIndex: 'className',
      key: 'className',
      width: 120,
    },
    {
      title: '科目',
      dataIndex: 'subject',
      key: 'subject',
      width: 80,
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (duration: number) => duration ? formatDuration(duration) : '-',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 160,
      render: (time: Date) => new Date(time).toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: SessionStatus) => getStatusTag(status),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: ClassSession) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/m1/transcript/${record.id}`)}
          >
            查看文字稿
          </Button>
          <Button
            type="link"
            size="small"
            icon={<BarChartOutlined />}
            onClick={() => navigate(`/m1/report/${record.id}`)}
          >
            报告
          </Button>
        </Space>
      ),
    },
  ];

  // 功能分布饼图
  const featureChartOption = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '使用频次',
        type: 'pie',
        radius: '60%',
        data: [
          { value: 45, name: '课堂采集' },
          { value: 30, name: 'PPT生成' },
          { value: 25, name: '作业生成' },
          { value: 20, name: '数据看板' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return (
    <div className="page-container dashboard">
      {/* 欢迎区域 */}
      <div className="page-header">
        <h1 className="page-title">工作台</h1>
        <p className="page-description">欢迎回来，查看您的教学数据概览</p>
      </div>

      {/* 核心指标卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="本周课堂数"
              value={28}
              prefix={<AudioOutlined />}
              suffix={
                <span className="trend-up">
                  <ArrowUpOutlined /> 12%
                </span>
              }
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="生成内容数"
              value={64}
              prefix={<FileTextOutlined />}
              suffix={
                <span className="trend-up">
                  <ArrowUpOutlined /> 8%
                </span>
              }
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="班级报告数"
              value={18}
              prefix={<FormOutlined />}
              suffix={
                <span className="trend-down">
                  <ArrowDownOutlined /> 3%
                </span>
              }
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="平均教学效能"
              value={87.5}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
            />
            <Progress percent={87.5} showInfo={false} strokeColor="#722ed1" />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="本周使用趋势" bordered={false}>
            <ReactECharts option={trendChartOption} style={{ height: 300 }} />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="功能使用分布" bordered={false}>
            <ReactECharts option={featureChartOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      {/* 快捷操作和最近活动 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="快捷操作" bordered={false}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Button
                type="primary"
                size="large"
                block
                icon={<AudioOutlined />}
                onClick={() => navigate('/m1/recorder')}
              >
                开始课堂采集
              </Button>
              <Button
                size="large"
                block
                icon={<FileTextOutlined />}
                onClick={() => navigate('/m2/ppt-generator')}
              >
                生成PPT教案
              </Button>
              <Button
                size="large"
                block
                icon={<FormOutlined />}
                onClick={() => navigate('/m2/homework-generator')}
              >
                生成差异化作业
              </Button>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="最近活动" bordered={false}>
            <Timeline
              items={[
                {
                  dot: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                  children: (
                    <>
                      <p className="timeline-title">完成课堂采集</p>
                      <p className="timeline-desc">高一（3）班 - 语文</p>
                      <p className="timeline-time">2小时前</p>
                    </>
                  ),
                },
                {
                  dot: <FileTextOutlined style={{ color: '#1890ff' }} />,
                  children: (
                    <>
                      <p className="timeline-title">生成PPT教案</p>
                      <p className="timeline-desc">主题：《红楼梦》人物分析</p>
                      <p className="timeline-time">5小时前</p>
                    </>
                  ),
                },
                {
                  dot: <FormOutlined style={{ color: '#faad14' }} />,
                  children: (
                    <>
                      <p className="timeline-title">生成作业题集</p>
                      <p className="timeline-desc">三层难度共30道题</p>
                      <p className="timeline-time">昨天</p>
                    </>
                  ),
                },
                {
                  dot: <ClockCircleOutlined style={{ color: '#8c8c8c' }} />,
                  children: (
                    <>
                      <p className="timeline-title">查看学习力雷达</p>
                      <p className="timeline-desc">高一（3）班整体分析</p>
                      <p className="timeline-time">2天前</p>
                    </>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* 最近的录音记录 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card
            title="最近的录音记录"
            bordered={false}
            extra={
              <Button type="link" onClick={() => navigate('/m1/sessions')}>
                查看全部
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={recentSessions}
              loading={sessionsLoading}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
      </Row>

      {/* M1/M2/M3 阶段进度 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="系统能力阶段" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <div className="stage-card">
                  <div className="stage-header">
                    <h3>M1 - 数据闭环</h3>
                    <span className="stage-status completed">已上线</span>
                  </div>
                  <Progress percent={100} status="success" />
                  <ul className="stage-features">
                    <li>✓ 课堂采集器</li>
                    <li>✓ 指标库 V1</li>
                    <li>✓ 基础报告生成</li>
                  </ul>
                </div>
              </Col>

              <Col xs={24} md={8}>
                <div className="stage-card">
                  <div className="stage-header">
                    <h3>M2 - 教学增效</h3>
                    <span className="stage-status active">进行中</span>
                  </div>
                  <Progress percent={75} status="active" />
                  <ul className="stage-features">
                    <li>✓ PPT生成器</li>
                    <li>✓ 作业生成器</li>
                    <li>⏳ 学习力雷达优化中</li>
                  </ul>
                </div>
              </Col>

              <Col xs={24} md={8}>
                <div className="stage-card">
                  <div className="stage-header">
                    <h3>M3 - 组织赋能</h3>
                    <span className="stage-status pending">规划中</span>
                  </div>
                  <Progress percent={30} />
                  <ul className="stage-features">
                    <li>⏳ 校级看板</li>
                    <li>⏳ 合规审计</li>
                    <li>⏳ 资源库建设</li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
