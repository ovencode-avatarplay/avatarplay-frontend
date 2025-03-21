import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from './PreviewViewer.module.css';
import 'swiper/css';
import 'swiper/css/pagination';

import ReactPlayer from 'react-player';
import {
  BoldArchive,
  BoldArrowLeft,
  BoldComment,
  BoldContents,
  BoldDislike,
  BoldLike,
  BoldLock,
  BoldMore,
  BoldPause,
  BoldPlay,
  BoldReward,
  BoldShare,
  BoldVideo,
  BoldVolumeOff,
  BoldVolumeOn,
  LineArchive,
  LineCheck,
  LineScaleUp,
} from '@ui/Icons';
import {Avatar, Box, Modal} from '@mui/material';
import {useRouter} from 'next/navigation';
import {pushLocalizedRoute} from '@/utils/UrlMove';
import SharePopup from '@/components/layout/shared/SharePopup';
import {ContentCategoryType, ContentType} from '@/app/NetWork/ContentNetwork';
import Comment from '@/components/layout/shared/Comment';
import {CommentContentType} from '@/app/NetWork/CommonNetwork';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';

interface Props {
  open: boolean;
  onClose: () => void;
  mediaUrls: string[];
  type: ContentCategoryType;
}

const PreviewViewer: React.FC<Props> = ({open, onClose, mediaUrls, type}) => {
  interface Episode {
    number: number;
    isLocked: boolean;
  }

  const [isVisible, setIsVisible] = useState(true);

  const handleTrigger = () => {
    setIsVisible(!isVisible); // 트리거 발생 시 서서히 사라짐
  };
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const [isImageModal, setIsImageModal] = useState(false);
  const [isMute, setIsMute] = useState(true);
  const playerRef = useRef<ReactPlayer>(null); // ReactPlayer 참조 생성

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

  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 🎯 프로그레스 바 클릭 또는 드래그 시작 시 실행
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('마우스 다운');
    setIsDragging(true);
    updateProgress(e.nativeEvent); // 클릭 위치 반영
  };

  // 🎯 마우스를 움직일 때 실행
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    updateProgress(e);
  };

  // 🎯 마우스가 놓일 때 실행
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // 📌 진행도를 비디오에 반영하는 함수
  const updateProgress = (e: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || videoDuration === 0) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    let newProgress = (offsetX / rect.width) * videoDuration;

    // 진행도 범위 제한 (0 ~ videoDuration)
    newProgress = Math.max(0, Math.min(videoDuration, newProgress));

    setVideoProgress(newProgress);
    if (playerRef.current) {
      playerRef.current.seekTo(newProgress, 'seconds'); // 비디오 위치 변경
    }
  };

  // 🎯 드래그 이벤트 `window`에 적용하여 진행 바 놓치지 않도록 유지
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  const handleOnSubscribe = async () => {
    console.log('Subscribe');

    setIsSubscribed(true);
    // 클릭하면 애니메이션 시작
    setAnimationClass(styles.startAnimation);

    // 3프레임 후 크기 100%
    setTimeout(() => {
      setAnimationClass(styles.fullSize);
    }, 75); // 3프레임 (약 50ms)

    // 17프레임 동안 유지
    setTimeout(() => {
      setAnimationClass(styles.shrinkAnimation);
    }, 475); // (3프레임 + 17프레임) 약 350ms 후 축소 시작
  };

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation(); // 부모로 이벤트 전파 방지
    setIsPlaying(!isPlaying);
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
  };
  const [lastExecutedSecond, setLastExecutedSecond] = useState(0);
  const handleVideoProgress = (playedSeconds: number) => {
    // 10초마다 한 번만 실행하도록 체크
    const roundedSeconds = Math.floor(playedSeconds);
    if (roundedSeconds % 1 === 0 && lastExecutedSecond !== roundedSeconds) {
      setLastExecutedSecond(roundedSeconds); // 마지막 실행 시간 업데이트

      // 실행할 로직 추가
    }
    setVideoProgress(playedSeconds);
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

  const checkMobileOrTablet = useCallback(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    const platform = navigator.platform;
    const maxTouchPoints = navigator.maxTouchPoints || 0;

    const isIOSDevice = /iPhone|iPad|iPod/i.test(userAgent);

    // iPad Pro를 구분하기 위해 추가 체크
    const isTouchDevice = navigator.maxTouchPoints > 0;

    return (
      isIOSDevice ||
      isTouchDevice ||
      /Android|webOS|BlackBerry|Windows Phone|Opera Mini|IEMobile|Tablet/i.test(userAgent)
    );
  }, []);
  const isMobile = checkMobileOrTablet();
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="viwer-content-modal"
      aria-describedby="viwer-content-modal-description"
      className={styles.body}
      hideBackdrop
      componentsProps={{
        backdrop: {
          style: {backgroundColor: 'rgba(0, 0, 0, 0.8)'}, // 원하는 색상 설정
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          bgcolor: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div className={styles.reelsContainer}>
          <div className={`${styles.header} ${!isVisible ? styles.fadeOutT : ''}`}>
            <header className={styles.header}>
              <div className={styles.baseArea}>
                <button className={styles.backButton} onClick={onClose}>
                  <img src={BoldArrowLeft.src} className={styles.backIcon} />
                </button>

                <h1 className={styles.navTitle}></h1>
              </div>
            </header>
          </div>
          <div style={{height: '100%'}} onClick={() => handleTrigger()}>
            <div className={styles.Image}>
              {type === ContentCategoryType.Webtoon && (
                <div className={styles.webtoonContainer}>
                  {mediaUrls.map((url, index) => (
                    <img key={index} src={url} loading="lazy" className={styles.webtoonImage} />
                  ))}
                </div>
              )}

              {type === ContentCategoryType.Video && (
                <div style={{position: 'relative', width: '100%', height: '100%'}}>
                  <ReactPlayer
                    ref={playerRef} // ReactPlayer 참조 연결
                    muted={isMute}
                    url={mediaUrls[0]} //추후 더빙 자막 합쳐야함
                    playing={isPlaying} // 재생 상태
                    loop={true}
                    width="100%"
                    playsinline={true}
                    height="calc(100% - 4px)"
                    style={{
                      borderRadius: '8px',
                      objectFit: 'contain',
                    }}
                    config={{
                      file: {
                        attributes: {
                          style: {
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          },
                        },
                      },
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
                      zIndex: 13,
                    }}
                  >
                    <div
                      className={`${styles.playCircleIcon} ${isVisible ? styles.fadeAndGrow : styles.fadeOutAndShrink}`}
                    >
                      <img src={isPlaying ? BoldPause.src : BoldPlay.src} onClick={event => handleClick(event)} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div
              ref={progressBarRef}
              className={`${styles.progressBar} ${!isVisible ? styles.fadeOutB : ''} ${
                isDragging ? styles.dragging : ''
              }`}
              onMouseDown={e => {
                console.log('✅ ProgressBar 클릭됨');
                console.log('클릭 좌표:', e.clientX, e.clientY);
                handleMouseDown(e);
              }}
            >
              <div
                className={styles.progressFill}
                style={{
                  width: `${(videoProgress / videoDuration) * 100}%`,
                  transition: isDragging ? 'none' : 'width 0.1s linear',
                }}
              ></div>
            </div>

            <div className={`${styles.profileBox} ${!isVisible ? styles.fadeOutB : ''}`}>
              <div className={styles.dim}></div>

              {/* Video Info */}
              <div className={styles.videoInfo}>
                {type == ContentCategoryType.Webtoon && <>Image</>}
                {type == ContentCategoryType.Video && (
                  <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center'}}>
                    <img className={styles.iconVideo} src={BoldVideo.src}></img>
                    Video · {currentProgress ? currentProgress : '0:00'}/{formatDuration(videoDuration)}
                  </div>
                )}
              </div>
            </div>
            {/* CTA Buttons */}
            <div className={`${styles.ctaButtons} ${!isVisible ? styles.fadeOutR : ''}`}>
              <div className={styles.textButtons}>
                <Avatar
                  src={'/images/001.png'}
                  style={{width: '32px', height: '32px', position: 'relative'}}
                  onClick={event => {
                    event.stopPropagation();
                  }}
                ></Avatar>

                <div
                  className={`${isSubscribed ? styles.checkCircle : styles.plusCircle} ${animationClass}`}
                  onClick={event => {
                    event.stopPropagation();
                  }}
                >
                  {isSubscribed ? (
                    <img src={LineCheck.src} alt="Check" className={styles.checkImg} />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.4863 12.0005L3.51577 12.0005L20.4863 12.0005Z" fill="white" />
                      <path
                        d="M20.4863 12.0005L3.51577 12.0005"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M12 3.51416V20.4847V3.51416Z" fill="white" />
                      <path
                        d="M12 3.51416V20.4847"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <div></div>
              <div
                className={styles.textButtons}
                onClick={event => {
                  event.stopPropagation();
                }}
              >
                <img src={BoldReward.src} className={styles.button}></img>
              </div>
              <div
                className={styles.textButtons}
                onClick={event => {
                  event.stopPropagation();
                }}
              >
                <img src={BoldLike.src} className={styles.button} />
                <div className={styles.count}>{0}</div>
              </div>

              {/* Dislike Button */}
              <div
                className={styles.textButtons}
                onClick={event => {
                  event.stopPropagation();
                }}
              >
                <img src={BoldDislike.src} className={styles.button} />
              </div>
              <div
                className={styles.textButtons}
                onClick={event => {
                  event.stopPropagation();
                }}
              >
                <img src={BoldComment.src} className={styles.button}></img>
                <div className={styles.count}>{0}</div>
              </div>
              <div
                className={styles.noneTextButton}
                onClick={async event => {
                  event.stopPropagation();
                }}
              >
                <img src={BoldShare.src} className={styles.button}></img>
              </div>

              <div
                className={styles.noneTextButton}
                onClick={event => {
                  event.stopPropagation();
                }}
              >
                <img src={LineArchive.src} className={styles.button}></img>
              </div>

              <div
                className={styles.noneTextButton}
                onClick={event => {
                  event.stopPropagation();
                }}
              >
                <img src={BoldContents.src} className={styles.button}></img>
              </div>

              <div
                className={styles.noneTextButton}
                onClick={event => {
                  event.stopPropagation();
                }}
              >
                <img src={BoldMore.src} className={styles.button}></img>
              </div>
            </div>
            <div
              className={`${styles.volumeButton} ${!isVisible ? styles.fadeOutR : ''}`}
              onClick={event => {
                event.stopPropagation();
                if (type == ContentCategoryType.Video) setIsMute(!isMute);
                else if (type == ContentCategoryType.Webtoon) setIsImageModal(true);
              }}
            >
              {/* 검은색 반투명 배경 */}
              {isMute && <div className={styles.volumeCircleIcon}></div>}

              {/* 음소거 상태 아이콘 */}
              {type == ContentCategoryType.Video && isMute && (
                <img src={BoldVolumeOff.src} className={styles.volumeIcon} />
              )}

              {/* 볼륨 활성 상태 아이콘 */}
              {type == ContentCategoryType.Video && !isMute && (
                <img src={BoldVolumeOn.src} className={styles.volumeIcon} />
              )}

              {/* 이미지 확대 아이콘 */}
              {type == ContentCategoryType.Webtoon && <img src={LineScaleUp.src} className={styles.volumeIcon} />}
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default PreviewViewer;
