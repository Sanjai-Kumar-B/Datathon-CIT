import React from 'react';
import { Lightbulb, Footprints, ClipboardList } from 'lucide-react';

const ResponseCard = ({ response }) => {
  if (!response) return null;

  return (
    <div className="response-card animate-fade-in">
      <section className="response-section main-answer">
        <div className="section-header">
          <Lightbulb className="icon orange" />
          <h2>Teaching Guidance</h2>
        </div>
        <p className="answer-text">{response.answer}</p>
      </section>

      <div className="response-grid">
        <section className="response-section activities">
          <div className="section-header">
            <Footprints className="icon blue" />
            <h2>Suggested Activities</h2>
          </div>
          <ul>
            {response.activities.map((activity, i) => (
              <li key={i}>{activity}</li>
            ))}
          </ul>
        </section>

        <section className="response-section tips">
          <div className="section-header">
            <ClipboardList className="icon green" />
            <h2>Pro Tips</h2>
          </div>
          <ul>
            {response.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </section>
      </div>

      <style>{`
        .response-card {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .response-section {
          background: white;
          padding: 2rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          border: 1px solid rgba(0,0,0,0.03);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .section-header h2 {
          font-size: 1.25rem;
          color: var(--text-dark);
          font-weight: 700;
        }

        .icon {
          width: 24px;
          height: 24px;
        }

        .orange { color: var(--teacher-primary); }
        .blue { color: var(--teacher-secondary); }
        .green { color: var(--success); }

        .answer-text {
          font-size: 1.15rem;
          color: var(--text-dark);
          line-height: 1.8;
          white-space: pre-wrap;
        }

        .response-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        ul {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        li {
          position: relative;
          padding-left: 1.5rem;
          color: var(--text-dark);
          line-height: 1.5;
        }

        li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: var(--teacher-primary);
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .response-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default ResponseCard;
