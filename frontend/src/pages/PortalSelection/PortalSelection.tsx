import { useNavigate } from 'react-router-dom';
import { Card } from 'antd';
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
          <circle cx="60" cy="45" r="15" fill="#1890ff"/>
          <path d="M35 85 C35 70, 45 65, 60 65 C75 65, 85 70, 85 85 L85 95 L35 95 Z" fill="#1890ff"/>
          <rect x="50" y="30" width="20" height="3" fill="#1890ff"/>
          <circle cx="45" cy="50" r="2" fill="#40a9ff"/>
          <circle cx="75" cy="50" r="2" fill="#40a9ff"/>
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
          <path d="M60 25 L85 40 L85 75 L60 90 L35 75 L35 40 Z" fill="#1890ff"/>
          <rect x="55" y="55" width="10" height="15" fill="white"/>
          <rect x="47" y="45" width="6" height="6" fill="white"/>
          <rect x="67" y="45" width="6" height="6" fill="white"/>
          <path d="M40 40 L60 30 L80 40" stroke="#40a9ff" strokeWidth="2" fill="none"/>
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
            src="/picture/logo.png"
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
