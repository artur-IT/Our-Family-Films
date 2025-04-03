import React from "react";
import styles from "./RatingBar.module.css";

interface RatingBarProps {
  rating: number;
  maxRating?: number;
}

const RatingBar: React.FC<RatingBarProps> = ({ rating, maxRating = 10 }) => {
  const percentage = (rating / maxRating) * 100;

  let barColor = "#ff4545";

  if (rating >= 7) {
    barColor = "#4caf50";
  } else if (rating >= 5) {
    barColor = "#ffc107";
  }

  return (
    <div className={styles.ratingBarContainer}>
      <div className={styles.ratingBar}>
        <div className={styles.ratingFill} style={{ width: `${percentage}%`, backgroundColor: barColor }}></div>
      </div>
      <span className={styles.ratingValue}>
        {rating.toFixed(1)}/{maxRating}
      </span>
    </div>
  );
};

export default RatingBar;
