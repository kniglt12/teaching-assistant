import { Card, Table, Tag, Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const MetricsLibrary = () => {
  const columns = [
    {
      title: '指标名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color={category === 'pre_class' ? 'blue' : category === 'in_class' ? 'green' : 'orange'}>
          {category === 'pre_class' ? '课前' : category === 'in_class' ? '课中' : '课后'}
        </Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  const data = [
    {
      key: '1',
      name: '师生互动频次',
      category: 'in_class',
      description: '课堂中师生互动的总次数',
    },
    {
      key: '2',
      name: '学生参与度',
      category: 'in_class',
      description: '学生主动参与课堂活动的比例',
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">指标库 V1</h1>
        <p className="page-description">课前/课中/课后核心指标与口径表</p>
      </div>

      <Card className="card-container">
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <Input
            placeholder="搜索指标"
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
          <Select placeholder="选择类别" style={{ width: 150 }}>
            <Select.Option value="all">全部</Select.Option>
            <Select.Option value="pre_class">课前</Select.Option>
            <Select.Option value="in_class">课中</Select.Option>
            <Select.Option value="post_class">课后</Select.Option>
          </Select>
        </div>

        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};

export default MetricsLibrary;
