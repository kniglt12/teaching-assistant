import { Row, Col, Card, Statistic, Button, Table, Progress, Tabs, Tag } from 'antd';
import {
  TeamOutlined,
  BookOutlined,
  RiseOutlined,
  TrophyOutlined,
  FileTextOutlined,
  StarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SmileOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import './SchoolDashboard.css';

const SchoolDashboard = () => {
  const navigate = useNavigate();

  // 跨班级对比数据
  const classComparisonData = [
    {
      key: '1',
      className: '八年级(1)班',
      teacher: '张老师',
      avgScore: 92,
      participation: 95,
      improvement: 8,
    },
    {
      key: '2',
      className: '八年级(2)班',
      teacher: '李老师',
      avgScore: 88,
      participation: 90,
      improvement: 5,
    },
    {
      key: '3',
      className: '八年级(3)班',
      teacher: '王老师',
      avgScore: 85,
      participation: 87,
      improvement: -2,
    },
  ];

  const classComparisonColumns = [
    {
      title: '班级',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: '教师',
      dataIndex: 'teacher',
      key: 'teacher',
    },
    {
      title: '平均分',
      dataIndex: 'avgScore',
      key: 'avgScore',
      sorter: (a: any, b: any) => a.avgScore - b.avgScore,
      render: (score: number) => <span style={{ fontWeight: 'bold' }}>{score}</span>,
    },
    {
      title: '参与度',
      dataIndex: 'participation',
      key: 'participation',
      render: (rate: number) => <Progress percent={rate} size="small" />,
    },
    {
      title: '进步率',
      dataIndex: 'improvement',
      key: 'improvement',
      render: (rate: number) => (
        <span style={{ color: rate > 0 ? '#52c41a' : rate < 0 ? '#ff4d4f' : '#8c8c8c' }}>
          {rate > 0 ? <ArrowUpOutlined /> : rate < 0 ? <ArrowDownOutlined /> : null}
          {Math.abs(rate)}%
        </span>
      ),
    },
  ];

  // 跨学期趋势图
  const semesterTrendOption = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['参与度', '互动质量', '学生投入度', '教学有效性'],
    },
    xAxis: {
      type: 'category',
      data: ['2023秋', '2024春', '2024秋'],
    },
    yAxis: {
      type: 'value',
      max: 100,
    },
    series: [
      {
        name: '参与度',
        type: 'line',
        data: [75, 82, 90],
        smooth: true,
      },
      {
        name: '互动质量',
        type: 'line',
        data: [70, 78, 85],
        smooth: true,
      },
      {
        name: '学生投入度',
        type: 'line',
        data: [68, 75, 83],
        smooth: true,
      },
      {
        name: '教学有效性',
        type: 'line',
        data: [72, 80, 88],
        smooth: true,
      },
    ],
  };

  // 优秀做法数据
  const bestPracticesData = [
    {
      key: '1',
      title: '情境教学法在权利义务课中的应用',
      teacher: '张老师',
      date: '2024-10-05',
      rating: 4.8,
      usage: 25,
    },
    {
      key: '2',
      title: '小组讨论式教学提升课堂参与度',
      teacher: '李老师',
      date: '2024-10-03',
      rating: 4.6,
      usage: 18,
    },
    {
      key: '3',
      title: '时事热点融入教学的创新尝试',
      teacher: '王老师',
      date: '2024-09-28',
      rating: 4.5,
      usage: 22,
    },
  ];

  const practicesColumns = [
    {
      title: '优秀做法',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '教师',
      dataIndex: 'teacher',
      key: 'teacher',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <span>
          <StarOutlined style={{ color: '#faad14' }} /> {rating}
        </span>
      ),
    },
    {
      title: '被复用',
      dataIndex: 'usage',
      key: 'usage',
      render: (usage: number) => <Tag color="blue">{usage}次</Tag>,
    },
  ];

  // 德育成效雷达图
  const moralEducationRadarOption = {
    tooltip: {},
    radar: {
      indicator: [
        { name: '价值观认同', max: 100 },
        { name: '道德实践', max: 100 },
        { name: '社会责任', max: 100 },
        { name: '法治意识', max: 100 },
        { name: '公民素养', max: 100 },
      ],
    },
    series: [
      {
        name: '德育成效',
        type: 'radar',
        data: [
          {
            value: [88, 85, 90, 82, 87],
            name: '2024秋季学期',
          },
          {
            value: [78, 75, 82, 75, 80],
            name: '2024春季学期',
          },
        ],
      },
    ],
  };

  return (
    <div className="page-container school-dashboard">
      {/* 页面头部 */}
      <div className="page-header">
        <h1 className="page-title">学校端管理看板</h1>
        <p className="page-description">跨班级、跨学期教学质量追踪与德育成效评估</p>
        <Button onClick={() => navigate('/')} style={{ position: 'absolute', right: 24, top: 24 }}>
          返回首页
        </Button>
      </div>

      {/* 核心指标 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="教师总数"
              value={45}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="班级总数"
              value={36}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="本学期课堂数"
              value={1280}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="平台活跃度"
              value={92}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 功能模块 */}
      <Tabs
        defaultActiveKey="1"
        style={{ marginTop: 24 }}
        items={[
          {
            key: '1',
            label: (
              <span>
                <BookOutlined />
                校级数据看板
              </span>
            ),
            children: (
              <>
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <Card title="跨班级教学质量对比" bordered={false}>
                      <Table
                        dataSource={classComparisonData}
                        columns={classComparisonColumns}
                        pagination={false}
                      />
                    </Card>
                  </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                  <Col xs={24}>
                    <Card title="跨学期教学质量趋势" bordered={false}>
                      <ReactECharts option={semesterTrendOption} style={{ height: 350 }} />
                    </Card>
                  </Col>
                </Row>
              </>
            ),
          },
          {
            key: '2',
            label: (
              <span>
                <FileTextOutlined />
                教研证据包
              </span>
            ),
            children: (
              <>
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <Card title="优秀做法沉淀与复用" bordered={false}>
                      <Table
                        dataSource={bestPracticesData}
                        columns={practicesColumns}
                        pagination={false}
                      />
                    </Card>
                  </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                  <Col xs={24} md={12}>
                    <Card title="本月教研活动" bordered={false}>
                      <ul style={{ paddingLeft: 20 }}>
                        <li>情境教学研讨会 - 10月15日</li>
                        <li>跨学科融合教学交流 - 10月20日</li>
                        <li>学生评价体系研讨 - 10月25日</li>
                      </ul>
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title="资源复用统计" bordered={false}>
                      <Statistic
                        title="本月被复用的教学资源"
                        value={156}
                        suffix="个"
                        prefix={<RiseOutlined />}
                      />
                      <Statistic
                        title="平均复用率"
                        value={3.2}
                        suffix="次/资源"
                        style={{ marginTop: 16 }}
                      />
                    </Card>
                  </Col>
                </Row>
              </>
            ),
          },
          {
            key: '3',
            label: (
              <span>
                <HeartOutlined />
                德育成效可视化
              </span>
            ),
            children: (
              <>
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card title="德育五维度分析" bordered={false}>
                      <ReactECharts option={moralEducationRadarOption} style={{ height: 400 }} />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="大思政课建设评估" bordered={false}>
                      <div style={{ padding: '20px 0' }}>
                        <div style={{ marginBottom: 24 }}>
                          <div style={{ marginBottom: 8 }}>课程建设</div>
                          <Progress percent={88} strokeColor="#52c41a" />
                        </div>
                        <div style={{ marginBottom: 24 }}>
                          <div style={{ marginBottom: 8 }}>实践活动</div>
                          <Progress percent={85} strokeColor="#1890ff" />
                        </div>
                        <div style={{ marginBottom: 24 }}>
                          <div style={{ marginBottom: 8 }}>资源整合</div>
                          <Progress percent={90} strokeColor="#722ed1" />
                        </div>
                        <div>
                          <div style={{ marginBottom: 8 }}>整体成效</div>
                          <Progress percent={87} strokeColor="#faad14" />
                        </div>
                      </div>
                      <div style={{ marginTop: 24, padding: 16, background: '#f0f5ff', borderRadius: 8 }}>
                        <SmileOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>优秀</span>
                        <p style={{ marginTop: 8, marginBottom: 0, color: '#595959' }}>
                          学校德育工作成效显著,建议继续深化实践活动,加强家校协同育人机制。
                        </p>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default SchoolDashboard;
