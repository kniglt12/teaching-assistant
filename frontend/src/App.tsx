import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';

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
import SchoolDashboard from './pages/M3/SchoolDashboard';
import ComplianceAudit from './pages/M3/ComplianceAudit';
import ResourceLibrary from './pages/M3/ResourceLibrary';

import PrivateRoute from './components/Auth/PrivateRoute';
import './App.css';

function App() {
  return (
    <Routes>
      {/* 登录页面 */}
      <Route path="/login" element={<Login />} />

      {/* 主应用布局 */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        {/* 首页 - 跳转到仪表盘 */}
        <Route index element={<Navigate to="/dashboard" replace />} />

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
          <Route path="school-dashboard" element={<SchoolDashboard />} />
          <Route path="compliance" element={<ComplianceAudit />} />
          <Route path="resources" element={<ResourceLibrary />} />
        </Route>
      </Route>

      {/* 404 页面 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
