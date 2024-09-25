"use client"

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ExploreInfo, fetchCharacterInfo, sendGetExplore } from '@/app/NetWork/MyNetWork';
import { addNewCharacter, clearChatList } from '@/redux-store/slices/chat';
import Header from './searchboard-header/SearchBoardHeader';
import Style from './SearchBoard.module.css'
import SearchBoardHorizonScroll from './SearchBoardHorizonScroll';

const SearchBoard: React.FC = () => {

    const [searchOptionList, setSearchOptionList] = useState<string[]|null>(null);
    const [playingList, setPlayingList] = useState<ExploreInfo[] | null>(null);
    const [recommendationList, setRecommendationList] = useState<ExploreInfo[] | null>(null);
    
    const [search, setSearch] = useState('all');
    const [onlyAdults, setOnlyAdults] = useState(false);

    // Hooks
    const dispatch = useDispatch();

    //#region 채팅 연결 test용
    useEffect(() => {
        console.log('이 코드는 컴포넌트가 마운트될 때 한번만 실행됩니다.');
        init();

        return () => {
        };
    }, []);

    const init = async () => {
        const resCharacterInfo = await fetchCharacterInfo();

        if (!resCharacterInfo?.data?.characterInfoList) return;

        dispatch(clearChatList())

        for (let i = 0; i < resCharacterInfo.data.characterInfoList.length; i++) {
            const character = resCharacterInfo.data?.characterInfoList[i];

            dispatch(addNewCharacter({
                character,
            }));
            // Fake DB 변경해야 함.
        }
    }
    //#endregion
        
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await sendGetExplore(search, onlyAdults);
  
                console.log(response);
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
                    {playingList &&
                        <SearchBoardHorizonScroll title='playingList' data={playingList} />}
                    {recommendationList &&
                        <SearchBoardHorizonScroll title='recomendationList' data={recommendationList} />}
                    {playingList &&
                        <SearchBoardHorizonScroll title='playingList' data={playingList} />}
                    {recommendationList &&
                        <SearchBoardHorizonScroll title='recomendationList' data={recommendationList} />}
                    {playingList &&
                        <SearchBoardHorizonScroll title='playingList' data={playingList} />}
                    {recommendationList &&
                        <SearchBoardHorizonScroll title='recomendationList' data={recommendationList} />}

                </main>
            </div>
        </>
    )
}

export default SearchBoard
