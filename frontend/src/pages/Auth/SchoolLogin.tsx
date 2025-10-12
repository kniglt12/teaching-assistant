import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './Login.css';

const SchoolLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (_values: any) => {
    try {
      setLoading(true);
      // TODO: 实现学校端登录逻辑
      message.info('学校端功能开发中...');
      // 临时跳转到占位页面
      setTimeout(() => {
        navigate('/school/dashboard');
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
          <h1>学校端</h1>
        </div>

        <Card className="login-card" bordered={false}>
          <Form
            name="school-login"
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
                学校端功能开发中,敬请期待
              </small>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default SchoolLogin;
