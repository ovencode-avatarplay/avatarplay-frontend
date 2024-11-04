'use client';

import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {sendGetExplore} from '@/app/NetWork/ExploreNetwork';
import Header from './searchboard-header/SearchBoardHeader';
import Style from './SearchBoard.module.css';
import SearchBoardHorizonScroll from './SearchBoardHorizonScroll';
import {ExploreCardProps} from '@/types/apps/explore-card-type';

const SearchBoard: React.FC = () => {
  const [searchOptionList, setSearchOptionList] = useState<string[] | null>(null);
  const [playingList, setPlayingList] = useState<ExploreCardProps[] | null>(null);
  const [recommendationList, setRecommendationList] = useState<ExploreCardProps[] | null>(null);

  const [search, setSearch] = useState('all');
  const [onlyAdults, setOnlyAdults] = useState(false);

  // Hooks
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
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
        } else {
          console.error(`Error: ${response.resultMessage}`);
        }
      } catch (error) {
        console.error('Error fetching shorts data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className={Style.content}>
        <Header></Header>
        <main className={Style.container}>
          {playingList && <SearchBoardHorizonScroll title="playingList" data={playingList} />}
          {recommendationList && <SearchBoardHorizonScroll title="recomendationList" data={recommendationList} />}
          {recommendationList && <SearchBoardHorizonScroll title="recomendationList" data={recommendationList} />}
          {recommendationList && <SearchBoardHorizonScroll title="recomendationList" data={recommendationList} />}
          {recommendationList && <SearchBoardHorizonScroll title="recomendationList" data={recommendationList} />}
          {recommendationList && <SearchBoardHorizonScroll title="recomendationList" data={recommendationList} />}
        </main>
      </div>
    </>
  );
};

export default SearchBoard;
