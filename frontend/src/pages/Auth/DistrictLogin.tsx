import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './Login.css';

const DistrictLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: any) => {
    try {
      setLoading(true);
      // TODO: 实现区域端登录逻辑
      message.info('区域端功能开发中...');
      // 临时跳转到占位页面
      setTimeout(() => {
        navigate('/district/dashboard');
      }, 1000);
    } catch (error) {
      message.error('登录失败,请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="login-content">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          className="back-button"
          type="text"
        >
          返回
        </Button>

        <div className="login-header">
          <img
            src="/picture/logo.png"
            alt="智同道合"
            className="login-logo"
          />
          <h1>区域端</h1>
          <p>基于"可用、可测、可复盘"的智能教学助手</p>
        </div>

        <Card className="login-card" bordered={false}>
          <Form
            name="district-login"
            onFinish={handleLogin}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
              >
                登录
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center', color: '#8c8c8c' }}>
              <small>
                区域端功能开发中,敬请期待
              </small>
            </div>
          </Form>
        </Card>

        <div className="login-footer">
          <p>© 2025 智同道合 · 让教学更智能</p>
        </div>
      </div>
    </div>
  );
};

export default DistrictLogin;
