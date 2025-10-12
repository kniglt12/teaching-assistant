import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BuildOutlined } from '@ant-design/icons';
import './DistrictDashboard.css';

const DistrictDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="placeholder-container">
      <Result
        icon={<BuildOutlined />}
        title="区域端功能开发中"
        subTitle="我们正在努力开发区域端的各项功能,敬请期待!"
        extra={[
          <Button type="primary" key="back" onClick={() => navigate('/')}>
            返回首页
          </Button>,
        ]}
      />
    </div>
  );
};

export default DistrictDashboard;
