import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from './ReelsContent.module.scss';
import {Swiper, SwiperClass, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import {Pagination} from 'swiper/modules';
import {FeedInfo, sendFeedShare} from '@/app/NetWork/ShortsNetwork';
import ReactPlayer from 'react-player';
import {
  BoldArchive,
  BoldComment,
  BoldDislike,
  BoldImage,
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
  LineScaleUp,
} from '@ui/Icons';
import {Avatar} from '@mui/material';
import Comment from '../layout/shared/Comment';
import SharePopup from '../layout/shared/SharePopup';
import ChatMediaDialog from '@/app/view/main/content/Chat/MainChat/ChatMediaDialog';
import {MediaData, TriggerMediaState} from '@/app/view/main/content/Chat/MainChat/ChatTypes';
import {useRouter} from 'next/navigation';
import {pushLocalizedRoute} from '@/utils/UrlMove';
import ProfileBase from '@/app/view/profile/ProfileBase';
import DrawerDonation from '@/app/view/main/content/create/common/DrawerDonation';
import {followProfile, ProfileType} from '@/app/NetWork/ProfileNetwork';
import {
  bookmark,
  BookMarkReq,
  CommentContentType,
  InteractionType,
  sendDisLike,
  sendLike,
  sendReport,
} from '@/app/NetWork/CommonNetwork';
import getLocalizedText from '@/utils/getLocalizedText';
import {RecommendState} from './ReelsLayout';
import SelectDrawer, {SelectDrawerItem} from '../create/SelectDrawer';

interface ReelsContentProps {
  item: FeedInfo;
  isActive: boolean; // 현재 슬라이드인지 확인
  isMute: boolean;
  setIsMute: (mute: boolean) => void; // boolean 매개변수 추가
  setIsProfile: (profile: boolean) => void; // boolean 매개변수 추가
  recommendState: RecommendState;
  isShowProfile: boolean;
  setSyncFollow: (id: number, value: boolean) => void;
  isFollow: boolean;
}

const ReelsContent: React.FC<ReelsContentProps> = ({
  item,
  isActive,
  isMute,
  setIsMute,
  setIsProfile,
  isShowProfile = true,
  recommendState,
  setSyncFollow,
  isFollow,
}) => {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isDonation, setDonation] = useState(false);
  const [isLike, setIsLike] = useState(item.isLike);
  const [isDisLike, setIsDisLike] = useState(item.isDisLike);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const [isImageModal, setIsImageModal] = useState(false);
  const [isReportModal, setIsRefortModal] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likeCount);
  const playerRef = useRef<ReactPlayer>(null); // ReactPlayer 참조 생성
  const swiperRef = useRef<SwiperClass | null>(null);

  const Header = 'Home';
  const Common = 'Common';
  useEffect(() => {
    console.log('setSyncFollow', item);
  }, [item]);
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
  const handleSubCommentCount = () => {
    setCommentCount(commentCount - 1);
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

  const handleDonation = () => {
    setDonation(true);
  };

  const handleDonationclose = () => {
    setDonation(false);
  };
  const selectReportItem: SelectDrawerItem[] = [
    {
      name: 'Report',
      onClick: () => {
        handleReport();
      },
    },
  ];
  const handleReport = async () => {
    try {
      const response = await sendReport({
        interactionType: InteractionType.Feed, // 예: 댓글 = 1, 피드 = 2 등 서버 정의에 따라
        typeValueId: item.id, // 신고 대상 ID
        isReport: true, // true = 신고, false = 취소
      });
    } catch (error) {
      console.error('🚨 신고 API 호출 오류:', error);
    }
  };

  const handleLikeFeed = async (feedId: number, isLike: boolean) => {
    try {
      if (isDisLike == true) {
        await handleDisLikeFeed(item.id, !isDisLike);
      }
      const response = await sendLike(InteractionType.Feed, feedId, isLike);

      if (response.resultCode === 0) {
        console.log(`Feed ${feedId} has been ${isLike ? 'liked' : 'unliked'} successfully!`);

        if (response.data) setLikeCount(response.data?.likeCount);
        console.log('likeCount', likeCount);
        console.log('response.data?.likeCount', response.data?.likeCount);
        setIsLike(isLike);
      } else {
        console.error(`Failed to like/unlike feed: ${response.resultMessage}`);
      }
    } catch (error) {
      console.error('An error occurred while liking/unliking the feed:', error);
    }
  };
  const handleDisLikeFeed = async (feedId: number, isDisLike: boolean) => {
    try {
      if (isLike == true) {
        await handleLikeFeed(item.id, !isLike);
      }
      const response = await sendDisLike(InteractionType.Feed, feedId, isDisLike);

      if (response.resultCode === 0) {
        console.log(`Feed ${feedId} has been ${isDisLike ? 'liked' : 'unliked'} successfully!`);
        setIsDisLike(isDisLike);
      } else {
        console.error(`Failed to like/unlike feed: ${response.resultMessage}`);
      }
    } catch (error) {
      console.error('An error occurred while liking/unliking the feed:', error);
    }
  };
  const handleFollow = async (profileId: number, value: boolean) => {
    try {
      const response = await followProfile(profileId, value);
      setSyncFollow(profileId, value);
    } catch (error) {
      console.error('An error occurred while Following:', error);
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
    const payload: BookMarkReq = {
      interactionType: InteractionType.Feed,
      typeValueId: item.id, // 북마크할 피드 ID
      isBookMark: !isBookmarked,
      // feedId: item.id, // 북마크할 피드 ID
      // isSave: !isBookmarked, // 북마크 저장 여부 (true: 저장, false: 해제)
    };

    const response = await bookmark(payload);
    setIsBookmarked(!isBookmarked);
    if (response && response.resultCode === 0) {
      console.log('Bookmark operation successful:', response);
    } else {
      console.error('Failed to bookmark feed:', response?.resultMessage || '');
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

  const imageMediaData: MediaData = {
    mediaType: TriggerMediaState.TriggerImage, // 기본값 (TriggerMediaState의 기본 상태)
    mediaUrlList: item.mediaUrlList, // 빈 배열
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
  const [activeIndexProfile, setActiveIndexProfile] = useState(0);

  const handleSlideChangeProfile = (swiper: any) => {
    swiper.allowSlidePrev = true; // 다시 이동 가능하게 설정
    swiper.allowSlideNext = true;

    // 기존 onSlideChange 로직 추가
    setActiveIndexProfile(swiper.activeIndex);
    if (swiper.activeIndex === 1) setIsProfile(true);
    else if (swiper.activeIndex === 0) setIsProfile(false);
  };
  return (
    <div className={styles.reelsContainer}>
      <Swiper
        onSwiper={(swiper: SwiperClass) => {
          swiperRef.current = swiper;
        }}
        direction="horizontal"
        slidesPerView={1}
        centeredSlides={true}
        // scrollbar={{draggable: true}}
        onSlideChange={handleSlideChangeProfile}
        className={`${styles.mainContent}  ${!isMobile && styles.limitWidth}`}
        resistanceRatio={0}
        touchReleaseOnEdges={true} // ✅ 끝에서 터치 이벤트 해제 (빈 공간 방지)
        preventClicks={true} // ✅ 클릭 시 이벤트가 Swiper 내부에서만 처리되도록 함
      >
        <SwiperSlide style={{height: '100%'}}>
          <div className={styles.Image}>
            {item.mediaState === 1 && (
              <img
                src={item?.mediaUrlList[0]}
                loading="lazy"
                style={{width: '100%'}}
                onClick={() => setIsImageModal(true)}
              />
            )}
            {item.mediaState === 2 && (
              <div
                onClick={handleClick}
                style={{position: 'relative', width: '100%', height: '100%', background: '#000'}}
              >
                <ReactPlayer
                  ref={playerRef} // ReactPlayer 참조 연결
                  muted={isMute}
                  url={item.mediaUrlList[0]} // 첫 번째 URL 사용
                  playing={isPlaying} // 재생 상태
                  loop={true}
                  width="100%"
                  playsinline={true}
                  height="calc(100%)"
                  style={{
                    borderRadius: '8px',
                    objectFit: 'contain',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  config={{
                    file: {
                      attributes: {
                        style: {
                          width: '100%',
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
                    zIndex: 10,
                  }}
                >
                  <div className={`${styles.playCircleIcon} ${isClicked ? styles.fadeAndGrow : ''}`}>
                    <img src={isPlaying ? BoldPause.src : BoldPlay.src} style={{width: '50%', height: '50%'}} />
                  </div>
                </div>
              </div>
            )}

            <div className={styles.gradientTop}></div>
            <div className={styles.gradientBottom}></div>
          </div>

          {/* Progress Bar */}

          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${(videoProgress / videoDuration) * 100}%`, // 비디오 진행도
                transition: 'width 0.1s linear', // 부드러운 진행도 애니메이션
              }}
            ></div>
          </div>

          <div className={styles.profileBox}>
            <div className={styles.dim}></div>
            {/* User Info */}
            <div className={styles.userInfo}>
              <Avatar
                src={item.profileIconUrl || '/images/001.png'}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: item.profileType === ProfileType.Channel ? '10px' : '50%',
                }}
                onClick={() => {
                  pushLocalizedRoute('/profile/' + item?.profileUrlLinkKey + '?from=""', router);
                }}
              />

              <div
                className={styles.profileDetails}
                onClick={() => {
                  pushLocalizedRoute('/profile/' + item?.profileUrlLinkKey + '?from=""', router);
                }}
              >
                <span className={styles.username}>{item.profileName}</span>
              </div>
              {recommendState == RecommendState.ForYou && item.isMyFeed == false && (
                <button
                  className={`${styles.follow} ${isFollow ? styles.followButtonOn : styles.followButtonOff}`}
                  onClick={() => {
                    handleFollow(item.profileId, !isFollow);
                    console.log('isfollow', isFollow);
                  }}
                >
                  {isFollow
                    ? getLocalizedText(Common, 'common_button_following')
                    : getLocalizedText(Common, 'common_button_follow')}
                </button>
              )}
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
              {item.mediaState == 1 && (
                <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center'}}>
                  <img className={styles.iconVideo} src={BoldImage.src}></img>
                  {getLocalizedText(Common, 'common_filter_photo')}
                </div>
              )}
              {item.mediaState == 2 && (
                <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center'}}>
                  <img className={styles.iconVideo} src={BoldVideo.src}></img>
                  {getLocalizedText(Common, 'common_filter_video')} · {currentProgress ? currentProgress : '0:00'}/
                  {formatDuration(videoDuration)}
                </div>
              )}
              {/* <div>{formatTimeAgo(item.createAt ? item.createAt.toString() : '0')}</div> */}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={styles.ctaButtons}>
            {item.isMyFeed == false && (
              <div
                className={styles.textButtons}
                onClick={() => {
                  handleDonation();
                }}
              >
                <img src={BoldReward.src} className={styles.button}></img>
              </div>
            )}

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
              <div className={styles.count}>{likeCount && likeCount >= 0 ? likeCount : 0}</div>
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
                setIsRefortModal(true);
              }}
            >
              <img src={BoldMore.src} className={styles.button}></img>
            </div>
          </div>
          <div
            className={styles.volumeButton}
            onClick={() => {
              if (item.mediaState == 2) setIsMute(!isMute);
              else if (item.mediaState == 1) setIsImageModal(true);
            }}
          >
            {/* 검은색 반투명 배경 */}
            {isMute && <div className={styles.volumeCircleIcon}></div>}

            {/* 음소거 상태 아이콘 */}
            {item.mediaState == 2 && isMute && <img src={BoldVolumeOff.src} className={styles.volumeIcon} />}

            {/* 볼륨 활성 상태 아이콘 */}
            {item.mediaState == 2 && !isMute && <img src={BoldVolumeOn.src} className={styles.volumeIcon} />}

            {/* 이미지 확대 아이콘 */}
            {/* {item.mediaState == 1 && <img src={LineScaleUp.src} className={styles.volumeIcon} />} */}
          </div>
        </SwiperSlide>
        {isShowProfile && (
          <SwiperSlide style={{overflowY: 'scroll', background: 'white'}}>
            {activeIndexProfile === 1 && (
              <ProfileBase
                urlLinkKey={item.profileUrlLinkKey}
                maxWidth={'600px'}
                onClickBack={() => {
                  swiperRef.current?.slidePrev();
                }}
              />
            )}
          </SwiperSlide>
        )}
      </Swiper>
      {
        /*isDonation === true && */ <DrawerDonation
          isOpen={isDonation}
          sponsoredName={item.profileName}
          giveToPDId={item.profileId}
          onClose={handleDonationclose}
        />
      }
      <Comment
        contentId={item.id}
        isOpen={isCommentOpen}
        toggleDrawer={v => setCommentIsOpen(v)}
        onAddTotalCommentCount={() => handleAddCommentCount()}
        onSubTotalCommentCount={() => handleSubCommentCount()}
        commentType={CommentContentType.Feed}
      />

      <SharePopup
        open={isShare}
        title={item.title}
        url={window.location.href}
        onClose={() => setIsShare(false)}
      ></SharePopup>

      <ChatMediaDialog
        isModalOpen={isImageModal}
        closeModal={() => setIsImageModal(false)}
        type={TriggerMediaState.TriggerImage}
        mediaData={imageMediaData}
      ></ChatMediaDialog>
      <SelectDrawer
        isOpen={isReportModal}
        items={selectReportItem}
        onClose={() => {
          setIsRefortModal(false);
        }}
        isCheck={false}
        selectedIndex={0}
      ></SelectDrawer>
    </div>
  );
};

export default ReelsContent;
