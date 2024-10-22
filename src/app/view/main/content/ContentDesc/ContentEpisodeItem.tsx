import React, {useState} from 'react';
import Style from './ContentEpisodeItem.module.css'; // CSS 파일 임포트
import MovieIcon from '@mui/icons-material/Movie';
import ImageIcon from '@mui/icons-material/Image';
import {EpisodeCardProps} from '@/types/apps/episode-card-type'; // 에피소드 타입 정의
import {useDispatch} from 'react-redux';
import {setDrawerEpisodeId} from '@/redux-store/slices/drawerContentDescSlice';

const ContentEpisodeItem: React.FC<EpisodeCardProps> = ({episodeId, intimacy, imageCount, thumbnail, name: title}) => {
  const dispatch = useDispatch();
  const [episodeDesc, setEpisodeDesc] = useState('Episode Description'); // 에피소드 설명

  const handleOpenEpisodeDrawer = () => {
    dispatch(setDrawerEpisodeId(episodeId));
  };

  return (
    <div className={Style.episodeCard}>
      <img
        src={thumbnail}
        alt={`Episode ${episodeId} Thumbnail`}
        className={Style.episodeImage}
        onClick={handleOpenEpisodeDrawer}
      />
      <div className={Style.episodeOverlay}>
        <div className={Style.episodeInfo}>
          <h3>{title}</h3>
          <div className={Style.episodeIcons}>
            <div className={Style.iconInfo}>
              <MovieIcon />
              <span>{intimacy}</span>
            </div>
            <div className={Style.iconInfo}>
              <ImageIcon />
              <span>{imageCount}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={Style.episodeDescription}>{episodeDesc}</div>
    </div>
  );
};

export default ContentEpisodeItem;
