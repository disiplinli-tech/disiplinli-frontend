import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Sayfaların import edilmesi
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CoachDashboard from './pages/CoachDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Students from './pages/Students';
import StudentDetail from './pages/StudentDetail';
import Schedule from './pages/Schedule';
import StudentSchedule from './pages/StudentSchedule';
import Exams from './pages/Exams';
import ExamResults from './pages/ExamResults';
import Assignments from './pages/Assignments';
import Chat from './pages/Chat';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ana sayfa açılınca Login'e at */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login Sayfası */}
        <Route path="/login" element={<Login />} />

        {/* Dashboardlar */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/coach-dashboard" element={<CoachDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />

        {/* Öğrenci İşlemleri */}
        <Route path="/students" element={<Students />} />
        <Route path="/student/:id" element={<StudentDetail />} />

        {/* Program ve Takvim */}
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/student-schedule" element={<StudentSchedule />} />

        {/* Sınavlar ve Ödevler */}
        <Route path="/exams" element={<Exams />} />
        <Route path="/exam-results" element={<ExamResults />} />
        <Route path="/assignments" element={<Assignments />} />

        {/* Diğer */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;