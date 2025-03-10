import React from 'react';
import styles from './DrawerStoryDesc.module.css';
import 'swiper/css';
import 'swiper/css/pagination';

import ContentEpisodeItem from './StoryEpisodeItem'; // 아이템 컴포넌트 임포트
import {EpisodeCardProps} from './StoryDescType';

interface DrawerContentEpisodeItemListProps {
  episodes: EpisodeCardProps[];
  onEpisodeSelect: (index: number) => void;
}

const DrawerContentEpisodeItemList: React.FC<DrawerContentEpisodeItemListProps> = ({episodes, onEpisodeSelect}) => {
  return (
    <div className={styles.episodeInfoList}>
      {episodes.map(episode => (
        <ContentEpisodeItem
          episodeId={episode.episodeId}
          name={episode.name}
          desc={episode.desc}
          thumbnail={episode.thumbnail}
          intimacy={episode.intimacy}
          isLock={episode.isLock}
          imageCount={episode.imageCount}
        />
      ))}
    </div>
  );
};

export default DrawerContentEpisodeItemList;
