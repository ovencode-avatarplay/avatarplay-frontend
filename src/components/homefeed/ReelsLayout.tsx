'use client';

import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import ReelsContent from './ReelsContent';
import {FeedInfo, sendFeedView, sendGetRecommendFeed} from '@/app/NetWork/ShortsNetwork';
import styles from './ReelsLayout.module.css';
import {setBottomNavColor, setRecommendState, setSelectedIndex} from '@/redux-store/slices/MainControl';
import {useDispatch, useSelector} from 'react-redux';
import {LineArrowDown, LineFeatured} from '@ui/Icons';
import {getCurrentLanguage, getLocalizedLink, pushLocalizedRoute} from '@/utils/UrlMove';
import {useRouter} from 'next/navigation';
import {
  CharacterProfileTabType,
  ExploreSortType,
  FeedMediaType,
  getProfileCharacterTabInfo,
  getProfilePdTabInfo,
  PdProfileTabType,
  ProfileType,
} from '@/app/NetWork/ProfileNetwork';
import {RootState} from '@/redux-store/ReduxStore';
import {getCharacterStateText} from '@/app/view/studio/characterDashboard/CharacterGridItem';
import formatText from '@/utils/formatText';
import getLocalizedText from '@/utils/getLocalizedText';
import CustomPopup from '../layout/shared/CustomPopup';
export enum RecommendState {
  Following = 1,
  ForYou = 0,
}
interface ReelsLayoutProps {
  initialFeed?: FeedInfo; // 특정 URL 키를 통해 전달받은 초기 피드
  recommendState?: RecommendState;

  profileType?: ProfileType;
  feedSortType?: ExploreSortType;
  feedMediaType?: FeedMediaType;
  idContent?: number;
  profileUrlLinkKey?: string;
}

const ReelsLayout: React.FC<ReelsLayoutProps> = ({
  initialFeed,
  recommendState = 0,

  profileUrlLinkKey = '',
  profileType = ProfileType.PD,
  feedSortType = ExploreSortType.Newest,
  feedMediaType = FeedMediaType.Total,
  idContent = 0,
}) => {
  const dataProfile = useSelector((state: RootState) => state.profile);
  const [allFeeds, setAllFeeds] = useState<FeedInfo[]>([]); // 전체 데이터 저장
  const [info, setInfo] = useState<FeedInfo[]>([]); // 현재 렌더링된 데이터
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // 현재 슬라이드 인덱스
  const [isMute, setIsMute] = useState(true); // 현재 슬라이드 인덱스
  const containerRef = useRef<HTMLDivElement>(null);
  const reelsWrapperRef = useRef<HTMLDivElement>(null);
  const [isProfile, setIsProfile] = useState(false); // 현재 슬라이드 인덱스
  const [selectedTab, setSelectedTab] = useState<RecommendState>(recommendState);
  const router = useRouter();
  const dispatch = useDispatch();

  const isSpecificProfile = !!profileUrlLinkKey;

  const Header = 'Home';
  const Common = 'Common';
  const decodeJwt = (token: string): {id?: string; email?: string; [key: string]: any} | null => {
    try {
      const base64Payload = token.split('.')[1]; // payload 부분 추출
      const decodedPayload = atob(base64Payload); // Base64 디코드
      return JSON.parse(decodedPayload); // JSON 파싱하여 반환
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  };
  const getEmailFromJwt = (): string | null => {
    const jwt = localStorage.getItem('jwt'); // localStorage에서 JWT 가져오기
    if (jwt) {
      const payload = decodeJwt(jwt); // 디코드
      return payload?.email || null; // email 반환
    }
    return null; // JWT가 없을 경우 null 반환
  };

  // API 호출
  const fetchRecommendFeed = async () => {
    dispatch(setBottomNavColor(0));
    if (isSpecificProfile) {
      const isPD = [ProfileType.PD, ProfileType.User].includes(profileType);
      let result = null;

      if (isPD) {
        result = await getProfilePdTabInfo(
          profileUrlLinkKey,
          PdProfileTabType.Feed,
          feedSortType,
          {
            feedMediaType: feedMediaType,
            channelTabType: 0,
            characterTabType: 0,
            contentTabType: 0,
            sharedTabType: 0,
          },
          0,
          1000,
        );
      } else {
        result = await getProfileCharacterTabInfo(
          profileUrlLinkKey,
          CharacterProfileTabType.Feed,
          feedSortType,
          {
            feedMediaType: feedMediaType,
            channelTabType: 0,
            characterTabType: 0,
            contentTabType: 0,
            sharedTabType: 0,
          },
          0,
          1000,
        );
      } //TODO : 1000개로 임시 처리, oh, feed가 많은 경우 일부만 뿌리고 id를 찾아서 보여주는 처리가 필요해보임, 무한 스크롤

      const mergedFeeds = result?.feedInfoList || [];
      setAllFeeds(mergedFeeds); // 전체 데이터 저장
      const indexContent = mergedFeeds.findIndex(v => v.id == idContent);
      setInfo(mergedFeeds.slice(0, indexContent + 2)); // 초기 렌더링용 첫 2개
      setCurrentSlideIndex(indexContent);

      const wrapper = reelsWrapperRef.current;
      if (!wrapper) {
        return;
      }

      setTimeout(() => {
        const sectionHeight = wrapper.clientHeight; //58 : header , 48 : footer
        const scrollY = sectionHeight * indexContent;
        wrapper.scrollTo(0, scrollY);
        handleScroll();
      }, 100);
    }

    if (!isSpecificProfile) {
      try {
        const lang = getCurrentLanguage();
        const result = await sendGetRecommendFeed({recommendState: recommendState, languageType: lang});

        if (result.resultCode === 0 && result.data) {
          const feeds = result.data.feedInfoList;

          // initialFeed가 있다면 feeds 배열 앞에 추가
          const mergedFeeds = initialFeed ? [initialFeed, ...feeds.filter(feed => feed.id !== initialFeed.id)] : feeds;

          setAllFeeds(mergedFeeds); // 전체 데이터 저장
          setInfo(mergedFeeds.slice(0, 2)); // 초기 렌더링용 첫 2개
        }
      } catch (error) {
        setAllFeeds([]);
        setInfo([]);
        console.error('Failed to fetch recommended feed:', error);
      }
    }
  };

  const [hasMore, setHasMore] = useState(false); // 현재 슬라이드 인덱스

  useEffect(() => {
    fetchRecommendFeed();
  }, [initialFeed, getEmailFromJwt(), selectedTab]);

  useEffect(() => {
    if (isSpecificProfile) {
      return;
    }
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname; // 현재 경로
      const basePath = '/ko/main/homefeed'; // 동적 라우팅이 없는 기본 경로

      // 현재 경로가 basePath와 같다면 URL에 첫 번째 피드의 urlLinkKey 추가
      if (currentPath === basePath && info.length > 0) {
        const firstFeed = info[0];
        const newUrl = `${basePath}/${firstFeed.urlLinkKey}`;
        window.history.replaceState(null, '', newUrl); // 주소창만 변경 (새로고침 없음)
      }
    }
    console.log('info', info);
  }, [info]);

  // 피드 조회 API 호출
  const viewFeed = async (feedId: number) => {
    try {
      const response = await sendFeedView(feedId);
    } catch (error) {
      console.error('Error while viewing feed:', error);
    }
  };
  const handleScroll = () => {
    const container = containerRef.current;
    const wrapper = reelsWrapperRef.current;

    if (!container || !wrapper) return;

    const scrollY = wrapper.scrollTop;
    const slides = Array.from(wrapper.children || []);
    let cumulativeHeight = 0;
    let calculatedIndex = 0;

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i] as HTMLElement;
      cumulativeHeight += slide.offsetHeight;

      if (scrollY + wrapper.clientHeight / 2 < cumulativeHeight) {
        calculatedIndex = i;
        break;
      }
    }

    setCurrentSlideIndex(prevIndex => {
      if (calculatedIndex > prevIndex + 1) {
        return prevIndex + 1;
      } else if (calculatedIndex < prevIndex - 1) {
        return prevIndex - 1;
      } else {
        return calculatedIndex;
      }
    });
  };

  const urlUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentItem = allFeeds[currentSlideIndex];
    setIsMute(true);
    // ✅ URL 변경 (딜레이 적용)
    if (currentItem && currentItem.urlLinkKey) {
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current);
      }

      urlUpdateTimeoutRef.current = setTimeout(() => {
        viewFeed(currentItem.id);

        if (isSpecificProfile) {
          return;
        }
        const newUrl = `/ko/main/homefeed/${currentItem.urlLinkKey}`;
        if (window.location.pathname !== newUrl) {
          window.history.pushState(null, '', newUrl);
        }
      }, 300); // ✅ 스크롤 멈춘 뒤 300ms 후에 URL 변경
    }

    // ✅ 데이터 미리 로딩
    if (info.length <= currentSlideIndex + 2 && info.length < allFeeds.length) {
      const nextItems = allFeeds.slice(info.length, info.length + 5);
      setInfo(prev => [...prev, ...nextItems]);
    }

    if (currentSlideIndex >= allFeeds.length - 2 && info.length === allFeeds.length) {
      if (isSpecificProfile) {
        loadMoreFeedsMine();
      } else {
        loadMoreFeeds();
      }
    }

    // ✅ 컴포넌트 unmount 시 타이머 정리
    return () => {
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current);
      }
    };
  }, [currentSlideIndex]);

  const loadMoreFeedsMine = async () => {
    // const isPD = [ProfileType.PD, ProfileType.User].includes(profileType);
    // let result = null;
    // if (isPD) {
    //   result = await getProfilePdTabInfo(
    //     profileUrlLinkKey,
    //     PdProfileTabType.Feed,
    //     feedSortType,
    //     {
    //       feedMediaType: feedMediaType,
    //       channelTabType: 0,
    //       characterTabType: 0,
    //       contentTabType: 0,
    //       sharedTabType: 0,
    //     },
    //     info?.length || 0,
    //     10,
    //   );
    // } else {
    //   result = await getProfileCharacterTabInfo(
    //     profileUrlLinkKey,
    //     CharacterProfileTabType.Feed,
    //     feedSortType,
    //     {
    //       feedMediaType: feedMediaType,
    //       channelTabType: 0,
    //       characterTabType: 0,
    //       contentTabType: 0,
    //       sharedTabType: 0,
    //     },
    //     info?.length || 0,
    //     10,
    //   );
    // } //TODO : 1000개로 임시 처리, oh, feed가 많은 경우 일부만 뿌리고 id를 찾아서 보여주는 처리가 필요해보임, 무한 스크롤
    // if (result?.feedInfoList.length == 0) {
    //   setHasMore(false); // 실패 또는 데이터 없을 경우 중지
    //   return;
    // }
    // const mergedFeeds = result?.feedInfoList || [];
    // setAllFeeds(prevFeeds => [...prevFeeds, ...mergedFeeds]);
    // const feeds = result?.feedInfoList || [];
    // setInfo(prevInfo => [...prevInfo, ...feeds.slice(0, 2)]);
  };

  const loadMoreFeeds = async () => {
    try {
      const lang = getCurrentLanguage();

      const result = await sendGetRecommendFeed({
        recommendState: recommendState,
        languageType: lang,
      });

      if (result.resultCode === 0 && result.data) {
        const feeds = result.data.feedInfoList;
        console.log(feeds);
        console.log(allFeeds);
        setAllFeeds(prevFeeds => [...prevFeeds, ...feeds]);

        console.log(allFeeds);
        // 화면 렌더링용 info 배열에도 추가
        setInfo(prevInfo => [...prevInfo, ...feeds.slice(0, 2)]);
      } else {
        setHasMore(false); // 실패 또는 데이터 없을 경우 중지
      }
    } catch (error) {
      console.error('Failed to load more feeds:', error);
    }
  };
  useEffect(() => {
    console.log('Updated allFeeds:', allFeeds);
  }, [allFeeds]);
  useEffect(() => {
    console.log('info:', info);
  }, [info]);

  // useEffect(() => {
  //   if (isProfile) {
  //     document.body.style.overflowY = 'hidden'; // 스냅 비활성화
  //     document.body.style.overflowX = 'hidden';
  //   } else {
  //     document.body.style.overflowY = 'scroll'; // 스냅 활성화
  //     document.body.style.overflowX = 'hidden';
  //   }

  //   return () => {
  //     // 💡 cleanup: 기본 상태로 복구
  //     // document.body.style.overflowY = 'scroll';
  //     // document.body.style.overflowX = 'hidden';
  //     document.body.style.removeProperty('overflow');
  //   };
  // }, [isProfile]);

  useEffect(() => {
    if (!reelsWrapperRef.current) return;
    reelsWrapperRef.current.addEventListener('scroll', handleScroll);
    return () => {
      if (!reelsWrapperRef.current) return;

      reelsWrapperRef.current.removeEventListener('scroll', handleScroll);
    };
  }, [allFeeds, currentSlideIndex]);

  // const {isInteracting, scrollDirection} = useResponsiveBodyHeight();
  const handleFollow = (profileId: number, isFollow: boolean) => {
    const updatedInfo = info.map(feed => (feed.profileId === profileId ? {...feed, isFollowing: isFollow} : feed));

    const updatedAllFeeds = allFeeds.map(feed =>
      feed.profileId === profileId ? {...feed, isFollowing: isFollow} : feed,
    );

    // 상태 업데이트
    setInfo(updatedInfo);
    setAllFeeds(updatedAllFeeds);
  };

  return (
    <div ref={containerRef} className={styles.reelsContainer}>
      {/* <Head>
        <title>{initialFeed?.characterProfileName || 'Home Feed'}</title>
        <meta name="description" content={initialFeed?.description || 'Welcome to the home feed'} />
        <meta property="og:title" content={initialFeed?.characterProfileName || 'Home Feed'} />
        <meta property="og:description" content={initialFeed?.description || ''} />
        <meta property="og:image" content={initialFeed?.characterProfileUrl || '/default-image.png'} />
      </Head> 추후 메타 처리*/}

      {!isProfile && !isSpecificProfile && (
        <>
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tab} ${selectedTab === RecommendState.Following ? styles.active : ''}`}
              onClick={() => {
                setSelectedTab(RecommendState.Following);
                dispatch(setRecommendState(1));
                pushLocalizedRoute('/main/homefeed', router, true, true);
              }}
            >
              {getLocalizedText(Header, 'home001_label_002')}
            </button>
            <button
              className={`${styles.tab} ${selectedTab === RecommendState.ForYou ? styles.active : ''}`}
              onClick={() => {
                setSelectedTab(RecommendState.ForYou);
                dispatch(setRecommendState(0));
                pushLocalizedRoute('/main/homefeed', router, true, true);
              }}
            >
              <span style={{whiteSpace: 'nowrap'}}> {getLocalizedText(Header, 'home001_label_001')}</span>
            </button>
          </div>
        </>
      )}
      <div ref={reelsWrapperRef} className={styles.reelsWrapper}>
        {info.map((item, index) => {
          return (
            <div key={index} className={styles.reelSlide}>
              <ReelsContent
                item={item}
                isActive={index === currentSlideIndex}
                isMute={isMute}
                setIsMute={setIsMute}
                setIsProfile={setIsProfile}
                isShowProfile={!isSpecificProfile}
                recommendState={selectedTab}
                setSyncFollow={handleFollow}
                isFollow={item.isFollowing}
              />
            </div>
          );
        })}
      </div>
      {selectedTab == RecommendState.Following && info.length == 0 && (
        <CustomPopup
          type="alert"
          title="Sorry"
          description="팔로우한 프로필이 없거나, 피드가 아직 없습니다."
          buttons={[
            {
              label: 'OK',
              onClick: () => {
                setSelectedTab(RecommendState.ForYou);
                dispatch(setRecommendState(0));
                pushLocalizedRoute('/main/homefeed', router, true, true);
              },
              isPrimary: true,
            },
          ]}
        />
      )}
    </div>
  );
};

export default ReelsLayout;
