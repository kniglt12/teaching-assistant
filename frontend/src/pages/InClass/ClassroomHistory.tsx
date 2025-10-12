import { useState } from 'react';
import { Card, Table, Button, Space, Tag, Input, DatePicker, Select, Row, Col, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, EyeOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './InClass.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface ClassRecord {
  key: string;
  id: string;
  courseName: string;
  className: string;
  grade: string;
  date: string;
  duration: number;
  transcriptCount: number;
  studentCount: number;
  avgParticipation: number;
  status: 'completed' | 'processing' | 'failed';
}

const ClassroomHistory = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [loading] = useState(false);

  // 模拟历史记录数据
  const [records] = useState<ClassRecord[]>([
    {
      key: '1',
      id: 'session-001',
      courseName: '公民的基本权利与义务',
      className: '八年级(3)班',
      grade: '八年级',
      date: '2024-01-15 14:00',
      duration: 2400,
      transcriptCount: 156,
      studentCount: 43,
      avgParticipation: 82.5,
      status: 'completed',
    },
    {
      key: '2',
      id: 'session-002',
      courseName: '法治精神与法治思维',
      className: '八年级(2)班',
      grade: '八年级',
      date: '2024-01-14 10:00',
      duration: 2700,
      transcriptCount: 178,
      studentCount: 45,
      avgParticipation: 78.3,
      status: 'completed',
    },
    {
      key: '3',
      id: 'session-003',
      courseName: '社会责任感的培养',
      className: '七年级(1)班',
      grade: '七年级',
      date: '2024-01-13 15:00',
      duration: 2250,
      transcriptCount: 142,
      studentCount: 42,
      avgParticipation: 75.8,
      status: 'completed',
    },
    {
      key: '4',
      id: 'session-004',
      courseName: '宪法的地位与作用',
      className: '九年级(1)班',
      grade: '九年级',
      date: '2024-01-12 09:00',
      duration: 2550,
      transcriptCount: 165,
      studentCount: 40,
      avgParticipation: 85.2,
      status: 'completed',
    },
    {
      key: '5',
      id: 'session-005',
      courseName: '民主与法治的关系',
      className: '八年级(3)班',
      grade: '八年级',
      date: '2024-01-11 14:00',
      duration: 2100,
      transcriptCount: 132,
      studentCount: 43,
      avgParticipation: 73.5,
      status: 'completed',
    },
  ]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    return `${mins}分钟`;
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'completed':
        return <Tag color="success">已完成</Tag>;
      case 'processing':
        return <Tag color="processing">处理中</Tag>;
      case 'failed':
        return <Tag color="error">失败</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const handleView = (record: ClassRecord) => {
    navigate(`/teacher/in-class/classroom-detail/${record.id}`);
  };

  const handleDelete = (record: ClassRecord) => {
    message.success(`已删除课堂记录: ${record.courseName}`);
  };

  const handleExport = (record: ClassRecord) => {
    message.success(`正在导出课堂记录: ${record.courseName}`);
  };

  const columns: ColumnsType<ClassRecord> = [
    {
      title: '课程主题',
      dataIndex: 'courseName',
      key: 'courseName',
      filteredValue: [searchText],
      onFilter: (value: boolean | React.Key, record: ClassRecord) =>
        record.courseName.toLowerCase().includes(String(value).toLowerCase()) ||
        record.className.toLowerCase().includes(String(value).toLowerCase()),
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: '班级',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'grade',
      filters: [
        { text: '七年级', value: '七年级' },
        { text: '八年级', value: '八年级' },
        { text: '九年级', value: '九年级' },
      ],
      onFilter: (value: boolean | React.Key, record: ClassRecord) => record.grade === value,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '记录时间',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: ClassRecord, b: ClassRecord) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => formatDuration(duration),
      sorter: (a: ClassRecord, b: ClassRecord) => a.duration - b.duration,
    },
    {
      title: '文字稿段数',
      dataIndex: 'transcriptCount',
      key: 'transcriptCount',
      render: (count: number) => <Tag>{count}段</Tag>,
      sorter: (a: ClassRecord, b: ClassRecord) => a.transcriptCount - b.transcriptCount,
    },
    {
      title: '参与学生',
      dataIndex: 'studentCount',
      key: 'studentCount',
      render: (count: number) => `${count}人`,
    },
    {
      title: '平均参与度',
      dataIndex: 'avgParticipation',
      key: 'avgParticipation',
      render: (value: number) => {
        const color = value >= 80 ? 'green' : value >= 60 ? 'orange' : 'red';
        return <Tag color={color}>{value.toFixed(1)}%</Tag>;
      },
      sorter: (a: ClassRecord, b: ClassRecord) => a.avgParticipation - b.avgParticipation,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
      filters: [
        { text: '已完成', value: 'completed' },
        { text: '处理中', value: 'processing' },
        { text: '失败', value: 'failed' },
      ],
      onFilter: (value: boolean | React.Key, record: ClassRecord) => record.status === value,
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      render: (_: unknown, record: ClassRecord) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleExport(record)}
          >
            导出
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const filteredRecords = selectedGrade === 'all'
    ? records
    : records.filter(r => r.grade === selectedGrade);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">课堂历史记录</h2>
        <p className="page-description">查看和管理历史课堂记录与分析数据</p>
      </div>

      <Card>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              placeholder="搜索课程主题或班级"
              prefix={<SearchOutlined />}
              allowClear
              size="large"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="选择年级"
              size="large"
              style={{ width: '100%' }}
              value={selectedGrade}
              onChange={setSelectedGrade}
            >
              <Option value="all">全部年级</Option>
              <Option value="七年级">七年级</Option>
              <Option value="八年级">八年级</Option>
              <Option value="九年级">九年级</Option>
            </Select>
          </Col>
          <Col span={8}>
            <RangePicker size="large" style={{ width: '100%' }} />
          </Col>
          <Col span={2}>
            <Button type="primary" size="large" block onClick={() => navigate('/teacher/in-class/classroom-analysis')}>
              新建记录
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredRecords}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 统计信息 */}
      <Card title="统计概览" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 600, color: '#1890ff' }}>
                {records.length}
              </div>
              <div style={{ color: '#8c8c8c', marginTop: 8 }}>总记录数</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 600, color: '#52c41a' }}>
                {Math.floor(records.reduce((sum, r) => sum + r.duration, 0) / 60)}
              </div>
              <div style={{ color: '#8c8c8c', marginTop: 8 }}>累计时长(分钟)</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 600, color: '#faad14' }}>
                {records.reduce((sum, r) => sum + r.transcriptCount, 0)}
              </div>
              <div style={{ color: '#8c8c8c', marginTop: 8 }}>总文字稿段数</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 600, color: '#722ed1' }}>
                {(records.reduce((sum, r) => sum + r.avgParticipation, 0) / records.length).toFixed(1)}%
              </div>
              <div style={{ color: '#8c8c8c', marginTop: 8 }}>平均参与度</div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ClassroomHistory;
