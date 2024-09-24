import React from 'react';
import './ExploreCard.css'; // CSS 파일 임포트
import MovieIcon from '@mui/icons-material/Movie';
import ImageIcon from '@mui/icons-material/Image';
import { ExploreCardProps } from '@/types/apps/explore-card-type';

const ExploreCard: React.FC<ExploreCardProps> = ({ characterId,shortsId,thumbnail }) => {
  return (
    <>
    <div className="explore-card">
      <img src={thumbnail} alt={thumbnail} className="explore-image" />
      <div className="explore-overlay">
        <div className="explore-info">
          <div className="explore-icons">
            <h3>{characterId}</h3>
            <div className="icon-info">
              <MovieIcon />
              <span>{shortsId}</span>
            </div>
            <div className="icon-info">
              <ImageIcon />
              <span>{shortsId}</span>
            </div>
          </div>
        </div>
      </div>
    <div>
    <textarea className="explore-textarea" placeholder="Add a comment..."></textarea>
    </div>
    </div>
    </>
  );
};

export default ExploreCard;
