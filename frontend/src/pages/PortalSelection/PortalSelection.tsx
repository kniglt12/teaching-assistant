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
        <img
          src={getAssetPath('teacher_logo.png')}
          alt="教师端"
          style={{ width: '100px', height: '120px', objectFit: 'contain' }}
        />
      ),
      path: '/teacher/login'
    },
    {
      id: 'school',
      name: '学校端',
      icon: (
        <img
          src={getAssetPath('school_logo.png')}
          alt="学校端"
          style={{ width: '120px', height: '120px', objectFit: 'contain' }}
        />
      ),
      path: '/school/login'
    },
    {
      id: 'district',
      name: '区域端',
      icon: (
        <img
          src={getAssetPath('area_logo.png')}
          alt="区域端"
          style={{ width: '120px', height: '120px', objectFit: 'contain' }}
        />
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
