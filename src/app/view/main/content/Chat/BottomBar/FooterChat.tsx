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
import {
  SendChatMessageReq,
  sendMessageStream,
  EmoticonGroupInfo,
  SendChatMessageResSuccess,
  SendChatMessageResError,
} from '@/app/NetWork/ChatNetwork';
import Sticker from './Sticker';
import EmojiOverlayPopup from './EmojiOverlayPopup';
import {updateRecent} from '@/redux-store/slices/EmoticonSlice';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import ExtendedInputField from './ExtendedInputField';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ChatBar from './ChatBar';
import NotEnoughRubyPopup from '../MainChat/NotEnoughRubyPopup';
import {cheatMessage, isAnyCheatMessageType, cheatManager} from '@/devTool/CheatCommand';
import {ChattingCheatRes} from '@/app/NetWork/CheatNetwork';
import getLocalizedText from '@/utils/getLocalizedText';
interface FooterChatProps {
  onSend: (message: string, isMyMessage: boolean, isClearString: boolean) => void;
  send: (reqSendChatMessage: SendChatMessageReq) => void;
  streamKey: string;
  setStreamKey: (key: string) => void;
  EmoticonData?: EmoticonGroupInfo[];
  isHideChat: boolean;
  onToggleBackground: () => void;
  onLoading: (isLoading: boolean) => void; // 로딩 상태 변경 함수 추가
  onUpdateChatBarCount: (count: number) => void; // 추가된 prop
  onReqPrevChatting: (isEnter: boolean) => void;
  isSendingMessage: {
    state: boolean;
  };
}

const FooterChat: React.FC<FooterChatProps> = ({
  onSend,
  EmoticonData,
  onToggleBackground,
  isHideChat,
  onLoading,
  onUpdateChatBarCount,
  onReqPrevChatting,
  isSendingMessage,
  send,
}) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStickerOpen, setIsStickerOpen] = useState(false);
  const [showEmojiPopup, setShowEmojiPopup] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [selectedEmoticonId, setSelectedEmoticonId] = useState<number | null>(null);
  const [selectedEmoticonIsFavorite, setselectedEmoticonIsFavorite] = useState(false);

  const currentEpisodeId: number = useSelector((state: RootState) => state.chatting.episodeId);
  const currentContentId: number = useSelector((state: RootState) => state.chatting.contentId);
  const UserId: number = useSelector((state: RootState) => state.user.userId);
  const [messages, setMessage] = useState(''); // 모든 ChatBar의 입력값을 관리하는 상태
  const [failMessage, setfailMessage] = useState<string | null>(null);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    setSelectedEmoji(null);
    setSelectedEmoticonId(null);
    setselectedEmoticonIsFavorite(false);
    setShowEmojiPopup(false);
    setIsStickerOpen(false); // 창이 닫힐 때 스티커 창도 닫음
  };

  const cheatMessageProcess = async (messages: string): Promise<boolean> => {
    // 치트 메시지인가?
    const cheat = messages ? messages : '';
    let result: boolean = false;

    if (isAnyCheatMessageType(cheat)) {
      try {
        const chattingCheatRes = await cheatMessage(currentContentId, currentEpisodeId, messages);

        if (chattingCheatRes) {
          const cheatResult = cheatManager(chattingCheatRes);
          if (cheatResult.text.length > 0) {
            onSend(cheatResult.text, true, false);
            result = true;
          } else if (cheatResult.reqEnter === true) {
            onReqPrevChatting(true);
            result = true;
          }
          result = true;
        } else {
          console.warn('ChattingCheatRes is undefined');
          result = true;
        }
      } catch (error) {
        console.error('Error fetching cheat message:', error);
        result = true;
      }
      result = true;
      onLoading(false);
    }
    return result;
  };

  const handleSend = async () => {
    // 새 채팅을 보낼 수 없는 상태
    if (isSendingMessage.state === true) return;
    else isSendingMessage.state = true;

    // 치트 메시지면 치트키 처리하고 빠져나온다.
    if ((await cheatMessageProcess(messages || '')) === true) {
      isSendingMessage.state = false;
      return;
    }

    const messageText = messages ? messages : '';

    // 선택된 이모티콘이 있으면 이미지 요소로 생성
    const message = selectedEmoji
      ? `<img src="${selectedEmoji}" alt="emoji" style="width:24px;height:24px;"/>`
      : messageText;

    if (message.trim()) {
      // 입력란 초기화
      if (messages) {
        setMessage('');
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

      const parseMessage = true;

      reqSendChatMessage.text = message.replace(/\(,\)/g, '');
      send(reqSendChatMessage);

      if (message.includes('⦿SYSTEM_CHAT⦿')) {
        const messageParts = message.split('⦿SYSTEM_CHAT⦿');
        messageParts.forEach(part => {
          const trimmedPart = part.trim(); // 필요시 양쪽 공백 제거
          if (trimmedPart.length > 0) {
            // 빈 문자열이 아닌 경우에만 onSend 호출
            onSend(trimmedPart, true, parseMessage);
          }
        });
      } else {
        onSend(message, true, parseMessage);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<Element>) => {
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
        zIndex: 4,
      }}
    >
      <Box>
        <ChatBar
          message={messages} // 상태를 전달하여 최신 메시지를 관리
          setMessage={setMessage} // 메시지를 업데이트할 함수 전달
          onSend={handleSend}
          toggleExpand={toggleExpand}
          isExpanded={false}
          handleKeyDown={handleKeyDown}
          isHideChat={isHideChat}
          onToggleBackground={onToggleBackground}
          onLoading={onLoading}
          onUpdateChatBarCount={onUpdateChatBarCount}
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

export default FooterChat;
