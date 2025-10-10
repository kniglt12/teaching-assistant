import { useParams } from 'react-router-dom';
import { Card } from 'antd';
import ReactECharts from 'echarts-for-react';

const LearningRadar = () => {
  const { classId } = useParams();

  const radarOption = {
    title: { text: '班级学习力雷达' },
    radar: {
      indicator: [
        { name: '知识掌握', max: 100 },
        { name: '学习主动性', max: 100 },
        { name: '思维能力', max: 100 },
        { name: '协作能力', max: 100 },
        { name: '创新能力', max: 100 },
      ],
    },
    series: [
      {
        type: 'radar',
        data: [{ value: [82, 75, 78, 85, 72], name: '班级平均' }],
      },
    ],
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">学习力雷达</h1>
        <p className="page-description">班级ID: {classId}</p>
      </div>

      <Card className="card-container">
        <ReactECharts option={radarOption} style={{ height: 500 }} />
      </Card>
    </div>
  );
};

export default LearningRadar;
