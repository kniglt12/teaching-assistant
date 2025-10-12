import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';

// Portal Selection
import PortalSelection from './pages/PortalSelection/PortalSelection';

// Auth pages
import Login from './pages/Auth/Login';
import TeacherLogin from './pages/Auth/TeacherLogin';
import SchoolLogin from './pages/Auth/SchoolLogin';
import DistrictLogin from './pages/Auth/DistrictLogin';

// Dashboard pages
import Dashboard from './pages/Dashboard/Dashboard';
import SchoolDashboard from './pages/School/SchoolDashboard';
import DistrictDashboard from './pages/District/DistrictDashboard';

// M1 阶段页面
import ClassRecorder from './pages/M1/ClassRecorder';
import MetricsLibrary from './pages/M1/MetricsLibrary';
import ClassReport from './pages/M1/ClassReport';
import TranscriptViewer from './pages/M1/TranscriptViewer';
import SessionHistory from './pages/M1/SessionHistory';

// M2 阶段页面
import PPTGenerator from './pages/M2/PPTGenerator';
import HomeworkGenerator from './pages/M2/HomeworkGenerator';
import LearningRadar from './pages/M2/LearningRadar';

// M3 阶段页面
import M3SchoolDashboard from './pages/M3/SchoolDashboard';
import ComplianceAudit from './pages/M3/ComplianceAudit';
import ResourceLibrary from './pages/M3/ResourceLibrary';

import PrivateRoute from './components/Auth/PrivateRoute';
import './App.css';

function App() {
  return (
    <Routes>
      {/* 初始页面 - Portal Selection */}
      <Route path="/" element={<PortalSelection />} />

      {/* 教师端登录 */}
      <Route path="/teacher/login" element={<TeacherLogin />} />

      {/* 学校端登录和功能 */}
      <Route path="/school/login" element={<SchoolLogin />} />
      <Route path="/school/dashboard" element={<SchoolDashboard />} />

      {/* 区域端登录和功能 */}
      <Route path="/district/login" element={<DistrictLogin />} />
      <Route path="/district/dashboard" element={<DistrictDashboard />} />

      {/* 兼容旧的登录路径 */}
      <Route path="/login" element={<Login />} />

      {/* 教师端主应用布局 */}
      <Route
        path="/teacher"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        {/* 首页 - 跳转到仪表盘 */}
        <Route index element={<Navigate to="/teacher/dashboard" replace />} />

        {/* 仪表盘 */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* M1 阶段功能 */}
        <Route path="m1">
          <Route path="recorder" element={<ClassRecorder />} />
          <Route path="metrics" element={<MetricsLibrary />} />
          <Route path="report/:sessionId" element={<ClassReport />} />
          <Route path="transcript/:id" element={<TranscriptViewer />} />
          <Route path="sessions" element={<SessionHistory />} />
        </Route>

        {/* M2 阶段功能 */}
        <Route path="m2">
          <Route path="ppt-generator" element={<PPTGenerator />} />
          <Route path="homework-generator" element={<HomeworkGenerator />} />
          <Route path="learning-radar/:classId" element={<LearningRadar />} />
        </Route>

        {/* M3 阶段功能 */}
        <Route path="m3">
          <Route path="school-dashboard" element={<M3SchoolDashboard />} />
          <Route path="compliance" element={<ComplianceAudit />} />
          <Route path="resources" element={<ResourceLibrary />} />
        </Route>
      </Route>

      {/* 兼容旧路径 - 重定向到教师端 */}
      <Route path="/dashboard" element={<Navigate to="/teacher/dashboard" replace />} />
      <Route path="/m1/*" element={<Navigate to="/teacher/m1/*" replace />} />
      <Route path="/m2/*" element={<Navigate to="/teacher/m2/*" replace />} />
      <Route path="/m3/*" element={<Navigate to="/teacher/m3/*" replace />} />

      {/* 404 页面 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
