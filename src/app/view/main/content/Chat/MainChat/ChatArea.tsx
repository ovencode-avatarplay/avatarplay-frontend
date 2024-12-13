import React, {useEffect, useRef, useState} from 'react';
import {Box, Avatar} from '@mui/material';
import styles from '@chats/Styles/StyleChat.module.css';
import ChatMessageBubble from './ChatMessageBubble';
import {Message, MessageGroup} from './ChatTypes';
import ChatTtsPlayer from './ChatTtsPlayer';
import {GenerateTtsUrl} from './GenerateTtsUrl';

import {SendChatMessageReq} from '@/app/NetWork/ChatNetwork';
import {RootState} from '@/redux-store/ReduxStore';
import {useSelector} from 'react-redux';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import ChatRetryButton from './ChatRetryButton';
import ChatLoadingBubble from './ChatLoadingBubble';
import {checkChatSystemError, ESystemError} from '@/app/NetWork/ESystemError';
import {red} from '@mui/material/colors';
interface ChatAreaProps {
  messages: MessageGroup;
  bgUrl: string;
  characterUrl: string;
  iconUrl: string;
  isHideChat: boolean;
  onToggleBackground: () => void;
  isLoading: boolean; // 로딩 상태 추가
  chatBarCount: number;
  aiChatHeight: number;
  transitionEnabled: boolean; // 배경 이미지 전환 여부를 제어하는 프롭
  send: (reqSendChatMessage: SendChatMessageReq) => void;
  lastMessage: Message;
  retrySend: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  bgUrl,
  iconUrl,
  isHideChat,
  onToggleBackground,
  isLoading,
  chatBarCount,
  aiChatHeight,
  transitionEnabled, // transitionEnabled 프롭을 추가
  send,
  lastMessage,
  retrySend,
  characterUrl,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [selectedBubbleIndex, setSelectedBubbleIndex] = useState<number | null>(null);

  const chatInfo = useSelector((state: RootState) => state.chatting);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [retryingMessages, setRetryingMessages] = useState<number[]>([]);

  const isModifyingQuestion = useSelector((state: RootState) => state.modifyQuestion.isRegeneratingQuestion);

  const [loading, setloading] = useState(false);

  const handleBubbleClick = (index: number) => {
    if (selectedBubbleIndex === null) {
      setSelectedBubbleIndex(index);
    } else {
      setSelectedBubbleIndex(null);
    }
  };

  const handlePlayAudio = async (text: string) => {
    setloading(true);
    const url = await GenerateTtsUrl(text, 'defaultVoice');

    setloading(false);
    setAudioUrl(url); // ChatTtsPlayer로 전달할 audioUrl 상태 업데이트
  };

  useEffect(() => {
    if (scrollRef.current) {
      const {scrollTop, clientHeight, scrollHeight} = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop === clientHeight;

      console.log(scrollRef.current);
      // 스크롤 위치를 유지하기 위해 이전 스크롤 높이 계산
      const previousScrollHeight = scrollHeight;

      // console.log('chatarea', JSON.stringify(messages, null, 2)); // JSON 문자열로 변환하여 보기 좋게 출력
      // console.log('Raw object:', messages);

      // 새 메시지가 추가된 후 스크롤을 업데이트
      if (messages.Messages.length > 0) {
        // 메시지가 추가된 후 스크롤 위치 복원
        if (isAtBottom) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight; // 맨 아래로 이동
        } else {
          // 현재 스크롤 위치에서 얼마나 위로 올라갔는지 계산
          const newScrollHeight = previousScrollHeight + scrollRef.current.scrollHeight;
          scrollRef.current.scrollTop = newScrollHeight - previousScrollHeight + scrollTop;
        }
      }
    }
  }, [messages, chatBarCount, aiChatHeight]); // messages와 chatBarCount가 변경될 때마다 실행

  const [prevBgUrl, setPrevBgUrl] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false); // 페이드 아웃 상태 추가
  useEffect(() => {}, [characterUrl]);

  useEffect(() => {
    // prevBgUrl이 null이면 초기 상태로서 bgUrl을 그대로 설정
    if (!prevBgUrl) {
      setPrevBgUrl(bgUrl);
      return;
    }

    // bgUrl이 변경되고 transitionEnabled가 true일 때만 전환을 수행
    if (bgUrl !== prevBgUrl && transitionEnabled) {
      setIsFadingOut(true);
      console.log('Start fading out previous background');

      setTimeout(() => {
        setPrevBgUrl(bgUrl); // bgUrl로 prevBgUrl 업데이트
        setIsFadingOut(false);
        setIsTransitioning(true);

        setTimeout(() => {
          setIsTransitioning(false);
        }, 1500); // 트랜지션 지속 시간과 일치
      }, 500); // 페이드 아웃 시간
    }
  }, [bgUrl, prevBgUrl, transitionEnabled]);

  useEffect(() => {
    if (isModifyingQuestion === false) {
      setSelectedBubbleIndex(null);
    }
  }, [isModifyingQuestion]);

  const handleRetry = (msgText: string, chatId: number) => {
    // 재전송을 시도한 메시지의 chatId를 상태에 추가하여 버튼 숨기기
    setRetryingMessages(prev => [...prev, chatId]);
    // 실패한 메시지를 재전송하기 위한 요청 데이터 생성
    const retryMessage: SendChatMessageReq = {
      episodeId: chatInfo.episodeId,
      text: msgText,
    };

    send(retryMessage); // Send 함수를 호출하여 메시지를 재전송
  };

  const retryAction = (msg: Message) => {
    if (msg.text.includes(`${ESystemError.syserr_chatting_send_post}`)) {
      // 첫 번째 문구에 해당하는 동작
      console.log('Failed to send message. Retry logic');
      handleRetry(
        messages.Messages[messages.Messages.length - 2].text,
        messages.Messages[messages.Messages.length - 2].chatId,
      );
    } else if (msg.text.includes(`${ESystemError.syserr_chat_stream_error}`)) {
      // 두 번째 문구에 해당하는 동작
      console.log('Stream error. Attempting to reconnect');
      retrySend();
    }
  };
  console.log('aiChatHeight', aiChatHeight);
  return (
    <>
      <LoadingOverlay loading={loading} />
      {/* {isHideChat === false && ( */}
      <Box
        className={styles.chatArea}
        onDoubleClick={event => {
          // if (isHideChat === false) {
          event.preventDefault();
          onToggleBackground();
          // }
        }}
      >
        {/* 기존 배경 */}
        <Box
          className={`${styles.mainBackground} ${isFadingOut ? styles.fadingOut : ''}`}
          sx={{
            backgroundImage: `url(${prevBgUrl || bgUrl})`,
            opacity: isFadingOut ? 0 : 1,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* 새 배경 */}
        <Box
          className={`${styles.newBackground} ${isHideChat ? styles.fadeCover : ''} ${
            isFadingOut ? styles.fadingOut : ''
          }`}
          sx={{
            backgroundImage: ` url(${prevBgUrl || bgUrl})`,
            opacity: isTransitioning ? 1 : 0,
            transition: transitionEnabled ? 'opacity 1.5s ease' : 'none',
          }}
        />

        {/* 캐릭터 이미지 */}
        <Box
          className={`${styles.mainCharacter} ${bgUrl === '' || bgUrl === undefined ? styles.mainCharacterNonBg : ''}`}
          sx={{
            backgroundImage: `url(${characterUrl})`,
          }}
        />

        {/* 최상위 그라데이션 */}
        <Box
          className={`${styles.mainGradiationCover}`}
          sx={{
            width: '100%',
            height: '100%',
            backgroundImage: `${
              !isHideChat
                ? 'linear-gradient(180deg, rgba(0, 0, 0, 0.70) 4.69%, rgba(0, 0, 0, 0.40) 14.22%, rgba(0, 0, 0, 0.02) 100%)'
                : ''
            }`,
            opacity: isTransitioning ? 0 : 1,
            transition: transitionEnabled ? 'opacity 1.5s ease' : 'none',
          }}
        />

        <ChatTtsPlayer audioUrl={audioUrl} />
        {/* Scrollable content */}
        {isHideChat === false && (
          <Box
            className={`${styles.messageBubbleArea}`}
            ref={scrollRef}
            sx={{
              height: `calc(100% - ${chatBarCount > 0 ? chatBarCount * 8 : 0}vh - ${aiChatHeight}px)`,
            }}
          >
            <Box onClick={() => setSelectedBubbleIndex(null)}>
              {messages.Messages.map((msg, index) => (
                <React.Fragment key={index}>
                  {!(retryingMessages.includes(msg.chatId) && msg.sender === 'system') && (
                    <ChatMessageBubble
                      key={index}
                      text={msg.text}
                      sender={msg.sender}
                      id={msg.chatId}
                      index={index}
                      iconUrl={iconUrl}
                      emoticonUrl={messages.emoticonUrl[index]}
                      mediaData={messages.mediaData?.[index] || null}
                      onClick={e => {
                        e.stopPropagation();
                        handleBubbleClick(index);
                      }}
                      onTtsClick={e => {
                        e.stopPropagation();
                        handlePlayAudio(msg.text);
                      }}
                      selectedIndex={selectedBubbleIndex} // 현재 선택된 상태 전달
                      lastMessage={lastMessage}
                      createDate={msg.createDate}
                    />
                  )}
                  {/* Retry 버튼 조건부 렌더링 */}
                  {msg.sender === 'system' &&
                    checkChatSystemError(msg.text) &&
                    !retryingMessages.includes(msg.chatId) && ( // 재전송된 메시지 제외
                      <>
                        <ChatRetryButton retrySend={() => retryAction(msg)} />
                      </>
                    )}
                </React.Fragment>
              ))}
            </Box>
            {isLoading && <ChatLoadingBubble iconUrl={iconUrl} />}
            <div className={styles.endPadding}> </div>
            <div ref={bottomRef} />
          </Box>
        )}
      </Box>
    </>
  );
};
export default ChatArea;
