import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  message,
  Modal,
  Tooltip,
} from 'antd';
import {
  FileTextOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { ClassSession, SessionStatus } from '@/types/shared';
import { request } from '@/services/api';
import type { ColumnsType } from 'antd/es/table';
import './SessionHistory.css';

const { Option } = Select;

const SessionHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<SessionStatus | 'all'>('all');

  useEffect(() => {
    fetchSessions();
  }, [page, pageSize, statusFilter]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: page.toString(),
        pageSize: pageSize.toString(),
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const result = await request.get('/collection/sessions', { params });

      if (result.success) {
        setSessions(result.data.sessions);
        setTotal(result.data.total);
      } else {
        message.error('获取会话列表失败');
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      message.error('加载失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (sessionId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后将无法恢复课堂数据和文字稿，确定要删除吗？',
      okText: '确定',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          const result = await request.delete(`/collection/sessions/${sessionId}`);

          if (result.success) {
            message.success('删除成功');
            fetchSessions();
          } else {
            message.error('删除失败');
          }
        } catch (error) {
          console.error('Failed to delete session:', error);
          message.error('删除失败，请稍后重试');
        }
      },
    });
  };

  const getStatusTag = (status: SessionStatus) => {
    const statusConfig = {
      [SessionStatus.RECORDING]: { color: 'red', text: '录制中' },
      [SessionStatus.PROCESSING]: { color: 'blue', text: '处理中' },
      [SessionStatus.COMPLETED]: { color: 'green', text: '已完成' },
      [SessionStatus.FAILED]: { color: 'default', text: '失败' },
    };

    const config = statusConfig[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}小时${mins}分钟` : `${mins}分钟`;
  };

  const filteredSessions = sessions.filter(session => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    return (
      session.courseName.toLowerCase().includes(searchLower) ||
      session.className.toLowerCase().includes(searchLower) ||
      session.subject.toLowerCase().includes(searchLower)
    );
  });

  const columns: ColumnsType<ClassSession> = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
      width: 250,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <strong>{text}</strong>
        </Tooltip>
      ),
    },
    {
      title: '班级',
      dataIndex: 'className',
      key: 'className',
      width: 120,
    },
    {
      title: '科目',
      dataIndex: 'subject',
      key: 'subject',
      width: 100,
    },
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'grade',
      width: 100,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 180,
      render: (time) => new Date(time).toLocaleString(),
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (duration) => formatDuration(duration),
    },
    {
      title: '文字稿',
      dataIndex: 'transcriptCount',
      key: 'transcriptCount',
      width: 100,
      align: 'center',
      render: (count) => (
        <span>
          <FileTextOutlined style={{ marginRight: 4 }} />
          {count || 0}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (status) => getStatusTag(status),
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看文字稿">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/m1/transcript/${record.id}`)}
              disabled={record.status !== SessionStatus.COMPLETED}
            />
          </Tooltip>
          <Tooltip title="查看报告">
            <Button
              type="link"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => navigate(`/m1/report/${record.id}`)}
              disabled={record.status !== SessionStatus.COMPLETED}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container session-history">
      <div className="page-header">
        <h1 className="page-title">课堂记录</h1>
        <p className="page-description">
          查看历史课堂记录和文字稿
        </p>
      </div>

      <Card className="card-container">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {/* 搜索和筛选 */}
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <Input
                placeholder="搜索课程、班级或科目..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
                allowClear
              />
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 150 }}
              >
                <Option value="all">全部状态</Option>
                <Option value={SessionStatus.COMPLETED}>已完成</Option>
                <Option value={SessionStatus.RECORDING}>录制中</Option>
                <Option value={SessionStatus.PROCESSING}>处理中</Option>
                <Option value={SessionStatus.FAILED}>失败</Option>
              </Select>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchSessions}
              >
                刷新
              </Button>
            </Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/m1/recorder')}
            >
              新建采集
            </Button>
          </Space>

          {/* 表格 */}
          <Table
            columns={columns}
            dataSource={filteredSessions}
            rowKey="id"
            loading={loading}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
              onChange: (newPage, newPageSize) => {
                setPage(newPage);
                setPageSize(newPageSize);
              },
            }}
            scroll={{ x: 1200 }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default SessionHistory;
