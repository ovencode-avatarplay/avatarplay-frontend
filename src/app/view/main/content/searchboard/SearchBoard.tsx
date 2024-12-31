'use client';

import React, {useEffect, useState} from 'react';

import {useDispatch} from 'react-redux';
import {sendGetExplore} from '@/app/NetWork/ExploreNetwork';

import styles from './SearchBoard.module.css';

import Header from './searchboard-header/SearchBoardHeader';
import SearchBoardHorizonScroll from './SearchBoardHorizonScroll';
import {ExploreCardProps} from './SearchBoardTypes';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import Tabs from '@/components/layout/shared/Tabs';
import ExploreFeaturedHeader from './searchboard-header/ExploreFeaturedHeader';

const SearchBoard: React.FC = () => {
  const [searchOptionList, setSearchOptionList] = useState<string[] | null>(null);
  const [playingList, setPlayingList] = useState<ExploreCardProps[] | null>(null);
  const [recommendationList, setRecommendationList] = useState<ExploreCardProps[] | null>(null);

  const [search, setSearch] = useState('all');
  const [onlyAdults, setOnlyAdults] = useState(false);

  const [loading, setloading] = useState(false);

  // Hooks
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setloading(true);
      try {
        const response = await sendGetExplore(search, onlyAdults);

        // console.log(response);
        if (response.resultCode === 0) {
          if (response.searchOptionList) {
            setSearchOptionList(response.searchOptionList);
          }
          if (response.playingListData) {
            setPlayingList(response.playingListData);
          }
          if (response.recommendationListData) {
            setRecommendationList(response.recommendationListData);
          }
          setloading(false);
        } else {
          setloading(false);
          console.error(`Error: ${response.resultMessage}`);
        }
      } catch (error) {
        setloading(false);
        console.error('Error fetching shorts data:', error);
      }
    };
    fetchData();
  }, []);

  const featureBannerData = [
    {
      id: 1,
      backgroundImage: '/images/001.png',
      title: 'Title 1',
      description: 'Description for item 1',
    },
    {
      id: 2,
      backgroundImage: '/images/001.png',
      title: 'Title 2',
      description: 'Description for item 2',
    },
    {
      id: 3,
      backgroundImage: '/images/001.png',
      title: 'Title 3',
      description: 'Description for item 3',
    },
  ];

  const tabData = [
    {
      label: 'Featured',
      preContent: <ExploreFeaturedHeader items={featureBannerData} />,
      content: <div className={styles.featuredContainer}></div>,
    },
    {
      label: 'Search',
      content: (
        <div>
          <Header />
        </div>
      ),
    },
  ];

  return (
    <>
      <Tabs tabs={tabData} />
      <div className={styles.content}>
        <main className={styles.container}>
          {playingList && <SearchBoardHorizonScroll title="playingList" data={playingList} />}
          {recommendationList && <SearchBoardHorizonScroll title="recomendationList" data={recommendationList} />}
          {recommendationList && <SearchBoardHorizonScroll title="recomendationList" data={recommendationList} />}
          {recommendationList && <SearchBoardHorizonScroll title="recomendationList" data={recommendationList} />}
          {recommendationList && <SearchBoardHorizonScroll title="recomendationList" data={recommendationList} />}
          {recommendationList && <SearchBoardHorizonScroll title="recomendationList" data={recommendationList} />}
        </main>
      </div>
      <LoadingOverlay loading={loading} />
    </>
  );
};

export default SearchBoard;
