import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BuildOutlined } from '@ant-design/icons';
import './SchoolDashboard.css';

const SchoolDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="placeholder-container">
      <Result
        icon={<BuildOutlined />}
        title="学校端功能开发中"
        subTitle="我们正在努力开发学校端的各项功能,敬请期待!"
        extra={[
          <Button type="primary" key="back" onClick={() => navigate('/')}>
            返回首页
          </Button>,
        ]}
      />
    </div>
  );
};

export default SchoolDashboard;
