import React, {useState} from 'react';
import styles from './ReelsContent.module.css';
import {Swiper, SwiperClass, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import {Pagination} from 'swiper/modules';
import {FeedInfo} from '@/app/NetWork/ShortsNetwork';
import ReactPlayer from 'react-player';
import {BoldPause, BoldPlay} from '@ui/Icons';

interface ReelsContentProps {
  item: FeedInfo;
}

const ReelsContent: React.FC<ReelsContentProps> = ({item}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0); // 현재 슬라이드 인덱스 상태
  const [videoProgress, setVideoProgress] = useState(0); // 비디오 진행도 상태
  const [videoDuration, setVideoDuration] = useState(0); // 비디오 총 길이
  const handleClick = () => {
    setIsPlaying(!isPlaying);
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300); // 애니메이션이 끝난 후 상태 초기화
  };
  const handleSlideChange = (swiper: SwiperClass) => {
    setActiveIndex(swiper.activeIndex); // Swiper의 activeIndex로 상태 업데이트
  };

  const handleVideoProgress = (playedSeconds: number) => {
    setVideoProgress(playedSeconds);
  };

  return (
    <div className={styles.reelsContainer}>
      <div className={styles.mainContent}>
        <div className={styles.Image}>
          {item.mediaState === 1 && (
            <Swiper
              style={{
                height: '100%',
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Pagination]}
              className={styles.mySwiper}
              initialSlide={0}
              onSlideChange={handleSlideChange} // 슬라이드 변경 이벤트 핸들러 추가
            >
              {item?.mediaUrlList.map((url, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={url}
                    alt={`Slide ${idx}`}
                    loading="lazy"
                    style={{width: '100%', height: '100%', objectFit: 'contain'}}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          {item.mediaState === 2 && (
            <div style={{position: 'relative', width: '100%', height: '100%'}}>
              <ReactPlayer
                muted={true}
                url={item.mediaUrlList[0]} // 첫 번째 URL 사용
                playing={isPlaying} // 재생 상태
                width="100%"
                height="100%"
                style={{
                  borderRadius: '8px',
                }}
                onProgress={({playedSeconds}) => handleVideoProgress(playedSeconds)} // 비디오 진행도 업데이트
                onDuration={duration => setVideoDuration(duration)} // 비디오 총 길이 설정
              />
              <button
                onClick={handleClick}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                }}
              >
                <div className={`${styles.playCircleIcon} ${isClicked ? styles.fadeAndGrow : ''}`}>
                  <img src={isPlaying ? BoldPause.src : BoldPlay.src} />
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width:
                item.mediaState === 1
                  ? `${((activeIndex + 1) / item.mediaUrlList.length) * 100}%` // 이미지 슬라이드 진행도
                  : `${(videoProgress / videoDuration) * 100}%`, // 비디오 진행도
            }}
          ></div>
        </div>
        <div className={styles.dim}></div>

        {/* User Info */}
        <div className={styles.userInfo}>
          <div className={styles.profilePicture}></div>
          <div className={styles.profileDetails}>
            <span className={styles.username}>your-name</span>
            <span className={styles.sponsored}>Sponsored</span>
          </div>
          <button className={styles.followButton}>Follow</button>
        </div>

        {/* Description */}
        <div className={styles.description}>Lorem ipsum dolor sit amet, consectetur...</div>

        {/* Video Info */}
        <div className={styles.videoInfo}>Video · 2:30/15:25</div>

        {/* CTA Buttons */}
        <div className={styles.ctaButtons}>
          <div className={styles.likeButton}></div>
          <div className={styles.dislikeButton}></div>
          <div className={styles.commentButton}></div>
          <div className={styles.shareButton}></div>
        </div>
      </div>
    </div>
  );
};

export default ReelsContent;
