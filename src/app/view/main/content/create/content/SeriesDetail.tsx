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
  sendUpdateSeasonNo,
  UpdateSeasonNoReq,
} from '@/app/NetWork/ContentNetwork';
import {EpisodeInfo} from '@/redux-store/slices/StoryInfo';
import {Category} from '@mui/icons-material';

interface SeriesDetailProps {
  contentInfo: ContentListInfo;
  onNext: () => void;
  onPrev: () => void;
}

interface Seasons {
  id: number;
  name: string;
}
const SeriesDetail: React.FC<SeriesDetailProps> = ({onNext, onPrev, contentInfo}) => {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedTab, setSelectedTab] = useState<'Episodes' | 'About'>('Episodes');
  const [onSeasonDropdown, setSeasonDropdown] = useState(false);

  const [seasons, setSeasons] = useState<Seasons[]>([]);

  const addSeason = async () => {
    if (!seriesInfo) return;

    const newSeasonNo = (seriesInfo.maxSeasonNo || 0) + 1; // 현재 maxSeasonNo + 1
    const payload: UpdateSeasonNoReq = {
      contentId: seriesInfo.id!,
      seasonNo: newSeasonNo,
    };

    try {
      const response = await sendUpdateSeasonNo(payload);
      if (response.data) {
        console.log(`시즌 ${newSeasonNo} 추가됨`);

        // maxSeasonNo 증가
        setSeriesInfo(prev => (prev ? {...prev, maxSeasonNo: newSeasonNo} : prev));

        // 시즌 리스트 업데이트
        setSeasons(prevSeasons => [...prevSeasons, {id: newSeasonNo, name: `Season ${newSeasonNo}`}]);
      }
    } catch (error) {
      console.error('시즌 추가 실패:', error);
    }
  };

  // 📌 시즌 삭제 (서버 요청)
  const removeSeason = async (seasonNo: number) => {
    if (!seriesInfo) return;

    const payload: UpdateSeasonNoReq = {
      contentId: seriesInfo.id!,
      seasonNo,
    };

    try {
      const response = await sendUpdateSeasonNo(payload);
      if (response.data) {
        console.log(`시즌 ${seasonNo} 삭제됨`);

        // maxSeasonNo 업데이트 (삭제 후 서버에서 maxSeasonNo가 업데이트될 가능성이 있음)
        const newMaxSeasonNo = seriesInfo.maxSeasonNo ? seriesInfo.maxSeasonNo - 1 : 0;
        setSeriesInfo(prev => (prev ? {...prev, maxSeasonNo: newMaxSeasonNo} : prev));

        // 시즌 리스트 업데이트 (자동으로 번호 재정렬)
        setSeasons(
          prevSeasons =>
            prevSeasons
              .filter(season => season.id !== seasonNo) // 삭제된 시즌 제거
              .map((season, index) => ({id: index + 1, name: `Season ${index + 1}`})), // ID 재정렬
        );
      }
    } catch (error) {
      console.error('시즌 삭제 실패:', error);
    }
  };
  const [seriesInfo, setSeriesInfo] = useState<ContentInfo>();
  const [episodeList, setEpisodeList] = useState<ContentEpisodeInfo[]>(); // 타입 변경

  useEffect(() => {
    if (seriesInfo?.maxSeasonNo) {
      const generatedSeasons = Array.from({length: seriesInfo.maxSeasonNo}, (_, i) => ({
        id: i + 1,
        name: `Season ${i + 1}`,
      }));
      setSeasons(generatedSeasons);
    }
  }, [seriesInfo?.maxSeasonNo]);

  useEffect(() => {
    fetchSeasonEpisodes(selectedSeason);
  }, [selectedSeason]);

  const fetchSeasonEpisodes = async (index: number) => {
    if (!seriesInfo) return;

    const payload: GetSeasonEpisodesReq = {
      contentId: seriesInfo.id ? seriesInfo.id : 0,
      seasonNo: index,
    };

    try {
      const response = await sendGetSeasonEpisodes(payload);

      if (response.data?.episodeList) {
        const transformedEpisodes: ContentEpisodeInfo[] = response.data.episodeList.map(episode => ({
          id: episode.episodeId,
          userId: 0, // 기본값 설정 (필요 시 API에서 제공하는 값으로 변경)
          contentId: seriesInfo.id || 0,
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
    const fetchContent = async (contentId: number) => {
      const payload: GetContentReq = {contentId};

      try {
        const response = await sendGetContent(payload);
        if (response.data) {
          console.log('콘텐츠 정보:', response.data.contentInfo);
          setSeriesInfo(response.data.contentInfo);
          fetchSeasonEpisodes(1);
        }
      } catch (error) {
        console.error('콘텐츠 조회 실패:', error);
      }
    };

    fetchContent(contentInfo.id);
  }, []);

  return (
    <div className={styles.container}>
      {/* 상단 배경 및 네비게이션 */}
      <div className={styles.header} style={{backgroundImage: `url(${seriesInfo?.thumbnailUrl})`}}>
        <div className={styles.topNav}>
          <button className={styles.iconButton} onClick={() => onPrev()}>
            <img src={BoldArrowLeft.src} alt="Back" />
          </button>
          <button className={styles.iconButton}>
            <img src={LineEdit.src} alt="Edit" />
          </button>
        </div>
      </div>

      <div className={styles.contentContainer}>
        {/* 장르 및 공유 버튼 */}
        <div className={styles.genreShare}>
          <span className={styles.genres}>{seriesInfo?.genre}</span>
          <button className={styles.iconButton}>
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

        {/* 시즌 선택 및 추가 버튼 */}
        <div className={styles.controls}>
          <button className={`${styles.seasonDropdown} ${onSeasonDropdown === true ? styles.onSeasonDropdown : ''}`}>
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
                <div className={styles.seasonDropdownAddButton} onClick={addSeason}>
                  + Add Season
                </div>
                <div className={styles.seasonDropdownBox}>
                  {seasons.map(season => (
                    <div key={season.id} className={styles.seasonDropdownEpisodeItem}>
                      <span style={{color: 'black'}}>{season.name}</span>
                      <button onClick={() => removeSeason(season.id)}>
                        <img src={LineDelete.src} className={styles.blackFilter}></img>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        {/* 새로운 에피소드 추가 버튼 */}
        <button className={styles.addEpisode} onClick={() => onNext()}>
          + New Episode
        </button>

        {/* 에피소드 리스트 */}
        <div className={styles.episodeList}>
          {episodeList &&
            episodeList.map((ep, index) => (
              <div key={ep.id} className={styles.episodeItem}>
                <div className={styles.episodeThumbnail} style={{backgroundImage: `url(${ep.thumbnailUrl})`}}></div>
                <div className={styles.episodeInfo}>
                  <div className={styles.epTitleText}>
                    {index}. {ep.name}
                  </div>
                  {ep.categoryType == 1 && <div className={styles.epDuration}>{ep.episodeVideoInfo?.playTime}</div>}
                </div>
                <div className={styles.episodeActions}>
                  <button className={styles.iconButton}>
                    <img src={LineEdit.src} alt="Edit" className={styles.editIcon} />
                  </button>
                  <div className={styles.rating}>
                    <img src={BoldStar.src} className={styles.starIcon} />
                    <span className={styles.rateText}>{ep.likeCount}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SeriesDetail;
