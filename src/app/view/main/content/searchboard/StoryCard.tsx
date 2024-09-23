import React from 'react';
import './StoryCard.css'; // CSS 파일 임포트
import MovieIcon from '@mui/icons-material/Movie';
import ImageIcon from '@mui/icons-material/Image';
import { StoryCardProps } from '@/types/apps/story-card-type';

const StoryCard: React.FC<StoryCardProps> = ({ title, number1, number2, imageUrl }) => {
  return (
    <>
    <div className="story-card">
      <img src={imageUrl} alt={title} className="story-image" />
      <div className="story-overlay">
        <div className="story-info">
          <div className="story-icons">
            <h3>{title}</h3>
            <div className="icon-info">
              <MovieIcon />
              <span>{number1}</span>
            </div>
            <div className="icon-info">
              <ImageIcon />
              <span>{number2}</span>
            </div>
          </div>
        </div>
      </div>
    <div>
    <textarea className="story-textarea" placeholder="Add a comment..."></textarea>
    </div>
    </div>
    </>
  );
};

export default StoryCard;
