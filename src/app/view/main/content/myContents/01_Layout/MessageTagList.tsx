import React, {useState} from 'react';
import styles from './MessageTagList.module.css';
import CustomHashtag from '@/components/layout/shared/CustomHashtag';
import {Swiper, SwiperSlide} from 'swiper/react';

interface Props {
  tags: string[]; // 외부에서 전달
  onTagChange?: (tag: string) => void;
  defaultTag?: string;
}

const MessageTagList: React.FC<Props> = ({tags, onTagChange, defaultTag}) => {
  const [activeTag, setActiveTag] = useState<string>(defaultTag ?? tags[0]);
  const [isCentered, setIsCentered] = useState<boolean>(false);

  const handleTagClick = (tag: string) => {
    setActiveTag(tag);
    onTagChange?.(tag);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tags}>
        <Swiper
          className={styles.horizonSwiper}
          centeredSlides={isCentered}
          slidesPerView="auto"
          spaceBetween={6}
          onSlideChange={() => setIsCentered(false)}
        >
          {tags.map(tag => (
            <SwiperSlide key={tag} className={styles.swiperSlide} style={{width: 'auto'}}>
              <CustomHashtag isSelected={activeTag === tag} onClickAction={() => handleTagClick(tag)} text={tag} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default MessageTagList;
