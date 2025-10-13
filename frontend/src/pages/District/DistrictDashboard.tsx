import { Row, Col, Card, Statistic, Button, Table, Tag, Tabs, Alert, Badge } from 'antd';
import {
  BankOutlined,
  TeamOutlined,
  UserOutlined,
  RiseOutlined,
  TrophyOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  FundOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import './DistrictDashboard.css';

const DistrictDashboard = () => {
  const navigate = useNavigate();

  // 多校对比数据
  const schoolComparisonData = [
    {
      key: '1',
      schoolName: '第一中学',
      teachingQuality: 92,
      studentEngagement: 90,
      teacherParticipation: 95,
      overallScore: 92,
      trend: 'improving',
      ranking: 1,
    },
    {
      key: '2',
      schoolName: '第二中学',
      teachingQuality: 88,
      studentEngagement: 85,
      teacherParticipation: 90,
      overallScore: 88,
      trend: 'stable',
      ranking: 2,
    },
    {
      key: '3',
      schoolName: '第三中学',
      teachingQuality: 75,
      studentEngagement: 72,
      teacherParticipation: 78,
      overallScore: 75,
      trend: 'declining',
      ranking: 3,
    },
  ];

  const schoolComparisonColumns = [
    {
      title: '排名',
      dataIndex: 'ranking',
      key: 'ranking',
      render: (rank: number) => (
        <Badge
          count={rank}
          style={{
            backgroundColor: rank === 1 ? '#faad14' : rank === 2 ? '#d9d9d9' : '#d46b08',
          }}
        />
      ),
    },
    {
      title: '学校',
      dataIndex: 'schoolName',
      key: 'schoolName',
    },
    {
      title: '教学质量',
      dataIndex: 'teachingQuality',
      key: 'teachingQuality',
      sorter: (a: any, b: any) => a.teachingQuality - b.teachingQuality,
    },
    {
      title: '学生投入度',
      dataIndex: 'studentEngagement',
      key: 'studentEngagement',
    },
    {
      title: '教师参与率',
      dataIndex: 'teacherParticipation',
      key: 'teacherParticipation',
    },
    {
      title: '综合得分',
      dataIndex: 'overallScore',
      key: 'overallScore',
      render: (score: number) => <span style={{ fontWeight: 'bold', fontSize: 16 }}>{score}</span>,
    },
    {
      title: '趋势',
      dataIndex: 'trend',
      key: 'trend',
      render: (trend: string) => {
        const config = {
          improving: { text: '进步中', color: 'success', icon: <ArrowUpOutlined /> },
          stable: { text: '稳定', color: 'default', icon: null },
          declining: { text: '下降', color: 'error', icon: <ArrowDownOutlined /> },
        };
        const c = config[trend as keyof typeof config];
        return (
          <Tag color={c.color}>
            {c.icon} {c.text}
          </Tag>
        );
      },
    },
  ];

  // 薄弱校数据
  const weakSchoolsData = [
    {
      key: '1',
      schoolName: '第三中学',
      weaknessAreas: ['教师参与率低', '学生投入度不足'],
      riskLevel: 'high',
      priorityScore: 85,
    },
    {
      key: '2',
      schoolName: '第五中学',
      weaknessAreas: ['资源利用率低'],
      riskLevel: 'medium',
      priorityScore: 65,
    },
  ];

  const weakSchoolsColumns = [
    {
      title: '学校',
      dataIndex: 'schoolName',
      key: 'schoolName',
    },
    {
      title: '薄弱环节',
      dataIndex: 'weaknessAreas',
      key: 'weaknessAreas',
      render: (areas: string[]) => (
        <>
          {areas.map((area, index) => (
            <Tag key={index} color="orange">
              {area}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (level: string) => {
        const config = {
          high: { text: '高', color: 'red' },
          medium: { text: '中', color: 'orange' },
          low: { text: '低', color: 'blue' },
        };
        const c = config[level as keyof typeof config];
        return <Tag color={c.color}>{c.text}</Tag>;
      },
    },
    {
      title: '优先级得分',
      dataIndex: 'priorityScore',
      key: 'priorityScore',
      sorter: (a: any, b: any) => a.priorityScore - b.priorityScore,
    },
  ];

  // 多校对比雷达图
  const schoolRadarOption = {
    tooltip: {},
    legend: {
      data: ['第一中学', '第二中学', '第三中学'],
    },
    radar: {
      indicator: [
        { name: '教学质量', max: 100 },
        { name: '学生投入度', max: 100 },
        { name: '教师参与率', max: 100 },
        { name: '资源利用率', max: 100 },
        { name: '创新水平', max: 100 },
      ],
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [92, 90, 95, 88, 85],
            name: '第一中学',
          },
          {
            value: [88, 85, 90, 82, 80],
            name: '第二中学',
          },
          {
            value: [75, 72, 78, 70, 68],
            name: '第三中学',
          },
        ],
      },
    ],
  };

  // 资源投放数据柱状图
  const resourceAllocationOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['培训资源', '设备资源', '内容资源', '技术支持'],
    },
    xAxis: {
      type: 'category',
      data: ['第一中学', '第二中学', '第三中学', '第四中学', '第五中学'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '培训资源',
        type: 'bar',
        stack: 'total',
        data: [20, 25, 35, 30, 32],
      },
      {
        name: '设备资源',
        type: 'bar',
        stack: 'total',
        data: [15, 20, 30, 25, 28],
      },
      {
        name: '内容资源',
        type: 'bar',
        stack: 'total',
        data: [25, 30, 40, 35, 38],
      },
      {
        name: '技术支持',
        type: 'bar',
        stack: 'total',
        data: [10, 15, 25, 20, 22],
      },
    ],
  };

  return (
    <div className="page-container district-dashboard">
      {/* 页面头部 */}
      <div className="page-header">
        <h1 className="page-title">区域端治理视图</h1>
        <p className="page-description">多校对比、薄弱校识别、资源精准投放</p>
        <Button onClick={() => navigate('/')} style={{ position: 'absolute', right: 24, top: 24 }}>
          返回首页
        </Button>
      </div>

      {/* 核心指标 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="区域学校总数"
              value={12}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="区域教师总数"
              value={580}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="区域学生总数"
              value={8520}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="平台使用率"
              value={85}
              suffix="%"
              prefix={<RiseOutlined />}
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
                <TrophyOutlined />
                多校对比
              </span>
            ),
            children: (
              <>
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <Card title="学校综合排名与对比" bordered={false}>
                      <Table
                        dataSource={schoolComparisonData}
                        columns={schoolComparisonColumns}
                        pagination={false}
                      />
                    </Card>
                  </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                  <Col xs={24}>
                    <Card title="学校多维度能力对比" bordered={false}>
                      <ReactECharts option={schoolRadarOption} style={{ height: 400 }} />
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
                <WarningOutlined />
                薄弱校识别
              </span>
            ),
            children: (
              <>
                <Alert
                  message="识别标准"
                  description="综合得分低于75分或单项指标低于70分的学校被识别为需要重点关注"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <Card title="薄弱校列表" bordered={false}>
                      <Table
                        dataSource={weakSchoolsData}
                        columns={weakSchoolsColumns}
                        pagination={false}
                      />
                    </Card>
                  </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                  <Col xs={24}>
                    <Card title="改进建议" bordered={false}>
                      <div style={{ padding: 16 }}>
                        <h4>
                          <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                          第三中学改进方案
                        </h4>
                        <ul style={{ paddingLeft: 20 }}>
                          <li>优先级：高 - 加强教师培训,提升教师参与积极性</li>
                          <li>优先级：高 - 开展学生激励活动,提高学生投入度</li>
                          <li>优先级：中 - 引入优秀教学案例,学习先进经验</li>
                        </ul>
                        <h4 style={{ marginTop: 24 }}>
                          <CheckCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                          第五中学改进方案
                        </h4>
                        <ul style={{ paddingLeft: 20 }}>
                          <li>优先级：中 - 优化资源配置,提高设备使用率</li>
                          <li>优先级：中 - 加强技术支持,解决使用障碍</li>
                        </ul>
                      </div>
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
                <FundOutlined />
                资源精准投放
              </span>
            ),
            children: (
              <>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Card title="本期资源预算" bordered={false}>
                      <Statistic
                        title="总预算"
                        value={500000}
                        precision={0}
                        valueStyle={{ color: '#3f8600' }}
                        prefix="¥"
                        suffix="元"
                      />
                      <Statistic
                        title="已分配"
                        value={380000}
                        precision={0}
                        valueStyle={{ color: '#1890ff' }}
                        prefix="¥"
                        suffix="元"
                        style={{ marginTop: 16 }}
                      />
                      <Statistic
                        title="分配率"
                        value={76}
                        precision={0}
                        valueStyle={{ color: '#cf1322' }}
                        suffix="%"
                        style={{ marginTop: 16 }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title="投放优先级" bordered={false}>
                      <div style={{ padding: '16px 0' }}>
                        <div style={{ marginBottom: 16 }}>
                          <Tag color="red">高优先级</Tag>
                          <span>薄弱校重点支持 - 40%</span>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <Tag color="orange">中优先级</Tag>
                          <span>普通校均衡发展 - 35%</span>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <Tag color="blue">低优先级</Tag>
                          <span>优质校创新试点 - 25%</span>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                  <Col xs={24}>
                    <Card title="各校资源分配情况" bordered={false}>
                      <ReactECharts option={resourceAllocationOption} style={{ height: 350 }} />
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

export default DistrictDashboard;
