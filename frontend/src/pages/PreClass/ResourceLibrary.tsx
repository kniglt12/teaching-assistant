import { useState } from 'react';
import { Card, Input, Tabs, Table, Tag, Space, Button, Upload, message, Modal } from 'antd';
import type { TabsProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, UploadOutlined, StarOutlined, StarFilled, ShareAltOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import './PreClass.css';

const { Search } = Input;

interface Resource {
  key: string;
  name: string;
  type: string;
  creator: string;
  createTime: string;
  useCount: number;
  favorite: boolean;
  tags: string[];
}

const ResourceLibrary = () => {
  const [searchText, setSearchText] = useState('');
  const [resources, setResources] = useState<Resource[]>([
    {
      key: '1',
      name: '公民基本权利PPT模板',
      type: '课件',
      creator: '张老师',
      createTime: '2024-01-15',
      useCount: 28,
      favorite: true,
      tags: ['八年级', '权利义务', '优质'],
    },
    {
      key: '2',
      name: '法治教育案例集',
      type: '案例库',
      creator: '李老师',
      createTime: '2024-01-10',
      useCount: 45,
      favorite: true,
      tags: ['通用', '案例', '推荐'],
    },
    {
      key: '3',
      name: '宪法知识思维导图',
      type: '教学素材',
      creator: '王老师',
      createTime: '2024-01-08',
      useCount: 32,
      favorite: false,
      tags: ['九年级', '宪法', '图示'],
    },
    {
      key: '4',
      name: '社会责任主题活动方案',
      type: '教案',
      creator: '赵老师',
      createTime: '2024-01-05',
      useCount: 19,
      favorite: false,
      tags: ['七年级', '活动', '实践'],
    },
  ]);

  const toggleFavorite = (key: string) => {
    setResources(
      resources.map((r) =>
        r.key === key ? { ...r, favorite: !r.favorite } : r
      )
    );
  };

  const handlePreview = (record: Resource) => {
    Modal.info({
      title: record.name,
      width: 800,
      content: (
        <div>
          <p>类型：{record.type}</p>
          <p>创建者：{record.creator}</p>
          <p>创建时间：{record.createTime}</p>
          <p>使用次数：{record.useCount}</p>
          <Space wrap>
            {record.tags.map((tag) => (
              <Tag key={tag} color="blue">
                {tag}
              </Tag>
            ))}
          </Space>
        </div>
      ),
    });
  };

  const columns: ColumnsType<Resource> = [
    {
      title: '资源名称',
      dataIndex: 'name',
      key: 'name',
      filteredValue: [searchText],
      onFilter: (value: string | number | boolean, record: Resource) =>
        record.name.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: '课件', value: '课件' },
        { text: '教案', value: '教案' },
        { text: '案例库', value: '案例库' },
        { text: '教学素材', value: '教学素材' },
      ],
      onFilter: (value: string | number | boolean, record: Resource) => record.type === value,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <Space size={4} wrap>
          {tags.map((tag) => (
            <Tag key={tag} color="blue" style={{ fontSize: '12px' }}>
              {tag}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: (a: Resource, b: Resource) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
    },
    {
      title: '使用次数',
      dataIndex: 'useCount',
      key: 'useCount',
      sorter: (a: Resource, b: Resource) => a.useCount - b.useCount,
      render: (count: number) => <Tag color="green">{count}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Resource) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={record.favorite ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
            onClick={() => toggleFavorite(record.key)}
          />
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handlePreview(record)}>
            预览
          </Button>
          <Button type="link" size="small" icon={<DownloadOutlined />}>
            下载
          </Button>
          <Button type="link" size="small" icon={<ShareAltOutlined />}>
            分享
          </Button>
        </Space>
      ),
    },
  ];

  const tabItems: TabsProps['items'] = [
    {
      key: 'all',
      label: '全部资源',
      children: <Table columns={columns} dataSource={resources} />,
    },
    {
      key: 'favorite',
      label: '我的收藏',
      children: (
        <Table
          columns={columns}
          dataSource={resources.filter((r) => r.favorite)}
        />
      ),
    },
    {
      key: 'my',
      label: '我的上传',
      children: (
        <Table
          columns={columns}
          dataSource={resources.filter((r) => r.creator === '张老师')}
        />
      ),
    },
    {
      key: 'group',
      label: '备课组共享',
      children: <Table columns={columns} dataSource={resources} />,
    },
  ];

  const handleUpload = () => {
    message.success('资源上传成功');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">校本资源库</h2>
          <p className="page-description">备课组内共享、复用与复盘优秀素材，形成本校特色教学范式</p>
        </div>
      </div>

      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Search
              placeholder="搜索资源名称或标签"
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              style={{ width: 400 }}
              onSearch={setSearchText}
            />
            <Upload beforeUpload={() => { handleUpload(); return false; }}>
              <Button type="primary" icon={<UploadOutlined />} size="large">
                上传资源
              </Button>
            </Upload>
          </Space>

          <Tabs items={tabItems} />
        </Space>
      </Card>
    </div>
  );
};

export default ResourceLibrary;
