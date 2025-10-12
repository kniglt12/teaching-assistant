import { useState } from 'react';
import { Card, Row, Col, Select, Table, Typography, Space, Tag, Tabs, Progress } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TabsProps } from 'antd';
import ReactECharts from 'echarts-for-react';
import './AfterClass.css';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

interface StudentRadar {
  key: string;
  name: string;
  cognitive: number;
  expression: number;
  application: number;
  engagement: number;
  average: number;
  trend: 'up' | 'down' | 'stable';
}

const LearningRadarNew = () => {
  const [selectedClass, setSelectedClass] = useState('八年级(3)班');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // 学生数据
  const studentData: StudentRadar[] = [
    {
      key: '1',
      name: '张三',
      cognitive: 88,
      expression: 92,
      application: 85,
      engagement: 95,
      average: 90,
      trend: 'up',
    },
    {
      key: '2',
      name: '李四',
      cognitive: 82,
      expression: 78,
      application: 80,
      engagement: 85,
      average: 81,
      trend: 'stable',
    },
    {
      key: '3',
      name: '王五',
      cognitive: 75,
      expression: 70,
      application: 72,
      engagement: 68,
      average: 71,
      trend: 'down',
    },
  ];

  // 班级整体雷达图
  const classRadarOption = {
    title: {
      text: '班级整体四维学情分析',
    },
    tooltip: {},
    legend: {
      data: ['班级平均', '年级平均'],
      bottom: 0,
    },
    radar: {
      indicator: [
        { name: '认知理解力', max: 100 },
        { name: '思维表达力', max: 100 },
        { name: '应用迁移力', max: 100 },
        { name: '学习投入度', max: 100 },
      ],
      splitNumber: 5,
      name: {
        textStyle: {
          fontSize: 14,
        },
      },
    },
    series: [
      {
        name: '学情对比',
        type: 'radar',
        data: [
          {
            value: [82, 78, 80, 85],
            name: '班级平均',
            areaStyle: {
              color: 'rgba(24, 144, 255, 0.3)',
            },
            itemStyle: {
              color: '#1890ff',
            },
          },
          {
            value: [78, 75, 77, 80],
            name: '年级平均',
            areaStyle: {
              color: 'rgba(82, 196, 26, 0.2)',
            },
            itemStyle: {
              color: '#52c41a',
            },
          },
        ],
      },
    ],
  };

  // 个人雷达图
  const getStudentRadarOption = (student: StudentRadar) => ({
    title: {
      text: `${student.name} - 四维学情雷达`,
    },
    tooltip: {},
    radar: {
      indicator: [
        { name: '认知理解力', max: 100 },
        { name: '思维表达力', max: 100 },
        { name: '应用迁移力', max: 100 },
        { name: '学习投入度', max: 100 },
      ],
      splitNumber: 5,
      name: {
        textStyle: {
          fontSize: 14,
        },
      },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [student.cognitive, student.expression, student.application, student.engagement],
            name: student.name,
            areaStyle: {
              color: 'rgba(24, 144, 255, 0.3)',
            },
            itemStyle: {
              color: '#1890ff',
            },
          },
        ],
      },
    ],
  });

  // 四维详细说明
  const dimensionDetails = [
    {
      name: '认知理解力',
      color: '#1890ff',
      description:
        '依据课堂即时测答与概念辨析表现、作业客观题与要点题正确率、考试各知识点覆盖与易错点分布，反映学生对核心知识与关键概念的理解深度与稳定性',
      metrics: ['课堂测答正确率', '概念辨析准确度', '作业客观题得分', '考试知识点覆盖率'],
    },
    {
      name: '思维表达力',
      color: '#52c41a',
      description:
        '依据课堂发言与板演的结构化评分、作业主观题的论证连贯度与要点完整度、考试论述题在"逻辑—证据—结论"三维评分，评估学生表述的条理性与推理质量',
      metrics: ['课堂发言结构化评分', '作业论证连贯度', '考试论述题得分', '逻辑推理质量'],
    },
    {
      name: '应用迁移力',
      color: '#faad14',
      description:
        '依据课堂情境题当堂演练与案例要点提取、作业案例题与变式题得分、考试综合题与新情境题的得分率，衡量学生将所学知识迁移到新问题与真实情境中的能力',
      metrics: ['情境题演练得分', '案例要点提取', '变式题正确率', '综合题得分率'],
    },
    {
      name: '学习投入度',
      color: '#f5222d',
      description:
        '依据课堂到课与互动频次、注意力与任务完成情况指标，作业按时提交率与订正完成率，考试作答完整率、空题率与审题错误占比，综合呈现学生的学习专注与执行力度',
      metrics: ['课堂出勤率', '互动参与频次', '作业提交率', '考试完成度'],
    },
  ];

  const columns: ColumnsType<StudentRadar> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
    },
    {
      title: '认知理解力',
      dataIndex: 'cognitive',
      key: 'cognitive',
      render: (value: number) => (
        <div>
          <Progress percent={value} size="small" strokeColor="#1890ff" />
        </div>
      ),
      sorter: (a: StudentRadar, b: StudentRadar) => a.cognitive - b.cognitive,
    },
    {
      title: '思维表达力',
      dataIndex: 'expression',
      key: 'expression',
      render: (value: number) => (
        <div>
          <Progress percent={value} size="small" strokeColor="#52c41a" />
        </div>
      ),
      sorter: (a: StudentRadar, b: StudentRadar) => a.expression - b.expression,
    },
    {
      title: '应用迁移力',
      dataIndex: 'application',
      key: 'application',
      render: (value: number) => (
        <div>
          <Progress percent={value} size="small" strokeColor="#faad14" />
        </div>
      ),
      sorter: (a: StudentRadar, b: StudentRadar) => a.application - b.application,
    },
    {
      title: '学习投入度',
      dataIndex: 'engagement',
      key: 'engagement',
      render: (value: number) => (
        <div>
          <Progress percent={value} size="small" strokeColor="#f5222d" />
        </div>
      ),
      sorter: (a: StudentRadar, b: StudentRadar) => a.engagement - b.engagement,
    },
    {
      title: '综合评分',
      dataIndex: 'average',
      key: 'average',
      render: (value: number) => <Text strong>{value}</Text>,
      sorter: (a: StudentRadar, b: StudentRadar) => a.average - b.average,
    },
    {
      title: '趋势',
      dataIndex: 'trend',
      key: 'trend',
      render: (trend: string) => {
        const config = {
          up: { text: '上升', color: 'green' },
          down: { text: '下降', color: 'red' },
          stable: { text: '稳定', color: 'blue' },
        };
        const { text, color } = config[trend as keyof typeof config];
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  const tabItems: TabsProps['items'] = [
    {
      key: 'class',
      label: '班级整体',
      children: (
        <div>
          <Card>
            <ReactECharts option={classRadarOption} style={{ height: 500 }} />
          </Card>

          <Card title="四维能力说明" style={{ marginTop: 16 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {dimensionDetails.map((dim) => (
                <Card key={dim.name} size="small" style={{ borderLeft: `4px solid ${dim.color}` }}>
                  <Title level={5} style={{ color: dim.color }}>
                    {dim.name}
                  </Title>
                  <Paragraph>{dim.description}</Paragraph>
                  <Space size={4} wrap>
                    {dim.metrics.map((metric) => (
                      <Tag key={metric}>{metric}</Tag>
                    ))}
                  </Space>
                </Card>
              ))}
            </Space>
          </Card>
        </div>
      ),
    },
    {
      key: 'students',
      label: '学生明细',
      children: (
        <div>
          <Card>
            <Table
              columns={columns}
              dataSource={studentData}
              onRow={(record) => ({
                onClick: () => setSelectedStudent(record.key),
                style: { cursor: 'pointer' },
              })}
            />
          </Card>

          {selectedStudent && (
            <Card title="学生详细分析" style={{ marginTop: 16 }}>
              {(() => {
                const student = studentData.find((s) => s.key === selectedStudent);
                return student ? (
                  <div>
                    <ReactECharts option={getStudentRadarOption(student)} style={{ height: 400 }} />
                    <Row gutter={16} style={{ marginTop: 24 }}>
                      <Col span={6}>
                        <Card size="small" style={{ background: '#e6f7ff', textAlign: 'center' }}>
                          <Statistic title="认知理解力" value={student.cognitive} suffix="分" />
                        </Card>
                      </Col>
                      <Col span={6}>
                        <Card size="small" style={{ background: '#f6ffed', textAlign: 'center' }}>
                          <Statistic title="思维表达力" value={student.expression} suffix="分" />
                        </Card>
                      </Col>
                      <Col span={6}>
                        <Card size="small" style={{ background: '#fffbe6', textAlign: 'center' }}>
                          <Statistic title="应用迁移力" value={student.application} suffix="分" />
                        </Card>
                      </Col>
                      <Col span={6}>
                        <Card size="small" style={{ background: '#fff1f0', textAlign: 'center' }}>
                          <Statistic title="学习投入度" value={student.engagement} suffix="分" />
                        </Card>
                      </Col>
                    </Row>
                    <Card size="small" style={{ marginTop: 16 }}>
                      <Title level={5}>改进建议</Title>
                      <ul>
                        {student.cognitive < 80 && <li>加强基础概念的理解和记忆训练</li>}
                        {student.expression < 80 && <li>增加课堂发言机会，提升表达的逻辑性</li>}
                        {student.application < 80 && <li>多做情境分析题，培养知识迁移能力</li>}
                        {student.engagement < 80 && <li>关注学习态度，提高作业完成质量</li>}
                      </ul>
                    </Card>
                  </div>
                ) : null;
              })()}
            </Card>
          )}
        </div>
      ),
    },
    {
      key: 'analysis',
      label: '数据分析',
      children: (
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card title="各维度分布">
              <ReactECharts
                option={{
                  tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                      type: 'shadow',
                    },
                  },
                  legend: {
                    data: ['优秀', '良好', '及格', '待提高'],
                  },
                  xAxis: {
                    type: 'category',
                    data: ['认知理解', '思维表达', '应用迁移', '学习投入'],
                  },
                  yAxis: {
                    type: 'value',
                    name: '人数',
                  },
                  series: [
                    {
                      name: '优秀',
                      type: 'bar',
                      stack: 'total',
                      data: [12, 10, 8, 15],
                      itemStyle: { color: '#52c41a' },
                    },
                    {
                      name: '良好',
                      type: 'bar',
                      stack: 'total',
                      data: [18, 20, 22, 16],
                      itemStyle: { color: '#1890ff' },
                    },
                    {
                      name: '及格',
                      type: 'bar',
                      stack: 'total',
                      data: [10, 12, 11, 10],
                      itemStyle: { color: '#faad14' },
                    },
                    {
                      name: '待提高',
                      type: 'bar',
                      stack: 'total',
                      data: [5, 3, 4, 4],
                      itemStyle: { color: '#ff4d4f' },
                    },
                  ],
                }}
                style={{ height: 400 }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="综合能力散点分布">
              <ReactECharts
                option={{
                  tooltip: {
                    trigger: 'item',
                  },
                  xAxis: {
                    name: '理论能力',
                    nameLocation: 'middle',
                    nameGap: 30,
                  },
                  yAxis: {
                    name: '实践能力',
                    nameLocation: 'middle',
                    nameGap: 40,
                  },
                  series: [
                    {
                      type: 'scatter',
                      symbolSize: 15,
                      data: studentData.map((s) => [
                        (s.cognitive + s.expression) / 2,
                        (s.application + s.engagement) / 2,
                      ]),
                      itemStyle: {
                        color: '#1890ff',
                        opacity: 0.7,
                      },
                    },
                  ],
                }}
                style={{ height: 400 }}
              />
            </Card>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <Title level={2}>四维学情雷达图</Title>
        <Paragraph>从认知理解、思维表达、应用迁移、学习投入四个维度全面评估学生学习状况</Paragraph>
      </div>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Text strong>选择班级：</Text>
          <Select value={selectedClass} onChange={setSelectedClass} style={{ width: 200 }}>
            <Option value="八年级(1)班">八年级(1)班</Option>
            <Option value="八年级(2)班">八年级(2)班</Option>
            <Option value="八年级(3)班">八年级(3)班</Option>
          </Select>
        </Space>
        <Tabs items={tabItems} />
      </Card>
    </div>
  );
};

// 添加 Statistic 组件
const Statistic = ({ title, value, suffix }: { title: string; value: number; suffix?: string }) => (
  <div>
    <Text type="secondary" style={{ fontSize: 14 }}>
      {title}
    </Text>
    <div style={{ fontSize: 24, fontWeight: 600, color: '#262626', marginTop: 8 }}>
      {value}
      {suffix && <span style={{ fontSize: 16, marginLeft: 4 }}>{suffix}</span>}
    </div>
  </div>
);

export default LearningRadarNew;
