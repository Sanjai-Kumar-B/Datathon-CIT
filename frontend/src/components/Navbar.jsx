import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  MessageCircle, 
  Grid, 
  Languages, 
  LogOut 
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  
  const navItems = [
    { name: 'Home', icon: <Home size={18} />, path: '/parent' },
    { name: 'Ask Guide', icon: <MessageCircle size={18} />, path: '/parent/ask' },
    { name: 'Flashcards', icon: <Grid size={18} />, path: '/parent/flashcards' },
    { name: 'Translate', icon: <Languages size={18} />, path: '/parent/translate' },
  ];

  return (
    <nav className="navbar animate-fade-in">
      <div className="navbar-content">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <div className="logo-icon">AI</div>
          <div className="logo-text">
            <span>Companion</span>
            <small>Parent Hub</small>
          </div>
        </div>

        <div className="navbar-links">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        <button className="exit-btn" onClick={() => navigate('/')}>
          <LogOut size={18} />
          <span>Exit</span>
        </button>
      </div>

      <style>{`
        .navbar {
          height: 80px;
          background: white;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          border-bottom: 1px solid rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .navbar-content {
          max-width: 1200px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: var(--parent-gradient);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          font-weight: 800;
          font-size: 0.8rem;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-text span {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-dark);
          line-height: 1.1;
        }

        .logo-text small {
          font-weight: 600;
          font-size: 0.75rem;
          color: var(--parent-primary);
        }

        .navbar-links {
          display: flex;
          gap: 1.5rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          color: var(--text-light);
          transition: var(--transition-fast);
        }

        .nav-link:hover {
          color: var(--parent-primary);
          background: #f8fafc;
        }

        .nav-link.active {
          color: var(--parent-primary);
          background: #f3eff5;
        }

        .exit-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          color: var(--text-light);
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
        }

        .exit-btn:hover {
          color: var(--error);
          background: #fff1f2;
        }

        @media (max-width: 768px) {
          .nav-link span, .exit-btn span { display: none; }
          .navbar-links { gap: 0.5rem; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
