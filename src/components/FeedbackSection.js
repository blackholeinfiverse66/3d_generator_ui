import React, { useState } from 'react';

const StarIcon = ({ filled, onClick, onHover, onLeave }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? "#FFD700" : "none"}
    stroke="#FFD700"
    strokeWidth="2"
    style={{ cursor: 'pointer' }}
    onClick={onClick}
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
  >
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const FeedbackSection = ({ onFeedback }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleStarClick = (starRating) => {
    setRating(starRating);
    setSubmitted(true);
    if (onFeedback) {
      onFeedback(starRating, feedback);
    }
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="feedback-section">
      <div className="feedback-content">
        <h3>Rate this design</h3>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              filled={star <= (hoverRating || rating)}
              onClick={() => handleStarClick(star)}
              onHover={() => setHoverRating(star)}
              onLeave={() => setHoverRating(0)}
            />
          ))}
        </div>
        <textarea
          className="feedback-text"
          placeholder="Optional: Share your thoughts about this design..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={2}
        />
        {submitted && (
          <p className="feedback-thanks">Thank you for your feedback!</p>
        )}
      </div>
    </div>
  );
};

export default FeedbackSection;