import {Dialog} from '@mui/material';
import styles from './ChatLevelModal.module.css';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import CharacterLevelGuage from './CharacterLevelGuage';

import {SwiperSlide, Swiper} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import {ChatLevelInfo} from '../MainChat/ChatTypes';
interface ChatLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  levelInfo: ChatLevelInfo | null;
  profileImage: string;
  bubbleText: string;
  rewardItems: any[];
}

const ChatLevelModal: React.FC<ChatLevelModalProps> = ({
  isOpen,
  onClose,
  levelInfo,
  profileImage,
  bubbleText,
  rewardItems,
}) => {
  return (
    <Dialog open={isOpen} fullScreen style={{maxWidth: '1300px', margin: '0 auto'}} onClose={onClose}>
      <div className={styles.levelModalContainer}>
        <CreateDrawerHeader title="Chat Level" onClose={onClose} style={{backgroundColor: '#EFEFEF'}} />
        <div className={styles.rewardPreviewArea}>
          <div className={`${styles.rewardItemArea} ${styles.rewardBorder}`}>
            <div className={styles.swiperContainer}>
              <Swiper
                spaceBetween={6}
                slidesPerView={1}
                onSlideChange={() => {}}
                pagination={{
                  el: `.${styles.rewardBorderPagination}`,
                  clickable: true,
                  renderBullet: (index, className) =>
                    `<span class="${className} ${styles.paginationBullet} ${
                      index > -1 ? styles.selected : ''
                    }"></span>`,
                }}
                modules={[Pagination]}
                style={{width: '76px', height: '80px'}}
              >
                {rewardItems.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className={styles.rewardSwiperItem}>
                      <div
                        className={styles.rewardBorderWrapper}
                        style={{
                          background: item.border,
                          padding: '4px',
                          borderRadius: '50%',
                        }}
                      >
                        <div
                          className={styles.rewardSwiperItemImage}
                          style={{
                            backgroundImage: `url(${profileImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            aspectRatio: '1/1',
                            // border: `4px solid ${item.border}`,
                          }}
                        ></div>
                      </div>
                      <div className={styles.rewardSwiperItemTitle} style={{color: `${item.color}`}}>
                        {item.title}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className={`${styles.rewardBorderPagination} swiper-pagination`}></div>
            </div>
          </div>
          <div className={`${styles.rewardItemArea} ${styles.rewardChattingBubble}`}>
            <div className={styles.swiperContainer}>
              <Swiper
                spaceBetween={6}
                slidesPerView={1}
                onSlideChange={() => {}}
                pagination={{
                  el: `.${styles.rewardBubblePagination}`,
                  clickable: true,
                  renderBullet: (index, className) =>
                    `<span class="${className} ${styles.paginationBullet} ${
                      index > -1 ? styles.selected : ''
                    }"></span>`,
                }}
                modules={[Pagination]}
                style={{width: '200px', height: '80px'}}
              >
                {rewardItems.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className={styles.rewardSwiperItem}>
                      <div className={styles.bubbleSample} style={{backgroundColor: `${item.color}`, color: 'white'}}>
                        {bubbleText}
                      </div>
                      <div className={styles.rewardSwiperItemTitle} style={{color: `${item.color}`}}>
                        {item.description}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className={`${styles.rewardBubblePagination} swiper-pagination`}></div>
            </div>
          </div>
        </div>
        <div className={styles.levelGuageContainer}>
          <CharacterLevelGuage levelInfo={levelInfo} canClick={false} rewardItems={rewardItems} />
        </div>
      </div>
    </Dialog>
  );
};

export default ChatLevelModal;
