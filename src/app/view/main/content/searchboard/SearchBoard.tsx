'use client';

import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';

import {
  BannerUrlList,
  ExploreItem,
  ExploreItemType,
  FeaturedReq,
  sendExploreFeatured,
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
import {LineArrowDown, LineArrowRight} from '@ui/Icons';
import DropDownMenu, {DropDownMenuItem} from '@/components/create/DropDownMenu';
import ExploreCard from './ExploreCard';
import {FilterDataItem} from '@/components/search/FilterSelector';
import {getCurrentLanguage, pushLocalizedRoute} from '@/utils/UrlMove';
import useCustomRouter from '@/utils/useCustomRouter';
import getLocalizedText from '@/utils/getLocalizedText';
import CustomButton from '@/components/layout/shared/CustomButton';
import {PaginationRequest} from '@/app/NetWork/ProfileNetwork';
import {useRouter} from 'next/navigation';
import {setSelectedIndex} from '@/redux-store/slices/MainControl';
import {useDispatch} from 'react-redux';
import TagsData from 'data/create/tags.json';
import {getLocalizationKeyByText} from '@/utils/getLocalizationKeyByText';

export type searchType = 'All' | 'Story' | 'Character' | 'Content';

const SearchBoard: React.FC = () => {
  const [data, setData] = useState({
    indexTab: 0,
  });
  const [exploreLoading, setExploreLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const router = useRouter();

  // Featured
  const [bannerList, setBannerList] = useState<BannerUrlList[] | null>(null);
  const [characterExploreList, setCharacterExploreList] = useState<ExploreItem[] | null>(null);
  const [storyExploreList, setStoryExploreList] = useState<ExploreItem[] | null>(null);
  const [contentExploreList, setContentExploreList] = useState<ExploreItem[] | null>(null);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(setSelectedIndex(1));
  }, []);
  // Search
  const tagGroups = TagsData;

  const themeGroup = tagGroups.tagGroups.find(group => group.category === 'Theme');

  const genreGroup = tagGroups.tagGroups.find(group => group.category === 'Genre');

  const [searchResultList, setSearchResultList] = useState<ExploreItem[] | null>(null);

  const [search, setSearch] = useState<searchType>('All');
  const [adultToggleOn, setAdultToggleOn] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const prevSearchValueRef = useRef(searchValue);

  // Filter State
  const [positiveFilters, setPositiveFilters] = useState<FilterDataItem[]>([]);
  const [negativeFilters, setNegativeFilters] = useState<FilterDataItem[]>([]);

  // Search Scroll
  const searchLimit = 20;
  const [hasSearchResult, setHasSearchResult] = useState(true);
  const [searchOffset, setSearchOffset] = useState<number>(0);
  const [contentOffset, setContentOffset] = useState<number>(0);
  const [characterOffset, setCharacterOffset] = useState<number>(0);
  const [storyOffset, setStoryOffset] = useState<number>(0);

  const [selectedSort, setSelectedSort] = useState<number>(0);
  const [sortDropDownOpen, setSortDropDownOpen] = useState<boolean>(false);
  const {changeParams, getParam} = useCustomRouter();

  const [requestFetch, setRequestFetch] = useState<boolean>(false);

  // scroll 조건 외에 마지막 아이템이 보이면 search 호출
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElement = useRef<HTMLLIElement | null>(null);

  const dropDownMenuItems: DropDownMenuItem[] = [
    {
      name: getLocalizedText('common_sort_newest'),
      onClick: () => {
        setSearchResultList(null);
        setSortDropDownOpen(false);
        setSelectedSort(0);
        setRequestFetch(true);
      },
    },
    {
      name: getLocalizedText('common_sort_popular'),
      onClick: () => {
        setSearchResultList(null);
        setSortDropDownOpen(false);
        setSelectedSort(1);
        setRequestFetch(true);
      },
    },
    {
      name: getLocalizedText('common_sort_Name'),
      onClick: () => {
        setSearchResultList(null);
        setSortDropDownOpen(false);
        setSelectedSort(2);
        setRequestFetch(true);
      },
    },
    // {
    //   name: getLocalizedText('common_sort_monthlypopular'),
    //   onClick: () => {
    //     setSortDropDownOpen(false);
    //     setSelectedSort(3);
    //   },
    // },
  ];

  const handleSearchChange = (value: searchType) => {
    setSearch(value);
  };

  const handleSearch = () => {
    setHasSearchResult(true);
    setSearchResultList(null);
    setStoryOffset(0);
    setCharacterOffset(0);
    setContentOffset(0);
    setRequestFetch(true);
  };

  const handleCreateClick = () => {
    pushLocalizedRoute('/create/character', router);
  };

  const handlerFilterSaved = (positive: FilterDataItem[], negative: FilterDataItem[]) => {
    const positiveResult = positive.map(filter => filter.key).filter(key => themeGroup?.tags.includes(key));
    const negativeResult = negative.map(filter => filter.key).filter(key => themeGroup?.tags.includes(key));

    const localizedPositive = positiveResult.map(key => getLocalizedText('placehold', key, 'en-us'));
    const localizedNegative = negativeResult.map(key => getLocalizedText('placehold', key, 'en-us'));

    const encodedPositive = localizedPositive.join('&&');
    const encodedNegative = localizedNegative.join('!!');

    const finalFilter = [encodedPositive, encodedNegative].filter(Boolean).join('::');

    changeParams('filter', finalFilter);

    setSearchResultList(null);
    setRequestFetch(true);
  };

  const handleAdultToggleOn = (isAdult: boolean) => {
    setAdultToggleOn(isAdult);

    changeParams('adult', isAdult ? 1 : 0);
    localStorage.setItem('isAdult', isAdult ? 'true' : 'false');
  };

  // Func
  const generatePositiveFilterList = (): string[] => {
    let filterResult = positiveFilters.map(filter => filter.key).filter(key => themeGroup?.tags.includes(key));
    return filterResult;
  };
  const generateNegativeFilterList = (): string[] => {
    let filterResult = negativeFilters.map(filter => filter.key).filter(key => themeGroup?.tags.includes(key));
    return filterResult;
  };

  const fetchSearchData = async (
    searchType: searchType,
    searchValue: string,
    adultToggleOn: boolean,
    contentOffset: number,
    characterOffset: number,
    storyOffset: number,
  ) => {
    if (searchLoading) return;

    setSearchLoading(true);

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
        // storyPage: contentPage,
        // characterPage,
        positiveFilterTags: generatePositiveFilterList(),
        nagativeFilterTags: generateNegativeFilterList(),
        isAdults: adultToggleOn,
        storyOffset: storyOffset,
        characterOffset: characterOffset,
        contentOffset: contentOffset,
        limit: searchLimit,
      });

      if (result.data !== undefined && result.resultCode === 0) {
        const newList = result.data?.searchExploreList || [];
        setSearchResultList(prevList => {
          if (!newList.length) return prevList ?? [];

          const existingItems = prevList ?? [];

          const filteredNewList = newList.filter(newItem => {
            return !existingItems.some(existingItem => {
              const sameProfile = existingItem.profileId === newItem.profileId;
              const sameType = existingItem.typeValueId === newItem.typeValueId;

              return sameProfile && (sameType || !newItem.typeValueId || !existingItem.typeValueId);
            });
          });

          return [...existingItems, ...filteredNewList];
        });
        setContentOffset(
          search === 'All' ? result.data.contentOffset : search === 'Content' ? searchResultList?.length || 0 : 0,
        );
        setCharacterOffset(
          search === 'All' ? result.data.characterOffset : search === 'Character' ? searchResultList?.length || 0 : 0,
        );
        setStoryOffset(
          search === 'All' ? result.data.storyOffset : search === 'Story' ? searchResultList?.length || 0 : 0,
        );

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
      setSearchLoading(false);
    }
  };

  const fetchExploreData = async () => {
    if (exploreLoading) return;

    setExploreLoading(true);
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
      setExploreLoading(false);
    }
  };

  const fetchFeaturedData = async (exploreItemType: ExploreItemType, page: PaginationRequest) => {
    if (exploreLoading) return;

    setExploreLoading(true);
    try {
      let req: FeaturedReq = {
        languageType: getCurrentLanguage(),
        exploreItemType: exploreItemType,
        page: page,
      };

      const response = await sendExploreFeatured(req);

      if (response.resultCode === 0) {
        const newList = response.data?.exploreList || [];
        switch (exploreItemType) {
          case ExploreItemType.Content:
            setContentExploreList(prev => (prev ? [...prev, ...newList] : newList));
            break;
          case ExploreItemType.Character:
            setCharacterExploreList(prev => (prev ? [...prev, ...newList] : newList));
            break;
          case ExploreItemType.Story:
            setStoryExploreList(prev => (prev ? [...prev, ...newList] : newList));
            break;
        }
      } else {
        console.error(`Error: ${response.resultMessage}`);
      }
    } catch (error) {
      console.error('Error fetching shorts data:', error);
    } finally {
      setExploreLoading(false);
    }
  };

  // Hooks
  useLayoutEffect(() => {
    const search = getParam('search');
    const indexTab = getParam('indexTab');
    const filters = getParam('filter');
    const adult = getParam('adult');
    data.indexTab = Number(indexTab);
    setData({...data});

    if (search && ['All', 'Story', 'Character', 'Content'].includes(search)) {
      handleSearchChange(search as 'All' | 'Story' | 'Character' | 'Content');
    }
    if (filters) {
      const [positiveRaw, negativeRaw] = decodeURIComponent(filters).split('::');
      const positiveList = (positiveRaw || '').split('&&').filter(Boolean);
      const negativeList = (negativeRaw || '').split('!!').filter(Boolean);

      const enTags = themeGroup?.en || [];
      const tagKeys = themeGroup?.tags || [];

      // 역으로 key를 찾아서 FilterDataItem[] 생성
      // 영어 텍스트 -> key로 매핑
      const positiveItems: FilterDataItem[] = positiveList
        .map(text => {
          const index = enTags.indexOf(text);
          const key = tagKeys[index];
          return {key};
        })
        .filter(item => item.key);

      const negativeItems: FilterDataItem[] = negativeList
        .map(text => {
          const index = enTags.indexOf(text);
          const key = tagKeys[index];
          return {key};
        })
        .filter(item => item.key);

      setPositiveFilters(positiveItems);
      setNegativeFilters(negativeItems);
      handlerFilterSaved(positiveItems, negativeItems);
    }
    if (adult) {
      setAdultToggleOn(adult === '1' ? true : false || false);
    }
  }, []);

  useEffect(() => {
    fetchExploreData();

    setSearchResultList([]);
  }, []);

  useEffect(() => {
    if (prevSearchValueRef.current !== '' && searchValue === '') {
      handleSearch();
    }

    prevSearchValueRef.current = searchValue;
  }, [searchValue]);

  useEffect(() => {
    if (searchLoading || !hasSearchResult) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchSearchData(search, searchValue, adultToggleOn, contentOffset, characterOffset, storyOffset);
        setSearchOffset(prev => {
          const newOffset = prev + searchLimit;
          return newOffset;
        });
      }
    });

    if (lastElement.current) observer.current.observe(lastElement.current);

    return () => {
      observer.current?.disconnect();
    };
  }, [searchResultList]);

  useEffect(() => {
    handleSearch();
  }, [search]);

  useEffect(() => {
    if (requestFetch) {
      fetchSearchData(search, searchValue, adultToggleOn, 0, 0, 0);
      setRequestFetch(false);
    }
  }, [requestFetch]);

  const splitterData = [
    {
      label: getLocalizedText('common_button_featured'),
      preContent: '',
      content: (
        <section className={styles.featuredContainer}>
          <div className={styles.scrollArea}>
            {bannerList && <ExploreFeaturedHeader items={[...bannerList]} />}
            <div className={styles.content}>
              <main className={styles.listContainer}>
                {characterExploreList && characterExploreList.length > 0 && (
                  <SearchBoardHorizonScroll
                    title={getLocalizedText('explore001_label_001')}
                    data={characterExploreList}
                    requestMoreData={() => {
                      fetchFeaturedData(ExploreItemType.Character, {
                        offset: characterExploreList.length || 0,
                        limit: 10,
                      });
                    }}
                  />
                )}
                {storyExploreList && storyExploreList.length > 0 && (
                  <SearchBoardHorizonScroll
                    title={getLocalizedText('explore001_label_002')}
                    data={storyExploreList}
                    requestMoreData={() => {
                      fetchFeaturedData(ExploreItemType.Story, {offset: storyExploreList.length || 0, limit: 10});
                    }}
                  />
                )}
                {contentExploreList && contentExploreList.length > 0 && (
                  <SearchBoardHorizonScroll
                    title={getLocalizedText('explore001_label_003')}
                    data={contentExploreList}
                    requestMoreData={() => {
                      fetchFeaturedData(ExploreItemType.Content, {offset: contentExploreList.length || 0, limit: 10});
                    }}
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
              setAdultToggleOn={handleAdultToggleOn}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              filterData={themeGroup?.tags || []}
              positiveFilter={positiveFilters}
              setPositiveFilter={setPositiveFilters}
              negativeFilter={negativeFilters}
              setNegativeFilter={setNegativeFilters}
              fetchExploreData={fetchSearchData}
              setSearchOffset={setSearchOffset}
              setContentOffset={setContentOffset}
              setCharacterOffset={setCharacterOffset}
              setStoryOffset={setStoryOffset}
              onFilterSaved={handlerFilterSaved}
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
                <div>{dropDownMenuItems[selectedSort].name}</div>
                <img className={styles.buttonIcon} src={LineArrowDown.src} />
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
                  {search === 'Character' && (
                    <>
                      <div className={styles.emptyCreateAlert}>{getLocalizedText('explore006_desc_003')}</div>
                      <CustomButton
                        size="Medium"
                        state="IconRight"
                        type="Primary"
                        icon={LineArrowRight.src}
                        customClassName={[styles.emptyCreateButton]}
                        onClick={handleCreateClick}
                      >
                        {getLocalizedText('common_button_createacharacter')}
                      </CustomButton>
                    </>
                  )}
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
  const isIOS = () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.userAgent.includes('Macintosh') && 'ontouchend' in document)
    );
  };
  return (
    <div className={isIOS() === true ? styles.scrollContainer : ''}>
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
        isDark={false}
        onSelectSplitButton={index => {
          changeParams('indexTab', index);
          handleSearch();
        }}
      />
      <LoadingOverlay loading={searchLoading} />
    </div>
  );
};

export default SearchBoard;
