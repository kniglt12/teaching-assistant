import { Row, Col, Card, Statistic, Timeline, Button, Space } from 'antd';
import {
  BookOutlined,
  AudioOutlined,
  RadarChartOutlined,
  FileTextOutlined,
  BulbOutlined,
  FolderOpenOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  // 本周使用趋势图
  const trendChartOption = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['课前备课', '课中记录', '课后分析'],
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
        name: '课前备课',
        type: 'line',
        data: [8, 12, 10, 14, 18, 6, 4],
        smooth: true,
        itemStyle: { color: '#1890ff' },
        areaStyle: { color: 'rgba(24, 144, 255, 0.2)' },
      },
      {
        name: '课中记录',
        type: 'line',
        data: [5, 8, 7, 9, 11, 4, 3],
        smooth: true,
        itemStyle: { color: '#52c41a' },
        areaStyle: { color: 'rgba(82, 196, 26, 0.2)' },
      },
      {
        name: '课后分析',
        type: 'line',
        data: [6, 9, 8, 10, 13, 5, 4],
        smooth: true,
        itemStyle: { color: '#faad14' },
        areaStyle: { color: 'rgba(250, 173, 20, 0.2)' },
      },
    ],
  };


  return (
    <div className="page-container dashboard">
      {/* 欢迎区域 */}
      <div className="page-header">
        <h1 className="page-title">道德与法治智能教学工作台</h1>
        <p className="page-description">欢迎回来,查看您的教学数据概览</p>
      </div>

      {/* 核心指标卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="本周备课次数"
              value={32}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="课堂记录数"
              value={18}
              prefix={<AudioOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="学情分析数"
              value={24}
              prefix={<RadarChartOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="资源库素材"
              value={156}
              prefix={<FolderOpenOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="本周使用趋势" bordered={false}>
            <ReactECharts option={trendChartOption} style={{ height: 300 }} />
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
                icon={<FileTextOutlined />}
                onClick={() => navigate('/teacher/pre-class/resource-matcher')}
              >
                资源精准匹配
              </Button>
              <Button
                size="large"
                block
                icon={<BulbOutlined />}
                onClick={() => navigate('/teacher/pre-class/case-generator')}
              >
                生成情景案例
              </Button>
              <Button
                size="large"
                block
                icon={<BarChartOutlined />}
                onClick={() => navigate('/teacher/in-class/classroom-analysis')}
              >
                课堂记录分析
              </Button>
              <Button
                size="large"
                block
                icon={<RadarChartOutlined />}
                onClick={() => navigate('/teacher/after-class/learning-radar')}
              >
                查看学情雷达
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
                      <p className="timeline-title">生成情景案例</p>
                      <p className="timeline-desc">主题：公民的基本权利与义务</p>
                      <p className="timeline-time">1小时前</p>
                    </>
                  ),
                },
                {
                  dot: <FileTextOutlined style={{ color: '#1890ff' }} />,
                  children: (
                    <>
                      <p className="timeline-title">生成课件框架</p>
                      <p className="timeline-desc">八年级下册 第一单元</p>
                      <p className="timeline-time">3小时前</p>
                    </>
                  ),
                },
                {
                  dot: <BarChartOutlined style={{ color: '#faad14' }} />,
                  children: (
                    <>
                      <p className="timeline-title">完成课堂分析</p>
                      <p className="timeline-desc">八年级(3)班 学生参与度分析</p>
                      <p className="timeline-time">昨天</p>
                    </>
                  ),
                },
                {
                  dot: <ClockCircleOutlined style={{ color: '#8c8c8c' }} />,
                  children: (
                    <>
                      <p className="timeline-title">查看学情雷达</p>
                      <p className="timeline-desc">八年级(3)班 四维能力分析</p>
                      <p className="timeline-time">2天前</p>
                    </>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* 教学模块卡片 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="道德与法治教学全流程" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <div className="stage-card" onClick={() => navigate('/teacher/pre-class/resource-matcher')} style={{ cursor: 'pointer' }}>
                  <div className="stage-header">
                    <BookOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 16 }} />
                    <h3>课前 - 智能备课</h3>
                  </div>
                  <ul className="stage-features">
                    <li>✓ 资源精准匹配</li>
                    <li>✓ 课件框架生成</li>
                    <li>✓ 情景案例生成</li>
                    <li>✓ 校本资源库</li>
                  </ul>
                </div>
              </Col>

              <Col xs={24} md={8}>
                <div className="stage-card" onClick={() => navigate('/teacher/in-class/classroom-analysis')} style={{ cursor: 'pointer' }}>
                  <div className="stage-header">
                    <AudioOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 16 }} />
                    <h3>课中 - 课堂记录</h3>
                  </div>
                  <ul className="stage-features">
                    <li>✓ 无感记录课堂</li>
                    <li>✓ 学生参与度分析</li>
                    <li>✓ 思维层级评估</li>
                    <li>✓ 互动热区识别</li>
                  </ul>
                </div>
              </Col>

              <Col xs={24} md={8}>
                <div className="stage-card" onClick={() => navigate('/teacher/after-class/learning-radar')} style={{ cursor: 'pointer' }}>
                  <div className="stage-header">
                    <RadarChartOutlined style={{ fontSize: 32, color: '#faad14', marginBottom: 16 }} />
                    <h3>课后 - 学情分析</h3>
                  </div>
                  <ul className="stage-features">
                    <li>✓ 认知理解力</li>
                    <li>✓ 思维表达力</li>
                    <li>✓ 应用迁移力</li>
                    <li>✓ 学习投入度</li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 系统特色 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card
            bordered={false}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <h2 style={{ color: 'white', marginBottom: 16 }}>道德与法治学科专属</h2>
              <p style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.9)', marginBottom: 0 }}>
                整合权威案例库、学段目标与教学规范，为情境化教学、价值观引导、思维能力培养提供精准支持
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
