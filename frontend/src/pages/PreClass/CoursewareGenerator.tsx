import { useState } from 'react';
import { Card, Form, Input, Select, Button, Steps, Row, Col, Typography, Space, Divider, message } from 'antd';
import { FileTextOutlined, EditOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import './PreClass.css';

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

interface CoursewareData {
  title: string;
  grade: string;
  unit: string;
  topic: string;
  objectives: string;
  keyPoints: string;
  difficulties: string;
}

const CoursewareGenerator = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [coursewareData, setCoursewareData] = useState<CoursewareData | null>(null);

  const handleGenerate = async (values: CoursewareData) => {
    setLoading(true);
    setCoursewareData(values);

    // 模拟生成过程
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
      setCurrentStep(1);
      message.success('课件框架生成成功！');
    }, 2000);
  };

  const handleDownload = () => {
    message.success('课件已下载到本地');
  };

  const steps = [
    {
      title: '填写基本信息',
      icon: <FileTextOutlined />,
    },
    {
      title: '预览与编辑',
      icon: <EditOutlined />,
    },
    {
      title: '导出使用',
      icon: <DownloadOutlined />,
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <Title level={2}>课件框架一键生成</Title>
        <Paragraph>自动生成包含PPT结构、板书要点的可编辑草案，保留充分的个性化设计空间</Paragraph>
      </div>

      <Card>
        <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />

        {currentStep === 0 && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleGenerate}
            initialValues={{
              grade: '八年级',
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="课程标题"
                  name="title"
                  rules={[{ required: true, message: '请输入课程标题' }]}
                >
                  <Input placeholder="例如：公民的基本权利与义务" size="large" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="年级"
                  name="grade"
                  rules={[{ required: true, message: '请选择年级' }]}
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
                  label="单元"
                  name="unit"
                  rules={[{ required: true, message: '请输入单元' }]}
                >
                  <Input placeholder="例如：第一单元" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="教学主题"
              name="topic"
              rules={[{ required: true, message: '请输入教学主题' }]}
            >
              <TextArea
                placeholder="简要描述本课的核心主题和教学方向"
                rows={3}
              />
            </Form.Item>

            <Form.Item
              label="教学目标"
              name="objectives"
              rules={[{ required: true, message: '请输入教学目标' }]}
            >
              <TextArea
                placeholder="例如：&#10;1. 理解权利与义务的关系&#10;2. 能够在生活中正确行使权利&#10;3. 培养法治意识和责任意识"
                rows={4}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="教学重点"
                  name="keyPoints"
                  rules={[{ required: true, message: '请输入教学重点' }]}
                >
                  <TextArea
                    placeholder="本课需要重点讲解的内容"
                    rows={3}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="教学难点"
                  name="difficulties"
                  rules={[{ required: true, message: '请输入教学难点' }]}
                >
                  <TextArea
                    placeholder="学生较难理解或容易混淆的内容"
                    rows={3}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" size="large" loading={loading} icon={<FileTextOutlined />}>
                  智能生成课件框架
                </Button>
                <Button size="large" onClick={() => form.resetFields()}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}

        {currentStep === 1 && generated && coursewareData && (
          <div className="courseware-preview">
            <Card title="课件框架预览" extra={<Button icon={<EditOutlined />}>编辑</Button>}>
              <Title level={4}>{coursewareData.title}</Title>
              <Text type="secondary">{coursewareData.grade} | {coursewareData.unit}</Text>

              <Divider />

              <div className="courseware-section">
                <Title level={5}>一、教学目标</Title>
                <Paragraph style={{ whiteSpace: 'pre-line' }}>{coursewareData.objectives}</Paragraph>
              </div>

              <div className="courseware-section">
                <Title level={5}>二、教学重难点</Title>
                <Row gutter={16}>
                  <Col span={12}>
                    <Card size="small" title="重点" bordered={false} style={{ background: '#e6f7ff' }}>
                      <Paragraph style={{ whiteSpace: 'pre-line' }}>{coursewareData.keyPoints}</Paragraph>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" title="难点" bordered={false} style={{ background: '#fff7e6' }}>
                      <Paragraph style={{ whiteSpace: 'pre-line' }}>{coursewareData.difficulties}</Paragraph>
                    </Card>
                  </Col>
                </Row>
              </div>

              <div className="courseware-section">
                <Title level={5}>三、PPT结构建议</Title>
                <ol className="ppt-structure">
                  <li>
                    <strong>导入环节（3-5分钟）</strong>
                    <ul>
                      <li>生活情境导入</li>
                      <li>提出核心问题</li>
                    </ul>
                  </li>
                  <li>
                    <strong>新课讲授（20-25分钟）</strong>
                    <ul>
                      <li>知识点1：权利的含义与分类</li>
                      <li>知识点2：义务的含义与要求</li>
                      <li>知识点3：权利与义务的关系</li>
                      <li>案例分析与讨论</li>
                    </ul>
                  </li>
                  <li>
                    <strong>巩固练习（8-10分钟）</strong>
                    <ul>
                      <li>情境题练习</li>
                      <li>小组讨论</li>
                    </ul>
                  </li>
                  <li>
                    <strong>课堂小结（5分钟）</strong>
                    <ul>
                      <li>知识框架梳理</li>
                      <li>布置作业</li>
                    </ul>
                  </li>
                </ol>
              </div>

              <div className="courseware-section">
                <Title level={5}>四、板书要点</Title>
                <Card style={{ background: '#f5f5f5' }}>
                  <pre className="board-notes">
{`${coursewareData.title}

一、权利
    1. 含义
    2. 分类
    3. 行使原则

二、义务
    1. 含义
    2. 类型
    3. 履行要求

三、权利与义务的关系
    • 统一性
    • 相互依存
    • 不可分离`}
                  </pre>
                </Card>
              </div>

              <Divider />

              <Space>
                <Button type="primary" size="large" icon={<DownloadOutlined />} onClick={handleDownload}>
                  导出PPT
                </Button>
                <Button size="large" icon={<EyeOutlined />}>
                  全屏预览
                </Button>
                <Button size="large" onClick={() => setCurrentStep(0)}>
                  重新生成
                </Button>
              </Space>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CoursewareGenerator;
