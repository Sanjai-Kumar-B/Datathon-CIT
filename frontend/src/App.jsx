import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelect from './pages/RoleSelect';

// Teacher Components
import TeacherDashboard from './teacher/Dashboard';
import TeacherLessonPlanner from './teacher/LessonPlanner';
import TeacherFlashcardGenerator from './teacher/FlashcardGenerator';
import TeacherResources from './teacher/Resources';
import TeacherInsights from './teacher/StudentInsights';
import TeacherVideoGenerator from './teacher/VideoGenerator';
import ParentCommunication from './teacher/ParentCommunication';
import TeacherSettings from './teacher/Settings';

// Parent Components
import ParentDashboard from './parent/Dashboard';
import ParentAssistant from './parent/Assistant';
import LanguageSettings from './parent/LanguageSettings';
import ParentProgressReport from './parent/ProgressReport';
import ParentSettings from './parent/Settings';
import ParentActivities from './parent/Activities';
import Register from './pages/Register';
import Login from './pages/Login';

// Child Components
import ChildWelcome from './child/Welcome';
import MissionFeed from './child/MissionFeed';
import MissionPlay from './child/MissionPlay';
import MissionCompleted from './child/MissionCompleted';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        
        {/* Teacher Routes */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/lesson-planner" element={<TeacherLessonPlanner />} />
        <Route path="/teacher/flashcards" element={<TeacherFlashcardGenerator />} />
        <Route path="/teacher/resources" element={<TeacherResources />} />
        <Route path="/teacher/insights" element={<TeacherInsights />} />
        <Route path="/teacher/video-generator" element={<TeacherVideoGenerator />} />
        <Route path="/teacher/communication" element={<ParentCommunication />} />
        <Route path="/teacher/settings" element={<TeacherSettings />} />

        {/* Parent Routes */}
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/parent/assistant" element={<ParentAssistant />} />
        <Route path="/parent/settings" element={<LanguageSettings />} />
        <Route path="/parent/progress" element={<ParentProgressReport />} />
        <Route path="/parent/activities" element={<ParentActivities />} />

        {/* Auth */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Child Routes */}
        <Route path="/child" element={<ChildWelcome />} />
        <Route path="/child/missions" element={<MissionFeed />} />
        <Route path="/child/mission/:missionId" element={<MissionPlay />} />
        <Route path="/child/completed" element={<MissionCompleted />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
