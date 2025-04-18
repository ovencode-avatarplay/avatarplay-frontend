import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from './ViewerContent.module.css';
import 'swiper/css';
import 'swiper/css/pagination';
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
import {Avatar, Box, Modal} from '@mui/material';
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
import DrawerDonation from '../../create/common/DrawerDonation';
import {PopupPurchase} from '../series/ContentSeriesDetail';
import getLocalizedText from '@/utils/getLocalizedText';
import formatText from '@/utils/formatText';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import shaka from 'shaka-player/dist/shaka-player.compiled';
import SelectDrawerArrow, {SelectDrawerArrowItem} from '@/components/create/SelectDrawerArrow';
import LoadingOverlay from '@/components/create/LoadingOverlay';

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

  const [isLoading, setIsLoading] = useState(false);

  const [episodeListData, setEpisodeListData] = useState<GetSeasonEpisodesPopupRes>();

  const [isDonation, setDonation] = useState(false);

  const [onPurchasePopup, setOnPurchasePopup] = useState(false);
  const [purchaseData, setPurchaseData] = useState<SeasonEpisodeInfo>();

  const handlePlayRecent = async () => {
    try {
      const playRequest: PlayButtonReq = {
        contentId: contentId,
      };

      setIsLoading(true);
      const playResponse = await sendPlayButton(playRequest);

      setIsLoading(false);
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
      setIsLoading(true);
      const playData = await sendPlay(playRequest);
      setIsLoading(false);
      console.log('✅ Play API 응답:', playData.data);
      setInfo(playData.data?.recentlyPlayInfo);
    } catch (error) {
      console.error('🚨 Play 관련 API 호출 오류:', error);
    }
  };

  useEffect(() => {
    if (info?.categoryType == ContentCategoryType.Webtoon) handleRecordPlay();
  }, [info]);

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

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
  }, []);

  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  // 5초 후에 isVisible을 false로 만드는 타이머 설정
  // 5초 후 자동 숨김 함수
  const startAutoHideTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current); // 이전 타이머 제거
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  // 상태 감지: visible && 드래그 중이 아닐 때만 타이머 시작
  useEffect(() => {
    if (isVisible) {
      if (isDragging) {
        // 드래그 중이면 타이머 보류
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      } else {
        // 드래그가 끝나면 타이머 새로 시작
        startAutoHideTimer();
      }
    } else {
      // visible이 false면 타이머 제거
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isVisible, isDragging]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleTrigger = () => {
    setIsVisible(!isVisible); // 트리거 발생 시 서서히 사라짐
  };
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

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

  // 🎯 프로그레스 바 클릭 또는 드래그 시작 시 실행
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('마우스 다운');
    setIsDragging(true);
    updateProgress(e.nativeEvent); // 클릭 위치 반영
    setIsPlaying(false);
  };

  // 🎯 마우스를 움직일 때 실행
  const handleMouseMove = (e: MouseEvent) => {
    e.stopPropagation();
    if (!isDragging) return;
    updateProgress(e);
  };

  // 🎯 마우스가 놓일 때 실행
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setIsPlaying(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.touches.length > 0) {
      setIsDragging(true);
      updateProgress(e.touches[0] as Touch); // ✅ 수정된 부분
      setIsPlaying(false);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    updateProgress(e.touches[0]);
    setIsPlaying(false);
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !info?.episodeVideoInfo?.videoSourceFileInfo.videoSourceUrl) return;

    const player = new shaka.Player(video);
    player.configure({
      textDisplayFactory: () => new shaka.text.UITextDisplayer(video, video.parentElement),
    });
    playerRef.current = player;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      handleVideoProgress(currentTime);
      setCurrentProgress(formatDuration(currentTime));
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };
    player.load(`${process.env.NEXT_PUBLIC_CHAT_API_URL}${info.episodeVideoInfo.mpdTempUrl}`).then(async () => {
      console.log('✅ Shaka Player video loaded');

      setVideoDuration(video.duration);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('ended', handleEnded);

      if (info?.episodeVideoInfo?.subTitleFileInfos) {
        console.log('🔎 자막 URL:', info.episodeVideoInfo.subTitleFileInfos);
        await Promise.all(
          info?.episodeVideoInfo?.subTitleFileInfos.map(async fileInfo => {
            const lang = ContentLanguageType[fileInfo.videoLanguageType].toLowerCase(); // ex) 'kor' -> 'kor'
            const url = fileInfo.videoSourceUrl;
            await player.addTextTrackAsync(url, lang, 'subtitles', 'text/vtt');
          }) || [],
        );

        player.setTextTrackVisibility(true);

        console.log('✅ 자막 추가 완료!');
      } else {
        console.warn('🚨 자막 URL이 없습니다.');
      }
    });

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      player.destroy();
    };
  }, [info?.episodeVideoInfo?.videoSourceFileInfo.videoSourceUrl]);

  useEffect(() => {
    const checkShakaSubtitle = setInterval(() => {
      const el = document.querySelector('.shaka-text-container');
      if (el) {
        console.log('✅ 자막 DOM 발견됨:', el);
        clearInterval(checkShakaSubtitle);
      } else {
        console.log('❌ 아직 자막 DOM 없음');
      }
    }, 500);

    return () => clearInterval(checkShakaSubtitle);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(error => console.error('🚨 Play Error:', error));
    } else {
      video.pause();
    }
  }, [isPlaying]);
  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = isMute;
  }, [isMute]);
  const updateProgress = (e: MouseEvent | Touch) => {
    if (!progressBarRef.current || videoDuration === 0) return;

    const rect = progressBarRef.current.getBoundingClientRect();

    // 공통으로 clientX를 뽑아오기
    const clientX = 'clientX' in e ? e.clientX : 0;

    const offsetX = clientX - rect.left;
    let newProgress = (offsetX / rect.width) * videoDuration;

    newProgress = Math.max(0, Math.min(videoDuration, newProgress));
    setVideoProgress(newProgress);

    if (videoRef.current) {
      videoRef.current.currentTime = newProgress;
    }
  };

  // 🎯 드래그 이벤트 `window`에 적용하여 진행 바 놓치지 않도록 유지
  useEffect(() => {
    // PC용
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // 모바일용
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    if (isDragging) setIsPlaying(false);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
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
  const handleClick = () => {
    setIsPlaying(!isPlaying);
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
  };
  const lastExecutedSecondRef = useRef<number>(-1);
  const handleRecordPlay = async () => {
    if (!info) return;
    try {
      const recordPlayRequest: RecordPlayReq = {
        episodeRecordPlayInfo: {
          contentId: info.contentId,
          episodeId: info.episodeId,
          categoryType: info.categoryType,
          playTimeSecond: Math.floor(videoProgress),
        },
      };

      await sendRecordPlay(recordPlayRequest);
    } catch (error) {
      console.error('🚨 RecordPlay API 호출 오류:', error);
    }
  };

  const handleVideoProgress = (playedSeconds: number) => {
    const roundedSeconds = Math.floor(playedSeconds);

    if (lastExecutedSecondRef.current !== roundedSeconds) {
      lastExecutedSecondRef.current = roundedSeconds; // 정확히 초마다 실행
      handleRecordPlay();
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
  const handleDisLikeFeed = async (feedId: number, isDisLike: boolean) => {
    try {
      if (isLike == true) {
        await handleLikeFeed(feedId, !isLike);
      }
      const response = await sendDisLike(
        episodeId ? InteractionType.Episode : InteractionType.Contents,
        feedId,
        isDisLike,
      );

      if (response.resultCode === 0) {
        console.log(`content ${feedId} has been ${isDisLike ? 'liked' : 'unliked'} successfully!`);
        setIsDisLike(isDisLike);
      } else {
        console.error(`Failed to like/unlike content: ${response.resultMessage}`);
      }
    } catch (error) {
      console.error('An error occurred while liking/unliking the content:', error);
    }
  };

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
  const [subTitleLang, setSubtitleLang] = useState<ContentLanguageType>(ContentLanguageType.Korean);
  const [playSpeed, setPlaySpeed] = useState<number>(1);

  //#region 더빙
  const dubbingDrawerItem: SelectDrawerItem[] = [
    {
      name: 'Original',
      onClick: () => {
        handleSetDubbing(0); // 오리지널은 0번
        setDubbingLang(ContentLanguageType.Default); // 필요시 타입에 맞게 수정
      },
    },
    ...(info?.episodeVideoInfo?.dubbingFileInfos?.map((fileInfo, index) => ({
      name: ContentLanguageType[fileInfo.videoLanguageType],
      onClick: () => {
        handleSetDubbing(index + 1); // +1 해서 오리지널 제외
        setDubbingLang(fileInfo.videoLanguageType);
      },
    })) || []),
  ];

  const [isOpenDubbingModal, setIsDubbingModal] = useState(false);

  const [dubbingLang, setDubbingLang] = useState<ContentLanguageType>(ContentLanguageType.Korean);
  const handleSetDubbing = (value: number) => {
    info?.episodeVideoInfo?.dubbingFileInfos;
    console.log(value);
    const track = playerRef.current?.getVariantTracks()[value];
    console.log(track);
    if (track) playerRef.current?.selectVariantTrack(track, true);
  };
  //#endregion

  //#region 자막
  const [isOpenSubtitleModal, setIsSubtitleModal] = useState(false);
  const subtitleDrawerItems: SelectDrawerItem[] = [
    {
      name: 'Original', // 자막 없음
      onClick: () => {
        playerRef.current?.setTextTrackVisibility(false); // 자막 끔
        setSubtitleLang(ContentLanguageType.Default); // 상태에도 반영
      },
    },
    ...(info?.episodeVideoInfo?.subTitleFileInfos?.map(fileInfo => ({
      name: ContentLanguageType[fileInfo.videoLanguageType],
      onClick: () => {
        handleSetSubtitle(fileInfo.videoLanguageType); // 선택한 자막 설정
      },
    })) || []),
  ];

  const handleSetSubtitle = (value: ContentLanguageType) => {
    const languageCode = ContentLanguageType[value].toLowerCase(); // ex) 'Korean' → 'korean' or 'ko'로 매핑 필요

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
  //#endregion

  //#region 배속
  const [isOpenPlaySpeedModal, setIsPlaySpeedModal] = useState(false);
  const playSpeedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const playSpeedItems: SelectDrawerItem[] = playSpeedOptions.map(speed => ({
    name: `x${speed}`,
    onClick: () => {
      handleSetPlaySpeed(speed);
      setPlaySpeed(speed); // 현재 선택된 속도를 상태에 반영
    },
  }));

  const handleSetPlaySpeed = (speedRate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speedRate;
    }
  };
  //#endregion

  //#region 옵션
  const [isOptionModal, setIsOptionModal] = useState(false);

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
  const handleReport = async () => {
    try {
      if (!info) return;
      const response = await sendReport({
        interactionType: InteractionType.Contents, // 예: 댓글 = 1, 피드 = 2 등 서버 정의에 따라
        typeValueId: info?.contentId, // 신고 대상 ID
        isReport: true, // true = 신고, false = 취소
      });
    } catch (error) {
      console.error('🚨 신고 API 호출 오류:', error);
    }
  };
  //#endregion

  //#region 웹툰 자막
  const [isOpenWebtoonSubtitleModal, setIsWebtoonSubtitleModal] = useState(false);
  const [webtoonSubtitleLang, setWebtoonSubtitleLang] = useState<ContentLanguageType>(ContentLanguageType.Default);

  useEffect(() => {
    if (info?.episodeWebtoonInfo?.webtoonSourceUrlList) {
      const subtitle = info.episodeWebtoonInfo.webtoonSourceUrlList.find(
        item => item.webtoonLanguageType !== ContentLanguageType.Source,
      );
      if (subtitle) {
        setWebtoonSubtitleLang(subtitle.webtoonLanguageType);
      }
    }
  }, [info?.episodeWebtoonInfo?.webtoonSourceUrlList]);

  const webtoonSubtitleItems: SelectDrawerItem[] = [
    ...(info?.episodeWebtoonInfo?.webtoonSourceUrlList?.map((item, index) => ({
      name: ContentLanguageType[item.webtoonLanguageType],
      onClick: () => {
        setWebtoonSubtitleLang(item.webtoonLanguageType);
      },
    })) || []),
  ];
  //#endregion

  const renderSelectDrawer = () => {
    return (
      <>
        {info?.categoryType == ContentCategoryType.Video ? (
          <>
            {' '}
            <SelectDrawerArrow
              isOpen={isOptionModal}
              items={selectOptionItem}
              onClose={() => {
                setIsOptionModal(false);
              }}
              selectedIndex={1}
            ></SelectDrawerArrow>
            <SelectDrawer
              isOpen={isOpenDubbingModal}
              items={dubbingDrawerItem}
              onClose={() => {
                setIsDubbingModal(false);
              }}
              isCheck={false}
              selectedIndex={1}
            ></SelectDrawer>
            <SelectDrawer
              isOpen={isOpenSubtitleModal}
              items={subtitleDrawerItems}
              onClose={() => {
                setIsSubtitleModal(false);
              }}
              isCheck={false}
              selectedIndex={1}
            ></SelectDrawer>
            <SelectDrawer
              isOpen={isOpenPlaySpeedModal}
              items={playSpeedItems}
              onClose={() => {
                setIsPlaySpeedModal(false);
              }}
              isCheck={false}
              selectedIndex={1}
            ></SelectDrawer>
          </>
        ) : (
          <>
            {' '}
            <SelectDrawerArrow
              isOpen={isOptionModal}
              items={selectWebtoonOptionItem}
              onClose={() => {
                setIsOptionModal(false);
              }}
              selectedIndex={1}
            ></SelectDrawerArrow>
            <SelectDrawer
              isOpen={isOpenWebtoonSubtitleModal}
              items={webtoonSubtitleItems}
              onClose={() => {
                setIsWebtoonSubtitleModal(false);
              }}
              isCheck={false}
              selectedIndex={1}
            ></SelectDrawer>
          </>
        )}
      </>
    );
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="viwer-content-modal"
      aria-describedby="viwer-content-modal-description"
      className={styles.body}
      hideBackdrop
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
                  <img src={LineArrowLeft.src} className={styles.backIcon} />
                </button>

                <h1 className={styles.navTitle}>
                  {info && episodeId ? (
                    <>
                      {formatText(getLocalizedText('contenthome001_label_001'), [info.episodeNo.toString()])}{' '}
                      {info.title}
                    </>
                  ) : (
                    <>{info?.title}</>
                  )}
                </h1>
              </div>
            </header>
          </div>
          <div style={{height: '100%'}} onClick={() => handleTrigger()}>
            <div className={styles.Image}>
              {info?.categoryType === ContentCategoryType.Webtoon && (
                <div className={styles.webtoonContainer}>
                  {(() => {
                    const sourceLayer = info?.episodeWebtoonInfo?.webtoonSourceUrlList?.find(
                      item => item.webtoonLanguageType === ContentLanguageType.Source,
                    );

                    const subtitleLayer =
                      webtoonSubtitleLang !== ContentLanguageType.Default
                        ? info?.episodeWebtoonInfo?.webtoonSourceUrlList?.find(
                            item => item.webtoonLanguageType === webtoonSubtitleLang,
                          )
                        : null;

                    return sourceLayer?.webtoonSourceUrls?.map((url, index) => (
                      <div key={index} className={styles.webtoonImageWrapper}>
                        <img src={url} className={styles.webtoonImage} />
                        {subtitleLayer?.webtoonSourceUrls?.[index] && (
                          <img
                            src={subtitleLayer.webtoonSourceUrls[index]}
                            className={styles.webtoonSubtitleImage}
                            alt="subtitle"
                          />
                        )}
                      </div>
                    ));
                  })()}
                </div>
              )}

              {info && info?.categoryType === ContentCategoryType.Video && (
                <div style={{position: 'relative', width: '100%', height: '100%'}}>
                  <video
                    ref={videoRef}
                    muted={isMute}
                    loop={true}
                    playsInline
                    style={{
                      width: '100%',
                      height: 'calc(100% - 4px)',
                      borderRadius: '8px',
                      objectFit: 'contain',
                    }}
                    onClick={event => {}}
                    controls={false} // Shaka Player가 컨트롤합니다.
                    autoPlay
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
                      onClick={event => {
                        event.stopPropagation(); // 부모로 이벤트 전파 방지
                        if (isVisible) handleClick();
                        else setIsVisible(true);
                      }}
                    >
                      <img src={isPlaying ? BoldPause.src : BoldPlay.src} />
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
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
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
                    onTouchStart={handleTouchStart}
                  />
                </div>
              </div>
            )}

            <div className={`${styles.profileBox} ${!isVisible ? styles.fadeOutB : ''}`}>
              <div className={styles.dim}></div>

              {/* Video Info */}
              <div className={styles.videoInfo}>
                {info?.categoryType == ContentCategoryType.Webtoon && <>{getLocalizedText('common_filter_photo')}</>}
                {info?.categoryType == ContentCategoryType.Video && (
                  <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center'}}>
                    <img className={styles.iconVideo} src={BoldVideo.src}></img>
                    {getLocalizedText('common_filter_video')}· {currentProgress ? currentProgress : '0:00'}/
                    {formatDuration(videoDuration)}
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
                <div className={styles.count}>{likeCount && likeCount >= 0 ? likeCount : 0}</div>
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
                  setIsOptionModal(true);
                }}
              >
                <img src={BoldMore.src} className={styles.button}></img>
              </div>
            </div>
            {info?.categoryType == ContentCategoryType.Video && (
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
                  <img src={LineVolumeOff.src} className={styles.volumeIcon} />
                )}

                {/* 볼륨 활성 상태 아이콘 */}
                {info?.categoryType == ContentCategoryType.Video && !isMute && (
                  <img src={LineVolumeOn.src} className={styles.volumeIcon} />
                )}
              </div>
            )}
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
                    <div className={styles.title}>
                      {formatText(getLocalizedText('contenthome001_label_001'), [episodeListData.contentName])}
                    </div>

                    <div style={{gap: '8px'}}>
                      {/* 에피소드 정보 + 완결 배지 */}
                      <div className={styles.episodeRow}>
                        <span className={styles.episodeInfo}>
                          {formatText(getLocalizedText('contenthome003_label_001'), [
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
          {renderSelectDrawer()}

          <LoadingOverlay loading={isLoading} />
        </div>
      </Box>
    </Modal>
  );
};

export default ViewerContent;
