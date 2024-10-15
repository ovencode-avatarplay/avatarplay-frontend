import React, {useEffect, useRef} from 'react';
import {Box} from '@mui/material';
import styles from '@chats/Styles/StyleChat.module.css';
import {EnterEpisodeChattingReq, sendChattingEnter} from '@/app/NetWork/ChatNetwork';

import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';

const PrevChatting: React.FC<EnterEpisodeChattingReq> = () => {
  // 기존 채팅내용 한번 싹 지워줘야 할듯..

  const userId = useSelector((state: RootState) => state.user.userId);
  const episodeId = useSelector((state: RootState) => state.contentselection.selectedEpisode);

  const ReqData: EnterEpisodeChattingReq = {
    userId: userId,
    episodeId: episodeId,
  };

  useEffect(() => {
    console.log('기존채팅 요청');
  }, []); // 처음 한번만..

  return null;
};

export default PrevChatting;
