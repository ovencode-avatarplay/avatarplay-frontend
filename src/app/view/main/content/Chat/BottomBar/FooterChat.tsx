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
import {SendChatMessageReq, sendMessageStream, EmoticonGroup} from '@/app/NetWork/ChatNetwork';
import Sticker from './Sticker';
import EmojiOverlayPopup from './EmojiOverlayPopup';

interface BottomBarProps {
  onSend: (message: string, isMyMessage: boolean, parseMessage: boolean) => void;
  streamKey: string;
  setStreamKey: (key: string) => void;
  EmoticonData?: EmoticonGroup[];
}

const BottomBar: React.FC<BottomBarProps> = ({onSend, streamKey, setStreamKey, EmoticonData}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStickerOpen, setIsStickerOpen] = useState(false);
  const [showEmojiPopup, setShowEmojiPopup] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [selectedEmoticonId, setSelectedEmoticonId] = useState<number | null>(null);
  const [selectedEmoticonIsFavorite, setselectedEmoticonIsFavorite] = useState(false);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const currentEpisodeId: number = useSelector((state: RootState) => state.chatting.episodeId);
  const UserId: number = useSelector((state: RootState) => state.user.userId);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    setIsStickerOpen(false); // 창이 닫힐 때 스티커 창도 닫음
  };

  const handleSend = async () => {
    const messageText = inputRef.current ? inputRef.current.innerHTML : '';

    // 선택된 이모티콘이 있으면 이미지 요소로 생성
    const message = selectedEmoji
      ? `<img src="${selectedEmoji}" alt="emoji" style="width:24px;height:24px;"/>`
      : messageText;

    if (message.trim()) {
      const parseMessage = false;
      onSend(message, true, parseMessage);

      if (inputRef.current) inputRef.current.innerHTML = ''; // 입력란 초기화
      setSelectedEmoticonId(null); // 선택된 이모티콘 ID 초기화
      setSelectedEmoji(null); // 선택된 이모티콘 초기화
      setShowEmojiPopup(false); // 팝업 닫기

      const reqSendChatMessage: SendChatMessageReq = {
        userId: UserId,
        episodeId: currentEpisodeId,
        emoticonId: selectedEmoticonId || undefined,
        text: message, // 이미지 요소가 포함된 message
      };

      const response = await sendMessageStream(reqSendChatMessage);
      if (response.resultCode === 0 && response.data) {
        setStreamKey(response.data.streamKey);
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
        if (!event.data) {
          throw new Error('Received null or empty data');
        }

        const newMessage = JSON.parse(event.data);
        const parseMessage = false;
        onSend(newMessage, false, parseMessage);
      } catch (error) {
        console.error('Error processing message:', error);
        console.error('Received data:', event.data);
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
        event.preventDefault();
        handleSend();
      }
    }
  };

  const handleStickerToggle = () => {
    setIsStickerOpen(!isStickerOpen);
  };

  const handleSelectEmoji = (emojiUrl: string, emojiId: number, isFavorite: boolean) => {
    setSelectedEmoji(emojiUrl); // 선택된 이모티콘 URL 저장
    setSelectedEmoticonId(emojiId); // 선택된 이모티콘 ID 저장
    setShowEmojiPopup(true); // 팝업 열기
    setselectedEmoticonIsFavorite(isFavorite);
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
        height: isStickerOpen ? '350px' : 'auto', //박스 크기 조절 부분
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
      {isExpanded && isStickerOpen && <Sticker onSelectEmoji={handleSelectEmoji} EmoticonData={EmoticonData} />}

      {/* EmojiOverlayPopup - 선택된 이모티콘을 팝업에 표시 */}
      {showEmojiPopup && selectedEmoji && (
        <EmojiOverlayPopup
          isOpen={showEmojiPopup}
          emojiUrl={selectedEmoji}
          emoticonId={selectedEmoticonId}
          onClose={() => {
            setselectedEmoticonIsFavorite(false);
            setShowEmojiPopup(false);
            console.log(selectedEmoticonIsFavorite);
          }}
          onSend={handleSend} // 팝업에서 이모티콘 클릭 시 전송
          isFavorite={selectedEmoticonIsFavorite}
        />
      )}
    </Box>
  );
};

export default BottomBar;
