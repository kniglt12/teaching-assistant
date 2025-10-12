import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import { request } from '@/services/api';
import './Login.css';

const TeacherLogin = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async (values: any) => {
    try {
      setLoading(true);
      const response = await request.post('/auth/login', values);

      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        message.success('登录成功');
        navigate('/teacher/dashboard');
      }
    } catch (error) {
      message.error('登录失败,请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: any) => {
    try {
      setLoading(true);
      const response = await request.post('/auth/register', values);

      if (response.success) {
        message.success('注册成功,请登录');
        setActiveTab('login');
      }
    } catch (error) {
      message.error('注册失败,请稍后再试');
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
          <h1>教师端</h1>
          <p>基于"可用、可测、可复盘"的智能教学助手</p>
        </div>

        <Card className="login-card" bordered={false}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            centered
            items={[
              {
                key: 'login',
                label: '登录',
                children: (
                  <Form
                    name="login"
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
                        测试账号: teacher / password123
                      </small>
                    </div>
                  </Form>
                ),
              },
              {
                key: 'register',
                label: '注册',
                children: (
                  <Form
                    name="register"
                    onFinish={handleRegister}
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
                      name="email"
                      rules={[
                        { required: true, message: '请输入邮箱' },
                        { type: 'email', message: '请输入有效的邮箱地址' },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined />}
                        placeholder="邮箱"
                      />
                    </Form.Item>

                    <Form.Item
                      name="school"
                      rules={[{ required: true, message: '请输入学校名称' }]}
                    >
                      <Input
                        prefix={<HomeOutlined />}
                        placeholder="学校名称"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[
                        { required: true, message: '请输入密码' },
                        { min: 6, message: '密码至少6个字符' },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="密码"
                      />
                    </Form.Item>

                    <Form.Item
                      name="confirmPassword"
                      dependencies={['password']}
                      rules={[
                        { required: true, message: '请确认密码' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('两次密码输入不一致'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="确认密码"
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                      >
                        注册
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
            ]}
          />
        </Card>

        <div className="login-footer">
          <p>© 2025 智同道合 · 让教学更智能</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
