import { useState } from "react";

export const MovieRating = () => {
  const [rating, setRating] = useState(0);

  const handleRating = (value: number) => {
    setRating(value);
  };

  return (
    <div className="movie-rating">
      <h3>Rate this movie</h3>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} className={`star ${rating >= star ? "active" : ""}`} onClick={() => handleRating(star)}>
            ★
          </button>
        ))}
      </div>
      <p>Your rating: {rating} stars</p>
    </div>
  );
};
