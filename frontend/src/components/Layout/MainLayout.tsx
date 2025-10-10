import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Space, Badge } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  AudioOutlined,
  BarChartOutlined,
  FileTextOutlined,
  FileAddOutlined,
  FormOutlined,
  RadarChartOutlined,
  AppstoreOutlined,
  SafetyOutlined,
  FolderOpenOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  // 菜单项配置
  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '工作台',
    },
    {
      key: 'm1',
      icon: <AudioOutlined />,
      label: 'M1 - 数据闭环',
      children: [
        {
          key: '/m1/recorder',
          icon: <AudioOutlined />,
          label: '课堂采集器',
        },
        {
          key: '/m1/metrics',
          icon: <BarChartOutlined />,
          label: '指标库',
        },
      ],
    },
    {
      key: 'm2',
      icon: <FileAddOutlined />,
      label: 'M2 - 教学增效',
      children: [
        {
          key: '/m2/ppt-generator',
          icon: <FileTextOutlined />,
          label: 'PPT生成器',
        },
        {
          key: '/m2/homework-generator',
          icon: <FormOutlined />,
          label: '作业生成器',
        },
        {
          key: '/m2/learning-radar',
          icon: <RadarChartOutlined />,
          label: '学习力雷达',
        },
      ],
    },
    {
      key: 'm3',
      icon: <AppstoreOutlined />,
      label: 'M3 - 组织赋能',
      children: [
        {
          key: '/m3/school-dashboard',
          icon: <DashboardOutlined />,
          label: '校级看板',
        },
        {
          key: '/m3/compliance',
          icon: <SafetyOutlined />,
          label: '合规审计',
        },
        {
          key: '/m3/resources',
          icon: <FolderOpenOutlined />,
          label: '资源库',
        },
      ],
    },
  ];

  // 用户菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
    }
  };

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname;
    // 如果是报告详情页，选中M1菜单
    if (path.startsWith('/m1/report')) {
      return ['/m1/recorder'];
    }
    // 如果是学习雷达详情页
    if (path.startsWith('/m2/learning-radar')) {
      return ['/m2/learning-radar'];
    }
    return [path];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={240}
        theme="light"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          borderRight: '1px solid #f0f0f0',
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 16px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          {!collapsed && (
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
              教学辅助平台
            </h2>
          )}
          {collapsed && <h2 style={{ margin: 0, fontSize: 18 }}>教辅</h2>}
        </div>

        {/* 导航菜单 */}
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={['m1', 'm2', 'm3']}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0, paddingTop: 8 }}
        />
      </Sider>

      {/* 主内容区 */}
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'all 0.2s' }}>
        {/* 顶部导航栏 */}
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 500 }}>
            {location.pathname === '/dashboard' && '工作台'}
            {location.pathname.startsWith('/m1') && 'M1 - 数据闭环阶段'}
            {location.pathname.startsWith('/m2') && 'M2 - 教学增效阶段'}
            {location.pathname.startsWith('/m3') && 'M3 - 组织赋能阶段'}
          </div>

          <Space size={24}>
            {/* 通知 */}
            <Badge count={5} size="small">
              <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
            </Badge>

            {/* 用户信息 */}
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1890ff' }}
                />
                <span>{user?.username || '教师'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* 页面内容 */}
        <Content style={{ margin: 0 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
