import React, {useEffect, useState} from 'react';
import styles from './SwipeTagList.module.css';
import CustomHashtag from '@/components/layout/shared/CustomHashtag';
import {Swiper, SwiperSlide} from 'swiper/react';
import getLocalizedText from '@/utils/getLocalizedText';

interface Props {
  tags: string[]; // 외부에서 전달
  onTagChange?: (tag: string) => void;
  currentTag?: string;
  isBorder?: boolean;
}
const SwipeTagList: React.FC<Props> = ({tags, onTagChange, currentTag, isBorder = true}) => {
  const [activeTag, setActiveTag] = useState<string>(currentTag ?? tags[0]);
  const [isCentered, setIsCentered] = useState<boolean>(false);
  const handleTagClick = (tag: string) => {
    setActiveTag(tag);
    onTagChange?.(tag);
  };

  useEffect(() => {
    if (currentTag) {
      setActiveTag(currentTag);
    }
  }, [currentTag]);

  const getLocalizedTag = (tag: string) => {
    return getLocalizedText(tag);
  };

  return (
    <div className={isBorder ? styles.container : styles.containerNoBorder}>
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
              <CustomHashtag
                isSelected={activeTag === tag}
                onClickAction={() => handleTagClick(tag)}
                text={getLocalizedTag(tag)}
                unselectedClassName={styles.unselectedClassName}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
export default SwipeTagList;
