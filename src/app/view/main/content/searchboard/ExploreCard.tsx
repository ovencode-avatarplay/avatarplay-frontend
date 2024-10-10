import React from 'react';
import Style from './ExploreCard.module.css'; // CSS 파일 임포트
import MovieIcon from '@mui/icons-material/Movie';
import ImageIcon from '@mui/icons-material/Image';
import { ExploreCardProps } from '@/types/apps/explore-card-type';
import { useDispatch } from 'react-redux';
import { openDrawerContentDesc } from '@/redux-store/slices/drawerContentDescSlice';
import { string } from 'valibot';

const ExploreCard: React.FC<ExploreCardProps> = ({ episodeId,shortsId,thumbnail }) => {
  const dispatch = useDispatch();

  const handleOpenDrawer = () => {
    dispatch(openDrawerContentDesc(String(episodeId))); // ID 값을 전달하여 Drawer 열기
  };

  return (
    <>
      <div className={Style.exploreCard}>
        <img src={thumbnail} alt={thumbnail} className={Style.exploreImage} onClick={handleOpenDrawer} />
        <div className={Style.exploreOverlay}>
          <div className={Style.exploreInfo}>
            <div className={Style.exploreIcons}>
              <h3>{episodeId}</h3>
              <div className={Style.iconInfo}>
                <MovieIcon />
                <span>{shortsId}</span>
              </div>
              <div className={Style.iconInfo}>
                <ImageIcon />
                <span>{shortsId}</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <textarea className={Style.exploreTextarea} placeholder="Add a comment..."></textarea>
        </div>
      </div>
    </>
  );
};

export default ExploreCard;
