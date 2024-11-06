import React, {useRef, useEffect, useState} from 'react';
import {Box, Button, IconButton, TextField, InputAdornment} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CameraIcon from '@mui/icons-material/Camera';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import styles from '@chats/BottomBar/FooterChat.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {SendChatMessageReq, sendMessageStream, EmoticonGroupInfo} from '@/app/NetWork/ChatNetwork';
import Sticker from './Sticker';
import EmojiOverlayPopup from './EmojiOverlayPopup';
import {updateRecent} from '@/redux-store/slices/EmoticonSlice';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import ExtendedInputField from './ExtendedInputField';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ChatBar from './ChatBar';
interface BottomBarProps {
  onSend: (message: string, isMyMessage: boolean, parseMessage: boolean) => void;
  streamKey: string;
  setStreamKey: (key: string) => void;
  EmoticonData?: EmoticonGroupInfo[];
}

const BottomBar: React.FC<BottomBarProps> = ({onSend, streamKey, setStreamKey, EmoticonData}) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStickerOpen, setIsStickerOpen] = useState(false);
  const [showEmojiPopup, setShowEmojiPopup] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [selectedEmoticonId, setSelectedEmoticonId] = useState<number | null>(null);
  const [selectedEmoticonIsFavorite, setselectedEmoticonIsFavorite] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState({state: false}); // 메시지 전송 상태
  const inputRef = useRef<HTMLInputElement | null>(null); // inputRef 타입 변경
  const currentEpisodeId: number = useSelector((state: RootState) => state.chatting.episodeId);
  const UserId: number = useSelector((state: RootState) => state.user.userId);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    setSelectedEmoji(null);
    setSelectedEmoticonId(null);
    setselectedEmoticonIsFavorite(false);
    setShowEmojiPopup(false);
    setIsStickerOpen(false); // 창이 닫힐 때 스티커 창도 닫음
  };

  const handleSend = async () => {
    // 새 채팅을 보낼 수 없는 상태
    if (isSendingMessage.state === true) return;
    else isSendingMessage.state = true;

    const messageText = inputRef.current ? inputRef.current.value : '';

    // 선택된 이모티콘이 있으면 이미지 요소로 생성
    const message = selectedEmoji
      ? `<img src="${selectedEmoji}" alt="emoji" style="width:24px;height:24px;"/>`
      : messageText;

    if (message.trim()) {
      const parseMessage = false;
      onSend(message, true, parseMessage);

      // 입력란 초기화
      if (inputRef.current) {
        inputRef.current.value = ''; // 입력 값을 빈 문자열로 설정하여 초기화
        inputRef.current.focus(); // 포커스 다시 설정
      }
      const reqSendChatMessage: SendChatMessageReq = {
        userId: UserId,
        episodeId: currentEpisodeId,
        emoticonId: selectedEmoticonId || undefined,
        text: message, // 이미지 요소가 포함된 message
      };

      dispatch(updateRecent({emoticonId: selectedEmoticonId == undefined ? 0 : selectedEmoticonId}));

      setSelectedEmoticonId(null); // 선택된 이모티콘 ID 초기화
      setSelectedEmoji(null); // 선택된 이모티콘 초기화
      setShowEmojiPopup(false); // 팝업 닫기

      const response = await sendMessageStream(reqSendChatMessage);
      if (response.resultCode === 0 && response.data) {
        setStreamKey(response.data.streamKey);
      }
    }
  };

  useEffect(() => {
    if (streamKey === '') return;
    console.log('stream key : ', streamKey);

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
        if (newMessage.includes('$') === true) {
          isSendingMessage.state = false;
        }
      } catch (error) {
        console.error('Error processing message:', error);
        console.error('Received data:', event.data);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      isSendingMessage.state = false;
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
        maxWidth: '500px',
        margin: '0 auto',
        backgroundColor: 'white',
        transition: 'height 0.3s',
        height: isStickerOpen ? '350px' : 'auto', //박스 크기 조절 부분
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
        width: window.innerWidth,
      }}
    >
      <Box>
        <ChatBar
          onSend={handleSend}
          toggleExpand={toggleExpand}
          isExpanded={false}
          handleKeyDown={handleKeyDown}
          inputRef={inputRef}
        />
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
            setSelectedEmoji(null);
            setSelectedEmoticonId(null);
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
