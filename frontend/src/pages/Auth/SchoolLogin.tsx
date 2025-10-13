import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, BankOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { getAssetPath } from '@/utils/assets';
import './Login.css';

const SchoolLogin = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  const handleLogin = async (_values: any) => {
    try {
      setLoading(true);
      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 800));
      message.success('登录成功');
      navigate('/school/dashboard');
    } catch (error) {
      message.error('登录失败,请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (_values: any) => {
    try {
      setLoading(true);
      // 模拟注册请求
      await new Promise(resolve => setTimeout(resolve, 800));
      message.success('注册成功,请登录');
      setActiveTab('login');
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
            src={getAssetPath('logo.png')}
            alt="智同道合"
            className="login-logo"
          />
          <h1>学校端</h1>
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
                  </Form>
                ),
              },
              {
                key: 'register',
                label: '注册',
                children: (
                  <Form
                    name="school-register"
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
                      name="schoolName"
                      rules={[{ required: true, message: '请输入学校名称' }]}
                    >
                      <Input
                        prefix={<BankOutlined />}
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
      </div>
    </div>
  );
};

export default SchoolLogin;
