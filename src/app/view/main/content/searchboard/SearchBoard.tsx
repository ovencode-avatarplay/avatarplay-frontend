'use client';

import React, {useEffect, useState} from 'react';

import {useDispatch} from 'react-redux';
import {sendGetExplore} from '@/app/NetWork/ExploreNetwork';

import styles from './SearchBoard.module.css';

import SearchBoardHeader from './searchboard-header/SearchBoardHeader';
import SearchBoardHorizonScroll from './SearchBoardHorizonScroll';
import {ExploreCardProps} from './SearchBoardTypes';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import Tabs from '@/components/layout/shared/Tabs';
import ExploreFeaturedHeader from './searchboard-header/ExploreFeaturedHeader';

const SearchBoard: React.FC = () => {
  const [bannerList, setBannerList] = useState<string[] | null>(null);
  const [searchOptionList, setSearchOptionList] = useState<string[] | null>(null);
  const [talkainOperatorList, setTalkainOperatorList] = useState<ExploreCardProps[] | null>(null);
  const [popularList, setPopularList] = useState<ExploreCardProps[] | null>(null);
  const [malePopularList, setMalePopularList] = useState<ExploreCardProps[] | null>(null);
  const [femalePopularList, setFemalePopularList] = useState<ExploreCardProps[] | null>(null);
  const [newContentList, setNewContentList] = useState<ExploreCardProps[] | null>(null);
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
              {talkainOperatorList && talkainOperatorList.length > 0 && (
                <SearchBoardHorizonScroll title="talkainOperatorList" data={talkainOperatorList} />
              )}
              {popularList && popularList.length > 0 && (
                <SearchBoardHorizonScroll title="popularList" data={popularList} />
              )}
              {malePopularList && malePopularList.length > 0 && (
                <SearchBoardHorizonScroll title="malePopularList" data={malePopularList} />
              )}
              {femalePopularList && femalePopularList.length > 0 && (
                <SearchBoardHorizonScroll title="femalePopularList" data={femalePopularList} />
              )}
              {newContentList && newContentList.length > 0 && (
                <SearchBoardHorizonScroll title="newContentList" data={newContentList} />
              )}
              {playingList && playingList.length > 0 && (
                <SearchBoardHorizonScroll title="playingList" data={playingList} />
              )}
              {recommendationList && recommendationList.length > 0 && (
                <SearchBoardHorizonScroll title="recommendList" data={recommendationList} />
              )}
            </main>
          </div>
        </div>
      ),
    },
    {
      label: 'Search',
      content: (
        <div>
          <SearchBoardHeader />
        </div>
      ),
    },
  ];

  return (
    <>
      <Tabs tabs={tabData} contentStyle={{padding: '0'}} />
      <LoadingOverlay loading={loading} />
    </>
  );
};

export default SearchBoard;
