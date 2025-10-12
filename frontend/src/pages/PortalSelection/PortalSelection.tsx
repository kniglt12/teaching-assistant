import { useNavigate } from 'react-router-dom';
import { Card } from 'antd';
import { getAssetPath } from '@/utils/assets';
import './PortalSelection.css';

const PortalSelection = () => {
  const navigate = useNavigate();

  const portals = [
    {
      id: 'teacher',
      name: '教师端',
      icon: (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="55" fill="#1890ff" opacity="0.1"/>
          {/* 头部 */}
          <circle cx="60" cy="45" r="15" fill="#1890ff"/>
          {/* 身体 */}
          <path d="M35 85 C35 70, 45 65, 60 65 C75 65, 85 70, 85 85 L85 95 L35 95 Z" fill="#1890ff"/>
          {/* 帽子 */}
          <rect x="50" y="30" width="20" height="3" fill="#1890ff"/>
          {/* 眼睛 */}
          <circle cx="52" cy="45" r="2" fill="white"/>
          <circle cx="68" cy="45" r="2" fill="white"/>
        </svg>
      ),
      path: '/teacher/login'
    },
    {
      id: 'school',
      name: '学校端',
      icon: (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="55" fill="#1890ff" opacity="0.1"/>
          {/* 房子屋顶 */}
          <path d="M60 30 L85 50 L35 50 Z" fill="#1890ff"/>
          {/* 房子主体 */}
          <rect x="35" y="50" width="50" height="35" fill="#1890ff"/>
          {/* 门 */}
          <rect x="50" y="60" width="20" height="25" fill="white" rx="2"/>
          {/* 门把手 */}
          <circle cx="64" cy="73" r="1.5" fill="#1890ff"/>
          {/* 地板 */}
          <rect x="30" y="85" width="60" height="8" fill="#40a9ff"/>
          {/* 烟囱 */}
          <rect x="70" y="35" width="6" height="15" fill="#40a9ff"/>
        </svg>
      ),
      path: '/school/login'
    },
    {
      id: 'district',
      name: '区域端',
      icon: (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="55" fill="#1890ff" opacity="0.1"/>
          <circle cx="60" cy="60" r="35" fill="none" stroke="#1890ff" strokeWidth="3"/>
          <circle cx="60" cy="60" r="25" fill="none" stroke="#1890ff" strokeWidth="2"/>
          <circle cx="60" cy="60" r="5" fill="#1890ff"/>
          <circle cx="60" cy="30" r="4" fill="#40a9ff"/>
          <circle cx="60" cy="90" r="4" fill="#40a9ff"/>
          <circle cx="30" cy="60" r="4" fill="#40a9ff"/>
          <circle cx="90" cy="60" r="4" fill="#40a9ff"/>
          <line x1="60" y1="60" x2="60" y2="30" stroke="#1890ff" strokeWidth="1.5"/>
          <line x1="60" y1="60" x2="90" y2="60" stroke="#1890ff" strokeWidth="1.5"/>
          <line x1="60" y1="60" x2="60" y2="90" stroke="#1890ff" strokeWidth="1.5"/>
          <line x1="60" y1="60" x2="30" y2="60" stroke="#1890ff" strokeWidth="1.5"/>
        </svg>
      ),
      path: '/district/login'
    }
  ];

  const handlePortalClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="portal-selection-container">
      <div className="portal-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="portal-content">
        <div className="portal-header">
          <img
            src={getAssetPath('logo.png')}
            alt="智同道合"
            className="portal-logo"
          />
          <p className="portal-description">基于"可用、可测、可复盘"的智能教学助手</p>
        </div>

        <div className="portal-cards">
          {portals.map((portal) => (
            <Card
              key={portal.id}
              className="portal-card"
              hoverable
              onClick={() => handlePortalClick(portal.path)}
            >
              <div className="portal-icon">
                {portal.icon}
              </div>
              <h2 className="portal-name">{portal.name}</h2>
            </Card>
          ))}
        </div>

        <div className="portal-footer">
          <p>© 2025 智同道合 · 让教学更智能</p>
        </div>
      </div>
    </div>
  );
};

export default PortalSelection;
