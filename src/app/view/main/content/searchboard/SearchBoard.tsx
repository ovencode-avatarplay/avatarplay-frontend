'use client';

import React, {useEffect, useState} from 'react';

import {useDispatch} from 'react-redux';
import {sendGetExplore} from '@/app/NetWork/ExploreNetwork';

import styles from './SearchBoard.module.css';

import Header from './searchboard-header/SearchBoardHeader';
import SearchBoardHorizonScroll from './SearchBoardHorizonScroll';
import {ExploreCardProps} from './SearchBoardTypes';
import LoadingOverlay from '@/components/create/LoadingOverlay';

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

  return (
    <>
      <div className={styles.content}>
        <Header></Header>
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
