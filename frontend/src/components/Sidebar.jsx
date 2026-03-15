import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Layers, 
  Languages, 
  Settings, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Classroom', icon: <LayoutDashboard size={20} />, path: '/teacher', active: true },
    { name: 'Courses', icon: <Layers size={20} />, path: '/teacher/courses' },
    { name: 'Concept Videos', icon: <div style={{ fontSize: '14px', fontWeight: 'bold' }}>▷</div>, path: '/teacher/videos' },
    { name: 'Quizzes', icon: <MessageSquare size={20} />, path: '/teacher/ask' },
    { name: 'Tests', icon: <ClipboardList size={20} />, path: '/teacher/tests' },
    { name: 'Study Materials', icon: <Layers size={20} />, path: '/teacher/materials' },
    { name: 'Doubt Solving', icon: <MessageCircle size={20} />, path: '/teacher/doubts', badge: 'NEW' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Vedantu_Logo.png" alt="Vedantu" style={{ height: '30px' }} 
             onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
        <span style={{ display: 'none', color: '#ff6b35', fontSize: '1.5rem', fontWeight: '900' }}>Vedantu</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.name}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>

      <style>{`
        .sidebar {
          width: 240px;
          height: 100vh;
          background: #ffffff;
          border-right: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
          padding: 1.5rem 0.5rem;
          position: fixed;
          left: 0;
          top: 0;
        }

        .sidebar-logo {
          padding: 0 1rem;
          margin-bottom: 2.5rem;
          display: flex;
          align-items: center;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          color: #4a4a4a;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          transition: 0.2s;
          text-decoration: none;
          position: relative;
        }

        .nav-link:hover {
          background: #fdf2f2;
          color: #ff6b35;
        }

        .nav-link.active {
          background: #fdf2f2;
          color: #ff6b35;
          border-right: 3px solid #ff6b35;
          border-radius: 8px 0 0 8px;
        }

        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
        }

        .nav-badge {
          background: #ff6b35;
          color: white;
          font-size: 0.65rem;
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: auto;
          font-weight: 800;
        }

        @media (max-width: 1024px) {
          .sidebar { width: 70px; }
          .sidebar-logo, .nav-link span:not(.nav-icon) { display: none; }
          .nav-link { justify-content: center; }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
