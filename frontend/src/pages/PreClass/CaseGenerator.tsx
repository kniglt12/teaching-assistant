import { useState } from 'react';
import { Card, Form, Input, Select, Button, Row, Col, Typography, Space, Tag, message, List } from 'antd';
import { BulbOutlined, CheckCircleOutlined, EditOutlined, CopyOutlined } from '@ant-design/icons';
import './PreClass.css';

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

interface GeneratedCase {
  id: string;
  title: string;
  scenario: string;
  questions: string[];
  tags: string[];
}

const CaseGenerator = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState<GeneratedCase[]>([]);

  const handleGenerate = async () => {
    setLoading(true);

    // 模拟AI生成
    setTimeout(() => {
      const mockCases: GeneratedCase[] = [
        {
          id: '1',
          title: '社区志愿服务中的权利与义务',
          scenario:
            '小李是一名初中生，周末经常参加社区组织的志愿服务活动。在一次敬老院服务中，他发现有些老人的基本生活权利没有得到充分保障。小李想要通过合法途径帮助这些老人，但不知道该如何行动。',
          questions: [
            '小李参加志愿服务体现了什么？',
            '老人的哪些基本权利需要得到保障？',
            '小李可以通过哪些合法途径帮助老人？',
            '这个案例如何体现权利与义务的关系？',
          ],
          tags: ['贴近生活', '价值引导', '初二上册'],
        },
        {
          id: '2',
          title: '校园生活中的民主参与',
          scenario:
            '学校准备修改校规中关于手机使用的规定，校长决定先征求学生代表的意见。班级推选小张作为代表参加座谈会，小张认真收集了同学们的建议，并在会上积极发言，最终学校采纳了部分合理建议。',
          questions: [
            '这个案例体现了什么民主权利？',
            '小张履行了哪些责任？',
            '学校的做法有什么积极意义？',
            '作为学生，我们应该如何正确行使民主权利？',
          ],
          tags: ['校园情境', '民主意识', '八年级'],
        },
      ];

      setCases(mockCases);
      setLoading(false);
      message.success('案例生成成功！');
    }, 2000);
  };

  const handleCopy = (caseItem: GeneratedCase) => {
    const text = `${caseItem.title}\n\n${caseItem.scenario}\n\n思考问题：\n${caseItem.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    message.success('案例已复制到剪贴板');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <Title level={2}>情景案例智能生成</Title>
        <Paragraph>基于权威案例库，智能生成贴近学生生活、契合学段目标与教学规范的情景化案例</Paragraph>
      </div>

      <Card>
        <Form form={form} layout="vertical" onFinish={handleGenerate}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="教学主题"
                name="topic"
                rules={[{ required: true, message: '请输入教学主题' }]}
              >
                <Input placeholder="例如：公民的基本权利" size="large" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="年级"
                name="grade"
                rules={[{ required: true, message: '请选择年级' }]}
                initialValue="八年级"
              >
                <Select size="large">
                  <Option value="七年级">七年级</Option>
                  <Option value="八年级">八年级</Option>
                  <Option value="九年级">九年级</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="生成数量"
                name="count"
                initialValue="2"
              >
                <Select size="large">
                  <Option value="1">1个</Option>
                  <Option value="2">2个</Option>
                  <Option value="3">3个</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="情境偏好"
            name="preference"
            initialValue="life"
          >
            <Select size="large" placeholder="选择案例情境类型">
              <Option value="life">校园与家庭生活</Option>
              <Option value="social">社会热点事件</Option>
              <Option value="legal">法律实务案例</Option>
              <Option value="history">历史与时事</Option>
            </Select>
          </Form.Item>

          <Form.Item label="特殊要求（选填）" name="requirements">
            <TextArea placeholder="例如：需要包含具体的法律条文、适合小组讨论等" rows={2} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" loading={loading} icon={<BulbOutlined />}>
              智能生成案例
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {cases.length > 0 && (
        <List
          dataSource={cases}
          renderItem={(caseItem) => (
            <Card
              key={caseItem.id}
              className="case-card"
              title={
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <Text strong>{caseItem.title}</Text>
                </Space>
              }
              extra={
                <Space>
                  <Button icon={<EditOutlined />} type="link">
                    编辑
                  </Button>
                  <Button icon={<CopyOutlined />} type="link" onClick={() => handleCopy(caseItem)}>
                    复制
                  </Button>
                </Space>
              }
              style={{ marginTop: 16 }}
            >
              <div className="case-content">
                <div className="case-section">
                  <Title level={5}>情境描述</Title>
                  <Paragraph>{caseItem.scenario}</Paragraph>
                </div>

                <div className="case-section">
                  <Title level={5}>思考问题</Title>
                  <ol>
                    {caseItem.questions.map((q, index) => (
                      <li key={index}>{q}</li>
                    ))}
                  </ol>
                </div>

                <Space size={4} wrap style={{ marginTop: 16 }}>
                  {caseItem.tags.map((tag) => (
                    <Tag key={tag} color="blue">
                      {tag}
                    </Tag>
                  ))}
                </Space>
              </div>
            </Card>
          )}
        />
      )}
    </div>
  );
};

export default CaseGenerator;
