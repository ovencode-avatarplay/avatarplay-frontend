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
  const [bannerList, setBannerList] = useState<string[] | null>(null);
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
          if (response.bannerUrlList) {
            setBannerList(response.bannerUrlList);
          }
          if (response.searchOptionList) {
            setSearchOptionList(response.searchOptionList);
          }
          if (response.playingList) {
            setPlayingList(response.playingList);
          }
          if (response.recommendationList) {
            setRecommendationList(response.recommendationList);
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

  const tabData = [
    {
      label: 'Featured',
      preContent: bannerList && <ExploreFeaturedHeader items={bannerList} />,
      content: (
        <div className={styles.featuredContainer}>
          <div className={styles.content}>
            <main className={styles.listContainer}>
              {playingList && <SearchBoardHorizonScroll title="playingList" data={playingList} />}
              {recommendationList && <SearchBoardHorizonScroll title="recommendList" data={recommendationList} />}
            </main>
          </div>
        </div>
      ),
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
      <Tabs tabs={tabData} contentStyle={{padding: '0'}} />
      <div className={styles.content}></div>
      <LoadingOverlay loading={loading} />
    </>
  );
};

export default SearchBoard;
