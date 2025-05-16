import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from './ViewerContent.module.css';
import {
  BoldArchive,
  LineArrowLeft,
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
  LineVolumeOff,
  LineVolumeOn,
  LineArchive,
  LineCheck,
  LineScaleUp,
} from '@ui/Icons';
import {Avatar, Box, Dialog} from '@mui/material';
import {useRouter} from 'next/navigation';
import {pushLocalizedRoute} from '@/utils/UrlMove';
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
  sendReport,
} from '@/app/NetWork/CommonNetwork';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import {PopupPurchase} from '../series/ContentSeriesDetail';
import getLocalizedText from '@/utils/getLocalizedText';
import formatText from '@/utils/formatText';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import shaka from 'shaka-player/dist/shaka-player.compiled';
import SelectDrawerArrow, {SelectDrawerArrowItem} from '@/components/create/SelectDrawerArrow';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import {ConstructionOutlined} from '@mui/icons-material';
import {ToastMessageAtom, ToastType} from '@/app/Root';
import {useAtom} from 'jotai';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Virtual} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/virtual';
import DrawerDonation from '../../create/common/DrawerDonation';

interface ContentItem {
  id: number;
  type: ContentType;
  categoryType: ContentCategoryType;
  title: string;
  profileId: number;
  profileIconUrl: string;
  profileUrlLinkKey: string;
  isProfileFollow: boolean;
  isMyEpisode: boolean;
  commonMediaViewInfo: {
    isLike: boolean;
    isDisLike: boolean;
    likeCount: number;
    commentCount: number;
    isBookmark: boolean;
  };
  // 비디오 컨텐츠인 경우
  episodeVideoInfo?: {
    videoSourceFileInfo: {
      videoSourceUrl: string;
    };
    mpdTempUrl: string;
    subTitleFileInfos?: {
      videoLanguageType: ContentLanguageType;
      videoSourceUrl: string;
    }[];
    dubbingFileInfos?: {
      videoLanguageType: ContentLanguageType;
      videoSourceUrl: string;
    }[];
  };
  // 웹툰 컨텐츠인 경우
  episodeWebtoonInfo?: {
    webtoonSourceUrlList: {
      webtoonLanguageType: ContentLanguageType;
      webtoonSourceUrls: string[];
    }[];
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  contents: ContentItem[];
  initialIndex?: number;
  contentId?: number;
}

const ViewerContent: React.FC<Props> = ({open, onClose, contents, initialIndex = 0, contentId}) => {
  console.log('contents', contents);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [loadedContents, setLoadedContents] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMute, setIsMute] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCommentOpen, setCommentIsOpen] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const [isDonation, setDonation] = useState(false);
  const [isOptionModal, setIsOptionModal] = useState(false);
  const [onEpisodeListDrawer, setOnEpisodeListDrawer] = useState(false);
  const [episodeListData, setEpisodeListData] = useState<GetSeasonEpisodesPopupRes>();
  const [onPurchasePopup, setOnPurchasePopup] = useState(false);
  const [purchaseData, setPurchaseData] = useState<SeasonEpisodeInfo>();
  const [dataToast, setDataToast] = useAtom(ToastMessageAtom);
  const router = useRouter();
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isLike, setIsLike] = useState(false);
  const [isDisLike, setIsDisLike] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [curIsFollow, setCurIsFollow] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const progressBarRef = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);
  const [curEpisodeId, setCurEpisodeId] = useState(initialIndex);
  const [isOpenDubbingModal, setIsDubbingModal] = useState(false);
  const [isOpenSubtitleModal, setIsSubtitleModal] = useState(false);
  const [isOpenPlaySpeedModal, setIsPlaySpeedModal] = useState(false);
  const [isOpenWebtoonSubtitleModal, setIsWebtoonSubtitleModal] = useState(false);
  const [subTitleLang, setSubtitleLang] = useState<ContentLanguageType>(ContentLanguageType.Korean);
  const [playSpeed, setPlaySpeed] = useState<number>(1);
  const [dubbingLang, setDubbingLang] = useState<ContentLanguageType>(ContentLanguageType.Korean);
  const playerRef = useRef<any>(null);
  const [webtoonSubtitleLang, setWebtoonSubtitleLang] = useState<ContentLanguageType>(ContentLanguageType.Default);

  const dubbingDrawerItem: SelectDrawerItem[] = [
    {
      name: 'Original',
      onClick: () => {
        handleSetDubbing(0);
        setDubbingLang(ContentLanguageType.Default);
      },
    },
    ...(contents[currentIndex]?.episodeVideoInfo?.dubbingFileInfos?.map((fileInfo, index) => ({
      name: ContentLanguageType[fileInfo.videoLanguageType],
      onClick: () => {
        handleSetDubbing(index + 1);
        setDubbingLang(fileInfo.videoLanguageType);
      },
    })) || []),
  ];

  const subtitleDrawerItems: SelectDrawerItem[] = [
    {
      name: 'Original',
      onClick: () => {
        playerRef.current?.setTextTrackVisibility(false);
        setSubtitleLang(ContentLanguageType.Default);
      },
    },
    ...(contents[currentIndex]?.episodeVideoInfo?.subTitleFileInfos?.map(fileInfo => ({
      name: ContentLanguageType[fileInfo.videoLanguageType],
      onClick: () => {
        handleSetSubtitle(fileInfo.videoLanguageType);
      },
    })) || []),
  ];

  const playSpeedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const playSpeedItems: SelectDrawerItem[] = playSpeedOptions.map(speed => ({
    name: `x${speed}`,
    onClick: () => {
      handleSetPlaySpeed(speed);
      setPlaySpeed(speed);
    },
  }));

  const selectOptionItem: SelectDrawerArrowItem[] = [
    {
      name: 'Subtitle',
      arrowName: ContentLanguageType[subTitleLang],
      onClick: () => {
        setIsSubtitleModal(true);
      },
    },
    {
      name: 'Dubbing',
      arrowName: ContentLanguageType[dubbingLang],
      onClick: () => {
        setIsDubbingModal(true);
      },
    },
    {
      name: 'Play Speed',
      arrowName: `x${playSpeed}`,
      onClick: () => {
        setIsPlaySpeedModal(true);
      },
    },
    {
      name: 'Report',
      arrowName: '',
      onClick: () => {
        handleReport();
      },
    },
  ];

  const selectWebtoonOptionItem: SelectDrawerArrowItem[] = [
    {
      name: 'Subtitle',
      arrowName: ContentLanguageType[subTitleLang],
      onClick: () => {
        setIsWebtoonSubtitleModal(true);
      },
    },
    {
      name: 'Report',
      arrowName: '',
      onClick: () => {
        handleReport();
      },
    },
  ];

  const webtoonSubtitleItems: SelectDrawerItem[] = [
    ...(contents[currentIndex]?.episodeWebtoonInfo?.webtoonSourceUrlList?.map((item, index) => ({
      name: ContentLanguageType[item.webtoonLanguageType],
      onClick: () => {
        setWebtoonSubtitleLang(item.webtoonLanguageType);
      },
    })) || []),
  ];

  const fetchSeasonEpisodesPopup = async () => {
    try {
      const requestPayload: GetSeasonEpisodesPopupReq = {
        episodeId: curEpisodeId,
      };

      const response = await sendGetSeasonEpisodesPopup(requestPayload);
      setEpisodeListData(response.data);
      setOnEpisodeListDrawer(true);
      console.log('✅ 시즌 에피소드 팝업 데이터:', response.data);
    } catch (error) {
      console.error('🚨 시즌 에피소드 팝업 API 호출 오류:', error);
    }
  };

  const renderSelectDrawer = () => {
    return (
      <>
        {contents[currentIndex]?.categoryType === ContentCategoryType.Video ? (
          <>
            <SelectDrawerArrow
              isOpen={isOptionModal}
              items={selectOptionItem}
              onClose={() => {
                setIsOptionModal(false);
              }}
              selectedIndex={1}
            />
            <SelectDrawer
              isOpen={isOpenDubbingModal}
              items={dubbingDrawerItem}
              onClose={() => {
                setIsDubbingModal(false);
              }}
              isCheck={false}
              selectedIndex={1}
            />
            <SelectDrawer
              isOpen={isOpenSubtitleModal}
              items={subtitleDrawerItems}
              onClose={() => {
                setIsSubtitleModal(false);
              }}
              isCheck={false}
              selectedIndex={1}
            />
            <SelectDrawer
              isOpen={isOpenPlaySpeedModal}
              items={playSpeedItems}
              onClose={() => {
                setIsPlaySpeedModal(false);
              }}
              isCheck={false}
              selectedIndex={1}
            />
          </>
        ) : (
          <>
            <SelectDrawerArrow
              isOpen={isOptionModal}
              items={selectWebtoonOptionItem}
              onClose={() => {
                setIsOptionModal(false);
              }}
              selectedIndex={1}
            />
            <SelectDrawer
              isOpen={isOpenWebtoonSubtitleModal}
              items={webtoonSubtitleItems}
              onClose={() => {
                setIsWebtoonSubtitleModal(false);
              }}
              isCheck={false}
              selectedIndex={1}
            />
          </>
        )}
      </>
    );
  };

  // 현재 보이는 컨텐츠와 다음 컨텐츠만 로드
  useEffect(() => {
    const newLoadedContents = [currentIndex];
    if (currentIndex < contents.length - 1) {
      newLoadedContents.push(currentIndex + 1);
    }
    setLoadedContents(newLoadedContents);
  }, [currentIndex, contents.length]);

  // 스크롤 스냅 처리
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollPosition = container.scrollTop;
    const itemHeight = container.clientHeight;
    const newIndex = Math.round(scrollPosition / itemHeight);

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex]);

  // 컨트롤 UI 자동 숨김
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startAutoHideTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  useEffect(() => {
    if (isVisible && !isDragging) {
      startAutoHideTimer();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isVisible, isDragging]);

  const handleTrigger = () => {
    setIsVisible(!isVisible);
  };

  const handleVideoProgress = (currentTime: number) => {
    setVideoProgress(currentTime);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleContentChange = (index: number) => {
    // 이전 비디오 정지
    if (videoRefs.current[currentIndex]) {
      videoRefs.current[currentIndex].pause();
    }
    // 새 비디오 재생
    if (videoRefs.current[index]) {
      videoRefs.current[index].play();
    }
  };

  const handleFollow = async () => {
    try {
      await followProfile(contents[currentIndex].profileId, !curIsFollow);
      setCurIsFollow(!curIsFollow);
      setAnimationClass(styles.startAnimation);
      setTimeout(() => setAnimationClass(styles.fullSize), 75);
      setTimeout(() => setAnimationClass(styles.shrinkAnimation), 475);
    } catch (error) {
      console.error('Follow error:', error);
    }
  };

  const handleLike = async () => {
    try {
      if (isDisLike) {
        await handleDisLike(!isDisLike);
      }
      const response = await sendLike(InteractionType.Contents, contents[currentIndex].id, !isLike);
      if (response?.resultCode === 0) {
        setIsLike(!isLike);
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleDisLike = async (value: boolean) => {
    try {
      if (isLike) {
        await handleLike();
      }
      const response = await sendDisLike(InteractionType.Contents, contents[currentIndex].id, value);
      if (response.resultCode === 0) {
        setIsDisLike(value);
      }
    } catch (error) {
      console.error('Dislike error:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      const payload: BookMarkReq = {
        interactionType: InteractionType.Contents,
        typeValueId: contents[currentIndex].id,
        isBookMark: !isBookmarked,
      };
      const response = await bookmark(payload);
      if (response?.resultCode === 0) {
        setIsBookmarked(!isBookmarked);
      }
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  const updateProgress = useCallback(
    (e: MouseEvent | Touch) => {
      if (!progressBarRef.current || videoDuration === 0) return;

      const rect = progressBarRef.current.getBoundingClientRect();
      const clientX = 'clientX' in e ? e.clientX : 0;
      const offsetX = clientX - rect.left;
      let newProgress = (offsetX / rect.width) * videoDuration;

      newProgress = Math.max(0, Math.min(videoDuration, newProgress));
      setVideoProgress(newProgress);

      if (videoRefs.current[currentIndex]) {
        videoRefs.current[currentIndex].currentTime = newProgress;
      }
    },
    [videoDuration],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true);
      updateProgress(e.nativeEvent);
      setIsPlaying(false);
    },
    [updateProgress],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      // 컨트롤 영역이나 버튼을 터치한 경우 이벤트 전파 중단
      if (
        e.target instanceof HTMLElement &&
        (e.target.closest(`.${styles.controls}`) ||
          e.target.closest(`.${styles.header}`) ||
          e.target.closest(`.${styles.progressBar}`) ||
          e.target.closest(`.${styles.playCircleIcon}`))
      ) {
        return;
      }

      e.stopPropagation();
      setIsVisible(prev => !prev);
      if (!isVisible) {
        startAutoHideTimer();
      }
    },
    [isVisible],
  );

  const handleProgressTouch = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (e.touches.length > 0) {
        setIsDragging(true);
        updateProgress(e.touches[0] as Touch);
        setIsPlaying(false);
      }
    },
    [updateProgress],
  );

  const handleSetDubbing = (value: number) => {
    const track = playerRef.current?.getVariantTracks()[value];
    if (track) playerRef.current?.selectVariantTrack(track, true);
  };

  const handleSetSubtitle = (value: ContentLanguageType) => {
    const languageCode = ContentLanguageType[value].toLowerCase();
    const tracks = playerRef.current?.getTextTracks();
    const matchedTrack = tracks?.find((track: any) => track.language === languageCode);

    if (matchedTrack) {
      playerRef.current.selectTextTrack(matchedTrack);
      playerRef.current.setTextTrackVisibility(true);
      setSubtitleLang(value);
    } else {
      console.warn(`🚨 해당 자막(${value})에 맞는 트랙을 찾지 못했습니다.`);
    }
  };

  const handleSetPlaySpeed = (speedRate: number) => {
    if (videoRefs.current[currentIndex]) {
      videoRefs.current[currentIndex].playbackRate = speedRate;
    }
  };

  const handleReport = async () => {
    try {
      dataToast.open(getLocalizedText('common_alert_110'), ToastType.Normal);
      if (!contents[currentIndex]) return;
      const response = await sendReport({
        interactionType: InteractionType.Contents,
        typeValueId: contents[currentIndex].id,
        isReport: true,
      });
    } catch (error) {
      console.error('🚨 신고 API 호출 오류:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
          margin: 0,
          borderRadius: 0,
          overflow: 'hidden',
          position: 'relative',
        },
      }}
    >
      <div className={styles.viewerModal} onTouchStart={handleTouchStart}>
        <div
          className={`${styles.header} ${isVisible ? styles.fadeInT : styles.fadeOutT}`}
          onTouchStart={e => e.stopPropagation()}
        >
          <button onClick={onClose}>
            <img src={LineArrowLeft.src} alt="Back" />
          </button>
          <h2>{contents[currentIndex].title}</h2>
        </div>

        <Swiper
          direction="vertical"
          modules={[Virtual]}
          virtual
          initialSlide={initialIndex}
          onSlideChange={swiper => {
            setCurrentIndex(swiper.activeIndex);
            handleContentChange(swiper.activeIndex);
          }}
          style={{height: '100%'}}
        >
          {contents.map((content, index) => (
            <SwiperSlide key={content.id} virtualIndex={index}>
              <div className={styles.contentItem} onTouchStart={handleTouchStart}>
                {content.categoryType === ContentCategoryType.Video ? (
                  <div className={styles.videoContainer}>
                    <video
                      ref={el => {
                        if (el) {
                          videoRefs.current[index] = el;
                        }
                      }}
                      src={content.episodeVideoInfo?.videoSourceFileInfo.videoSourceUrl}
                      muted={isMute}
                      loop
                      playsInline
                      onTimeUpdate={e => handleVideoProgress(e.currentTarget.currentTime)}
                      onDurationChange={e => setVideoDuration(e.currentTarget.duration)}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                    {currentIndex === index && (
                      <>
                        <div
                          className={`${styles.playCircleIcon} ${isVisible ? styles.fadeIn : styles.fadeOut}`}
                          onClick={() => {
                            if (videoRefs.current[currentIndex]) {
                              if (isPlaying) {
                                videoRefs.current[currentIndex].pause();
                              } else {
                                videoRefs.current[currentIndex].play();
                              }
                              setIsPlaying(!isPlaying);
                            }
                          }}
                        >
                          <img
                            src={isPlaying ? BoldPause.src : BoldPlay.src}
                            alt={isPlaying ? 'Pause' : 'Play'}
                            style={{width: '30px', height: '30px'}}
                          />
                        </div>
                        <div className={`${styles.header} ${isVisible ? styles.fadeInT : styles.fadeOutT}`}>
                          <div
                            ref={progressBarRef}
                            className={`${styles.progressBar} ${isVisible ? styles.fadeInB : styles.fadeOutB} ${
                              isDragging ? styles.dragging : ''
                            }`}
                            onMouseDown={handleMouseDown}
                            onTouchStart={handleProgressTouch}
                          >
                            <div
                              className={styles.progressFill}
                              style={{
                                width: `${(videoProgress / videoDuration) * 100}%`,
                                transition: isDragging ? 'none' : 'width 0.1s linear',
                              }}
                            >
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '50%',
                                  right: 0,
                                  transform: 'translate(50%, -50%)',
                                  width: '20px',
                                  height: '20px',
                                  backgroundColor: '#fff',
                                  borderRadius: '50%',
                                  boxShadow: '0 0 4px rgba(0, 0, 0, 0.3)',
                                  zIndex: 10,
                                  cursor: 'pointer',
                                }}
                                onMouseDown={handleMouseDown}
                                onTouchStart={handleProgressTouch}
                              />
                            </div>
                          </div>
                        </div>
                        <div className={styles.timeDisplay}>{formatDuration(videoDuration)}</div>
                      </>
                    )}
                    <div className={`${styles.controls} ${!isVisible ? styles.hidden : ''}`}>
                      <div className={`${styles.ctaButtons} ${!isVisible ? styles.fadeOutR : ''}`}>
                        <div className={styles.textButtons} style={{pointerEvents: 'auto'}}>
                          <Avatar
                            src={content.profileIconUrl}
                            style={{width: '32px', height: '32px', position: 'relative'}}
                            onClick={event => {
                              event.stopPropagation();
                              pushLocalizedRoute(`/profile/${content.profileUrlLinkKey}`, router);
                            }}
                          />
                          {!content.isProfileFollow && !content.isMyEpisode && (
                            <div
                              className={`${curIsFollow ? styles.checkCircle : styles.plusCircle} ${animationClass}`}
                              onClick={event => {
                                event.stopPropagation();
                                handleFollow();
                              }}
                            >
                              {curIsFollow ? (
                                <img src={LineCheck.src} alt="Check" className={styles.checkImg} />
                              ) : (
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
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
                        {!content.isMyEpisode && (
                          <div
                            className={styles.textButtons}
                            style={{pointerEvents: 'auto'}}
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
                          style={{pointerEvents: 'auto'}}
                          onClick={event => {
                            event.stopPropagation();
                            handleLike();
                          }}
                        >
                          <img
                            src={BoldLike.src}
                            className={styles.button}
                            style={{
                              filter: isLike
                                ? 'brightness(0) saturate(100%) invert(47%) sepia(57%) saturate(1806%) hue-rotate(287deg) brightness(102%) contrast(98%)'
                                : 'none',
                            }}
                          />
                          <div className={styles.count}>{content.commonMediaViewInfo.likeCount}</div>
                        </div>
                        <div
                          className={styles.textButtons}
                          style={{pointerEvents: 'auto'}}
                          onClick={event => {
                            event.stopPropagation();
                            handleDisLike(!isDisLike);
                          }}
                        >
                          <img
                            src={BoldDislike.src}
                            className={styles.button}
                            style={{
                              filter: isDisLike
                                ? 'brightness(0) saturate(100%) invert(69%) sepia(59%) saturate(1244%) hue-rotate(153deg) brightness(102%) contrast(101%)'
                                : 'none',
                            }}
                          />
                        </div>
                        <div
                          className={styles.textButtons}
                          style={{pointerEvents: 'auto'}}
                          onClick={event => {
                            event.stopPropagation();
                            setCommentIsOpen(true);
                          }}
                        >
                          <img src={BoldComment.src} className={styles.button}></img>
                          <div className={styles.count}>{content.commonMediaViewInfo.commentCount}</div>
                        </div>
                        <div
                          className={styles.noneTextButton}
                          style={{pointerEvents: 'auto'}}
                          onClick={event => {
                            event.stopPropagation();
                            setIsShare(true);
                          }}
                        >
                          <img src={BoldShare.src} className={styles.button}></img>
                        </div>
                        <div
                          className={styles.noneTextButton}
                          style={{pointerEvents: 'auto'}}
                          onClick={event => {
                            event.stopPropagation();
                            handleBookmark();
                          }}
                        >
                          {isBookmarked && <img src={BoldArchive.src} className={styles.button}></img>}
                          {!isBookmarked && <img src={LineArchive.src} className={styles.button}></img>}
                        </div>
                        {contents[currentIndex].type !== ContentType.Single && (
                          <div
                            className={styles.noneTextButton}
                            style={{pointerEvents: 'auto'}}
                            onClick={event => {
                              event.stopPropagation();
                              fetchSeasonEpisodesPopup();
                            }}
                          >
                            <img src={BoldContents.src} className={styles.button}></img>
                          </div>
                        )}
                        <div
                          className={styles.noneTextButton}
                          style={{pointerEvents: 'auto'}}
                          onClick={event => {
                            event.stopPropagation();
                            setIsOptionModal(true);
                          }}
                        >
                          <img src={BoldMore.src} className={styles.button}></img>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.webtoonContainer}>
                    {content.episodeWebtoonInfo?.webtoonSourceUrlList
                      .find(item => item.webtoonLanguageType === ContentLanguageType.Source)
                      ?.webtoonSourceUrls.map((url, index) => (
                        <img key={index} src={url} className={styles.webtoonImage} alt={`Webtoon page ${index + 1}`} />
                      ))}
                    <div className={`${styles.controls} ${!isVisible ? styles.hidden : ''}`}>
                      <div className={`${styles.ctaButtons} ${!isVisible ? styles.fadeOutR : ''}`}>
                        <div className={styles.textButtons} style={{pointerEvents: 'auto'}}>
                          <Avatar
                            src={content.profileIconUrl}
                            style={{width: '32px', height: '32px', position: 'relative'}}
                            onClick={event => {
                              event.stopPropagation();
                              pushLocalizedRoute(`/profile/${content.profileUrlLinkKey}`, router);
                            }}
                          />
                          {!content.isProfileFollow && !content.isMyEpisode && (
                            <div
                              className={`${curIsFollow ? styles.checkCircle : styles.plusCircle} ${animationClass}`}
                              onClick={event => {
                                event.stopPropagation();
                                handleFollow();
                              }}
                            >
                              {curIsFollow ? (
                                <img src={LineCheck.src} alt="Check" className={styles.checkImg} />
                              ) : (
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
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
                        {!content.isMyEpisode && (
                          <div
                            className={styles.textButtons}
                            style={{pointerEvents: 'auto'}}
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
                          style={{pointerEvents: 'auto'}}
                          onClick={event => {
                            event.stopPropagation();
                            handleLike();
                          }}
                        >
                          <img
                            src={BoldLike.src}
                            className={styles.button}
                            style={{
                              filter: isLike
                                ? 'brightness(0) saturate(100%) invert(47%) sepia(57%) saturate(1806%) hue-rotate(287deg) brightness(102%) contrast(98%)'
                                : 'none',
                            }}
                          />
                          <div className={styles.count}>{content.commonMediaViewInfo.likeCount}</div>
                        </div>
                        <div
                          className={styles.textButtons}
                          style={{pointerEvents: 'auto'}}
                          onClick={event => {
                            event.stopPropagation();
                            handleDisLike(!isDisLike);
                          }}
                        >
                          <img
                            src={BoldDislike.src}
                            className={styles.button}
                            style={{
                              filter: isDisLike
                                ? 'brightness(0) saturate(100%) invert(69%) sepia(59%) saturate(1244%) hue-rotate(153deg) brightness(102%) contrast(101%)'
                                : 'none',
                            }}
                          />
                        </div>
                        <div
                          className={styles.textButtons}
                          style={{pointerEvents: 'auto'}}
                          onClick={event => {
                            event.stopPropagation();
                            setCommentIsOpen(true);
                          }}
                        >
                          <img src={BoldComment.src} className={styles.button}></img>
                          <div className={styles.count}>{content.commonMediaViewInfo.commentCount}</div>
                        </div>
                        <div
                          className={styles.noneTextButton}
                          style={{pointerEvents: 'auto'}}
                          onClick={event => {
                            event.stopPropagation();
                            setIsShare(true);
                          }}
                        >
                          <img src={BoldShare.src} className={styles.button}></img>
                        </div>
                        <div
                          className={styles.noneTextButton}
                          style={{pointerEvents: 'auto'}}
                          onClick={event => {
                            event.stopPropagation();
                            handleBookmark();
                          }}
                        >
                          {isBookmarked && <img src={BoldArchive.src} className={styles.button}></img>}
                          {!isBookmarked && <img src={LineArchive.src} className={styles.button}></img>}
                        </div>
                        {contents[currentIndex].type !== ContentType.Single && (
                          <div
                            className={styles.noneTextButton}
                            style={{pointerEvents: 'auto'}}
                            onClick={event => {
                              event.stopPropagation();
                              fetchSeasonEpisodesPopup();
                            }}
                          >
                            <img src={BoldContents.src} className={styles.button}></img>
                          </div>
                        )}
                        <div
                          className={styles.noneTextButton}
                          style={{pointerEvents: 'auto'}}
                          onClick={event => {
                            event.stopPropagation();
                            setIsOptionModal(true);
                          }}
                        >
                          <img src={BoldMore.src} className={styles.button}></img>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {isCommentOpen && (
        <Comment
          contentId={contents[currentIndex].id}
          isOpen={isCommentOpen}
          toggleDrawer={setCommentIsOpen}
          commentType={CommentContentType.Content}
          onAddTotalCommentCount={() => {}}
          onSubTotalCommentCount={() => {}}
        />
      )}

      <SharePopup
        open={isShare}
        title={contents[currentIndex].title}
        url={window.location.href}
        onClose={() => setIsShare(false)}
      />

      {isDonation && (
        <DrawerDonation
          isOpen={isDonation}
          sponsoredName={contents[currentIndex].title}
          giveToPDId={contents[currentIndex].profileId}
          onClose={() => setDonation(false)}
        />
      )}

      <LoadingOverlay loading={isLoading} />

      {/* 모어 버튼 모달 */}
      <CustomDrawer open={isOptionModal} onClose={() => setIsOptionModal(false)}>
        <div className={styles.episodeListDrawer}>
          <div className={styles.profileContainer}>
            <div className={styles.profileImageWrapper}>
              <img src={contents[currentIndex].profileIconUrl} alt="Profile" className={styles.profileImage} />
              <div className={styles.imageOverlay} />
            </div>
            <div className={styles.profileInfo}>
              <div className={styles.title}>{contents[currentIndex].title}</div>
              <div className={styles.episodeRow}>
                <span className={styles.episodeInfo}>
                  {contents[currentIndex].categoryType === ContentCategoryType.Video ? 'Video' : 'Webtoon'}
                </span>
                <span className={styles.completeBadge}>Complete</span>
              </div>
            </div>
          </div>
          <button
            className={styles.reportButton}
            onClick={() => {
              sendReport({
                interactionType: InteractionType.Contents,
                typeValueId: contents[currentIndex].id,
                isReport: true,
              });
              setIsOptionModal(false);
            }}
          >
            <img src={LineScaleUp.src} alt="Report" />
            <span>{getLocalizedText('Report')}</span>
          </button>
        </div>
      </CustomDrawer>

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
                <img src={contents[currentIndex].profileIconUrl} alt="Profile" className={styles.profileImage} />
                <div className={styles.imageOverlay}></div>
              </div>

              {/* 텍스트 정보 */}
              <div className={styles.profileInfo}>
                <div className={styles.title}>
                  {formatText(getLocalizedText('contenthome001_label_001'), [episodeListData.contentName])}
                </div>

                <div style={{gap: '8px'}}>
                  {/* 에피소드 정보 + 완결 배지 */}
                  <div className={styles.episodeRow}>
                    <span className={styles.episodeInfo}>
                      {formatText(getLocalizedText('common_alert_97'), [
                        '1',
                        episodeListData.episodeList.length.toString(),
                      ])}
                    </span>
                    {/* {<span className={styles.completeBadge}>완결여부</span>} */}
                  </div>

                  {/* 장르 정보 */}
                  <div className={styles.genreRow}>
                    {' '}
                    <span className={styles.genres}>
                      {[
                        getLocalizedText(episodeListData?.genre ?? ''),
                        ...(episodeListData?.tags.map(v => getLocalizedText(v)) ?? []),
                      ]
                        .filter(Boolean)
                        .join(' / ')}
                    </span>
                  </div>
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

                      hasRun.current = false;
                      setCurEpisodeId(episode.episodeId);
                      setOnEpisodeListDrawer(false);
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
          contentId={contentId ?? contents[currentIndex].id}
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
      {renderSelectDrawer()}
    </Dialog>
  );
};

export default ViewerContent;
