import React, {useState} from 'react';
import Style from './ExploreCard.module.css'; // CSS 파일 임포트
import MovieIcon from '@mui/icons-material/Movie';
import ImageIcon from '@mui/icons-material/Image';
import {ExploreCardProps} from '@/types/apps/explore-card-type';
import {useDispatch} from 'react-redux';
import {openDrawerContentId, setDrawerEpisodeId} from '@/redux-store/slices/drawerContentDescSlice';
import {string} from 'valibot';

const ExploreCard: React.FC<ExploreCardProps> = ({contentId, episodeId, shortsId, thumbnail}) => {
  const dispatch = useDispatch();
  const [exploreDesc, setExploreDesc] = useState('DESC');

  const handleOpenDrawer = () => {
    dispatch(openDrawerContentId(contentId));
  };

  return (
    <>
      <div className={Style.exploreCard}>
        <img src={thumbnail} alt={thumbnail} className={Style.exploreImage} onClick={handleOpenDrawer} />
        <div className={Style.exploreOverlay}>
          <div className={Style.exploreInfo}>
            <div className={Style.exploreIcons}>
              <h3>{contentId}</h3>
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
        <div>{exploreDesc}</div>
      </div>
    </>
  );
};

export default ExploreCard;
