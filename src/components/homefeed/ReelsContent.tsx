import React, {useEffect, useState} from 'react';
import styles from './ReelsContent.module.css';
import {Swiper, SwiperClass, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import {Pagination} from 'swiper/modules';
import {FeedInfo, sendFeedDisLike, sendFeedLike} from '@/app/NetWork/ShortsNetwork';
import ReactPlayer from 'react-player';
import {
  BoldComment,
  BoldDislike,
  BoldLike,
  BoldMore,
  BoldPause,
  BoldPlay,
  BoldShare,
  BoldVideo,
  LineArchive,
} from '@ui/Icons';
import {Avatar} from '@mui/material';
import ReelsComment from './ReelsComment';

interface ReelsContentProps {
  item: FeedInfo;
}

const ReelsContent: React.FC<ReelsContentProps> = ({item}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const [isLike, setIsLike] = useState(item.isLike);
  const [isDisLike, setIsDisLike] = useState(item.isDisLike);
  const [isExpanded, setIsExpanded] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likeCount);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  const [activeIndex, setActiveIndex] = useState(0); // 현재 슬라이드 인덱스 상태
  const [videoProgress, setVideoProgress] = useState(0); // 비디오 진행도 상태
  const [currentProgress, setCurrentProgress] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState(0); // 비디오 총 길이

  const [isCommentOpen, setCommentIsOpen] = useState(false);

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
  const handleLikeFeed = async (feedId: number, isLike: boolean) => {
    try {
      // if (isDisLike == true) {
      //   await handleDisLikeFeed(item.id, !isDisLike);
      // }
      const response = await sendFeedLike(feedId, isLike);

      if (response.resultCode === 0) {
        console.log(`Feed ${feedId} has been ${isLike ? 'liked' : 'unliked'} successfully!`);

        setIsLike(isLike);
      } else {
        console.error(`Failed to like/unlike feed: ${response.resultMessage}`);
      }
    } catch (error) {
      console.error('An error occurred while liking/unliking the feed:', error);
    }
  };
  const handleDisLikeFeed = async (feedId: number, isLike: boolean) => {
    try {
      // if (isLike == true) {
      //   await handleLikeFeed(item.id, !isLike);
      // }
      const response = await sendFeedDisLike(feedId, isLike);

      if (response.resultCode === 0) {
        console.log(`Feed ${feedId} has been ${isLike ? 'liked' : 'unliked'} successfully!`);
        setIsDisLike(isLike);
      } else {
        console.error(`Failed to like/unlike feed: ${response.resultMessage}`);
      }
    } catch (error) {
      console.error('An error occurred while liking/unliking the feed:', error);
    }
  };
  React.useEffect(() => {}, [item]);
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
                onProgress={({playedSeconds}) => {
                  handleVideoProgress(playedSeconds);

                  setCurrentProgress(formatDuration(playedSeconds));
                }} // 비디오 진행도 업데이트
                onDuration={(duration: number) => {
                  setVideoDuration(duration);
                }} // 영상 길이 설정
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
                width: isExpanded ? '80%' : '100%',
              }}
              onClick={() => {
                toggleExpanded();
              }}
            >
              {isExpanded
                ? item.description
                : item.description.length > 20 // 접힌 상태에서 최대 길이 제한
                ? `${item.description.slice(0, 17)}...` // 첫 17글자 + "..."
                : item.description}
            </div>
          </div>
          {/* Video Info */}
          <div className={styles.videoInfo}>
            {item.mediaState == 1 && <>Image</>}
            {item.mediaState == 2 && (
              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center'}}>
                <div style={{height: '16.67px', width: '16.67px'}}>
                  <img src={BoldVideo.src} style={{height: '100%', width: '100%'}}></img>
                </div>
                Video · {currentProgress ? currentProgress : '0:00'}/{formatDuration(videoDuration)}
              </div>
            )}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={styles.ctaButtons}>
          <div
            className={styles.textButtons}
            onClick={() => {
              handleLikeFeed(item.id, !isLike);
            }}
          >
            <img
              src={BoldLike.src}
              className={styles.button}
              style={{
                filter: isLike
                  ? 'brightness(0) saturate(100%) invert(47%) sepia(57%) saturate(1806%) hue-rotate(287deg) brightness(102%) contrast(98%)'
                  : 'none', // 기본 상태는 필터 없음
              }}
            />
            {item.likeCount}
          </div>

          {/* Dislike Button */}
          <div
            className={styles.textButtons}
            onClick={() => {
              handleDisLikeFeed(item.id, !isDisLike);
            }}
          >
            <img
              src={BoldDislike.src}
              className={styles.button}
              style={{
                filter: isDisLike
                  ? 'brightness(0) saturate(100%) invert(69%) sepia(59%) saturate(1244%) hue-rotate(153deg) brightness(102%) contrast(101%)'
                  : 'none', // 기본 상태는 필터 없음
              }}
            />
          </div>
          <div className={styles.textButtons} onClick={() => setCommentIsOpen(true)}>
            <img src={BoldComment.src} className={styles.button}></img>
            {item.commentCount}
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

      <ReelsComment feedId={item.id} isOpen={isCommentOpen} toggleDrawer={v => setCommentIsOpen(v)} />
    </div>
  );
};

export default ReelsContent;
