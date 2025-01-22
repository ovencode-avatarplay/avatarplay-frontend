'use client';

import React, {useEffect, useState} from 'react';

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

const SearchBoard: React.FC = () => {
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

  const [search, setSearch] = useState<'All' | 'Story' | 'Character'>('All');
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
  const [searchOffset, setSearchOffset] = useState<number>(0);
  const [contentPage, setContentPage] = useState<PaginationRequest>({offset: 0, limit: searchLimit});
  const [characterPage, setCharacterPage] = useState<PaginationRequest>({offset: 0, limit: searchLimit});
  const [previousScrollTop, setPreviousScrollTop] = useState(0);

  const [selectedSort, setSelectedSort] = useState<number>(0);
  const [sortDropDownOpen, setSortDropDownOpen] = useState<boolean>(false);
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

  // Handle

  const handleSearchChange = (value: 'All' | 'Story' | 'Character') => {
    setSearch(value);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const THRESHOLD = 200; // 데이터 불러오기 전에 남겨둘 여유 공간 (픽셀 단위)
    const isScrollingDown = target.scrollTop > previousScrollTop;

    setPreviousScrollTop(target.scrollTop);

    // 스크롤 끝에 도달하기 직전인지 확인
    if (isScrollingDown && target.scrollTop + target.clientHeight >= target.scrollHeight - THRESHOLD && !loading) {
      setSearchOffset(prevSearchOffset => {
        const newSearchOffset = prevSearchOffset + 1;
        fetchExploreData(searchValue, adultToggleOn, contentPage, characterPage);
        return newSearchOffset;
      });
    }
  };

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
        language: navigator.language || 'en-US',
        search: searchValue,
        category: search === 'All' ? 0 : search === 'Story' ? 1 : 2,
        sort: selectedSort,
        filterList: generateFilterList(),
        isOnlyAdults: adultToggleOn,
        contentPage,
        characterPage,
      });

      if (result.data !== undefined && result.resultCode === 0) {
        setSearchResultList(prevList => {
          const newList = result.data?.searchExploreList || [];
          return (contentPage.offset > 0 || characterPage.offset > 0) && prevList ? [...prevList, ...newList] : newList;
        });
        setContentPage(result.data.contentPage);
        setCharacterPage(result.data.characterPage);
      } else {
        console.error('Failed to fetch explore data:', result.resultMessage);
      }
    } catch (error) {
      console.error('Error fetching explore data:', error);
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
                {popularList && popularList.length > 0 && (
                  <SearchBoardHorizonScroll title="popularList" data={popularList} />
                )}
                {malePopularList && malePopularList.length > 0 && (
                  <SearchBoardHorizonScroll title="주간 TOP 10 스토리" data={malePopularList} />
                )}
                {femalePopularList && femalePopularList.length > 0 && (
                  <SearchBoardHorizonScroll title="추천 토카인 오리지널 스토리" data={femalePopularList} />
                )}
                {newContentList && newContentList.length > 0 && (
                  <SearchBoardHorizonScroll title="따끈따끈 TODAY 신작" data={newContentList} />
                )}
                {playingList && playingList.length > 0 && (
                  <SearchBoardHorizonScroll title="30대 남성 인기" data={playingList} />
                )}
                {recommendationList && recommendationList.length > 0 && (
                  <SearchBoardHorizonScroll title="recommendList" data={recommendationList} />
                )}
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
          <div className={styles.scrollArea} onScroll={handleScroll}>
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
                  }}
                >
                  All
                </button>
                <button
                  className={`${styles.tag} ${search === 'Story' ? styles.selected : ''}`}
                  onClick={() => {
                    handleSearchChange('Story');
                  }}
                >
                  Story
                </button>
                <button
                  className={`${styles.tag} ${search === 'Character' ? styles.selected : ''}`}
                  onClick={() => {
                    handleSearchChange('Character');
                  }}
                >
                  Character
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
                      return true;
                    })
                    .map(item => (
                      <li key={item.contentId} className={styles.resultItem}>
                        <ExploreCard
                          exploreItemType={item.exploreItemType}
                          updateExplorState={item.updateExplorState}
                          contentId={item.contentId}
                          contentName={item.contentName}
                          chatCount={item.chatCount}
                          episodeCount={item.episodeCount}
                          followerCount={item.followerCount}
                          thumbnail={item.thumbnail}
                          classType="search"
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
        splitters={splitterData}
        splitterStyle={{height: 'var(--body-height)'}}
        contentStyle={{padding: '0'}}
        isDark={true}
      />
      <LoadingOverlay loading={loading} />
    </>
  );
};

export default SearchBoard;
