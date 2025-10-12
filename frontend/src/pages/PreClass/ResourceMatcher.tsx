import { useState } from 'react';
import { Card, Input, Button, Row, Col, Tag, List, Typography, Space, Spin, Empty, Tabs } from 'antd';
import { SearchOutlined, FileTextOutlined, QuestionCircleOutlined, PictureOutlined } from '@ant-design/icons';
import './PreClass.css';

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

interface Resource {
  id: string;
  type: 'text' | 'question' | 'slide';
  title: string;
  content: string;
  tags: string[];
  relevance: number;
}

const ResourceMatcher = () => {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Resource[]>([]);

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockResults: Resource[] = [
        {
          id: '1',
          type: 'text',
          title: '公民的基本权利与义务',
          content: '在日常生活中，我们享有宪法赋予的各项基本权利，同时也承担着相应的义务。例如，受教育既是权利也是义务...',
          tags: ['八年级下册', '第一单元', '宪法'],
          relevance: 95,
        },
        {
          id: '2',
          type: 'question',
          title: '启发问题：权利与义务的关系',
          content: '1. 你认为权利和义务之间有什么关系？\n2. 请举例说明在学校生活中你享有哪些权利？承担哪些义务？\n3. 如果只享受权利而不履行义务会怎样？',
          tags: ['启发思考', '课堂讨论'],
          relevance: 92,
        },
        {
          id: '3',
          type: 'slide',
          title: 'PPT片段：权利义务一致性',
          content: '包含核心知识点图示、案例分析框架、课堂活动设计等完整PPT内容',
          tags: ['课件素材', '可编辑'],
          relevance: 88,
        },
        {
          id: '4',
          type: 'text',
          title: '依法行使权利的案例',
          content: '小明在商场购物时发现商品存在质量问题，他通过合法途径维护自己的消费者权益...',
          tags: ['案例素材', '生活情境'],
          relevance: 85,
        },
      ];
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <FileTextOutlined style={{ color: '#1890ff' }} />;
      case 'question':
        return <QuestionCircleOutlined style={{ color: '#52c41a' }} />;
      case 'slide':
        return <PictureOutlined style={{ color: '#faad14' }} />;
      default:
        return null;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'text':
        return '情境文本';
      case 'question':
        return '启发问题';
      case 'slide':
        return '课件片段';
      default:
        return '未知';
    }
  };

  const tabItems = [
    {
      key: 'all',
      label: '全部资源',
      children: (
        <List
          dataSource={results}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button type="link" key="preview">预览</Button>,
                <Button type="primary" key="use">使用</Button>,
              ]}
            >
              <List.Item.Meta
                avatar={getTypeIcon(item.type)}
                title={
                  <Space>
                    <Text strong>{item.title}</Text>
                    <Tag color="blue">匹配度: {item.relevance}%</Tag>
                    <Tag>{getTypeName(item.type)}</Tag>
                  </Space>
                }
                description={
                  <div>
                    <Paragraph ellipsis={{ rows: 2 }}>{item.content}</Paragraph>
                    <Space size={4} wrap>
                      {item.tags.map((tag) => (
                        <Tag key={tag} color="default" style={{ fontSize: '12px' }}>
                          {tag}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ),
    },
    {
      key: 'text',
      label: '情境文本',
      children: (
        <List
          dataSource={results.filter((r) => r.type === 'text')}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button type="link" key="preview">预览</Button>,
                <Button type="primary" key="use">使用</Button>,
              ]}
            >
              <List.Item.Meta
                avatar={getTypeIcon(item.type)}
                title={
                  <Space>
                    <Text strong>{item.title}</Text>
                    <Tag color="blue">匹配度: {item.relevance}%</Tag>
                  </Space>
                }
                description={
                  <div>
                    <Paragraph ellipsis={{ rows: 2 }}>{item.content}</Paragraph>
                    <Space size={4} wrap>
                      {item.tags.map((tag) => (
                        <Tag key={tag} color="default" style={{ fontSize: '12px' }}>
                          {tag}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ),
    },
    {
      key: 'question',
      label: '启发问题',
      children: (
        <List
          dataSource={results.filter((r) => r.type === 'question')}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button type="link" key="preview">预览</Button>,
                <Button type="primary" key="use">使用</Button>,
              ]}
            >
              <List.Item.Meta
                avatar={getTypeIcon(item.type)}
                title={
                  <Space>
                    <Text strong>{item.title}</Text>
                    <Tag color="blue">匹配度: {item.relevance}%</Tag>
                  </Space>
                }
                description={
                  <div>
                    <Paragraph ellipsis={{ rows: 2 }} style={{ whiteSpace: 'pre-line' }}>
                      {item.content}
                    </Paragraph>
                    <Space size={4} wrap>
                      {item.tags.map((tag) => (
                        <Tag key={tag} color="default" style={{ fontSize: '12px' }}>
                          {tag}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ),
    },
    {
      key: 'slide',
      label: '课件片段',
      children: (
        <List
          dataSource={results.filter((r) => r.type === 'slide')}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button type="link" key="preview">预览</Button>,
                <Button type="primary" key="use">使用</Button>,
              ]}
            >
              <List.Item.Meta
                avatar={getTypeIcon(item.type)}
                title={
                  <Space>
                    <Text strong>{item.title}</Text>
                    <Tag color="blue">匹配度: {item.relevance}%</Tag>
                  </Space>
                }
                description={
                  <div>
                    <Paragraph ellipsis={{ rows: 2 }}>{item.content}</Paragraph>
                    <Space size={4} wrap>
                      {item.tags.map((tag) => (
                        <Tag key={tag} color="default" style={{ fontSize: '12px' }}>
                          {tag}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <Title level={2}>资源精准匹配</Title>
        <Paragraph>输入主题或关键词，系统自动推送匹配的情境文本、启发问题与课件片段</Paragraph>
      </div>

      <Card className="search-card">
        <Row gutter={16}>
          <Col span={20}>
            <TextArea
              placeholder="请输入教学主题或关键词，例如：公民的基本权利与义务、法治精神、宪法..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={handleSearch}
              autoSize={{ minRows: 2, maxRows: 4 }}
              size="large"
            />
          </Col>
          <Col span={4}>
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              loading={loading}
              block
              style={{ height: '100%', minHeight: '60px' }}
            >
              智能搜索
            </Button>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" tip="正在智能匹配资源..." />
          </div>
        </Card>
      ) : results.length > 0 ? (
        <Card title="匹配结果" extra={<Text type="secondary">共找到 {results.length} 条资源</Text>}>
          <Tabs items={tabItems} />
        </Card>
      ) : keyword ? (
        <Card>
          <Empty description="未找到匹配的资源，请尝试其他关键词" />
        </Card>
      ) : (
        <Card>
          <Empty
            description={
              <div>
                <Paragraph>输入主题或关键词开始搜索</Paragraph>
                <Space wrap>
                  <Tag color="blue" style={{ cursor: 'pointer' }} onClick={() => setKeyword('公民权利')}>
                    公民权利
                  </Tag>
                  <Tag color="blue" style={{ cursor: 'pointer' }} onClick={() => setKeyword('法治精神')}>
                    法治精神
                  </Tag>
                  <Tag color="blue" style={{ cursor: 'pointer' }} onClick={() => setKeyword('宪法')}>
                    宪法
                  </Tag>
                  <Tag color="blue" style={{ cursor: 'pointer' }} onClick={() => setKeyword('社会责任')}>
                    社会责任
                  </Tag>
                </Space>
              </div>
            }
          />
        </Card>
      )}
    </div>
  );
};

export default ResourceMatcher;
