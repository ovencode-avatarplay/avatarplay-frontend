import React, {useEffect, useRef, useState} from 'react';
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
  retryStream,
} from '@/app/NetWork/ChatNetwork';

import {QueryParams, getWebBrowserUrl} from '@/utils/browserInfo';
import {COMMAND_SYSTEM, Message, MessageGroup} from './MainChat/ChatTypes';
import NextEpisodePopup from './MainChat/NextEpisodePopup';
import NotEnoughRubyPopup from './MainChat/NotEnoughRubyPopup';
import {modifyQuestionSlice, setRegeneratingQuestion} from '@/redux-store/slices/ModifyQuestion';
import {error} from 'console';

const ChatPage: React.FC = () => {
  const TempIdforSendQuestion: number = -222;
  const [parsedMessages, setParsedMessages] = useState<MessageGroup>({Messages: [], emoticonUrl: []});
  const parsedMessagesRef = useRef(parsedMessages);
  const [hasFetchedPrevMessages, setHasFetchedPrevMessages] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [streamKey, setStreamKey] = useState<string>(''); // streamKey 상태 추가
  const [retryStreamKey, setRetryStreamKey] = useState<string>(''); // streamKey 상태 추가
  const [chatId, setChatId] = useState<number>(TempIdforSendQuestion);
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
  // console.log('getWebBrowserUrl', key);

  const episodeId = useSelector((state: RootState) => state.chatting.episodeId);
  const contentId = useSelector((state: RootState) => state.chatting.contentId);
  const shortsId = useSelector((state: RootState) => state.chatting.contentUrl);
  const [isNotEnoughRubyPopupOpen, setNotEnoughRubyPopupOpen] = useState(false); // 팝업 상태 추가
  const [isSendingMessage, setIsSendingMessage] = useState({state: false}); // 메시지 전송 상태
  const [emoticonGroupInfoList, setEmoticonGroupInfoList] = useState<EmoticonGroupInfo[]>([]);

  const [lastMessage, setLastMessage] = useState<Message>({
    chatId: TempIdforSendQuestion,
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
  const isRegeneratingQuestion = useSelector((state: RootState) => state.modifyQuestion.isRegeneratingQuestion);
  const regenerateQuestion = useSelector((state: RootState) => state.modifyQuestion.regeneratingQuestion);

  const Send = async (reqSendChatMessage: SendChatMessageReq) => {
    try {
      console.log('sendParsedMessageStart:', parsedMessages);
      console.log('sendParsedMessageStartRef:', parsedMessagesRef);

      const currentMessages = parsedMessagesRef.current.Messages;
      const filteredMessages = currentMessages.filter(
        msg =>
          !(
            msg.text.includes('Failed to send message. Please try again.') ||
            msg.text.includes('Stream encountered an error or connection was lost. Please try again.')
          ),
      );

      // 상태를 업데이트
      setParsedMessages({
        ...parsedMessagesRef.current, // 최신 상태 유지
        Messages: filteredMessages,
      });

      if (isRegeneratingQuestion) {
        reqSendChatMessage.isRegenerate = isRegeneratingQuestion;
        reqSendChatMessage.regenerateChatId = regenerateQuestion.id;
      }

      const response = (await Promise.race([
        sendMessageStream(reqSendChatMessage),

        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), 5000)),
      ])) as SendChatMessageResSuccess | SendChatMessageResError;

      if ('streamKey' in response) {
        // 성공적인 응답 처리
        setStreamKey(response.streamKey);
        setChatId(response.chatContentId);

        const currentMessages = parsedMessagesRef.current.Messages;

        const updatedMessages = currentMessages.map(message =>
          message.chatId === TempIdforSendQuestion ? {...message, chatId: response.chatContentId} : message,
        );

        // 상태 업데이트
        setParsedMessages({
          ...parsedMessagesRef.current,
          Messages: updatedMessages,
        });
        dispatch(
          setRegeneratingQuestion({
            lastMessageId: response.chatContentId,
            lastMessageQuestion: reqSendChatMessage.text,
          }),
        );
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
    //let messageCount = 0; // 메시지 수신 횟수 추적
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
        handleSendMessage(newMessage, false, true);

        //messageCount++; // 메시지 수신 횟수 증가

        // 메시지가 3번 수신되면 강제로 에러 발생
        // if (messageCount === 50) {
        //   console.log('Forcing an error after 3 messages');
        //   if (eventSource.onerror) {
        //     const simulatedErrorEvent = new Event('error');
        //     eventSource.onerror(simulatedErrorEvent);
        //   } else {
        //     console.warn('No error handler defined for EventSource');
        //   }
        //   return;
        // }

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
    parsedMessagesRef.current = parsedMessages;
  }, [parsedMessages]);

  const handleSendMessage = async (message: string, isMyMessage: boolean, isClearString: boolean) => {
    if (!message || typeof message !== 'string') return;

    // console.log('SetChatID checkResult');
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
        handleSendMessage('%Stream encountered an error or connection was lost. Please try again.%', false, false);
      }
      return;
    }

    // *가 포함되어 있으면 적절한 위치에서 isNarrationActive.active 상태를 갱신해줘야 한다.
    // sender가 바뀌었어도 isNarrationActive.active 상태를 갱신해줘야 한다.
    const isIncludeAsterisk: boolean = isNarrationMessage(message);

    // 나레이션 활성화 상태에 따라 sender 설정
    const newMessage: Message = {
      chatId: TempIdforSendQuestion, // 임시 ID 지급
      text: message,
      sender: isMyMessage ? 'user' : isNarrationActive.active ? 'narration' : 'partner',
    };

    //console.log('setParsedMessages ==========' + newMessage.text + '=========', 'isClearString : ', isClearString);

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

      // 시스템 메시지 처리
      if (isMyMessage === false && isSystemMessage(newMessage.text)) {
        const newMessageSystem: Message = {
          chatId: chatId,
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
        dispatch(setRegeneratingQuestion({lastMessageId: chatId, lastMessageQuestion: message ?? ''}));
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
              chatId,
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
                chatId,
              );

              allMessages.push(newMessageStep3);
            }
          } else {
            isNarrationActive.active = !isNarrationActive.active;

            const splitMessageStep4: Message = setSenderType(
              splitMessageStep1Right,
              isMyMessage,
              isNarrationActive.active,
              chatId,
            );
            if (splitMessageStep4.text.length > 0) allMessages.push(splitMessageStep4);
          }
        } else {
          const splitMessageStep5: Message = setSenderType(
            newMessage.text,
            isMyMessage,
            isNarrationActive.active,
            chatId,
          );

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
    console.log('sendParsedMessage0:', parsedMessages);
    const _parsedMessages = func(parsedMessages);
    parsedMessages.Messages = _parsedMessages.Messages;
    parsedMessages.emoticonUrl = _parsedMessages.emoticonUrl;
    setParsedMessages({..._parsedMessages});

    console.log('sendParsedMessage1:', _parsedMessages);
  };

  //#endregion

  //#region 프론트에서 메시지 삭제 로직

  const removeParsedMessage = (removeId: number) => {
    const filteredMessages = parsedMessages.Messages.filter(
      message => message.chatId !== removeId, // 해당 id만 삭제
    );

    const updatedParsedMessages = {
      ...parsedMessages,
      Messages: filteredMessages,
    };

    setParsedMessages(updatedParsedMessages);

    console.log('removeParsedMessage:', updatedParsedMessages);
    console.log('removeParsedMessage:', parsedMessages);
  };

  //#endregion

  //#region 메세지 재전송 로직
  const handleRetryStream = () => {
    if (streamKey && chatId !== TempIdforSendQuestion) {
      const retryRequestData = {
        chatContentId: chatId, // 또는 필요에 따라 다른 ID 사용
        episodeId: episodeId, // 에피소드 ID
        text: parsedMessages.Messages[parsedMessages.Messages.length - 2].text, // 재전송할 메시지
      };

      // const filteredMessages = parsedMessages.Messages.filter(message => message.chatId === chatId);

      // // 필터링된 메시지의 text를 합치기
      // const combinedText = filteredMessages.map(message => message.text).join(' ');

      // const retryRequestData = {
      //   chatContentId: chatId, // 메시지의 고유 ID
      //   episodeId: episodeId, // 에피소드의 고유 ID
      //   text: combinedText, // chatId가 같은 모든 메시지의 텍스트를 합친 결과
      // };
      retryStream(retryRequestData)
        .then(response => {
          if ('streamKey' in response) {
            console.log('Retry successful, StreamKey:', response.streamKey);
            // 재전송 성공 시 처리 로직
            setIsLoading(true);
            setRetryStreamKey(response.streamKey);

            setParsedMessages(prev => ({
              ...prev,
              Messages: prev.Messages.filter(
                msg =>
                  !(
                    msg.text.includes('Failed to send message. Please try again.') ||
                    msg.text.includes('Stream encountered an error or connection was lost. Please try again.')
                  ),
              ),
            }));
          } else {
            if (response.resultCode == 1) {
              alert('잠시 후 시도해주세요');
            }
            console.log('Retry failed:', response.resultMessage);
            // 재전송 실패 시 처리 로직
          }
        })
        .catch(error => {
          console.error('Error retrying stream:', error);
        });
    } else {
      console.error('StreamKey or ChatId is not available');
    }
  };

  useEffect(() => {
    if (retryStreamKey === '') return;
    console.log('stream key : ', retryStreamKey);

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/Chatting/retryStream?streamKey=${retryStreamKey}`, // 쿼리 파라미터 제대로 추가
    );

    eventSource.onmessage = event => {
      try {
        if (!event.data) {
          throw new Error('Received null or empty data');
          setIsLoading(false);
        }

        setIsLoading(false);

        const newMessage = JSON.parse(event.data);
        handleSendMessage(newMessage, false, true);
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
      isSendingMessage.state = false;
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [retryStreamKey]);

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
      // loadEmoticons();
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
          retrySend={handleRetryStream}
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
        onRemoveChat={removeParsedMessage}
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
