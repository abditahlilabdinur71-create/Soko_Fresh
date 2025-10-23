import React, { useState } from 'react';
import { StarIcon } from './icons';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
  interactive = false,
  // FIX: The default `onRate` function must accept a parameter to match the prop's type signature.
  // This resolves the "Expected 0 arguments, but got 1" error when `onRate` is called without being passed as a prop.
  onRate = (_rating) => {},
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseOver = (index: number) => {
    if (interactive) {
      setHoverRating(index + 1);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const handleClick = (index: number) => {
    if (interactive) {
      onRate(index + 1);
    }
  };
  
  const stars = Array.from({ length: totalStars }, (_, index) => {
    const starValue = index + 1;
    const isFilled = starValue <= (hoverRating || rating);
    
    return (
      <button
        key={index}
        type="button"
        onMouseOver={() => handleMouseOver(index)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(index)}
        disabled={!interactive}
        className={`focus:outline-none ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
        aria-label={`Rate ${starValue} out of ${totalStars} stars`}
      >
        <StarIcon filled={isFilled} />
      </button>
    );
  });

  return <div className={`flex items-center space-x-0.5 ${className}`}>{stars}</div>;
};

export default StarRating;