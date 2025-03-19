import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from './ViewerContent.module.css';
import 'swiper/css';
import 'swiper/css/pagination';
import {FeedInfo, sendFeedShare} from '@/app/NetWork/ShortsNetwork';
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
  LineDashboard,
  LinePlus,
  LineScaleUp,
} from '@ui/Icons';
import {Avatar, Box, Modal} from '@mui/material';
import ChatMediaDialog from '@/app/view/main/content/Chat/MainChat/ChatMediaDialog';
import {MediaData, TriggerMediaState} from '@/app/view/main/content/Chat/MainChat/ChatTypes';
import {useRouter} from 'next/navigation';
import {pushLocalizedRoute} from '@/utils/UrlMove';
import ProfileBase from '@/app/view/profile/ProfileBase';
import {followProfile, subscribeProfile} from '@/app/NetWork/ProfileNetwork';
import SharePopup from '@/components/layout/shared/SharePopup';
import {
  ContentCategoryType,
  ContentLanguageType,
  ContentPlayInfo,
  ContentType,
  GetSeasonEpisodesPopupReq,
  GetSeasonEpisodesPopupRes,
  PlayButtonReq,
  PlayReq,
  RecordPlayReq,
  SeasonEpisodeInfo,
  sendGetSeasonEpisodesPopup,
  sendPlay,
  sendPlayButton,
  sendRecordPlay,
} from '@/app/NetWork/ContentNetwork';
import Comment from '@/components/layout/shared/Comment';
import {
  bookmark,
  BookMarkReq,
  CommentContentType,
  InteractionType,
  sendDisLike,
  sendLike,
} from '@/app/NetWork/CommonNetwork';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import DrawerDonation from '../../create/common/DrawerDonation';
import {PopupPurchase} from '../series/ContentSeriesDetail';

interface Props {
  open: boolean;
  onClose: () => void;

  isPlayButon: boolean;
  contentId: number;
  episodeId?: number;
}

const ViewerContent: React.FC<Props> = ({isPlayButon, open, onClose, contentId, episodeId = 0}) => {
  const [info, setInfo] = useState<ContentPlayInfo>();
  const [curEpisodeId, setCurEpisodeId] = useState(episodeId);

  const [onEpisodeListDrawer, setOnEpisodeListDrawer] = useState(false);
  interface Episode {
    number: number;
    isLocked: boolean;
  }

  const [episodeListData, setEpisodeListData] = useState<GetSeasonEpisodesPopupRes>();

  const [isDonation, setDonation] = useState(false);

  const [onPurchasePopup, setOnPurchasePopup] = useState(false);
  const [purchaseData, setPurchaseData] = useState<SeasonEpisodeInfo>();

  const handlePlayRecent = async () => {
    try {
      const playRequest: PlayButtonReq = {
        contentId: contentId,
      };

      const playResponse = await sendPlayButton(playRequest);
      console.log('✅ PlayButton API 응답:', playResponse.data);
      setInfo(playResponse.data?.recentlyPlayInfo);
      setCurEpisodeId(playResponse.data?.recentlyPlayInfo.episodeId || 0);
    } catch (error) {
      console.error('🚨 Play 관련 API 호출 오류:', error);
    }
  };

  const handlePlayNew = async () => {
    try {
      const playRequest: PlayReq = {
        contentId: contentId,
        episodeId: curEpisodeId,
      };

      const playData = await sendPlay(playRequest);
      console.log('✅ Play API 응답:', playData.data);
      setInfo(playData.data?.recentlyPlayInfo);
    } catch (error) {
      console.error('🚨 Play 관련 API 호출 오류:', error);
    }
  };

  const handleRecordPlay = async () => {
    if (!info) return;
    try {
      const recordPlayRequest: RecordPlayReq = {
        episodeRecordPlayInfo: {
          contentId: info?.contentId,
          episodeId: info?.episodeId,
          categoryType: info?.categoryType,
          playTimeSecond: Math.floor(videoProgress),
        },
      };

      const recordPlayResponse = await sendRecordPlay(recordPlayRequest);
    } catch (error) {
      console.error('🚨 RecordPlay API 호출 오류:', error);
    }
  };

  useEffect(() => {
    if (info?.categoryType == ContentCategoryType.Webtoon) handleRecordPlay();
  }, [info]);

  useEffect(() => {
    if (onEpisodeListDrawer) {
      handlePlayNew();
      console.log('playnew');
      return;
    }
    if (isPlayButon) {
      handlePlayRecent();
      console.log('playrecent');
    } else {
      handlePlayNew();
      console.log('playnew');
    }
  }, [contentId, curEpisodeId]);

  const [isVisible, setIsVisible] = useState(true);

  const handleTrigger = () => {
    setIsVisible(!isVisible); // 트리거 발생 시 서서히 사라짐
  };
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [isLike, setIsLike] = useState(info?.commonMediaViewInfo.isLike);
  const [isDisLike, setIsDisLike] = useState(info?.commonMediaViewInfo.isDisLike);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const [isImageModal, setIsImageModal] = useState(false);
  const [isMute, setIsMute] = useState(true);
  const [likeCount, setLikeCount] = useState(info?.commonMediaViewInfo.likeCount);
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

  const [curIsFollow, setCurIsFollow] = useState(info?.isProfileFollow);
  const [tempFollow, setTempFollow] = useState(true);
  const [animationClass, setAnimationClass] = useState('');
  const handleFollow = async (profileId: number, value: boolean) => {
    try {
      const response = await followProfile(profileId, value);
    } catch (error) {
      console.error('An error occurred while Following:', error);
    }
  };
  const handleOnSubscribe = async () => {
    console.log('Subscribe');
    if (info) handleFollow(info?.profileId, !curIsFollow);
    setCurIsFollow(true);
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

  const [commentCount, setCommentCount] = useState(info?.commonMediaViewInfo.commentCount);

  const [isCommentOpen, setCommentIsOpen] = useState(false);
  const handleAddCommentCount = () => {
    if (info) setCommentCount(info?.commonMediaViewInfo.commentCount + 1);
  };
  const handleSubCommentCount = () => {
    if (info) setCommentCount(info?.commonMediaViewInfo.commentCount - 1);
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

      handleRecordPlay();
      // 실행할 로직 추가
    }
    setVideoProgress(playedSeconds);
  };
  const handleLikeFeed = async (feedId: number, isLike: boolean) => {
    try {
      if (isDisLike == true) {
        await handleDisLikeFeed(feedId, !isDisLike);
      }
      const response = await sendLike(episodeId ? InteractionType.Episode : InteractionType.Contents, feedId, isLike);

      if (response.resultCode === 0) {
        console.log(`content ${feedId} has been ${isLike ? 'liked' : 'unliked'} successfully!`);
        if (response.data) setLikeCount(response.data?.likeCount);
        setIsLike(isLike);
      } else {
        console.error(`Failed to like/unlike content: ${response.resultMessage}`);
      }
    } catch (error) {
      console.error('An error occurred while liking/unliking the content:', error);
    }
  };
  const handleDisLikeFeed = async (feedId: number, isLike: boolean) => {
    try {
      if (isLike == true) {
        await handleLikeFeed(feedId, !isLike);
      }
      const response = await sendDisLike(
        episodeId ? InteractionType.Episode : InteractionType.Contents,
        feedId,
        isLike,
      );

      if (response.resultCode === 0) {
        console.log(`content ${feedId} has been ${isLike ? 'liked' : 'unliked'} successfully!`);
        setIsDisLike(isLike);
      } else {
        console.error(`Failed to like/unlike content: ${response.resultMessage}`);
      }
    } catch (error) {
      console.error('An error occurred while liking/unliking the content:', error);
    }
  };

  // const sendShare = async () => {
  //   const response = await sendFeedShare(info.id);
  //   const {resultCode, resultMessage} = response;

  //   if (resultCode === 0) {
  //     console.log('공유 성공!');
  //   } else {
  //     console.log(`공유 실패: ${resultMessage}`);
  //   }
  // };
  const handleShare = async () => {
    //sendShare();
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

  const [isBookmarked, setIsBookmarked] = useState(info?.commonMediaViewInfo.isBookmark);
  const bookmarkFeed = async () => {
    const payload: BookMarkReq = {
      interactionType: episodeId ? InteractionType.Episode : InteractionType.Contents,
      typeValueId: episodeId ? episodeId : contentId, // 북마크할 피드 ID
      isBookMark: !isBookmarked,
      // feedId: item.id, // 북마크할 피드 ID
      // isSave: !isBookmarked, // 북마크 저장 여부 (true: 저장, false: 해제)
    };

    const response = await bookmark(payload);
    setIsBookmarked(!isBookmarked);
    if (response && response.resultCode === 0) {
      console.log('Bookmark operation successful:', response);
    } else {
      console.error('Failed to bookmark content:', response?.resultMessage || '');
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
  const fetchSeasonEpisodesPopup = async () => {
    try {
      const requestPayload: GetSeasonEpisodesPopupReq = {
        episodeId: curEpisodeId, // 조회할 에피소드 ID
      };

      const response = await sendGetSeasonEpisodesPopup(requestPayload);
      setEpisodeListData(response.data);
      setOnEpisodeListDrawer(true);
      console.log('✅ 시즌 에피소드 팝업 데이터:', response.data);
    } catch (error) {
      console.error('🚨 시즌 에피소드 팝업 API 호출 오류:', error);
    }
  };

  React.useEffect(() => {
    setCommentCount(info?.commonMediaViewInfo.commentCount);
    setCurIsFollow(info?.isProfileFollow);
    if (info) setTempFollow(info?.isProfileFollow);
  }, [info]);

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
      // componentsProps={{
      //   backdrop: {
      //     style: {backgroundColor: 'rgba(0, 0, 0, 0.8)'}, // 원하는 색상 설정
      //   },
      // }}
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

                <h1 className={styles.navTitle}>adads</h1>
              </div>
            </header>
          </div>
          <div style={{height: '100%'}} onClick={() => handleTrigger()}>
            <div className={styles.Image}>
              {info && info?.categoryType === ContentCategoryType.Webtoon && (
                <div className={styles.webtoonContainer}>
                  {info?.episodeWebtoonInfo?.webtoonSourceUrlList[0].webtoonSourceUrls.map((url, index) => (
                    <img key={index} src={url} loading="lazy" className={styles.webtoonImage} />
                  ))}
                </div>
              )}

              {info && info?.categoryType === ContentCategoryType.Video && (
                <div style={{position: 'relative', width: '100%', height: '100%'}}>
                  <ReactPlayer
                    ref={playerRef} // ReactPlayer 참조 연결
                    muted={isMute}
                    url={info.episodeVideoInfo?.videoSourceFileInfo.videoSourceUrl} //추후 더빙 자막 합쳐야함
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
            {info?.categoryType == ContentCategoryType.Video && (
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
            )}

            <div className={`${styles.profileBox} ${!isVisible ? styles.fadeOutB : ''}`}>
              <div className={styles.dim}></div>

              {/* Video Info */}
              <div className={styles.videoInfo}>
                {info?.categoryType == ContentCategoryType.Webtoon && <>Image</>}
                {info?.categoryType == ContentCategoryType.Video && (
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
                  src={info?.profileIconUrl || '/images/001.png'}
                  style={{width: '32px', height: '32px', position: 'relative'}}
                  onClick={event => {
                    event.stopPropagation();
                    pushLocalizedRoute('/profile/' + info?.profileUrlLinkKey + '?from=""', router);
                  }}
                ></Avatar>
                {!info?.isProfileFollow && !tempFollow && info?.isMyEpisode == false && (
                  <div
                    className={`${curIsFollow ? styles.checkCircle : styles.plusCircle} ${animationClass}`}
                    onClick={event => {
                      event.stopPropagation();
                      handleOnSubscribe();
                    }}
                  >
                    {curIsFollow ? (
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
                )}
              </div>
              {info?.isMyEpisode == false && !info?.isProfileFollow && <div></div>}
              {info?.isMyEpisode == false && (
                <div
                  className={styles.textButtons}
                  onClick={event => {
                    event.stopPropagation();
                    setDonation(true);
                  }}
                >
                  <img src={BoldReward.src} className={styles.button}></img>
                </div>
              )}

              <div
                className={styles.textButtons}
                onClick={event => {
                  event.stopPropagation();
                  let id = contentId;
                  if (episodeId) id = episodeId;
                  handleLikeFeed(id, !isLike);
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
                onClick={event => {
                  event.stopPropagation();
                  let id = contentId;
                  if (episodeId) id = episodeId;
                  handleDisLikeFeed(id, !isDisLike);
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
              <div
                className={styles.textButtons}
                onClick={event => {
                  event.stopPropagation();
                  setCommentIsOpen(true);
                }}
              >
                <img src={BoldComment.src} className={styles.button}></img>
                <div className={styles.count}>{commentCount}</div>
              </div>
              <div
                className={styles.noneTextButton}
                onClick={async event => {
                  event.stopPropagation();
                  handleShare();
                }}
              >
                <img src={BoldShare.src} className={styles.button}></img>
              </div>

              <div
                className={styles.noneTextButton}
                onClick={event => {
                  event.stopPropagation();
                  bookmarkFeed();
                }}
              >
                {isBookmarked && <img src={BoldArchive.src} className={styles.button}></img>}
                {!isBookmarked && <img src={LineArchive.src} className={styles.button}></img>}
              </div>

              <div
                className={styles.noneTextButton}
                onClick={event => {
                  event.stopPropagation();
                  fetchSeasonEpisodesPopup();
                }}
              >
                <img src={BoldContents.src} className={styles.button}></img>
              </div>

              <div
                className={styles.noneTextButton}
                onClick={event => {
                  event.stopPropagation();
                  alert('추후 신고 기능 추가');
                }}
              >
                <img src={BoldMore.src} className={styles.button}></img>
              </div>
            </div>
            <div
              className={`${styles.volumeButton} ${!isVisible ? styles.fadeOutR : ''}`}
              onClick={event => {
                event.stopPropagation();
                if (info?.categoryType == ContentCategoryType.Video) setIsMute(!isMute);
                else if (info?.categoryType == ContentCategoryType.Webtoon) setIsImageModal(true);
              }}
            >
              {/* 검은색 반투명 배경 */}
              {isMute && <div className={styles.volumeCircleIcon}></div>}

              {/* 음소거 상태 아이콘 */}
              {info?.categoryType == ContentCategoryType.Video && isMute && (
                <img src={BoldVolumeOff.src} className={styles.volumeIcon} />
              )}

              {/* 볼륨 활성 상태 아이콘 */}
              {info?.categoryType == ContentCategoryType.Video && !isMute && (
                <img src={BoldVolumeOn.src} className={styles.volumeIcon} />
              )}

              {/* 이미지 확대 아이콘 */}
              {info?.categoryType == ContentCategoryType.Webtoon && (
                <img src={LineScaleUp.src} className={styles.volumeIcon} />
              )}
            </div>
          </div>
          {isCommentOpen && (
            <Comment
              contentId={episodeId ? episodeId : contentId}
              isOpen={isCommentOpen}
              toggleDrawer={v => setCommentIsOpen(v)}
              onAddTotalCommentCount={() => handleAddCommentCount()}
              onSubTotalCommentCount={() => handleSubCommentCount()}
              commentType={episodeId ? CommentContentType.Episode : CommentContentType.Content}
            />
          )}

          <SharePopup
            open={isShare}
            title={''}
            url={window.location.href}
            onClose={() => setIsShare(false)}
          ></SharePopup>
          {episodeListData?.episodeList && (
            <CustomDrawer
              open={onEpisodeListDrawer}
              onClose={() => {
                setOnEpisodeListDrawer(false);
              }}
              contentStyle={{
                padding: '0px',
                zIndex: '1300',

                justifyItems: 'center',
              }}
              containerStyle={{paddingBottom: '14px'}}
            >
              <div className={styles.episodeListDrawer}>
                <div className={styles.profileContainer}>
                  {/* 프로필 이미지 */}
                  <div className={styles.profileImageWrapper}>
                    <img src={info?.profileIconUrl} alt="Profile" className={styles.profileImage} />
                    <div className={styles.imageOverlay}></div>
                  </div>

                  {/* 텍스트 정보 */}
                  <div className={styles.profileInfo}>
                    <div className={styles.title}>{'타이틀 들어가야함'}</div>

                    <div style={{gap: '8px'}}>
                      {/* 에피소드 정보 + 완결 배지 */}
                      <div className={styles.episodeRow}>
                        <span className={styles.episodeInfo}>{'에피소드 리스트'}</span>
                        {<span className={styles.completeBadge}>완결여부</span>}
                      </div>

                      {/* 장르 정보 */}
                      <div className={styles.genreRow}>{'장르들'}</div>
                    </div>
                  </div>
                </div>
                <div className={styles.episodeContainer}>
                  {episodeListData?.episodeList.map((episode, index) => (
                    <div
                      key={episode.episodeId}
                      className={`${styles.episodeButton} ${episode.isLock ? styles.locked : ''}`}
                      onClick={() => {
                        if (episode.isLock) {
                          setPurchaseData(episode);
                          setOnPurchasePopup(true);
                        } else {
                          console.log('episode.episodeId', episode.episodeId);
                          setCurEpisodeId(episode.episodeId);
                        }
                      }}
                    >
                      {index + 1}
                      {episode.isLock && (
                        <div className={styles.lockIcon}>
                          <img src={BoldLock.src} alt="Lock" className={styles.lockImg} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CustomDrawer>
          )}

          {isDonation && (
            <DrawerDonation
              isOpen={isDonation}
              sponsoredName={'이름도 받아야함'}
              giveToPDId={0}
              onClose={() => setDonation(false)}
            />
          )}
          {onPurchasePopup && purchaseData && (
            <PopupPurchase
              contentId={contentId}
              episodeId={purchaseData.episodeId}
              price={purchaseData.salesStarEa}
              contentType={episodeId ? ContentType.Series : ContentType.Single}
              onClose={() => {
                setOnPurchasePopup(false);
              }}
              onPurchaseSuccess={() => {
                setOnPurchasePopup(false);
                fetchSeasonEpisodesPopup();
              }}
            ></PopupPurchase>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default ViewerContent;
