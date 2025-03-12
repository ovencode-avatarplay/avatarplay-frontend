import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from './ViewerContent.module.css';
import 'swiper/css';
import 'swiper/css/pagination';
import {FeedInfo, sendFeedShare} from '@/app/NetWork/ShortsNetwork';
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
  LineDashboard,
  LineScaleUp,
} from '@ui/Icons';
import {Avatar, Box, Modal} from '@mui/material';
import ChatMediaDialog from '@/app/view/main/content/Chat/MainChat/ChatMediaDialog';
import {MediaData, TriggerMediaState} from '@/app/view/main/content/Chat/MainChat/ChatTypes';
import {useRouter} from 'next/navigation';
import {pushLocalizedRoute} from '@/utils/UrlMove';
import ProfileBase from '@/app/view/profile/ProfileBase';
import {followProfile} from '@/app/NetWork/ProfileNetwork';
import SharePopup from '@/components/layout/shared/SharePopup';
import {
  ContentCategoryType,
  ContentPlayInfo,
  ContentType,
  PlayButtonReq,
  PlayReq,
  RecordPlayReq,
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
  sendFeedDisLike,
  sendFeedLike,
} from '@/app/NetWork/CommonNetwork';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';
// export interface ViewInfo {
//   id: number;
//   mediaState: ContentCategoryType;
//   contentType: ContentType;
//   mediaUrlList: string[];
//   commentCount: number;
//   likeCount: number;
//   disLikeCount: number;
//   isLike: boolean;
//   isDisLike: boolean;
//   isBookmark: boolean;
//   playTime: string;
//   profileUrlLinkKey: string;
//   characterProfileUrl: string;
//   characterProfileName: string;
// }

interface Props {
  open: boolean;
  onClose: () => void;

  isPlayButon: boolean;
  contentId: number;
  episodeId?: number;
}

const ViewerContent: React.FC<Props> = ({isPlayButon, open, onClose, contentId, episodeId = 0}) => {
  const [info, setInfo] = useState<ContentPlayInfo>();

  const handlePlayRecent = async () => {
    try {
      const playRequest: PlayButtonReq = {
        contentId: 1001,
      };

      const playResponse = await sendPlayButton(playRequest);
      console.log('✅ PlayButton API 응답:', playResponse.data);
      setInfo(playResponse.data?.recentlyPlayInfo);
    } catch (error) {
      console.error('🚨 Play 관련 API 호출 오류:', error);
    }
  };

  const handlePlayNew = async () => {
    try {
      const playRequest: PlayReq = {
        contentId: 1001,
        episodeId: 2002,
      };

      const playData = await sendPlay(playRequest);
      console.log('✅ Play API 응답:', playData.data);
      setInfo(playData.data?.recentlyPlayInfo);
    } catch (error) {
      console.error('🚨 Play 관련 API 호출 오류:', error);
    }
  };

  const handleRecordPlay = async () => {
    try {
      const recordPlayRequest: RecordPlayReq = {
        episodeRecordPlayInfo: {
          contentId: 1001,
          episodeId: 2002,
          categoryType: 1,
          playTimeSecond: 120,
        },
      };

      const recordPlayResponse = await sendRecordPlay(recordPlayRequest);
      console.log('✅ RecordPlay API 응답:', recordPlayResponse.data);
    } catch (error) {
      console.error('🚨 RecordPlay API 호출 오류:', error);
    }
  };
  useEffect(() => {
    if (isPlayButon) {
      handlePlayRecent();
    } else {
      handlePlayNew();
    }
  }, []);

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
  const [commentCount, setCommentCount] = useState(info?.commonMediaViewInfo.commentCount);

  const [isCommentOpen, setCommentIsOpen] = useState(false);
  const handleAddCommentCount = () => {
    if (info) setCommentCount(info?.commonMediaViewInfo.commentCount + 1);
  };
  const handleClick = () => {
    setIsPlaying(!isPlaying);
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300); // 애니메이션이 끝난 후 상태 초기화
  };
  const handleVideoProgress = (playedSeconds: number) => {
    setVideoProgress(playedSeconds);
  };
  const handleLikeFeed = async (feedId: number, isLike: boolean) => {
    try {
      // if (isDisLike == true) {
      //   await handleDisLikeFeed(item.id, !isDisLike);
      // }
      const response = await sendFeedLike(
        episodeId ? InteractionType.Episode : InteractionType.Contents,
        feedId,
        isLike,
      );

      if (response.resultCode === 0) {
        console.log(`content ${feedId} has been ${isLike ? 'liked' : 'unliked'} successfully!`);
        if (response.data?.likeCount) setLikeCount(response.data?.likeCount);
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
      // if (isLike == true) {
      //   await handleLikeFeed(item.id, !isLike);
      // }
      const response = await sendFeedDisLike(
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

  React.useEffect(() => {
    setCommentCount(info?.commonMediaViewInfo.commentCount);
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
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          bgcolor: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div className={styles.reelsContainer}>
          <div className={styles.header}>
            <CustomArrowHeader
              title="Create Series Contents"
              onClose={() => {
                pushLocalizedRoute(`/create/content/series/${contentId}`, router);
              }}
              children={
                <div className={styles.rightArea}>
                  <button className={styles.dashBoard} onClick={() => {}}>
                    <img className={styles.dashBoardIcon} src={LineDashboard.src} />
                  </button>
                </div>
              }
            />
          </div>
          <div style={{height: '100%'}}>
            <div className={styles.Image}>
              {info?.categoryType === ContentCategoryType.Webtoon && (
                <img
                  src={info?.episodeWebtoonInfo?.webtoonSourceUrlList[0].webtoonSourceUrls[0]} //추후 자막 합쳐야함
                  loading="lazy"
                  style={{width: '100%', height: '100%'}}
                />
              )}
              {info?.categoryType === ContentCategoryType.Video && (
                <div onClick={handleClick} style={{position: 'relative', width: '100%', height: '100%'}}>
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
                    info?.categoryType === 0
                      ? '' // 이미지 슬라이드 진행도
                      : `${(videoProgress / videoDuration) * 100}%`, // 비디오 진행도
                  transition: 'width 0.1s linear', // 부드러운 진행도 애니메이션
                }}
              ></div>
            </div>

            <div className={styles.profileBox}>
              <div className={styles.dim}></div>
              {/* User Info */}
              <div className={styles.userInfo}>
                <Avatar
                  src={info?.profileIconUrl || '/images/001.png'}
                  style={{width: '32px', height: '32px'}}
                  onClick={() => {
                    pushLocalizedRoute('/profile/' + info?.profileUrlLinkKey + '?from=""', router);
                  }}
                />

                <div
                  className={styles.profileDetails}
                  onClick={() => {
                    pushLocalizedRoute('/profile/' + info?.profileUrlLinkKey + '?from=""', router);
                  }}
                >
                  <span className={styles.sponsored}>Sponsored</span>
                </div>
              </div>

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
            <div className={styles.ctaButtons}>
              <div className={styles.textButtons} onClick={() => {}}>
                <img src={BoldReward.src} className={styles.button}></img>
              </div>
              <div
                className={styles.textButtons}
                onClick={() => {
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
                onClick={() => {
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
          <Comment
            contentId={episodeId ? episodeId : contentId}
            isOpen={isCommentOpen}
            toggleDrawer={v => setCommentIsOpen(v)}
            onAddTotalCommentCount={() => handleAddCommentCount()}
            commentType={CommentContentType.Episode}
          />

          <SharePopup
            open={isShare}
            title={''}
            url={window.location.href}
            onClose={() => setIsShare(false)}
          ></SharePopup>
        </div>
      </Box>
    </Modal>
  );
};

export default ViewerContent;
