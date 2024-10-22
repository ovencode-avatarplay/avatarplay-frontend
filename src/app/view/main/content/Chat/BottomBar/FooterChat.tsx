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
  onSend: (message: string, isMyMessage: boolean, parseMessage: boolean) => void; // 파싱 여부 추가
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

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const currentEpisodeId: number = useSelector((state: RootState) => state.chatting.episodeId);
  const UserId: number = useSelector((state: RootState) => state.user.userId);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSend = async () => {
    if (message.trim()) {
      const parseMessage = false; // 채팅 입력에서 보낼 때는 파싱 기능 끔
      console.log('parseMessage', parseMessage);
      onSend(message, true, parseMessage); // 파싱 여부 전달
      setMessage('');
      inputRef.current?.focus();

      // 메시지 전송 요청
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
    }
  };

  useEffect(() => {
    if (data.streamKey === '') return;

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Chatting/stream?streamKey=${data.streamKey}`,
    );

    eventSource.onmessage = event => {
      const newMessage = JSON.parse(event.data);

      // 스트리밍으로 받은 메시지일 때 파싱 기능 끔
      const parseMessage = false;
      onSend(newMessage, false, parseMessage); // 파싱 여부 전달
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        return; // 기본 동작을 방지하지 않음
      } else {
        event.preventDefault(); // 기본 Enter 키 동작 방지
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
          inputRef={inputRef}
          multiline
          minRows={1}
          maxRows={4}
          sx={{flex: 1, marginRight: 1, overflow: 'auto'}}
          inputProps={{
            onKeyDown: handleKeyDown,
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
