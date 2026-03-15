import React from 'react';

const FlashcardGrid = ({ cards }) => {
  if (!cards || cards.length === 0) return null;

  return (
    <div className="flashcard-grid animate-fade-in">
      {cards.map((card, i) => (
        <div key={i} className="flashcard-container">
          <div className="flashcard">
            <div className="flashcard-front">
              <span className="card-emoji">{card.emoji}</span>
              <p>{card.front}</p>
              <span className="flip-hint">Click to see answer</span>
            </div>
            <div className="flashcard-back">
              <p>{card.back}</p>
              <span className="flip-hint">Click to see front</span>
            </div>
          </div>
        </div>
      ))}

      <style>{`
        .flashcard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .flashcard-container {
          perspective: 1000px;
          height: 280px;
        }

        .flashcard {
          width: 100%;
          height: 100%;
          position: relative;
          transition: transform 0.6s;
          transform-style: preserve-3d;
          cursor: pointer;
        }

        .flashcard-container:hover .flashcard {
          /* No auto-flip on hover, let user click if they want */
        }
        
        /* Using a simple class toggle for flip would be better in a larger app, 
           for now we'll use a CSS-only hover flip for demonstration */
        .flashcard-container:active .flashcard {
          transform: rotateY(180deg);
        }

        .flashcard-front, .flashcard-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          border-radius: var(--radius-lg);
          text-align: center;
          box-shadow: var(--shadow-md);
          border: 1px solid rgba(0,0,0,0.05);
        }

        .flashcard-front {
          background: white;
          color: var(--text-dark);
        }

        .flashcard-back {
          background: var(--teacher-gradient);
          color: white;
          transform: rotateY(180deg);
        }

        .card-emoji {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          display: block;
        }

        .flashcard-front p {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .flashcard-back p {
          font-size: 1.15rem;
          font-weight: 500;
        }

        .flip-hint {
          position: absolute;
          bottom: 1rem;
          font-size: 0.75rem;
          opacity: 0.6;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
};

export default FlashcardGrid;
