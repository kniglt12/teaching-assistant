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
  BookOutlined,
  BulbOutlined,
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
      key: '/teacher/dashboard',
      icon: <DashboardOutlined />,
      label: '工作台',
    },
    {
      key: 'pre-class',
      icon: <BookOutlined />,
      label: '课前',
      children: [
        {
          key: '/teacher/pre-class/resource-matcher',
          icon: <FileTextOutlined />,
          label: '资源精准匹配',
        },
        {
          key: '/teacher/pre-class/courseware-generator',
          icon: <FileAddOutlined />,
          label: '课件框架生成',
        },
        {
          key: '/teacher/pre-class/case-generator',
          icon: <BulbOutlined />,
          label: '情景案例生成',
        },
        {
          key: '/teacher/pre-class/resource-library',
          icon: <FolderOpenOutlined />,
          label: '校本资源库',
        },
      ],
    },
    {
      key: 'in-class',
      icon: <AudioOutlined />,
      label: '课中',
      children: [
        {
          key: '/teacher/in-class/classroom-analysis',
          icon: <BarChartOutlined />,
          label: '课堂记录与分析',
        },
      ],
    },
    {
      key: 'after-class',
      icon: <FormOutlined />,
      label: '课后',
      children: [
        {
          key: '/teacher/after-class/learning-radar',
          icon: <RadarChartOutlined />,
          label: '四维学情雷达',
        },
      ],
    },
    // 暂时隐藏M1/M2/M3模块
    // {
    //   key: 'm1',
    //   icon: <AppstoreOutlined />,
    //   label: 'M1 - 数据闭环',
    //   children: [
    //     {
    //       key: '/teacher/m1/recorder',
    //       icon: <AudioOutlined />,
    //       label: '课堂采集器',
    //     },
    //     {
    //       key: '/teacher/m1/metrics',
    //       icon: <BarChartOutlined />,
    //       label: '指标库',
    //     },
    //   ],
    // },
    // {
    //   key: 'm2',
    //   icon: <FileAddOutlined />,
    //   label: 'M2 - 教学增效',
    //   children: [
    //     {
    //       key: '/teacher/m2/ppt-generator',
    //       icon: <FileTextOutlined />,
    //       label: 'PPT生成器',
    //     },
    //     {
    //       key: '/teacher/m2/homework-generator',
    //       icon: <FormOutlined />,
    //       label: '作业生成器',
    //     },
    //     {
    //       key: '/teacher/m2/learning-radar',
    //       icon: <RadarChartOutlined />,
    //       label: '学习力雷达',
    //     },
    //   ],
    // },
    // {
    //   key: 'm3',
    //   icon: <AppstoreOutlined />,
    //   label: 'M3 - 组织赋能',
    //   children: [
    //     {
    //       key: '/teacher/m3/school-dashboard',
    //       icon: <DashboardOutlined />,
    //       label: '校级看板',
    //     },
    //     {
    //       key: '/teacher/m3/compliance',
    //       icon: <SafetyOutlined />,
    //       label: '合规审计',
    //     },
    //     {
    //       key: '/teacher/m3/resources',
    //       icon: <FolderOpenOutlined />,
    //       label: '资源库',
    //     },
    //   ],
    // },
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
      navigate('/');
    }
  };

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname;
    // 如果是报告详情页，选中M1菜单
    if (path.startsWith('/teacher/m1/report')) {
      return ['/teacher/m1/recorder'];
    }
    // 如果是学习雷达详情页
    if (path.startsWith('/teacher/m2/learning-radar')) {
      return ['/teacher/m2/learning-radar'];
    }
    return [path];
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)' }}>
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
          borderRight: '1px solid #e6f7ff',
          background: '#fff',
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
          defaultOpenKeys={['pre-class', 'in-class', 'after-class']}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0, paddingTop: 8 }}
        />
      </Sider>

      {/* 主内容区 */}
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'all 0.2s', background: 'transparent' }}>
        {/* 顶部导航栏 */}
        <Header
          style={{
            padding: '0 24px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid #e6f7ff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            boxShadow: '0 2px 8px rgba(24, 144, 255, 0.08)',
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 500, color: '#1890ff' }}>
            {location.pathname === '/teacher/dashboard' && '工作台'}
            {location.pathname.startsWith('/teacher/pre-class') && '课前 - 智能备课与导入'}
            {location.pathname.startsWith('/teacher/in-class') && '课中 - 课堂记录与分析'}
            {location.pathname.startsWith('/teacher/after-class') && '课后 - 精准练习与学情分析'}
            {location.pathname.startsWith('/teacher/m1') && 'M1 - 数据闭环阶段'}
            {location.pathname.startsWith('/teacher/m2') && 'M2 - 教学增效阶段'}
            {location.pathname.startsWith('/teacher/m3') && 'M3 - 组织赋能阶段'}
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
        <Content style={{
          margin: 0,
          minHeight: 'calc(100vh - 64px)',
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
