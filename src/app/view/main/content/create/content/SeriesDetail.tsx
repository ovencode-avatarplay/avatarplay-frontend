import React, {useEffect, useState} from 'react';
import styles from './SeriesDetail.module.css';
import {
  BoldArrowLeft,
  BoldShare,
  BoldLock,
  BoldHeart,
  BoldVideo,
  BoldStar,
  LineEdit,
  LinePlus,
  LineArrowDown,
  LineDelete,
} from '@ui/Icons';
import {IconButton} from '@mui/material';
import {
  ContentEpisodeInfo,
  ContentInfo,
  ContentListInfo,
  GetContentReq,
  GetSeasonEpisodesReq,
  sendGetContent,
  sendGetSeasonEpisodes,
  sendAddSeasonNo,
  UpdateSeasonNoReq,
  sendDeleteSeasonNo,
  DeleteSeasonNoReq,
  sendDeleteEpisode,
  GetSeasonEpisodesRes,
} from '@/app/NetWork/ContentNetwork';
import {EpisodeInfo} from '@/redux-store/slices/StoryInfo';
import {Category} from '@mui/icons-material';
import {pushLocalizedRoute} from '@/utils/UrlMove';
import {useRouter} from 'next/navigation';
import {CreateContentEpisodeProps} from './CreateContentEpisode';
import SharePopup from '@/components/layout/shared/SharePopup';
import CustomPopup from '@/components/layout/shared/CustomPopup';

interface SeriesDetailProps {
  urlLinkKey: string;
}

export interface Seasons {
  id: number;
  name: string;
}
const SeriesDetail: React.FC<SeriesDetailProps> = ({urlLinkKey}) => {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedTab, setSelectedTab] = useState<'Episodes' | 'About'>('Episodes');
  const [onSeasonDropdown, setSeasonDropdown] = useState(false);

  const [seasons, setSeasons] = useState<Seasons[]>([]);
  const [contentInfo, setContentInfo] = useState<GetSeasonEpisodesRes>();

  const [episodeList, setEpisodeList] = useState<ContentEpisodeInfo[]>(); // 타입 변경

  const [isShare, setIsShare] = useState(false);
  const [onAddSeasonPopup, setOnAddSeasonPopup] = useState(false);
  const [onDeleteEpisodePopup, setOnDeleteEpisodePopup] = useState(false);
  const [onDeleteEpisodeNum, setOnDeleteEpisodeNum] = useState(0);
  useEffect(() => {}, [episodeList]);
  const handleShare = async () => {
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

  const router = useRouter();
  const navigateToCreateContentEpisode = ({
    contentId,
    curSeason,
    curEpisodeCount,
    episodeId,
  }: CreateContentEpisodeProps) => {
    // id 배열 생성 (contentId가 있을 경우 포함)
    console.log('episodeId', episodeId);
    const ids = contentId
      ? [contentId, curSeason, curEpisodeCount, episodeId]
      : [curSeason, curEpisodeCount, episodeId];

    // 기존의 pushLocalizedRoute 함수를 활용하여 라우팅 수행
    if (!episodeId) pushLocalizedRoute(`/create/content/episode/series/${ids.join('/')}`, router);
    else pushLocalizedRoute(`/update/content/series/episode/${ids.join('/')}`, router);
  };

  const deleteEpisode = async (contentEpisodeId: number) => {
    try {
      const response = await sendDeleteEpisode({contentEpisodeId});

      if (response.resultCode === 0) {
        console.log('✅ 에피소드 삭제 완료');

        fetchSeasonEpisodes(selectedSeason);
      } else {
        console.error('❌ 에피소드 삭제 실패:', response.resultMessage);
      }
    } catch (error) {
      console.error('🚨 API 호출 중 오류 발생:', error);
    }
  };

  const addSeason = async () => {
    const newSeasonNo = (contentInfo?.maxSeasonNo || 0) + 1; // 현재 maxSeasonNo + 1
    const payload: UpdateSeasonNoReq = {
      contentId: contentInfo?.contentId || 0,
      seasonNo: newSeasonNo,
    };

    try {
      const response = await sendAddSeasonNo(payload);
      if (response.data) {
        console.log(`시즌 ${newSeasonNo} 추가됨`);

        // maxSeasonNo 증가
        setContentInfo(prev => (prev ? {...prev, maxSeasonNo: newSeasonNo} : prev));

        // 시즌 리스트 업데이트
        setSeasons(prevSeasons => [...prevSeasons, {id: newSeasonNo, name: `Season ${newSeasonNo}`}]);
        fetchSeasonEpisodes(selectedSeason);
      }
    } catch (error) {
      console.error('시즌 추가 실패:', error);
    }
  };

  // 📌 시즌 삭제 (서버 요청)
  const removeSeason = async (seasonNo: number) => {
    console.log(seasonNo);
    const payload: DeleteSeasonNoReq = {
      contentId: contentInfo?.contentId || 0,
      deleteSeasonNo: seasonNo,
    };

    try {
      const response = await sendDeleteSeasonNo(payload);

      if (response.data && response.data.lastSeasonNo !== undefined) {
        console.log(`시즌 ${seasonNo} 삭제됨, 마지막 시즌 번호: ${response.data.lastSeasonNo}`);

        // maxSeasonNo 업데이트
        setContentInfo(prev => prev && {...prev, maxSeasonNo: response.data!.lastSeasonNo});

        // 시즌 리스트 업데이트 (자동으로 번호 재정렬)
        setSeasons(
          prevSeasons =>
            prevSeasons
              .filter(season => season.id !== seasonNo) // 삭제된 시즌 제거
              .map((season, index) => ({id: index + 1, name: `Season ${index + 1}`})), // ID 재정렬
        );
        setSelectedSeason(1);
        fetchSeasonEpisodes(1);
      } else {
        console.warn('서버 응답에 lastSeasonNo가 없습니다.');
      }
    } catch (error) {
      console.error('시즌 삭제 실패:', error);
      alert('시즌 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    if (contentInfo?.maxSeasonNo) {
      const generatedSeasons = Array.from({length: contentInfo.maxSeasonNo}, (_, i) => ({
        id: i + 1,
        name: `Season ${i + 1}`,
      }));
      setSeasons(generatedSeasons);
    }
  }, [contentInfo?.maxSeasonNo]);

  useEffect(() => {
    fetchSeasonEpisodes(selectedSeason);
  }, [selectedSeason]);

  const fetchSeasonEpisodes = async (index: number) => {
    const payload: GetSeasonEpisodesReq = {
      urlLinkKey: urlLinkKey,
      seasonNo: index,
    };

    try {
      const response = await sendGetSeasonEpisodes(payload);
      setContentInfo(response.data);
      if (response.data?.episodeList) {
        const transformedEpisodes: ContentEpisodeInfo[] = response.data.episodeList.map(episode => ({
          id: episode.episodeId,
          userId: 0, // 기본값 설정 (필요 시 API에서 제공하는 값으로 변경)
          contentId: 0,
          seasonNo: index,
          episodeNo: episode.episodeNo,
          thumbnailUrl: episode.thumbnailUrl,
          name: episode.episodeName,
          description: '',
          categoryType: 0,
          nsfw: false,
          monetization: false,
          salesStarEa: 0,
          likeCount: 0,
          episodeVideoInfo: undefined,
          episodeWebtoonInfo: undefined,
        }));

        setEpisodeList(transformedEpisodes);
        console.log('에피소드 목록:', transformedEpisodes);
      }
    } catch (error) {
      console.error('에피소드 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchSeasonEpisodes(1);
  }, []);
  const videoExtensions = ['mp4', 'webm', 'ogg']; // 비디오 확장자 목록
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']; // 이미지 확장자 목록

  const getFileExtension = (url?: string) => url?.split('.').pop()?.toLowerCase() || '';

  const isVideo = (url?: string) => videoExtensions.includes(getFileExtension(url));
  const isImage = (url?: string) => imageExtensions.includes(getFileExtension(url));

  return (
    <div className={styles.container}>
      {/* 상단 배경 및 네비게이션 */}
      <div className={styles.header}>
        {isVideo(contentInfo?.contentThumbnailUrl) ? (
          <video
            className={styles.videoBackground}
            src={contentInfo?.contentThumbnailUrl}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <div
            className={styles.imageBackground}
            style={{backgroundImage: `url(${contentInfo?.contentThumbnailUrl})`}}
          />
        )}

        {/* 기존 UI 요소들 */}
        <div className={styles.overlayContent}>
          <div className={styles.topNav}>
            <button
              className={styles.iconButton}
              onClick={() => {
                pushLocalizedRoute(`/create/content`, router);
              }}
            >
              <img src={BoldArrowLeft.src} alt="Back" />
            </button>
          </div>
        </div>
        <div className={styles.topNav}>
          <button
            className={styles.iconButton}
            onClick={() => {
              pushLocalizedRoute(`/create/content`, router);
            }}
          >
            <img src={BoldArrowLeft.src} alt="Back" />
          </button>
          {/* <button className={styles.iconButton}>
            <img src={LineEdit.src} alt="Edit" />
          </button> */}
        </div>
      </div>

      <div className={styles.contentContainer}>
        {/* 장르 및 공유 버튼 */}
        <div className={styles.genreShare}>
          <span className={styles.genres}>
            {[contentInfo?.genre, ...(contentInfo?.tags ?? [])].filter(Boolean).join(' / ')}
          </span>
          <button className={styles.iconButton} onClick={() => handleShare()}>
            <img src={BoldShare.src} alt="Share" />
          </button>
        </div>

        {/* 탭 메뉴 */}
        <div className={styles.tabs}>
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tabButton} ${selectedTab === 'Episodes' ? styles.activeTab : ''}`}
              onClick={() => setSelectedTab('Episodes')}
            >
              Episodes
            </button>
            <button
              className={`${styles.tabButton} ${selectedTab === 'About' ? styles.activeTab : ''}`}
              onClick={() => setSelectedTab('About')}
            >
              About
            </button>
            {/* 이동하는 밑줄 */}
            <div className={styles.tabUnderline} style={{left: selectedTab === 'Episodes' ? '0px' : '80px'}} />
          </div>
        </div>

        {selectedTab == 'Episodes' && (
          <>
            {' '}
            {/* 시즌 선택 및 추가 버튼 */}
            <div className={styles.controls}>
              <button
                className={`${styles.seasonDropdown} ${onSeasonDropdown === true ? styles.onSeasonDropdown : ''}`}
              >
                <div>Season {selectedSeason}</div>
                <img
                  src={LineArrowDown.src}
                  className={`${styles.lineArrowDown} ${onSeasonDropdown === true ? styles.onLineArrowDown : ''}`}
                  onClick={() => setSeasonDropdown(!onSeasonDropdown)}
                />
              </button>
              {onSeasonDropdown && (
                <>
                  <div className={styles.seasonDropdownContainer}>
                    <div
                      className={styles.seasonDropdownAddButton}
                      onClick={() => {
                        setOnAddSeasonPopup(true);
                      }}
                    >
                      + Add Season
                    </div>
                    <div className={styles.seasonDropdownBox}>
                      {seasons.map(season => (
                        <div
                          key={season.id}
                          className={styles.seasonDropdownEpisodeItem}
                          onClick={() => {
                            setSelectedSeason(season.id);
                            setSeasonDropdown(false);
                          }}
                        >
                          <span style={{color: 'black'}}>{season.name}</span>
                          <button onClick={() => removeSeason(season.id)}>
                            {seasons.length > 1 && <img src={LineDelete.src} className={styles.blackFilter}></img>}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* 새로운 에피소드 추가 버튼 */}
            <button
              className={styles.addEpisode}
              onClick={() => {
                navigateToCreateContentEpisode({
                  contentId: urlLinkKey,
                  curSeason: selectedSeason,
                  curEpisodeCount: episodeList ? episodeList.length : 0,
                });
              }}
            >
              + New Episode
            </button>
            {/* 에피소드 리스트 */}
            <div className={styles.episodeList}>
              {episodeList &&
                episodeList.map((ep, index) => (
                  <div key={ep.id} className={styles.episodeItem}>
                    {isVideo(ep.thumbnailUrl) ? (
                      <video
                        className={styles.episodeThumbnail}
                        src={ep.thumbnailUrl}
                        poster={ep.thumbnailUrl} // 첫 프레임을 표시
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <div className={styles.episodeThumbnail} style={{backgroundImage: `url(${ep.thumbnailUrl})`}} />
                    )}

                    <div className={styles.episodeInfo}>
                      <div className={styles.epTitleText}>
                        {index + 1}. {ep.name}
                      </div>
                      {/* {seriesInfo?.categoryType == 1 && (
                    <div className={styles.epDuration}>{ep.episodeVideoInfo?.videoSourcePlayTime}</div>
                  )} */}
                    </div>
                    <div className={styles.episodeActions}>
                      <div style={{display: 'flex', gap: '10px'}}>
                        <button
                          className={styles.iconButton}
                          onClick={() => {
                            if (ep.id) {
                              setOnDeleteEpisodeNum(ep.id);
                              setOnDeleteEpisodePopup(true);
                            }
                          }}
                        >
                          <img src={LineDelete.src} alt="Delete" className={styles.editIcon} />
                        </button>
                        <button
                          className={styles.iconButton}
                          onClick={() => {
                            navigateToCreateContentEpisode({
                              contentId: urlLinkKey,
                              curSeason: selectedSeason,
                              curEpisodeCount: episodeList ? episodeList.length : 0,
                              episodeId: ep.id,
                            });
                          }}
                        >
                          <img src={LineEdit.src} alt="Edit" className={styles.editIcon} />
                        </button>
                      </div>
                      {/* <div className={styles.rating}>
                    <img src={BoldStar.src} className={styles.starIcon} />
                    <span className={styles.rateText}>{ep.likeCount}</span>
                  </div> */}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}

        {selectedTab == 'About' && (
          <>
            <div className={styles.about}>{contentInfo?.description}</div>
          </>
        )}
      </div>
      <SharePopup
        open={isShare}
        title={'Share'}
        url={window.location.href}
        onClose={() => setIsShare(false)}
      ></SharePopup>
      {onAddSeasonPopup && (
        <CustomPopup
          type="alert"
          title={`Would you like to add a new Season ${(contentInfo?.maxSeasonNo || 0) + 1}?"`}
          description=""
          buttons={[
            {
              label: 'No',
              onClick: () => setOnAddSeasonPopup(false),
              isPrimary: false,
            },
            {
              label: 'Yes',
              onClick: () => {
                addSeason();
                setOnAddSeasonPopup(false);
              },
              isPrimary: true,
            },
          ]}
        />
      )}
      {onDeleteEpisodePopup && (
        <CustomPopup
          type="alert"
          title="Are you sure you want to delete this Episode?"
          description="Episodes cannot be recovered once deleted."
          buttons={[
            {
              label: 'Cancel',
              onClick: () => setOnDeleteEpisodePopup(false),
              isPrimary: false,
            },
            {
              label: 'Confirm',
              onClick: () => {
                deleteEpisode(onDeleteEpisodeNum);
                setOnDeleteEpisodePopup(false);
              },
              isPrimary: true,
            },
          ]}
        />
      )}
    </div>
  );
};

export default SeriesDetail;
