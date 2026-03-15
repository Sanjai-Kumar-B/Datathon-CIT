import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users } from 'lucide-react';

const RoleSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="role-select-universe">
      {/* Background Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <div className="content-wrap">
        <header className="hero-section animate-slide-down">
          <div className="badge">Next-Gen Education</div>
          <h1 className="hero-title">
            AI Learning <span className="text-gradient">Companion</span>
          </h1>
          <p className="hero-subtitle">
            Personalized education powered by advanced AI. Bridging the gap between 
            teachers, parents, and students.
          </p>
        </header>

        <div className="role-grid">
          {/* Teacher Card */}
          <div 
            className="glass-card teacher-card animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
            onClick={() => navigate('/teacher')}
          >
            <div className="card-icon-box">
              <GraduationCap size={32} />
            </div>
            <h3>Teacher</h3>
            <p>Generate lesson plans, flashcards, and track classroom analytics instantly.</p>
            <div className="card-action">
              <span>Enter Portal</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </div>
          </div>

          {/* Student Card */}
          <div 
            className="glass-card student-card animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
            onClick={() => navigate('/child')}
          >
            <div className="card-icon-box">
              <span className="material-symbols-outlined text-4xl">child_care</span>
            </div>
            <h3>Student</h3>
            <p>Access your personalized learning feed, play games, and finish missions.</p>
            <div className="card-action">
              <span>Start Learning</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </div>
          </div>

          {/* Parent Card */}
          <div 
            className="glass-card parent-card animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
            onClick={() => navigate('/parent')}
          >
            <div className="card-icon-box">
              <Users size={32} />
            </div>
            <h3>Parent</h3>
            <p>Monitor your child's progress and get professional AI-driven guidance.</p>
            <div className="card-action">
              <span>View Insights</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </div>
          </div>
        </div>

        <footer className="home-footer animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="auth-box glassmorphism">
            <p>Want a personalized experience?</p>
            <div className="auth-actions">
              <button onClick={() => navigate('/register')} className="btn-primary-glow">
                Create Actual Account
              </button>
              <div className="divider"></div>
              <button onClick={() => navigate('/login')} className="btn-link">
                Already have an account? <span>Sign In</span>
              </button>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

        .role-select-universe {
          min-height: 100vh;
          background: #0f172a;
          color: white;
          font-family: 'Outfit', sans-serif;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        /* Animated Background Orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          z-index: 0;
          opacity: 0.4;
          animation: orb-move 20s infinite alternate ease-in-out;
        }
        .orb-1 { width: 500px; height: 500px; background: #4f46e5; top: -100px; left: -100px; }
        .orb-2 { width: 400px; height: 400px; background: #9333ea; bottom: -50px; right: -50px; animation-delay: -5s; }
        .orb-3 { width: 300px; height: 300px; background: #06b6d4; top: 40%; left: 60%; animation-delay: -10s; }

        @keyframes orb-move {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(50px, 100px) scale(1.1); }
        }

        .content-wrap {
          position: relative;
          z-index: 10;
          max-width: 1200px;
          width: 100%;
          text-align: center;
        }

        .hero-section {
          margin-bottom: 4rem;
        }

        .badge {
          display: inline-block;
          padding: 0.5rem 1.25rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #94a3b8;
          margin-bottom: 1.5rem;
        }

        .hero-title {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -2px;
        }

        .text-gradient {
          background: linear-gradient(to right, #818cf8, #c084fc, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: #94a3b8;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .role-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 5rem;
        }

        .glass-card {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 2.5rem;
          border-radius: 2rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }

        .glass-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 100%;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
          z-index: 0;
        }

        .glass-card:hover {
          transform: translateY(-12px) scale(1.02);
          border-color: rgba(255,255,255,0.3);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .card-icon-box {
          width: 64px;
          height: 64px;
          background: rgba(255,255,255,0.05);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: #818cf8;
          transition: all 0.3s ease;
        }

        .glass-card:hover .card-icon-box {
          background: #818cf8;
          color: white;
          transform: rotate(10deg);
        }

        .glass-card h3 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .glass-card p {
          color: #94a3b8;
          font-size: 1rem;
          line-height: 1.5;
          margin-bottom: 2rem;
        }

        .card-action {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #818cf8;
          transition: all 0.3s ease;
        }

        .glass-card:hover .card-action {
          gap: 1rem;
          color: white;
        }

        .auth-box {
          padding: 2rem;
          border-radius: 2rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          display: inline-block;
        }

        .auth-box p {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .auth-actions {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .btn-primary-glow {
          background: #818cf8;
          color: white;
          padding: 1rem 2rem;
          border-radius: 1rem;
          font-weight: 700;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(129, 140, 248, 0.4);
        }

        .btn-primary-glow:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(129, 140, 248, 0.6);
        }

        .divider {
          width: 1px;
          height: 32px;
          background: rgba(255,255,255,0.1);
        }

        .btn-link {
          color: #94a3b8;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .btn-link span {
          color: #818cf8;
          font-weight: 700;
          margin-left: 0.25rem;
        }

        .btn-link:hover span {
          text-decoration: underline;
        }

        /* Animations */
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slideDown 1s ease-out backwards; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out backwards; }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 1s ease-out backwards; }

        @media (max-width: 768px) {
          .auth-actions { flex-direction: column; gap: 1rem; }
          .divider { display: none; }
          .hero-title { font-size: 3rem; }
        }
      `}</style>
    </div>
  );
};

export default RoleSelect;
