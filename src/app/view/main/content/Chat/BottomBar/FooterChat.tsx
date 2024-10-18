import React, {useRef, useEffect, useState} from 'react';
import {Box, Button, TextField, IconButton} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CameraIcon from '@mui/icons-material/Camera';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import styles from '@chats/Styles/StyleChat.module.css';

import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {SendChatMessageReq, sendMessageStream} from '@/app/NetWork/ChatNetwork';

interface BottomBarProps {
  onSend: (message: string) => void;
}

const BottomBar: React.FC<BottomBarProps> = ({onSend}) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState<{
    streamKey: string;
    newMessageIndex: number;
    message: string;
    isNewMessage: boolean;
  }>({
    streamKey: '',
    newMessageIndex: 0,
    message: '',
    isNewMessage: false,
  });

  const inputRef = useRef<HTMLTextAreaElement | null>(null); // ref 타입을 HTMLTextAreaElement로 수정

  // 현재 에피소드 정보 가져오기
  const currentEpisodeId: number = useSelector((state: RootState) => state.chatting.episodeId);
  const UserId: number = useSelector((state: RootState) => state.user.userId);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSend = async () => {
    // if (message.trim()) {
    // onSend(message);
    // setMessage('');
    // console.log('message', message);
    // inputRef.current?.focus(); // 메시지 전송 후 포커스 유지
    // }

    if (message.trim()) {
      const reqSendChatMessage: SendChatMessageReq = {
        userId: UserId,
        episodeId: currentEpisodeId,
        text: message,
      };

      const response = await sendMessageStream(reqSendChatMessage);
      console.log(response);
      if (response.resultCode === 0) {
        setData(prev => ({...prev, streamKey: response.data.streamKey}));
      }
      setMessage('');
      inputRef.current?.focus(); // 메시지 전송 후 포커스 유지
    }
  };

  useEffect(() => {
    if (data.streamKey == '') return;
    //console.log('streamKey ', data.streamKey);
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Chatting/stream?streamKey=${data.streamKey}`,
    ); // 서버의 SSE 엔드포인트 URL

    eventSource.onmessage = event => {
      const newMessage = JSON.parse(event.data);
      setData(prev => {
        const updatedMessage = prev.message + newMessage;
        // 메시지 상태를 업데이트하여 React가 변화 인식
        // onSend(newMessage); // 상태 업데이트 추가
        return {
          ...prev,
          message: updatedMessage,
        };
      });

      // setData(prev => ({
      //   ...prev,
      //   message1: prev.message + newMessage,
      // }));

      //onSend(newMessage);

      //if (newMessage.trim()) {
      //onSend(newMessage);
      //setMessage('');
      //console.log('message::', message);
      //inputRef.current?.focus(); // 메시지 전송 후 포커스 유지
      //}
    };

    eventSource.onerror = () => {
      setData(prev => ({
        ...prev,
        message: '',
      }));
      console.error('Error occurred with SSE');
      eventSource.close();
    };

    return () => {
      setData(prev => ({
        ...prev,
        message: '',
      }));
      eventSource.close();
    };
  }, [data.streamKey]);

  // 누적된 메시지를 출력
  useEffect(() => {
    console.log('Accumulated message:', data.message);
    onSend(data.message); // 상태 업데이트 추가
  }, [data.message]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        // Shift + Enter로 개행
        return; // 기본 동작을 방지하지 않음
      } else {
        event.preventDefault(); // 기본 Enter 키 동작 방지 (줄바꿈 방지)
        handleSend();
      }
    }
  };

  return (
    <Box className={`${styles.bottomBar} ${isExpanded ? styles.expanded : styles.collapsed}`}>
      <Box display="flex" alignItems="center" padding={1}>
        <Button
          variant="outlined"
          sx={{marginRight: 1, marginBottom: 1, width: '40px', height: '40px', minWidth: '40px', whiteSpace: 'nowrap'}}
        >
          +
        </Button>
        <TextField
          variant="outlined"
          placeholder="채팅 입력"
          value={message}
          onChange={e => setMessage(e.target.value)}
          inputRef={inputRef} // ref 추가
          multiline // 다중 행 지원
          minRows={1} // 최소 행 수 설정
          maxRows={4} // 최대 행 수 설정
          sx={{flex: 1, marginRight: 1, overflow: 'auto'}} // 오버플로우 처리
          inputProps={{
            onKeyDown: handleKeyDown, // KeyDown 이벤트 핸들러로 변경
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{marginRight: 1, marginBottom: 1, width: '40px', height: '40px', minWidth: '50px', whiteSpace: 'nowrap'}}
          onClick={handleSend}
        >
          보내기
        </Button>
        <IconButton onClick={toggleExpand} sx={{marginLeft: 1, marginBottom: 1}}>
          {isExpanded ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
        </IconButton>
      </Box>

      {isExpanded && (
        <Box display="flex" marginTop={1} gap={1}>
          <Button variant="outlined" startIcon={<CameraIcon />}>
            캡처
          </Button>
          <Button variant="outlined" startIcon={<EmojiEmotionsIcon />}>
            스티커
          </Button>
          <Button variant="outlined" startIcon={<CardGiftcardIcon />}>
            선물
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default BottomBar;
