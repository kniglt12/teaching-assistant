import { Card, List, Tag } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const ResourceLibrary = () => {
  const data = [
    { title: '优质导入话术库', type: '话术模板', count: 45 },
    { title: '本地化情境素材', type: '素材', count: 128 },
    { title: '指标解释规则', type: '规则库', count: 32 },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">资源库</h1>
        <p className="page-description">校本资源与知识库</p>
      </div>

      <Card className="card-container">
        <List
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<FileTextOutlined style={{ fontSize: 24 }} />}
                title={item.title}
                description={<Tag>{item.type}</Tag>}
              />
              <div>{item.count} 项</div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default ResourceLibrary;
