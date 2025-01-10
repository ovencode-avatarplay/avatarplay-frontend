import React, {useEffect, useState} from 'react';
import styles from './ReelsContent.module.css';
import {Swiper, SwiperClass, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import {Pagination} from 'swiper/modules';
import {FeedInfo} from '@/app/NetWork/ShortsNetwork';
import ReactPlayer from 'react-player';
import {BoldComment, BoldDislike, BoldLike, BoldMore, BoldPause, BoldPlay, BoldShare, LineArchive} from '@ui/Icons';
import {Avatar} from '@mui/material';

interface ReelsContentProps {
  item: FeedInfo;
}

const ReelsContent: React.FC<ReelsContentProps> = ({item}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isFollow, setIsFollow] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
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
              navigation={true}
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
            <div onClick={handleClick} style={{position: 'relative', width: '100%', height: '100%'}}>
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

              <div
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
              </div>
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

        <div className={styles.profileBox}>
          <div className={styles.dim}></div>

          {/* User Info */}
          <div className={styles.userInfo}>
            <Avatar src={item.characterProfileUrl || '/images/001.png'} style={{width: '32px', height: '32px'}} />

            <div className={styles.profileDetails}>
              <span className={styles.username}>{item.characterProfileName}</span>
              <span className={styles.sponsored}>Sponsored</span>
            </div>
            <button
              className={isFollow ? styles.followButtonOn : styles.followButtonOff}
              onClick={() => {
                setIsFollow(!isFollow);
                console.log('isfollow', isFollow);
              }}
            >
              Follow
            </button>
          </div>

          <div className={styles.text_container}>
            <div
              className={styles.text_content}
              style={{
                maxHeight: isExpanded ? 'none' : '20px',
                overflowY: isExpanded ? 'auto' : 'hidden',
                marginBottom: isExpanded ? '20px' : '0px',
              }}
            >
              {item.description}
            </div>
            <button
              onClick={() => {
                toggleExpanded();
              }}
              className={styles.button2}
            >
              {isExpanded ? '간단히' : '자세히'}
            </button>
          </div>

          {/* Video Info */}
          <div className={styles.videoInfo}>Video · 2:30/15:25</div>
        </div>
        {/* CTA Buttons */}
        <div className={styles.ctaButtons}>
          <div className={styles.textButtons}>
            <img src={BoldLike.src} className={styles.button}></img>
            1200
          </div>
          <div className={styles.textButtons}>
            <img src={BoldDislike.src} className={styles.button}></img>
            1200
          </div>
          <div className={styles.textButtons}>
            <img src={BoldComment.src} className={styles.button}></img>
            40
          </div>
          <div className={styles.noneTextButton}>
            <img src={BoldShare.src} className={styles.button}></img>
          </div>
          <div className={styles.noneTextButton}>
            <img src={LineArchive.src} className={styles.button}></img>
          </div>
          <div className={styles.noneTextButton}>
            <img src={BoldMore.src} className={styles.button}></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelsContent;
