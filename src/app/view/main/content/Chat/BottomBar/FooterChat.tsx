import React, {useState} from 'react';
import {Box, Button} from '@mui/material';
import CameraIcon from '@mui/icons-material/Camera';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import styles from '@chats/BottomBar/FooterChat.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {SendChatMessageReq, EmoticonGroupInfo} from '@/app/NetWork/ChatNetwork';
import Sticker from './Sticker';
import EmojiOverlayPopup from './EmojiOverlayPopup';
import {updateRecent} from '@/redux-store/slices/EmoticonSlice';
import ChatBar from './ChatBar';
import {cheatMessage, isAnyCheatMessageType, cheatManager} from '@/devTool/CheatCommand';
import {useRouter} from 'next/navigation';
interface FooterChatProps {
  onSend: (
    message: string,
    isMyMessage: boolean,
    isClearString: boolean,
    isShowDate: boolean,
    //tempIdforSendQuestion: number,
  ) => void;
  send: (reqSendChatMessage: SendChatMessageReq) => void;
  streamKey: string;
  setStreamKey: (key: string) => void;
  isHideChat: boolean;
  isBlurOn: boolean;
  onToggleBackground: () => void;
  onLoading: (isLoading: boolean) => void; // 로딩 상태 변경 함수 추가
  onUpdateChatBarCount: (count: number) => void; // 추가된 prop
  onUpdateAiChatBarCount: (count: number) => void; // 추가된 prop
  onReqPrevChatting: (isEnter: boolean) => void;
  EmoticonData?: EmoticonGroupInfo[];

  isSendingMessage: React.MutableRefObject<boolean>; // ref 타입으로 쓰기가능형태로 받아오기
  onRemoveChat: (id: number) => void;
  onCheatChangeDate: (cheat: string) => void;
  //tempIdforSendQuestion: number;
}

const FooterChat: React.FC<FooterChatProps> = ({
  onSend,
  send,
  onToggleBackground,
  isHideChat,
  isBlurOn,
  EmoticonData,

  onLoading,
  onUpdateChatBarCount,
  onUpdateAiChatBarCount,
  onReqPrevChatting,
  isSendingMessage,
  onRemoveChat,
  onCheatChangeDate,
}) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStickerOpen, setIsStickerOpen] = useState(false);
  const [showEmojiPopup, setShowEmojiPopup] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [selectedEmoticonId, setSelectedEmoticonId] = useState<number | null>(null);
  const [selectedEmoticonIsFavorite, setselectedEmoticonIsFavorite] = useState(false);

  const currentEpisodeId: number = useSelector((state: RootState) => state.chatting.episodeId);
  const currentStoryId: number = useSelector((state: RootState) => state.chatting.storyId);
  const currentStreamKey: string = useSelector((state: RootState) => state.chatting.streamKey) ?? '';

  const [messages, setMessage] = useState(''); // 모든 ChatBar의 입력값을 관리하는 상태

  const router = useRouter();

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
        switch (cheat) {
          case '⦿YEAR⦿':
            onCheatChangeDate('⦿YEAR⦿');
            onLoading(false);
            return true;
          case '⦿MONTH⦿':
            onCheatChangeDate('⦿MONTH⦿');
            onLoading(false);
            return true;
          case '⦿DAY⦿':
            onCheatChangeDate('⦿DAY⦿');
            onLoading(false);
            return true;
          case '⦿REFRESH_NEW_DAY⦿':
            onCheatChangeDate('⦿REFRESH_NEW_DAY⦿');
            onLoading(false);
            return true;
        }

        const chattingCheatRes = await cheatMessage(currentStoryId, currentEpisodeId, messages);

        if (chattingCheatRes) {
          const cheatResult = cheatManager(chattingCheatRes, router);
          if (cheatResult.text.length > 0) {
            onSend(cheatResult.text, true, false, false);
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
    handleSendMessage(messages);
  };
  const handleSendMessage = async (messages: string) => {
    // 새 채팅을 보낼 수 없는 상태
    if (messages == '' || messages == null) return;
    const cleanedMessages = messages
      .replace(/⦿SYSTEM_CHAT⦿/g, '')
      .replace(/\*/g, '')
      .trim();

    if (cleanedMessages == '' || cleanedMessages == null) return;
    if (isSendingMessage.current === true) return;
    else isSendingMessage.current = true;

    // 치트 메시지면 치트키 처리하고 빠져나온다.
    if ((await cheatMessageProcess(messages || '')) === true) {
      isSendingMessage.current = false;
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
        episodeId: currentEpisodeId,
        emoticonId: selectedEmoticonId || undefined,
        text: message, // 이미지 요소가 포함된 message
        streamKey: currentStreamKey,
      };

      dispatch(updateRecent({emoticonId: selectedEmoticonId == undefined ? 0 : selectedEmoticonId}));

      setSelectedEmoticonId(null); // 선택된 이모티콘 ID 초기화
      setSelectedEmoji(null); // 선택된 이모티콘 초기화
      setShowEmojiPopup(false); // 팝업 닫기

      const parseMessage = true;

      if (message.includes('⦿SYSTEM_CHAT⦿')) {
        const messageParts = message.split('⦿SYSTEM_CHAT⦿');
        messageParts.forEach((part, index) => {
          const trimmedPart = part.trim(); // 필요시 양쪽 공백 제거
          const isLast = index === messageParts.length - 1; // 마지막 요소 판별

          if (trimmedPart.length > 0) {
            // 마지막 요소인 경우 별도 처리
            if (isLast) {
              onSend(trimmedPart, true, parseMessage, true);
            } else onSend(trimmedPart, true, parseMessage, false);
          }
        });
      } else {
        onSend(message, true, parseMessage, true);
      }

      reqSendChatMessage.text = message.replace(/\(,\)/g, '');
      send(reqSendChatMessage);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<Element>) => {
    if (messages == '' || messages == null) return;
    const cleanedMessages = messages
      .replace(/⦿SYSTEM_CHAT⦿/g, '')
      .replace(/\*/g, '')
      .trim();
    if (cleanedMessages == '' || cleanedMessages == null) return;
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
      className={`${styles.bottomBar} ${isExpanded ? styles.expanded : styles.collapsed} ${
        isBlurOn ? styles.blurOn : ''
      }`}
    >
      <ChatBar
        message={messages} // 상태를 전달하여 최신 메시지를 관리
        setMessage={setMessage} // 메시지를 업데이트할 함수 전달
        onSend={handleSendMessage}
        toggleExpand={toggleExpand}
        isExpanded={false}
        handleKeyDown={handleKeyDown}
        isHideChat={isHideChat}
        onToggleBackground={onToggleBackground}
        onLoading={onLoading}
        onUpdateChatBarCount={onUpdateChatBarCount}
        onUpdateAiBarCount={onUpdateAiChatBarCount}
        onRemoveChat={onRemoveChat}
        inputRef={null}
      />
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
