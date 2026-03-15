import React from 'react';

const Loader = ({ message = "Thinking..." }) => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>{message}</p>

      <style>{`
        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          min-height: 200px;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(0,0,0,0.1);
          border-left-color: var(--teacher-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        p {
          color: var(--text-light);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default Loader;
