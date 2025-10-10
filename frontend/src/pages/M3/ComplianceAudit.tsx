import { Card, Table, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const ComplianceAudit = () => {
  const columns = [
    { title: '检查项', dataIndex: 'item', key: 'item' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) =>
        status === 'passed' ? (
          <Tag icon={<CheckCircleOutlined />} color="success">通过</Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">未通过</Tag>
        ),
    },
    { title: '检查时间', dataIndex: 'time', key: 'time' },
  ];

  const data = [
    { key: '1', item: '数据加密', status: 'passed', time: '2025-10-10 10:00' },
    { key: '2', item: '访问控制', status: 'passed', time: '2025-10-10 10:05' },
    { key: '3', item: '隐私保护', status: 'passed', time: '2025-10-10 10:10' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">合规审计</h1>
        <p className="page-description">数据安全与合规检查</p>
      </div>

      <Card className="card-container">
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};

export default ComplianceAudit;
