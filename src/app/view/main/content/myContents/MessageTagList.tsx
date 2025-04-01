import React, {useState} from 'react';
import styles from './MessageTagList.module.css';
import CustomHashtag from '@/components/layout/shared/CustomHashtag';
import {Swiper, SwiperSlide} from 'swiper/react';

export enum MessageTagType {
  All = 'All',
  My = 'My',
  Story = 'Story',
  Music = 'Music',
  Gravure = 'Gravure',
  aa = 'aa',
  ss = 'ss',
  dd = 'dd',
}

interface Props {
  onTagChange?: (tab: MessageTagType) => void;
}

const MessageTagList: React.FC<Props> = ({onTagChange: onTagChange}) => {
  const [activeTag, setActiveTag] = useState<MessageTagType>(MessageTagType.All);
  const [isCentered, setIsCentered] = useState<boolean>(false);

  const handleTagClick = (tab: MessageTagType) => {
    setActiveTag(tab);
    if (onTagChange) {
      onTagChange(tab); // 외부에서 상태를 알 수 있도록 콜백 실행
    }
  };

  return (
    <div className={styles.container}>
      {/* 탭 메뉴 */}
      <div className={styles.tags}>
        <Swiper
          className={styles.horizonSwiper}
          // initialSlide={}
          centeredSlides={isCentered}
          slidesPerView="auto"
          spaceBetween={6}
          onSlideChange={
            swiper => setIsCentered(false)
            // handleSelectedLora(swiper.activeIndex)
          }
          onSwiper={() => {}}
        >
          {Object.values(MessageTagType).map(tag => (
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
