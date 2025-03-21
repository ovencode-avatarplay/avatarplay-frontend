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
import LoadingOverlay from '@/components/create/LoadingOverlay';
import Splitter from '@/components/layout/shared/CustomSplitter';
import ExploreFeaturedHeader from './searchboard-header/ExploreFeaturedHeader';
import EmptyState from '@/components/search/EmptyState';
import {BoldArrowDown, LineArrowRight} from '@ui/Icons';
import DropDownMenu, {DropDownMenuItem} from '@/components/create/DropDownMenu';
import ExploreCard from './ExploreCard';
import {FilterDataItem} from '@/components/search/FilterSelector';
import {getCurrentLanguage} from '@/utils/UrlMove';
import useCustomRouter from '@/utils/useCustomRouter';
import getLocalizedText from '@/utils/getLocalizedText';
import CustomButton from '@/components/layout/shared/CustomButton';

export type searchType = 'All' | 'Story' | 'Character' | 'Content';

const SearchBoard: React.FC = () => {
  const [data, setData] = useState({
    indexTab: 0,
  });
  const [loading, setLoading] = useState(false);

  // Featured
  const [bannerList, setBannerList] = useState<BannerUrlList[] | null>(null);
  const [characterExploreList, setCharacterExploreList] = useState<ExploreItem[] | null>(null);
  const [storyExploreList, setStoryExploreList] = useState<ExploreItem[] | null>(null);
  const [contentExploreList, setContentExploreList] = useState<ExploreItem[] | null>(null);

  // Search
  const searchOptionList = ['Female', 'Male', 'BL', 'GL', 'LGBT+', 'Romance', 'Villain', 'Gaming', 'Adventure'];
  const [searchResultList, setSearchResultList] = useState<ExploreItem[] | null>(null);

  const [search, setSearch] = useState<searchType>('All');
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
  const [storyPage, setStoryPage] = useState<PaginationRequest>({offset: 0, limit: searchLimit});

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
  // Handle

  const handleSearchChange = (value: searchType) => {
    setSearch(value);
  };

  // scroll 조건 외에 마지막 아이템이 보이면 search 호출
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElement = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (loading || !hasSearchResult) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setSearchOffset(prev => {
          const newOffset = prev + 1;
          fetchExploreData(search, searchValue, adultToggleOn, contentPage, characterPage, storyPage);
          return newOffset;
        });
      }
    });

    if (lastElement.current) observer.current.observe(lastElement.current);

    return () => {
      observer.current?.disconnect();
    };
  }, [searchResultList, search]);

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
    searchType: searchType,
    searchValue: string,
    adultToggleOn: boolean,
    contentPage: PaginationRequest,
    characterPage: PaginationRequest,
    storyPage: PaginationRequest,
  ) => {
    if (loading) return;

    setLoading(true);

    const minLoadingTime = new Promise<void>(resolve => setTimeout(resolve, 1000));
    try {
      const result = await sendSearchExplore({
        languageType: getCurrentLanguage(),
        search: searchValue,
        category:
          searchType === 'All'
            ? 0
            : searchType === 'Story'
            ? 1
            : searchType === 'Character'
            ? 2
            : searchType === 'Content'
            ? 3
            : 0,
        sort: selectedSort,
        // filterList: generateFilterList(),
        // isOnlyAdults: adultToggleOn,
        // storyPage: contentPage,
        // characterPage,
        storyOffset: storyPage.offset,
        characterOffset: characterPage.offset,
        contentOffset: contentPage.offset,
        limit: searchLimit,
      });

      if (result.data !== undefined && result.resultCode === 0) {
        const newList = result.data?.searchExploreList || [];
        setSearchResultList(prevList => {
          return (contentPage.offset > 0 || characterPage.offset > 0 || storyPage.offset > 0) && prevList
            ? [...prevList, ...newList]
            : newList;
        });
        setContentPage({
          offset:
            search === 'All' ? result.data.contentOffset : search === 'Content' ? searchResultList?.length || 0 : 0,
          limit: searchLimit,
        });
        setCharacterPage({
          offset:
            search === 'All' ? result.data.characterOffset : search === 'Character' ? searchResultList?.length || 0 : 0,
          limit: searchLimit,
        });
        setStoryPage({
          offset: search === 'All' ? result.data.storyOffset : search === 'Story' ? searchResultList?.length || 0 : 0,
          limit: searchLimit,
        });

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
      //await minLoadingTime;
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
          if (response.characterExploreList) {
            setCharacterExploreList(response.characterExploreList);
          }
          if (response.contentExploreList) {
            setContentExploreList(response.contentExploreList);
          }
          if (response.storyExploreList) {
            setStoryExploreList(response.storyExploreList);
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
    setHasSearchResult(true);
    fetchExploreData(
      search,
      searchValue,
      adultToggleOn,
      {offset: 0, limit: searchLimit},
      {offset: 0, limit: searchLimit},
      {offset: 0, limit: searchLimit},
    );
  }, [search]);

  const splitterData = [
    {
      label: getLocalizedText('common_button_featured'),
      preContent: '',
      content: (
        <section className={styles.featuredContainer}>
          <div className={styles.scrollArea}>
            {bannerList && <ExploreFeaturedHeader items={bannerList} />}
            <div className={styles.content}>
              <main className={styles.listContainer}>
                {characterExploreList && characterExploreList.length > 0 && (
                  <SearchBoardHorizonScroll
                    title={getLocalizedText('explore001_label_001')}
                    data={characterExploreList}
                  />
                )}
                {storyExploreList && storyExploreList.length > 0 && (
                  <SearchBoardHorizonScroll title={getLocalizedText('explore001_label_002')} data={storyExploreList} />
                )}
                {contentExploreList && contentExploreList.length > 0 && (
                  <SearchBoardHorizonScroll
                    title={getLocalizedText('explore001_label_003')}
                    data={contentExploreList}
                  />
                )}
                <br />
              </main>
            </div>
          </div>
        </section>
      ),
    },
    {
      label: getLocalizedText('common_button_search'),
      content: (
        <section className={styles.searchContainer}>
          <div
            className={styles.scrollArea}
            // onScroll={handleScroll}
          >
            <SearchBoardHeader
              search={search}
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
                  {getLocalizedText('common_filter_all')}
                </button>
                <button
                  className={`${styles.tag} ${search === 'Story' ? styles.selected : ''}`}
                  onClick={() => {
                    handleSearchChange('Story');
                    changeParams('search', 'Story');
                  }}
                >
                  {getLocalizedText('common_filter_story')}
                </button>
                <button
                  className={`${styles.tag} ${search === 'Character' ? styles.selected : ''}`}
                  onClick={() => {
                    handleSearchChange('Character');
                    changeParams('search', 'Character');
                  }}
                >
                  {getLocalizedText('common_filter_character')}
                </button>
                <button
                  className={`${styles.tag} ${search === 'Content' ? styles.selected : ''}`}
                  onClick={() => {
                    handleSearchChange('Content');
                    changeParams('search', 'Content');
                  }}
                >
                  {getLocalizedText('common_filter_content')}
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
                {/* <h2 className={styles.emptyResult}> Result : 0</h2> */}
                <section className={styles.emptyContainer}>
                  <EmptyState stateText={getLocalizedText('explore006_desc_002')} />
                  <div className={styles.emptyCreateAlert}>{getLocalizedText('explore006_desc_003')}</div>
                  <CustomButton
                    size="Medium"
                    state="IconRight"
                    type="Primary"
                    icon={LineArrowRight.src}
                    customClassName={[styles.emptyCreateButton]}
                  >
                    {getLocalizedText('common_button_createacharacter')}
                  </CustomButton>
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
                        key={`explorecard-${index}`}
                        className={styles.resultItem}
                        ref={index === searchResultList.length - 1 ? lastElement : null}
                      >
                        <ExploreCard explore={item} classType="search" />
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
