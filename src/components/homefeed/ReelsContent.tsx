import React, {useEffect, useRef, useState} from 'react';
import styles from './ReelsContent.module.css';
import {Swiper, SwiperClass, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import {Pagination} from 'swiper/modules';
import {FeedInfo, sendFeedBookmark, sendFeedDisLike, sendFeedLike, sendFeedShare} from '@/app/NetWork/ShortsNetwork';
import ReactPlayer from 'react-player';
import {
  BoldArchive,
  BoldComment,
  BoldDislike,
  BoldLike,
  BoldMore,
  BoldPause,
  BoldPlay,
  BoldReward,
  BoldShare,
  BoldVideo,
  BoldVolumeOff,
  BoldVolumeOn,
  LineArchive,
  LineArrowDown,
  LineArrowLeft,
  LineFeatured,
} from '@ui/Icons';
import {Avatar} from '@mui/material';
import ReelsComment from './ReelsComment';
import SharePopup from '../layout/shared/SharePopup';

interface ReelsContentProps {
  item: FeedInfo;
  isActive: boolean; // 현재 슬라이드인지 확인
  isMute: boolean;
  setIsMute: (mute: boolean) => void; // boolean 매개변수 추가
}

const ReelsContent: React.FC<ReelsContentProps> = ({item, isActive, isMute, setIsMute}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const [isLike, setIsLike] = useState(item.isLike);
  const [isDisLike, setIsDisLike] = useState(item.isDisLike);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likeCount);
  const playerRef = useRef<ReactPlayer>(null); // ReactPlayer 참조 생성
  useEffect(() => {
    if (isActive) {
      setIsPlaying(true); // 활성화된 경우 자동 재생
    } else {
      setIsPlaying(false); // 비활성화된 경우 재생 중지
    }
    playerRef.current?.seekTo(0); // 재생 위치를 0으로 설정
  }, [isActive]);

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
  const [commentCount, setCommentCount] = useState(item.commentCount); // 비디오 총 길이

  const [isCommentOpen, setCommentIsOpen] = useState(false);
  const handleAddCommentCount = () => {
    setCommentCount(commentCount + 1);
  };
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
        if (response.data?.likeCount) setLikeCount(response.data?.likeCount);
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
  const sendShare = async () => {
    const response = await sendFeedShare(item.id);
    const {resultCode, resultMessage} = response;

    if (resultCode === 0) {
      console.log('공유 성공!');
    } else {
      console.log(`공유 실패: ${resultMessage}`);
    }
  };
  const handleShare = async () => {
    sendShare();
    const shareData = {
      title: '공유하기 제목',
      text: '이 링크를 확인해보세요!',
      url: window.location.href, // 현재 페이지 URL
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData); // 네이티브 공유 UI 호출
      } catch (error) {
        console.error('공유 실패:', error);
      }
    } else {
      setIsShare(true);
    }
  };

  const [isBookmarked, setIsBookmarked] = useState(item.isBookmark);
  const bookmarkFeed = async () => {
    const payload = {
      feedId: item.id, // 북마크할 피드 ID
      isSave: !isBookmarked, // 북마크 저장 여부 (true: 저장, false: 해제)
    };

    const response = await sendFeedBookmark(payload);
    setIsBookmarked(!isBookmarked);
    if (response.resultCode === 0) {
      console.log('Bookmark operation successful:', response);
    } else {
      console.error('Failed to bookmark feed:', response.resultMessage);
    }
  };

  const formatTimeAgo = (time: string): string => {
    const now = new Date();
    const commentTime = new Date(time);
    const diffInSeconds = Math.floor((now.getTime() - commentTime.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}초 전`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}주 전`;
    const diffInMonths = Math.floor(diffInWeeks / 4);
    if (diffInMonths < 12) return `${diffInMonths}달 전`;
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears}년 전`;
  };

  React.useEffect(() => {
    setCommentCount(item.commentCount);
  }, [item]);

  React.useEffect(() => {}, [isMute]);
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
                    style={{width: '100%', height: 'calc(100% - 4px)', objectFit: 'contain'}}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          {item.mediaState === 2 && (
            <div onClick={handleClick} style={{position: 'relative', width: '100%', height: '100%'}}>
              <ReactPlayer
                ref={playerRef} // ReactPlayer 참조 연결
                muted={isMute}
                url={item.mediaUrlList[0]} // 첫 번째 URL 사용
                playing={isPlaying} // 재생 상태
                loop={true}
                width="100%"
                playsinline={true}
                height="calc(100% - 4px)"
                style={{
                  borderRadius: '8px',
                }}
                progressInterval={100} // 0.1초(100ms) 단위로 진행 상황 업데이트
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
              transition: 'width 0.1s linear', // 부드러운 진행도 애니메이션
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
              className={`${styles.follow} ${isFollow ? styles.followButtonOn : styles.followButtonOff}`}
              onClick={() => {
                setIsFollow(!isFollow);
                console.log('isfollow', isFollow);
              }}
            >
              Follow
            </button>
          </div>
          {item?.description && (
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
          )}
          {/* Video Info */}
          <div className={styles.videoInfo}>
            {item.mediaState == 1 && <>Image</>}
            {item.mediaState == 2 && (
              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center'}}>
                <img className={styles.iconVideo} src={BoldVideo.src}></img>
                Video · {currentProgress ? currentProgress : '0:00'}/{formatDuration(videoDuration)}
              </div>
            )}
            <div>{formatTimeAgo(item.createAt.toString())}</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={styles.ctaButtons}>
          <div className={styles.textButtons} onClick={() => {}}>
            <img src={BoldReward.src} className={styles.button}></img>
          </div>
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
            <div className={styles.count}>{likeCount}</div>
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
            <div className={styles.count}>{commentCount}</div>
          </div>
          <div
            className={styles.noneTextButton}
            onClick={async () => {
              handleShare();
            }}
          >
            <img src={BoldShare.src} className={styles.button}></img>
          </div>

          <div
            className={styles.noneTextButton}
            onClick={() => {
              bookmarkFeed();
            }}
          >
            {isBookmarked && <img src={BoldArchive.src} className={styles.button}></img>}
            {!isBookmarked && <img src={LineArchive.src} className={styles.button}></img>}
          </div>
          <div
            className={styles.noneTextButton}
            onClick={() => {
              alert('추후 신고 기능 추가');
            }}
          >
            <img src={BoldMore.src} className={styles.button}></img>
          </div>
        </div>
        <div
          className={styles.volumeButton}
          onClick={() => {
            setIsMute(!isMute);
          }}
        >
          {/* 검은색 반투명 배경 */}
          {item.mediaState == 2 && isMute && <div className={styles.volumeCircleIcon}></div>}

          {/* 음소거 상태 아이콘 */}
          {item.mediaState == 2 && isMute && <img src={BoldVolumeOff.src} className={styles.volumeIcon} />}

          {/* 볼륨 활성 상태 아이콘 */}
          {item.mediaState == 2 && !isMute && <img src={BoldVolumeOn.src} className={styles.volumeIcon} />}
        </div>
      </div>

      <ReelsComment
        feedId={item.id}
        isOpen={isCommentOpen}
        toggleDrawer={v => setCommentIsOpen(v)}
        onAddTotalCommentCount={() => handleAddCommentCount()}
      />

      <SharePopup
        open={isShare}
        title={item.characterProfileName}
        url={window.location.href}
        onClose={() => setIsShare(false)}
      ></SharePopup>
    </div>
  );
};

export default ReelsContent;
