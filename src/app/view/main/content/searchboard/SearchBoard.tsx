"use client"

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCharacterInfo } from '@/app/NetWork/MyNetWork';
import { addNewCharacter, clearChatList } from '@/redux-store/slices/chat';
import Header from './searchboard-header/SearchBoardHeader';
import './SearchBoard.css'
import SearchBoardHorizonScroll from './SearchBoardHorizonScroll';

const SearchBoard: React.FC = () => {

    // Hooks
    const dispatch = useDispatch();

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

    return (
        <>
        <div className="content">
            <Header></Header>
            <main className='search-board-container'>
                <SearchBoardHorizonScroll />
                <SearchBoardHorizonScroll />
                <SearchBoardHorizonScroll />
                <SearchBoardHorizonScroll />
            </main>
        </div>
        </>
    )
}

export default SearchBoard
