import { Card, Form, Input, Select, Button } from 'antd';
import { FormOutlined } from '@ant-design/icons';

const HomeworkGenerator = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">差异化作业生成器</h1>
        <p className="page-description">基础/提升/拓展三层难度</p>
      </div>

      <Card className="card-container">
        <Form layout="vertical" size="large">
          <Form.Item label="知识点" required>
            <Input placeholder="例如：一次函数的图像与性质" />
          </Form.Item>
          <Form.Item label="科目" required>
            <Select placeholder="选择科目">
              <Select.Option value="math">数学</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="题目数量" required>
            <Select placeholder="选择数量">
              <Select.Option value="10">10题</Select.Option>
              <Select.Option value="20">20题</Select.Option>
              <Select.Option value="30">30题</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<FormOutlined />} size="large" block>
              生成作业
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default HomeworkGenerator;
