import React, {useEffect, useRef, useState} from 'react';
import {RootState} from '@/redux-store/ReduxStore';
import {setStateChatting, ChattingState} from '@/redux-store/slices/Chatting';
import {useDispatch, useSelector} from 'react-redux';

import TopBar from '@chats/TopBar/HeaderChat';
import FooterChat from '@chats/BottomBar/FooterChat';
import ChatArea from '@chats/MainChat/ChatArea';
import styles from '@chats/Styles/StyleChat.module.css';
import usePrevChatting from '@chats/MainChat/PrevChatting';

import {preventZoom, useBackHandler} from 'utils/util-1';

import {
  cleanString,
  isFinishMessage,
  isUserNarration,
  parsedUserNarration,
  parseMessage,
  isAnotherSenderType,
  isSameSenderType,
  cleanStringFinal,
  timeParser,
  getCurrentLocaleTime,
} from '@chats/MainChat/MessageParser';

import {
  sendChattingResult,
  fetchEmoticonGroups,
  EmoticonGroupInfo,
  SendChatMessageReq,
  sendMessageStream,
  SendChatMessageResSuccess,
  SendChatMessageResError,
  retryStream,
  ChatResultInfo,
  TriggerNextEpisodeInfo,
} from '@/app/NetWork/ChatNetwork'; // 테스튼

import {QueryParams, getWebBrowserUrl} from '@/utils/browserInfo';
import {MediaData, Message, MessageGroup, SenderType, TriggerMediaState} from './MainChat/ChatTypes';
import NextEpisodePopup from './MainChat/NextEpisodePopup';
import NotEnoughRubyPopup from './MainChat/NotEnoughRubyPopup';
import {setRegeneratingQuestion} from '@/redux-store/slices/ModifyQuestion';
import ChatFloatingArea from './MainChat/ChatFloatingArea';
import {checkChatSystemError, ESystemError} from '@/app/NetWork/ESystemError';
import {addNewDateMessage, compareDates, NewDateType, refreshNewDateAll, shiftDates} from './MainChat/NewDate';
import {TriggerActionType} from '@/redux-store/slices/ContentInfo';
import useChat from './hooks/useChat';
import {useStreamMessage} from './hooks/useStreamMessage';

const ChatPage: React.FC = () => {
  const {
    sendMessageAsync,
    //saveChatStreamInfo,

    handleBackClick,
    SetChatBarCount,
    SetAiChatHeight,
    removeParsedMessage,
    handleChangeNewDate,
    navigateToNextEpisode,
    handlePopupYes,
    handlePopupNo,
    handleRerender,

    characterImageUrl,
    isBlurOn,
    floatingNextEpisode,
    nextEpisodeName,
    parsedMessages,
    enterData,
    SetIsBlurOn,
    chatBarCount,
    aiChatHeight,
    isTransitionEnable,
    lastMessage,
    //streamKey,
    //setStreamKey,
    setReqPrevCheat,
    isSendingMessage,
    showPopup,
    nextPopupData,
    isNotEnoughRubyPopupOpen,
    setNotEnoughRubyPopupOpen,

    hasFetchedPrevMessages,
    isReqPrevCheat,
    isRenderComplete,

    currentParsingSender,
    TempIdforSendQuestion,
    parsedMessagesRef,
    setNextEpisodeId,
    setNextEpisodeName,
    setNextPopupData,
    setShowPopup,
    setCharacterImageUrl,
    setParsedMessages,
    chatId,
    isNarrationActive,

    //retryStreamKey,

    setChatId,
    isRegeneratingQuestion,
    regenerateQuestion,
    //setIsSendingMessage,

    //setRetryStreamKey,

    episodeId,
  } = useChat();

  const dispatch = useDispatch();
  const [emoticonGroupInfoList, setEmoticonGroupInfoList] = useState<EmoticonGroupInfo[]>([]);
  const [isHideChat, SetHideChat] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {streamKey, setStreamKey, retryStreamKey, setRetryStreamKey, saveChatStreamInfo} = useStreamMessage({
    isLoading,
    setIsLoading,
    handleSendMessage,
    isSendingMessage,
    setChatId,
    parsedMessages,
    setParsedMessages,
    parsedMessagesRef,
    TempIdforSendQuestion,
  });

  useEffect(() => {
    preventZoom(); // 줌인아웃을 막는다.
  }, []);

  useEffect(() => {
    window.addEventListener('resize', setFullHeight);
    window.addEventListener('orientationchange', setFullHeight);
    setFullHeight();

    // loadEmoticons();
  }, [enterData, hasFetchedPrevMessages, isReqPrevCheat, isRenderComplete]);

  // 나 또는 상대방의 메시지를 출력하기 위한 함수. ( 상대방의 메시지도 결국은 내가 메시지를 보내야만 오기때문에 이렇게 네이밍 됨. )
  async function handleSendMessage(message: string, isMyMessage: boolean, isClearString: boolean, isShowDate: boolean) {
    let currentTime: string = getCurrentLocaleTime();

    let isFinish = false;
    const currentSender = currentParsingSender.current;
    const mediaMessages: Message = {
      chatId: -1,
      text: '.',
      sender: SenderType.media,
      createDateString: currentTime,
      createDateLocale: new Date(),
    };

    if (isFinishMessage(isMyMessage, message) === true) {
      isFinish = true;
    }

    if (isShowDate === false) currentTime = '';

    // 나레이션 활성화 상태에 따라 sender 설정
    const newMessage: Message = {
      chatId: TempIdforSendQuestion, // 임시 ID 지급
      text: message,
      sender: isMyMessage ? SenderType.User : currentSender,
      createDateString: currentTime,
      createDateLocale: new Date(),
    };
    const mediaDataValue: MediaData = {
      mediaType: TriggerMediaState.None,
      mediaUrlList: [],
    };
    // console.log('SetChatID checkResult');
    // 메시지가 '$'을 포함할 경우 팝업 표시
    if (isFinish === true) {
      const requestData = {
        streamKey: streamKey, // streamKey 상태에서 가져오기
      };
      try {
        currentTime = getCurrentLocaleTime(); // 스트리밍 받는 말풍선은 무조건 위에서 지워줬기 때문에 한번 더 가져온다.
        // 이 시점이 마지막 Partner 말풍선이 끝난 시점이라서 이 시점에서 마지막 말풍선에 날짜를 출력한다.
        let tempAllMessage: Message[] = [...(parsedMessagesRef.current?.Messages || [])];
        if (tempAllMessage && tempAllMessage[tempAllMessage.length - 1]) {
          tempAllMessage[tempAllMessage.length - 1].createDateString = currentTime;
        }

        const allMedia = [...(parsedMessagesRef.current?.mediaData || [])];
        const allMessage = tempAllMessage;
        const allEmoticon = [...(parsedMessagesRef.current?.emoticonUrl || [])];

        const response = await sendChattingResult(requestData);
        const chatResultInfoList: ChatResultInfo[] = response.data.chatResultInfoList;

        const noneMedia: MediaData = {
          mediaType: TriggerMediaState.None,
          mediaUrlList: [],
        };

        // 마지막 채팅메시지에 날짜를 넣어주자.
        //allMessage[allMessage.length - 1].createDate = currentTime;

        //
        //parsedMessagesRef.current?.Messages[parsedMessagesRef.current?.Messages.length - 1].createDate = currentTime;

        // Trigger 데이터를 순차적으로 처리
        chatResultInfoList.forEach(triggerInfo => {
          // const allMedia = [...(parsedMessagesRef.current?.mediaData || [])];
          // const allMessage = [...(parsedMessagesRef.current?.Messages || [])];
          // const allEmoticon = [...(parsedMessagesRef.current?.emoticonUrl || [])];

          const isPrintDate: boolean = triggerInfo.type === 1 ? false : true; // triggerInfo.type === 1 이면 시스템메시지
          const resultSystemMessages: Message = {
            chatId: 0,
            text: '.',
            sender: SenderType.System,
            createDateString: isPrintDate ? currentTime : '', // 시스템 메시지에는 시간을 출력하지 않는다.
            createDateLocale: new Date(),
          };

          resultSystemMessages.text = triggerInfo.systemText.replace(/^%|%$/g, '');
          allMessage.push(resultSystemMessages); // Media 관련 메시지 추가
          allEmoticon.push(''); // 빈 이모티콘 추가
          allMedia.push(noneMedia); // 새 미디어 추가

          switch (triggerInfo.type as TriggerActionType) {
            case TriggerActionType.EpisodeChange:
              if (
                triggerInfo.triggerActionInfo.triggerNextEpisodeInfo != null &&
                triggerInfo.triggerActionInfo.triggerNextEpisodeInfo.nextEpisodeId !== 0
              ) {
                setNextEpisodeId(triggerInfo.triggerActionInfo.triggerNextEpisodeInfo.nextEpisodeId);
                setNextEpisodeName(triggerInfo.triggerActionInfo.triggerNextEpisodeInfo.nextEpisodeName);
                setNextPopupData(triggerInfo.triggerActionInfo.triggerNextEpisodeInfo);
                setShowPopup(true);
              }
              break;
            case TriggerActionType.ChangePrompt:
              break;
            case TriggerActionType.GetIntimacyPoint:
              break;
            case TriggerActionType.ChangeCharacter:
              // 캐릭터 변경 처리
              if (
                triggerInfo.triggerActionInfo.changeCharacterInfo &&
                characterImageUrl !== triggerInfo.triggerActionInfo.changeCharacterInfo.imageUrl
              ) {
                setCharacterImageUrl(triggerInfo.triggerActionInfo.changeCharacterInfo.imageUrl);
              }
              break;
            case TriggerActionType.PlayMedia:
              const mediaInfoList = triggerInfo.triggerActionInfo.triggerMediaInfoList || [];
              mediaInfoList.forEach(mediaInfo => {
                if (mediaInfo.triggerMediaState.toString() !== TriggerMediaState.None) {
                  const newMedia = {
                    mediaType: TriggerMediaState.None,
                    mediaUrlList: [...mediaInfo.triggerMediaUrlList],
                  };

                  // Media 상태에 따라 타입 설정
                  switch (mediaInfo.triggerMediaState) {
                    case 1:
                      newMedia.mediaType = TriggerMediaState.TriggerImage;
                      break;
                    case 2:
                      newMedia.mediaType = TriggerMediaState.TriggerVideo;
                      break;
                    case 3:
                      newMedia.mediaType = TriggerMediaState.TriggerAudio;
                      break;
                  }

                  allMessage.push(mediaMessages); // Media 관련 메시지 추가
                  allEmoticon.push(''); // 빈 이모티콘 추가
                  allMedia.push(newMedia); // 새 미디어 추가
                }
              });
              break;
          }
        });

        const updateMessage = {
          Messages: allMessage,
          emoticonUrl: allEmoticon,
          mediaData: allMedia,
        };

        setParsedMessages(updateMessage);
        parsedMessagesRef.current = updateMessage;

        console.log('Updated parsedMessagesRef.current:', parsedMessagesRef.current);

        console.log('Result API Response:', response);
      } catch (error) {
        console.error('Error calling Result API:', error);
        handleSendMessage(`${ESystemError.syserr_chat_stream_error}`, false, false, false);
      }
      return;
    }

    // *가 포함되어 있으면 적절한 위치에서 isNarrationActive.active 상태를 갱신해줘야 한다.
    // sender가 바뀌었어도 isNarrationActive.active 상태를 갱신해줘야 한다.

    //console.log('setParsedMessages ==========' + newMessage.text + '=========', 'isClearString : ', isClearString);

    const funcSendMessage = (prev: any) => {
      // 이전 메시지 정보를 복사하고 메시지만 가져와 배열 업데이트 준비
      const allMessages = [...(prev?.Messages || [])];
      const allEmoticon = [...(prev?.emoticonUrl || [])];
      const allMedia = [...(prev?.mediaData || [])];

      //return {Messages: allMessages, emoticonUrl: prev?.emoticonUrl || []};

      // 메시지가 비어있으면 반환
      if (newMessage.text.length === 0) return {Messages: allMessages, emoticonUrl: allEmoticon, mediaData: allMedia};

      // 메시지 정리
      if (isMyMessage === false && isClearString === true) newMessage.text = cleanString(newMessage.text);

      // 일단 내 메시지  처리
      if (isMyMessage === true) {
        // 임시로 newDate 넣자
        // const newDateMessage: Message = parsedUserNarration(newMessage);
        // newDateMessage.sender = SenderType.NewDate;
        // newDateMessage.text = newDateMessage.createDateString;
        // allMessages.push(newDateMessage);
        // allEmoticon.push('');
        // allMedia.push(mediaDataValue);

        // 가장최근 메시지의 표준시간을 가져온다
        const dateBefore = allMessages[allMessages.length - 1].createDateLocale;
        const dateCurrent = new Date();
        const strNewDate = compareDates(dateBefore, dateCurrent);
        addNewDateMessage(allMessages, allEmoticon, allMedia, strNewDate, dateCurrent, mediaDataValue);

        if (isUserNarration(newMessage.text)) {
          const parsedMessage: Message = parsedUserNarration(newMessage);
          newMessage.sender = SenderType.UserNarration;
          newMessage.text = parsedMessage.text;
        } else {
          newMessage.sender = SenderType.User;
        }
        dispatch(setRegeneratingQuestion({lastMessageId: chatId, lastMessageQuestion: message ?? ''}));
        if (!isFinish) {
          allMessages.push(newMessage);
          allEmoticon.push('');
          allMedia.push(mediaDataValue);
        } else {
          allMessages.push(mediaMessages);
          allEmoticon.push('');
          allMedia.push(mediaDataValue);
        }
      } else {
        //
        // 1. current sender를 가져온다
        let currentSender: SenderType = allMessages[allMessages.length - 1].sender;
        // 같은타입의 말풍선이 새로 만들어져야 하는 경우가 있어서 아래 조건 추가함.
        if (isNarrationActive.active === true) currentSender = SenderType.PartnerNarration;
        const tempChatId: number = chatId;
        console.log('newMessage.text :==' + newMessage.text + '==');
        // 2. 메시지를 한 바이트씩 조사해서 새로운 Sender로 만들지 말지 처리한다.
        for (let i = 0; i < newMessage.text.length; i++) {
          let {isAnotherSender, newSender} = isAnotherSenderType(isMyMessage, newMessage.text[i], currentSender);

          let newSenderResult = newSender;

          // 새 말풍선을 추가하라고 했는데 그냥 빈칸만 있는경우는 무시한다.
          if (isAnotherSender === true && (newMessage.text[i] === ' ' || newMessage.text === '\n')) {
            //isNarrationActive.active = false;
            continue;
          }

          if (isAnotherSender) isNarrationActive.active = false;
          // 나레이션모드이면  그냥 나레이션으로 출력해줘야 한다.
          if (isNarrationActive.active === true) {
            newSenderResult = SenderType.PartnerNarration;
            isAnotherSender = true;
            isNarrationActive.active = false;
          }

          const beforeSender = currentSender;
          if (isAnotherSender) {
            // sender Type이 달라졌으니 새로운 말풍선으로 넣어준다.
            const _newMessage: Message = {
              chatId: tempChatId,
              text: newMessage.text[i],
              sender: (newMessage.sender = newSenderResult),
              createDateString: currentTime,
              createDateLocale: new Date(),
            };
            currentSender = _newMessage.sender;

            if (!isFinish) {
              allMessages.push(_newMessage);
              allEmoticon.push('');
              allMedia.push(mediaDataValue);
            } else {
              allMessages.push(mediaMessages);
              allEmoticon.push('');
              allMedia.push(mediaDataValue);
            }
          } else {
            // sender Type이 같으니 기존 말풍선에 계속 넣어준다.
            allMessages[allMessages.length - 1].text += `${newMessage.text[i]}`;
            // 마지막으로 문자열들에 필요없는 문자열을 제거한다.
            allMessages[allMessages.length - 1].text = cleanStringFinal(allMessages[allMessages.length - 1].text);
          }

          // 마지막으로 아무 commend가 없으면 나레이션 모드로 하도록 하자.( 서버에서 **로 묶어주지 않을때가 있음 )
          const {isSameSenderCommand: isSame} = isSameSenderType(isMyMessage, newMessage.text[i], beforeSender);
          if (isSame === true) isNarrationActive.active = true;
        }
      }

      // 업데이트된 Messages 배열을 MessageInfo 객체로 반환
      return {
        Messages: allMessages,
        emoticonUrl: allEmoticon,
        mediaData: allMedia, // 빈 배열로 기본값 설정
      };
    };

    const updatedMessages = funcSendMessage(parsedMessagesRef.current);
    setParsedMessages(updatedMessages);
    parsedMessagesRef.current = updatedMessages;
  }

  function setFullHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  const loadEmoticons = async () => {
    try {
      const response = await fetchEmoticonGroups();
      setEmoticonGroupInfoList(response.data.emoticonGroupInfoList);
    } catch (error) {
      console.error('Error fetching emoticon groups:', error);
    }
  };

  //#region HeaderChat handler
  const handleMoreClick = () => {
    console.log('더보기 버튼 클릭');
  };

  const handleToggleBackground = () => {
    console.log('배경 보기/숨기기 버튼 클릭');
    SetHideChat(!isHideChat);
  };

  const sendMessage = async (reqSendChatMessage: SendChatMessageReq) => {
    try {
      const response = await sendMessageAsync(reqSendChatMessage);
      if ('streamKey' in response) {
        // 성공적인 응답 처리
        saveChatStreamInfo(reqSendChatMessage, response);
      } else if ('resultCode' in response) {
        // 오류 응답 처리
        if (response.resultCode === 13) {
          isSendingMessage.current = false;
          SetChatLoading(false);
          setNotEnoughRubyPopupOpen(true);
        }
      }
    } catch (error) {
      console.error(error);
      handleSendMessage(`${ESystemError.syserr_chatting_send_post}`, false, false, false);

      SetChatLoading(false);
    }
  };

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
              Messages: prev.Messages.filter(msg => !checkChatSystemError(msg.text)),
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

  const SetChatLoading = (bool: boolean) => {
    setIsLoading(bool);
  };

  return (
    <>
      {/*
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <meta name="description" content="채팅 페이지" />
          <meta name="author" content="당신의 이름" />
        </Head>
      */}

      <main className={styles.chatmodal}>
        <div className={styles.overlayContainer}>
          <TopBar
            onBackClick={handleBackClick}
            onMoreClick={handleMoreClick}
            iconUrl={characterImageUrl ?? ''}
            isHideChat={isHideChat}
            isBlurOn={isBlurOn}
          />
          {floatingNextEpisode && !isHideChat && (
            <ChatFloatingArea
              episodeName={`${nextEpisodeName} 이동 버튼`}
              onNavigate={handlePopupYes}
              isBlurOn={isBlurOn}
            /> // TODO nextEpisodeId 대신 에피소드 이름으로 변경 (서버 작업 후)
          )}
          <ChatArea
            messages={parsedMessages!}
            bgUrl={enterData?.episodeBgImageUrl ?? ''}
            characterUrl={characterImageUrl ?? ''}
            iconUrl={characterImageUrl ?? ''}
            isHideChat={isHideChat}
            onToggleBackground={handleToggleBackground}
            isLoading={isLoading} // 로딩 상태를 ChatArea에 전달
            setBlurOn={SetIsBlurOn}
            chatBarCount={chatBarCount}
            aiChatHeight={aiChatHeight}
            transitionEnabled={isTransitionEnable}
            send={sendMessage}
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
          isBlurOn={isBlurOn}
          onToggleBackground={handleToggleBackground}
          onLoading={SetChatLoading}
          onUpdateChatBarCount={SetChatBarCount}
          onUpdateAiChatBarCount={SetAiChatHeight}
          onReqPrevChatting={setReqPrevCheat}
          isSendingMessage={isSendingMessage}
          send={sendMessage}
          onRemoveChat={removeParsedMessage}
          onCheatChangeDate={handleChangeNewDate}
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
    </>
  );
};

export default ChatPage;
