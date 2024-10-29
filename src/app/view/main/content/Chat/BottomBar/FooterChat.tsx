import React, {useRef, useEffect, useState} from 'react';
import {Box, Button, IconButton} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CameraIcon from '@mui/icons-material/Camera';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import styles from '@chats/BottomBar/FooterChat.module.css';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {SendChatMessageReq, sendMessageStream} from '@/app/NetWork/ChatNetwork';
import Sticker from './Sticker';

interface BottomBarProps {
  onSend: (message: string, isMyMessage: boolean, parseMessage: boolean) => void;
  streamKey: string; // streamKey를 props로 전달
  setStreamKey: (key: string) => void; // 부모에서 streamKey 설정하는 함수
}

const BottomBar: React.FC<BottomBarProps> = ({onSend, streamKey, setStreamKey}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStickerOpen, setIsStickerOpen] = useState(false);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const currentEpisodeId: number = useSelector((state: RootState) => state.chatting.episodeId);
  const UserId: number = useSelector((state: RootState) => state.user.userId);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSend = async () => {
    if (inputRef.current) {
      const combinedMessage = inputRef.current.innerHTML;
      if (combinedMessage.trim()) {
        const parseMessage = false;
        onSend(combinedMessage, true, parseMessage);
        inputRef.current.innerHTML = ''; // 메시지 전송 후 입력란 초기화

        const reqSendChatMessage: SendChatMessageReq = {
          userId: UserId,
          episodeId: currentEpisodeId,
          text: combinedMessage,
        };

        const response = await sendMessageStream(reqSendChatMessage);
        if (response.resultCode === 0 && response.data) {
          setStreamKey(response.data.streamKey); // 부모 컴포넌트의 streamKey 상태 업데이트
        }
      }
    }
  };

  useEffect(() => {
    if (streamKey === '') return;

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Chatting/stream?streamKey=${streamKey}`,
    );

    eventSource.onmessage = event => {
      try {
        // event.data가 null 또는 빈 문자열인지 확인
        if (!event.data) {
          throw new Error('Received null or empty data');
        }

        const newMessage = JSON.parse(event.data);
        const parseMessage = false;
        onSend(newMessage, false, parseMessage);
      } catch (error) {
        console.error('Error processing message:', error);
        console.error('Received data:', event.data);
        // 추가적인 오류 처리 로직 (필요한 경우)
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [streamKey]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      if (!event.shiftKey) {
        event.preventDefault(); // 기본 Enter 키 동작 방지
        handleSend();
      }
    }
  };

  const handleStickerToggle = () => {
    setIsStickerOpen(!isStickerOpen);
  };

  const handleSelectEmoji = (emoji: string) => {
    if (inputRef.current) {
      const imgElement = document.createElement('img');
      imgElement.src = emoji;
      imgElement.alt = 'emoji';
      imgElement.style.width = '24px';
      imgElement.style.height = '24px';
      inputRef.current.appendChild(imgElement);
      inputRef.current.focus();
    }
    setIsStickerOpen(false);
  };

  return (
    <Box
      className={`${styles.bottomBar} ${isExpanded ? styles.expanded : styles.collapsed}`}
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        transition: 'height 0.3s',
        height: isStickerOpen ? '400px' : 'auto',
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box display="flex" alignItems="center" padding={1}>
        <Button
          variant="outlined"
          sx={{
            marginRight: 1,
            marginBottom: 1,
            width: '40px',
            height: '40px',
            minWidth: '40px',
            whiteSpace: 'nowrap',
          }}
        >
          +
        </Button>
        <Box
          contentEditable
          ref={inputRef}
          className={styles.messageInput}
          sx={{
            flex: 1,
            marginRight: 1,
            overflow: 'auto',
            border: '1px solid #ccc',
            padding: '8px',
            borderRadius: '4px',
            minHeight: '40px',
          }}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{
            marginRight: 1,
            marginBottom: 1,
            width: '40px',
            height: '40px',
            minWidth: '50px',
            whiteSpace: 'nowrap',
          }}
          onClick={handleSend}
        >
          보내기
        </Button>
        <IconButton onClick={toggleExpand} sx={{marginLeft: 1, marginBottom: 1}}>
          {isExpanded ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
        </IconButton>
      </Box>
      {isExpanded && !isStickerOpen && (
        <Box display="flex" marginTop={1} gap={1}>
          <Button variant="outlined" startIcon={<CameraIcon />}>
            캡처
          </Button>
          <Button variant="outlined" startIcon={<EmojiEmotionsIcon />} onClick={handleStickerToggle}>
            스티커
          </Button>
          <Button variant="outlined" startIcon={<CardGiftcardIcon />}>
            선물
          </Button>
        </Box>
      )}
      {isExpanded && isStickerOpen && <Sticker onSelectEmoji={handleSelectEmoji} />}
    </Box>
  );
};

export default BottomBar;
