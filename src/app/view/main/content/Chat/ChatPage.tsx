import React, {useEffect, useState} from 'react';
import {RootState} from '@/redux-store/ReduxStore';
import {setStateChatting, ChattingState} from '@/redux-store/slices/Chatting';
import {useDispatch, useSelector} from 'react-redux';

import TopBar from '@chats/TopBar/HeaderChat';
import FooterChat from '@chats/BottomBar/FooterChat';
import ChatArea from '@chats/MainChat/ChatArea';
import styles from '@chats/Styles/StyleChat.module.css';
import usePrevChatting from '@chats/MainChat/PrevChatting';

import {useBackHandler} from 'utils/util-1';

import {
  setSenderType,
  cleanString,
  isFinishMessage,
  isNarrationMessage,
  isSystemMessage,
  isUserNarration,
  parsedUserNarration,
  parseMessage,
  splitByNarration,
} from '@chats/MainChat/MessageParser';

import {
  sendChattingResult,
  fetchEmoticonGroups,
  EmoticonGroupInfo,
  ChattingResultData,
  SendChatMessageReq,
  sendMessageStream,
  SendChatMessageResSuccess,
  SendChatMessageResError,
} from '@/app/NetWork/ChatNetwork';

import {QueryParams, getWebBrowserUrl} from '@/utils/browserInfo';
import {COMMAND_SYSTEM, Message, MessageGroup} from './MainChat/ChatTypes';
import NextEpisodePopup from './MainChat/NextEpisodePopup';
import NotEnoughRubyPopup from './MainChat/NotEnoughRubyPopup';

const ChatPage: React.FC = () => {
  const [parsedMessages, setParsedMessages] = useState<MessageGroup>({Messages: [], emoticonUrl: []});
  const [hasFetchedPrevMessages, setHasFetchedPrevMessages] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [streamKey, setStreamKey] = useState<string>(''); // streamKey 상태 추가
  const [chatId, setChatId] = useState<number>(-1);
  const [isNarrationActive, setIsNarrationActive] = useState<{active: boolean}>({active: false}); // 나레이션 활성화 상태
  const [nextEpisodeId, setNextEpisodeId] = useState<number | null>(null); // 다음 에피소드 ID 상태 추가
  const [isHideChat, SetHideChat] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // 로딩 상태 추가
  const [isIdEnter, setIsIdEnter] = useState<boolean>(false); // 로딩 상태 추가
  const [chatBarCount, setChatBarCount] = useState<number>(1); // 로딩 상태 추가
  const [nextPopupData, setNextPopupData] = useState<ChattingResultData>();

  const [isTransitionEnable, setIsTransitionEnable] = useState<boolean>(false); // 로딩 상태 추가
  const [ChattingState, setChatInfo] = useState<ChattingState>();
  const [isReqPrevCheat, setReqPrevCheat] = useState<boolean>(false); // 치트키로 애피소드 초기화.
  const [isRenderComplete, setRenderComplete] = useState<boolean>(false);
  const QueryKey = QueryParams.ChattingInfo;
  const key = getWebBrowserUrl(QueryKey) || null;
  console.log('getWebBrowserUrl', key);

  const episodeId = useSelector((state: RootState) => state.chatting.episodeId);
  const contentId = useSelector((state: RootState) => state.chatting.contentId);
  const shortsId = useSelector((state: RootState) => state.chatting.contentUrl);
  const [isNotEnoughRubyPopupOpen, setNotEnoughRubyPopupOpen] = useState(false); // 팝업 상태 추가
  const [isSendingMessage, setIsSendingMessage] = useState({state: false}); // 메시지 전송 상태
  const [emoticonGroupInfoList, setEmoticonGroupInfoList] = useState<EmoticonGroupInfo[]>([]);

  const [lastMessage, setLastMessage] = useState<Message>({
    chatId: -1,
    text: '',
    sender: 'system',
  });

  const chatInfo = useSelector((state: RootState) => state);
  const handleBackClick = useBackHandler();
  const dispatch = useDispatch();
  // useEffect(() => {}, [isLoading]);
  const SetChatLoading = (bool: boolean) => {
    setIsLoading(bool);
  };

  const SetChatBarCount = (num: number) => {
    setChatBarCount(num);
  };

  //#region 메세지 전송 로직

  const Send = async (reqSendChatMessage: SendChatMessageReq) => {
    try {
      const response = (await Promise.race([
        sendMessageStream(reqSendChatMessage),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), 5000)),
      ])) as SendChatMessageResSuccess | SendChatMessageResError;

      if ('streamKey' in response) {
        // 성공적인 응답 처리
        setStreamKey(response.streamKey);
        setChatId(response.chatId);
      } else if ('resultCode' in response) {
        // 오류 응답 처리
        if (response.resultCode === 13) {
          setIsSendingMessage({state: false});
          SetChatLoading(false);
          setNotEnoughRubyPopupOpen(true);
        }
      }
    } catch (error) {
      console.error(error);
      handleSendMessage('%Failed to send message. Please try again.%', false, false);

      SetChatLoading(false);
    } finally {
      isSendingMessage.state = false;
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
          setIsLoading(false);
        }

        setIsLoading(false);

        const newMessage = JSON.parse(event.data);
        handleSendMessage(newMessage, false, false);
        if (newMessage.includes('$') === true) {
          isSendingMessage.state = false;
          eventSource.close();
          console.log('Stream ended normally');
        }
      } catch (error) {
        console.error('Error processing message:', error);
        console.error('Received data:', event.data);
      }
    };

    eventSource.onerror = error => {
      console.error('Stream encountered an error or connection was lost');
      handleSendMessage('%Stream encountered an error or connection was lost. Please try again.%', false, false);
      isSendingMessage.state = false;
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [streamKey]);

  useEffect(() => {
    if (parsedMessages.Messages.length > 0) {
      const lastMsg = parsedMessages.Messages[parsedMessages.Messages.length - 1];
      setLastMessage(lastMsg);
    }
  }, [parsedMessages]);

  const handleSendMessage = async (message: string, isMyMessage: boolean, isClearString: boolean) => {
    if (!message || typeof message !== 'string') return;

    // 메시지가 '$'을 포함할 경우 팝업 표시
    if (isFinishMessage(isMyMessage, message) === true) {
      const requestData = {
        streamKey: streamKey, // streamKey 상태에서 가져오기
      };

      try {
        const response = await sendChattingResult(requestData);
        console.log('Result API Response:', response);
        if (response.data.nextEpisodeId !== 0) {
          setNextEpisodeId(response.data.nextEpisodeId); // 다음 에피소드 ID 저장
          setNextPopupData(response.data);
          setShowPopup(true);
        }
      } catch (error) {
        console.error('Error calling Result API:', error);
        alert('API 호출 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
      return;
    }

    // *가 포함되어 있으면 적절한 위치에서 isNarrationActive.active 상태를 갱신해줘야 한다.
    // sender가 바뀌었어도 isNarrationActive.active 상태를 갱신해줘야 한다.
    const isIncludeAsterisk: boolean = isNarrationMessage(message);

    // 나레이션 활성화 상태에 따라 sender 설정
    const newMessage: Message = {
      chatId: chatId,
      text: message,
      sender: isMyMessage ? 'user' : isNarrationActive.active ? 'narration' : 'partner',
    };
    console.log('setParsedMessages');

    const func = (prev: any) => {
      // 유저의 메시지면 나레이션모드를 초기화
      if (isMyMessage) isNarrationActive.active = false;

      // 이전 메시지 정보를 복사하고 메시지만 가져와 배열 업데이트 준비
      const allMessages = [...(prev?.Messages || [])];

      // 메시지가 비어있으면 반환
      if (newMessage.text.length === 0) return {Messages: allMessages, emoticonUrl: prev?.emoticonUrl || []};

      // 메시지 정리
      if (isClearString) newMessage.text = cleanString(newMessage.text);

      const splitMessageStep1 = splitByNarration(newMessage.text);
      const splitMessageStep1Left = splitMessageStep1.leftAsterisk;
      const splitMessageStep1Right = splitMessageStep1.rightAsterisk;

      const id = newMessage.chatId;

      // 시스템 메시지 처리
      if (isMyMessage === false && isSystemMessage(newMessage.text)) {
        const newMessageSystem: Message = {
          chatId: id,
          text: newMessage.text.replace(new RegExp(`\\${COMMAND_SYSTEM}`, 'g'), ''),
          sender: 'system',
        };
        allMessages.push(newMessageSystem);
        return {Messages: allMessages, emoticonUrl: prev?.emoticonUrl || []};
      }

      // 내 메시지
      if (isMyMessage === true) {
        // newMessage.text가 *로 시작하고 끝나는 경우
        if (isUserNarration(newMessage.text)) {
          const parsedMessage: Message = parsedUserNarration(newMessage);
          newMessage.sender = parsedMessage.sender;
          newMessage.text = parsedMessage.text;
        } else {
          newMessage.sender = 'user'; // 일반 유저 메시지
        }
        allMessages.push(newMessage); // 메시지를 배열에 추가
      }

      // 상대 메시지 처리
      else {
        if (isIncludeAsterisk === true) {
          // 먼저 왼쪽을 기존 말풍선에 출력시킨다
          if (splitMessageStep1Left.length > 0) allMessages[allMessages.length - 1].text += `${splitMessageStep1Left}`;

          if (isNarrationMessage(splitMessageStep1Right)) {
            const splitMessageStep2 = splitByNarration(splitMessageStep1Right);
            const splitMessageStep2Left = splitMessageStep2.leftAsterisk;
            const splitMessageStep2Right = splitMessageStep2.rightAsterisk;

            isNarrationActive.active = !isNarrationActive.active;

            const newMessageStep2: Message = setSenderType(
              splitMessageStep2Left,
              isMyMessage,
              isNarrationActive.active,
              id,
            );

            if (splitMessageStep2Left.length > 0) {
              if (allMessages[allMessages.length - 1].sender !== newMessageStep2.sender) {
                allMessages.push(newMessage);
              }
            }

            isNarrationActive.active = !isNarrationActive.active;

            if (splitMessageStep2Right.length > 0) {
              const newMessageStep3: Message = setSenderType(
                splitMessageStep2Left,
                isMyMessage,
                isNarrationActive.active,
                id,
              );

              allMessages.push(newMessageStep3);
            }
          } else {
            isNarrationActive.active = !isNarrationActive.active;

            const splitMessageStep4: Message = setSenderType(
              splitMessageStep1Right,
              isMyMessage,
              isNarrationActive.active,
              id,
            );
            if (splitMessageStep4.text.length > 0) allMessages.push(splitMessageStep4);
          }
        } else {
          const splitMessageStep5: Message = setSenderType(newMessage.text, isMyMessage, isNarrationActive.active, id);

          if (splitMessageStep5.text !== ' ') {
            if (allMessages[allMessages.length - 1].sender !== splitMessageStep5.sender) {
              if (splitMessageStep5.text.length > 0) {
                allMessages.push(splitMessageStep5);
              }
            }
            // 같은 sender면 같은 말풍선에 출력
            else if (splitMessageStep5.text.length > 0) {
              allMessages[allMessages.length - 1].text += `${splitMessageStep5.text}`;
            }
          }
          // 빈문자가 왔을때 기존 sender가 user였으면 무시하자 ( 자꾸 빈말풍선 찍히는 원인 )
          else if (allMessages[allMessages.length - 1].sender === 'user') {
            return prev;
          } else {
            // 그외의 ' ' 띄어쓰기면 그냥 기존 말풍선에 넣어준다.
            allMessages[allMessages.length - 1].text += `${splitMessageStep5.text}`;
          }
        }
      }

      // 업데이트된 Messages 배열을 MessageInfo 객체로 반환
      return {Messages: allMessages, emoticonUrl: prev?.emoticonUrl || []};
    };
    const _parsedMessages = func(parsedMessages);
    parsedMessages.Messages = _parsedMessages.Messages;
    parsedMessages.emoticonUrl = _parsedMessages.emoticonUrl;
    setParsedMessages({..._parsedMessages});
  };

  //#endregion

  //#region  다음 에피소드 넘어가기
  const navigateToNextEpisode = async (episodeId: number) => {
    console.log(`Navigating to episode ID: ${episodeId}`);

    const chattingState: ChattingState = {
      contentName: `content episode${episodeId}`,
      episodeName: `episode${episodeId}`,
      contentId: Number(contentId),
      episodeId: Number(episodeId),
      contentUrl: shortsId,
    };
    dispatch(setStateChatting(chattingState));
    setIsTransitionEnable(true);
    setIsIdEnter(true);
  };

  const handlePopupYes = () => {
    console.log('Yes 클릭');
    // 특정 행동 수행
    if (nextEpisodeId !== null) {
      console.log(`에피소드 ID에 대한 행동 수행: ${nextEpisodeId}`);
      navigateToNextEpisode(nextEpisodeId); // 다음 에피소드로 이동하는 함수 호출
    }
    setShowPopup(false);
  };

  const handlePopupNo = () => {
    console.log('No 클릭');
    setShowPopup(false);
  };
  //#endregion

  //#region HeaderChat handler
  const handleMoreClick = () => {
    console.log('더보기 버튼 클릭');
  };

  const handleToggleBackground = () => {
    console.log('배경 보기/숨기기 버튼 클릭');
    SetHideChat(!isHideChat);
  };

  const handleRerender = (isComplete: boolean) => {
    setRenderComplete(isComplete);
  };
  //#endregion

  const {prevMessages: enterData} = usePrevChatting(episodeId, isReqPrevCheat, handleRerender, isIdEnter);

  useEffect(() => {
    if (
      (!hasFetchedPrevMessages && enterData && (enterData?.prevMessageInfoList || enterData?.introPrompt.length > 0)) ||
      (nextEpisodeId != null && enterData?.episodeId === nextEpisodeId) ||
      isReqPrevCheat === true ||
      isRenderComplete === true
    ) {
      // flatMap을 통해 parsedPrevMessages를 생성
      // parsedPrevMessages와 emoticonUrl을 동시에 생성하여 위치와 길이를 맞춤
      console.log('nepid', nextEpisodeId);
      console.log('episodeId', episodeId);

      const {parsedPrevMessages, emoticonUrl} = enterData?.prevMessageInfoList.reduce<{
        parsedPrevMessages: Message[];
        emoticonUrl: string[];
      }>(
        (acc, msg) => {
          const parsedMessages = parseMessage(msg.message, msg.id) || [];
          acc.parsedPrevMessages.push(...parsedMessages);

          // parseMessage 결과 수에 맞춰 emoticonUrl 배열에 값을 추가
          const emoticonValue = msg.emoticonUrl || '';
          acc.emoticonUrl.push(...Array(parsedMessages.length).fill(emoticonValue));

          return acc;
        },
        {parsedPrevMessages: [], emoticonUrl: []},
      ) || {parsedPrevMessages: [], emoticonUrl: []}; // 기본값 설정

      const introPrompt2: Message = {
        chatId: chatId,
        text: enterData?.introPrompt || '애피소드 도입부가 설정되지 않았습니다',
        sender: 'introPrompt',
      };

      parsedPrevMessages.unshift(introPrompt2);
      emoticonUrl.unshift('');

      const messageInfo: MessageGroup = {
        Messages: parsedPrevMessages, // Message 배열
        emoticonUrl: emoticonUrl, // 이모티콘 URL
      };
      setParsedMessages(messageInfo);
      setHasFetchedPrevMessages(true);
      //에피소드 변경 상황
      if (nextEpisodeId != null && enterData?.episodeId === nextEpisodeId) {
        setNextEpisodeId(null);
        setIsIdEnter(false);
      }
      if (isReqPrevCheat === true) setReqPrevCheat(false);
      const loadEmoticons = async () => {
        try {
          const response = await fetchEmoticonGroups();
          setEmoticonGroupInfoList(response.data.emoticonGroupInfoList);
        } catch (error) {
          console.error('Error fetching emoticon groups:', error);
        }
      };
      loadEmoticons();
    }
  }, [enterData, hasFetchedPrevMessages, isReqPrevCheat, isRenderComplete]);

  return (
    <main className={styles.chatmodal}>
      <div className={styles.overlayContainer}>
        <TopBar
          onBackClick={handleBackClick}
          onMoreClick={handleMoreClick}
          iconUrl={enterData?.iconImageUrl ?? ''}
          isHideChat={isHideChat}
        />
        <ChatArea
          messages={parsedMessages!}
          bgUrl={enterData?.episodeBgImageUrl ?? ''}
          iconUrl={enterData?.iconImageUrl ?? ''}
          isHideChat={isHideChat}
          onToggleBackground={handleToggleBackground}
          isLoading={isLoading} // 로딩 상태를 ChatArea에 전달
          chatBarCount={chatBarCount}
          transitionEnabled={isTransitionEnable}
          send={Send}
          lastMessage={lastMessage}
        />
      </div>
      <FooterChat
        onSend={handleSendMessage}
        streamKey={streamKey}
        setStreamKey={setStreamKey}
        EmoticonData={emoticonGroupInfoList || []} // EmoticonData에 emoticonGroupInfoList 전달
        isHideChat={isHideChat}
        onToggleBackground={handleToggleBackground}
        onLoading={SetChatLoading}
        onUpdateChatBarCount={SetChatBarCount}
        onReqPrevChatting={setReqPrevCheat}
        isSendingMessage={isSendingMessage}
        send={Send}
      />

      {showPopup && (
        <NextEpisodePopup onYes={handlePopupYes} onNo={handlePopupNo} open={showPopup} data={nextPopupData} />
      )}
      {isNotEnoughRubyPopupOpen && (
        <NotEnoughRubyPopup
          open={isNotEnoughRubyPopupOpen}
          onClose={() => setNotEnoughRubyPopupOpen(false)} // 팝업 닫기
          rubyAmount={5} //필요 루비 임시
        />
      )}
    </main>
  );
};

export default ChatPage;
