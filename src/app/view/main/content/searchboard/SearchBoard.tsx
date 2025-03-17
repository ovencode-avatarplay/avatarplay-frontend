'use client';

import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';

import {
  BannerUrlList,
  ExploreItem,
  PaginationRequest,
  sendGetExplore,
  sendSearchExplore,
} from '@/app/NetWork/ExploreNetwork';

import styles from './SearchBoard.module.css';

import SearchBoardHeader from './searchboard-header/SearchBoardHeader';
import SearchBoardHorizonScroll from './SearchBoardHorizonScroll';
import {ExploreCardProps} from './SearchBoardTypes';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import Splitter from '@/components/layout/shared/CustomSplitter';
import ExploreFeaturedHeader from './searchboard-header/ExploreFeaturedHeader';
import EmptyState from '@/components/search/EmptyState';
import {BoldArrowDown} from '@ui/Icons';
import DropDownMenu, {DropDownMenuItem} from '@/components/create/DropDownMenu';
import ExploreCard from './ExploreCard';
import {FilterDataItem} from '@/components/search/FilterSelector';
import {getCurrentLanguage} from '@/utils/UrlMove';
import useCustomRouter from '@/utils/useCustomRouter';

const SearchBoard: React.FC = () => {
  const [data, setData] = useState({
    indexTab: 0,
  });
  const [loading, setLoading] = useState(false);

  // Featured
  const [bannerList, setBannerList] = useState<BannerUrlList[] | null>(null);
  const [talkainOperatorList, setTalkainOperatorList] = useState<ExploreCardProps[] | null>(null);
  const [popularList, setPopularList] = useState<ExploreCardProps[] | null>(null);
  const [malePopularList, setMalePopularList] = useState<ExploreCardProps[] | null>(null);
  const [femalePopularList, setFemalePopularList] = useState<ExploreCardProps[] | null>(null);
  const [newContentList, setNewContentList] = useState<ExploreCardProps[] | null>(null);
  const [playingList, setPlayingList] = useState<ExploreCardProps[] | null>(null);
  const [recommendationList, setRecommendationList] = useState<ExploreCardProps[] | null>(null);

  // Search
  const searchOptionList = ['Female', 'Male', 'BL', 'GL', 'LGBT+', 'Romance', 'Villain', 'Gaming', 'Adventure'];
  const [searchResultList, setSearchResultList] = useState<ExploreItem[] | null>(null);

  const [search, setSearch] = useState<'All' | 'Story' | 'Character' | 'Content'>('All');
  const [adultToggleOn, setAdultToggleOn] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchSort, setSearchSort] = useState<'Newest' | 'Most Popular' | 'Weekly Popular' | 'Monthly Popular'>(
    'Newest',
  );

  // Filter State
  const [positiveFilters, setPositiveFilters] = useState<FilterDataItem[]>([]);
  const [negativeFilters, setNegativeFilters] = useState<FilterDataItem[]>([]);

  // Search Scroll
  const searchLimit = 20;
  const [hasSearchResult, setHasSearchResult] = useState(true);
  const [searchOffset, setSearchOffset] = useState<number>(0);
  const [contentPage, setContentPage] = useState<PaginationRequest>({offset: 0, limit: searchLimit});
  const [characterPage, setCharacterPage] = useState<PaginationRequest>({offset: 0, limit: searchLimit});
  const [previousScrollTop, setPreviousScrollTop] = useState(0);

  const [selectedSort, setSelectedSort] = useState<number>(0);
  const [sortDropDownOpen, setSortDropDownOpen] = useState<boolean>(false);
  const {changeParams, getParam} = useCustomRouter();
  const dropDownMenuItems: DropDownMenuItem[] = [
    {
      name: 'Newest',
      onClick: () => {
        setSearchSort('Newest');
        setSortDropDownOpen(false);
        setSelectedSort(0);
      },
    },
    {
      name: 'Most Popular',
      onClick: () => {
        setSearchSort('Most Popular');
        setSortDropDownOpen(false);
        setSelectedSort(1);
      },
    },
    {
      name: 'Weekly Popular',
      onClick: () => {
        setSearchSort('Weekly Popular');
        setSortDropDownOpen(false);
        setSelectedSort(2);
      },
    },
    {
      name: 'Monthly Popular',
      onClick: () => {
        setSearchSort('Monthly Popular');
        setSortDropDownOpen(false);
        setSelectedSort(3);
      },
    },
  ];

  useLayoutEffect(() => {
    const search = getParam('search');
    const indexTab = getParam('indexTab');
    data.indexTab = Number(indexTab);
    setData({...data});

    if (search && ['All', 'Story', 'Character', 'Content'].includes(search)) {
      handleSearchChange(search as 'All' | 'Story' | 'Character' | 'Content');
    }
  }, []);
  console.log('data : ', data);
  // Handle

  const handleSearchChange = (value: 'All' | 'Story' | 'Character' | 'Content') => {
    setSearch(value);
  };

  // 25.03.06 tr : 스크롤 대응해서 search 요청 -> observer로 변경
  // const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  //   const target = e.currentTarget;
  //   const THRESHOLD = 200; // 데이터 불러오기 전에 남겨둘 여유 공간 (픽셀 단위)
  //   const isScrollingDown = target.scrollTop > previousScrollTop;
  //   setPreviousScrollTop(target.scrollTop);
  //   // 스크롤 끝에 도달하기 직전인지 확인
  //   if (isScrollingDown && target.scrollTop + target.clientHeight >= target.scrollHeight - THRESHOLD && !loading) {
  //     setSearchOffset(prevSearchOffset => {
  //       const newSearchOffset = prevSearchOffset + 1;
  //       fetchExploreData(searchValue, adultToggleOn, contentPage, characterPage);
  //       return newSearchOffset;
  //     });
  //   }
  // };

  // scroll 조건 외에 마지막 아이템이 보이면 search 호출
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (loading || !hasSearchResult) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setSearchOffset(prevSearchOffset => {
            const newSearchOffset = prevSearchOffset + 1;
            fetchExploreData(searchValue, adultToggleOn, contentPage, characterPage);
            return newSearchOffset;
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasSearchResult, searchValue, adultToggleOn, contentPage, characterPage],
  );

  // Func
  const generateFilterList = (): {searchFilterType: number; searchFilterState: number}[] => {
    const positiveFilterList = positiveFilters
      .map(filter => ({
        searchFilterType: searchOptionList.indexOf(filter.name),
        searchFilterState: 0, // Positive
      }))
      .filter(item => item.searchFilterType !== -1);

    const negativeFilterList = negativeFilters
      .map(filter => ({
        searchFilterType: searchOptionList.indexOf(filter.name),
        searchFilterState: 1, // Negative
      }))
      .filter(item => item.searchFilterType !== -1);

    return [...positiveFilterList, ...negativeFilterList];
  };

  const fetchExploreData = async (
    searchValue: string,
    adultToggleOn: boolean,
    contentPage: PaginationRequest,
    characterPage: PaginationRequest,
  ) => {
    if (loading) return;

    setLoading(true);

    const minLoadingTime = new Promise<void>(resolve => setTimeout(resolve, 1000));
    try {
      const result = await sendSearchExplore({
        languageType: getCurrentLanguage(),
        search: searchValue,
        category: search === 'All' ? 0 : search === 'Story' ? 1 : 2,
        sort: selectedSort,
        filterList: generateFilterList(),
        isOnlyAdults: adultToggleOn,
        storyPage: contentPage,
        characterPage,
      });

      if (result.data !== undefined && result.resultCode === 0) {
        const newList = result.data?.searchExploreList || [];
        setSearchResultList(prevList => {
          return (contentPage.offset > 0 || characterPage.offset > 0) && prevList ? [...prevList, ...newList] : newList;
        });
        setContentPage(result.data.storyPage);
        setCharacterPage(result.data.characterPage);

        if (newList.length === 0) {
          setHasSearchResult(false);
        }
      } else {
        console.error('Failed to fetch explore data:', result.resultMessage);
        setHasSearchResult(false);
      }
    } catch (error) {
      console.error('Error fetching explore data:', error);
      setHasSearchResult(false);
    } finally {
      await minLoadingTime;
      setLoading(false);
    }
  };

  // Hooks
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await sendGetExplore(search, adultToggleOn);

        if (response.resultCode === 0) {
          if (response.bannerUrlList) {
            setBannerList(response.bannerUrlList);
          }
          if (response.talkainOperatorList) {
            setTalkainOperatorList(response.talkainOperatorList);
          }
          if (response.popularList) {
            setPopularList(response.popularList);
          }
          if (response.malePopularList) {
            setMalePopularList(response.malePopularList);
          }
          if (response.femalePopularList) {
            setFemalePopularList(response.femalePopularList);
          }
          if (response.newContentList) {
            setNewContentList(response.newContentList);
          }
          if (response.playingList) {
            setPlayingList(response.playingList);
          }
          if (response.recommendationList) {
            setRecommendationList(response.recommendationList);
          }
        } else {
          console.error(`Error: ${response.resultMessage}`);
        }
      } catch (error) {
        console.error('Error fetching shorts data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchExploreData(searchValue, adultToggleOn, {offset: 0, limit: searchLimit}, {offset: 0, limit: searchLimit});
  }, [search]);

  const splitterData = [
    {
      label: 'Featured',
      preContent: '',
      content: (
        <section className={styles.featuredContainer}>
          <div className={styles.scrollArea}>
            {bannerList && <ExploreFeaturedHeader items={bannerList} />}
            <div className={styles.content}>
              <main className={styles.listContainer}>
                {talkainOperatorList && talkainOperatorList.length > 0 && (
                  <SearchBoardHorizonScroll title="talkainOperatorList" data={talkainOperatorList} />
                )}
                {/* {popularList && popularList.length > 0 && (
                  <SearchBoardHorizonScroll title="popularList" data={popularList} />
                )} */}
                {malePopularList && malePopularList.length > 0 && (
                  <SearchBoardHorizonScroll title="Character" data={malePopularList} />
                )}
                {femalePopularList && femalePopularList.length > 0 && (
                  <SearchBoardHorizonScroll title="Story" data={femalePopularList} />
                )}
                {/* {newContentList && newContentList.length > 0 && (
                  <SearchBoardHorizonScroll title="New" data={newContentList} />
                )} */}
                {playingList && playingList.length > 0 && (
                  <SearchBoardHorizonScroll title="Content" data={playingList} />
                )}
                {/* {recommendationList && recommendationList.length > 0 && (
                  <SearchBoardHorizonScroll title="recommendList" data={recommendationList} />
                )} */}
                <br />
              </main>
            </div>
          </div>
        </section>
      ),
    },
    {
      label: 'Search',
      content: (
        <section className={styles.searchContainer}>
          <div
            className={styles.scrollArea}
            // onScroll={handleScroll}
          >
            <SearchBoardHeader
              setSearchResultList={setSearchResultList}
              adultToggleOn={adultToggleOn}
              setAdultToggleOn={setAdultToggleOn}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              filterData={searchOptionList}
              positiveFilter={positiveFilters}
              setPositiveFilter={setPositiveFilters}
              negativeFilter={negativeFilters}
              setNegativeFilter={setNegativeFilters}
              fetchExploreData={fetchExploreData}
              setSearchOffset={setSearchOffset}
            />
            <header className={styles.filterArea}>
              <div className={styles.tagArea}>
                <button
                  className={`${styles.tag} ${search === 'All' ? styles.selected : ''}`}
                  onClick={() => {
                    handleSearchChange('All');
                    changeParams('search', 'all');
                  }}
                >
                  All
                </button>
                <button
                  className={`${styles.tag} ${search === 'Story' ? styles.selected : ''}`}
                  onClick={() => {
                    handleSearchChange('Story');
                    changeParams('search', 'Story');
                  }}
                >
                  Story
                </button>
                <button
                  className={`${styles.tag} ${search === 'Character' ? styles.selected : ''}`}
                  onClick={() => {
                    handleSearchChange('Character');
                    changeParams('search', 'Character');
                  }}
                >
                  Character
                </button>
                <button
                  className={`${styles.tag} ${search === 'Content' ? styles.selected : ''}`}
                  onClick={() => {
                    handleSearchChange('Content');
                    changeParams('search', 'Content');
                  }}
                >
                  Content
                </button>
              </div>
              <button className={styles.sortButton} onClick={() => setSortDropDownOpen(true)}>
                <div>{searchSort}</div>
                <img className={styles.buttonIcon} src={BoldArrowDown.src} />
                {sortDropDownOpen && (
                  <DropDownMenu
                    items={dropDownMenuItems}
                    onClose={() => setSortDropDownOpen(false)}
                    className={styles.sortDropDown}
                    useSelected={true}
                    selectedIndex={selectedSort}
                  />
                )}
              </button>
            </header>
            {searchResultList === null || searchResultList.length < 1 ? (
              <>
                <h2 className={styles.emptyResult}> Result : 0</h2>
                <section className={styles.emptyContainer}>
                  <EmptyState stateText={'No search data'} />
                </section>
              </>
            ) : (
              <>
                <ul className={styles.resultList}>
                  {searchResultList
                    .filter(item => {
                      if (search === 'Story') {
                        return item.exploreItemType === 0;
                      }
                      if (search === 'Character') {
                        return item.exploreItemType === 1;
                      }
                      if (search === 'Content') {
                        return item.exploreItemType === 2;
                      }
                      return true;
                    })
                    .map((item, index) => (
                      <li
                        key={item.storyId}
                        className={styles.resultItem}
                        ref={index === searchResultList.length - 1 ? lastElementRef : null}
                      >
                        <ExploreCard
                          exploreItemType={item.exploreItemType}
                          updateExplorState={item.updateExplorState}
                          storyId={item.storyId}
                          storyName={item.storyName}
                          chatCount={item.chatCount}
                          episodeCount={item.episodeCount}
                          followerCount={item.followerCount}
                          thumbnail={item.thumbnail}
                          classType="search"
                          urlLinkKey={item.profileUrlLinkKey}
                        />
                      </li>
                    ))}
                </ul>
              </>
            )}
          </div>
        </section>
      ),
    },
  ];

  return (
    <>
      <Splitter
        initialActiveSplitter={data.indexTab}
        splitters={splitterData}
        splitterStyle={{
          height: 'var(--header-removed-height)',
          paddingTop: '58px',
        }}
        headerStyle={{
          paddingRight: '16px',
          paddingLeft: '16px',
        }}
        // contentStyle={{padding: '10px'}}
        itemStyle={{width: 'calc(50%)'}}
        isDark={true}
        onSelectSplitButton={index => {
          changeParams('indexTab', index);
          if (index == 0) {
            changeParams('search', null);
          }
        }}
      />
      <LoadingOverlay loading={loading} />
    </>
  );
};

export default SearchBoard;
