//import React, {useEffect, useState} from 'react';
import {
  EnterEpisodeChattingReq,
  //EnterEpisodeChattingRes,
  //MessageInfo,
  sendChattingEnter,
} from '@/app/NetWork/ChatNetwork';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';

const usePrevChatting = (userId: number, episodeId: number) => {
  // Redux에서 필요한 데이터 가져오기
  //   const userId = useSelector((state: RootState) => state.user.userId);
  //   const episodeId = useSelector((state: RootState) => state.chatting.episodeId);

  // API 호출 결과를 저장할 상태값 정의
  //const [prevMessages, setPrevMessages] = useState<MessageInfo[]>([]);
  //const [error, setError] = useState<string | null>(null);

  // API 요청 데이터 정의
  const ReqData: EnterEpisodeChattingReq = {
    userId: userId,
    episodeId: episodeId,
  };

  const fetchChattingData = async () => {
    try {
      // 서버로부터 이전 채팅 데이터를 가져옴
      const response = await sendChattingEnter(ReqData);
      if (response.resultCode === 0 && response.data) {
        return response.data.prevMessageInfoList;
      } else {
        console.error('Failed to fetch chat messages.');
      }
    } catch (err) {
      console.error('Error fetching Chatting Enter:', err);
    }
  };
  fetchChattingData(); // API 호출

  // API 호출 결과 또는 에러를 리턴

  return {prevMessageInfoList: []};
};

export default usePrevChatting;
