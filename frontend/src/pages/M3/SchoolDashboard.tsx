import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const SchoolDashboard = () => {
  const trendOption = {
    title: { text: '校级使用趋势' },
    xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五'] },
    yAxis: { type: 'value' },
    series: [{ data: [120, 200, 150, 180, 170], type: 'line' }],
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">校级数据看板</h1>
        <p className="page-description">年级/校级参与分布与趋势</p>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card><Statistic title="教师总数" value={85} prefix={<UserOutlined />} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="学生总数" value={1250} prefix={<TeamOutlined />} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="课程总数" value={342} prefix={<BookOutlined />} /></Card>
        </Col>
      </Row>

      <Card className="card-container" style={{ marginTop: 16 }}>
        <ReactECharts option={trendOption} style={{ height: 400 }} />
      </Card>
    </div>
  );
};

export default SchoolDashboard;
