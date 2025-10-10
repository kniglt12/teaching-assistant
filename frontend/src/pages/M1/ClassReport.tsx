import { useParams } from 'react-router-dom';
import { Card, Descriptions, Tag, Timeline, Row, Col } from 'antd';
import ReactECharts from 'echarts-for-react';

const ClassReport = () => {
  const { sessionId } = useParams();

  const radarOption = {
    radar: {
      indicator: [
        { name: '互动频次', max: 100 },
        { name: '参与度', max: 100 },
        { name: '问题质量', max: 100 },
        { name: '思维深度', max: 100 },
        { name: '课堂氛围', max: 100 },
      ],
    },
    series: [
      {
        type: 'radar',
        data: [{ value: [85, 78, 82, 75, 88], name: '本节课' }],
      },
    ],
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">课堂分析报告</h1>
        <p className="page-description">会话ID: {sessionId}</p>
      </div>

      <Card className="card-container" title="基本信息">
        <Descriptions bordered>
          <Descriptions.Item label="课程">《红楼梦》人物分析</Descriptions.Item>
          <Descriptions.Item label="班级">高一（3）班</Descriptions.Item>
          <Descriptions.Item label="科目">语文</Descriptions.Item>
          <Descriptions.Item label="时长">45分钟</Descriptions.Item>
          <Descriptions.Item label="日期">2025-10-10</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color="success">已完成</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="课堂指标雷达图">
            <ReactECharts option={radarOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="改进建议">
            <Timeline
              items={[
                { children: '增加小组讨论环节，提升学生参与度' },
                { children: '优化提问方式，引导学生深度思考' },
                { children: '关注后排学生，确保全员参与' },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ClassReport;
