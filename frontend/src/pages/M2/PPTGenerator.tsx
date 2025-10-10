import { Card, Form, Input, Select, Button, Steps } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const PPTGenerator = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">情境导入生成器</h1>
        <p className="page-description">自动生成PPT与教案底稿</p>
      </div>

      <Card className="card-container">
        <Steps
          current={0}
          items={[
            { title: '填写主题' },
            { title: '选择模板' },
            { title: '生成内容' },
            { title: '编辑下载' },
          ]}
          style={{ marginBottom: 32 }}
        />

        <Form layout="vertical" size="large">
          <Form.Item label="课程主题" required>
            <Input placeholder="例如：《红楼梦》人物分析" />
          </Form.Item>
          <Form.Item label="科目" required>
            <Select placeholder="选择科目">
              <Select.Option value="chinese">语文</Select.Option>
              <Select.Option value="math">数学</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="年级" required>
            <Select placeholder="选择年级">
              <Select.Option value="grade1">高一</Select.Option>
              <Select.Option value="grade2">高二</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<FileTextOutlined />} size="large" block>
              开始生成
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PPTGenerator;
