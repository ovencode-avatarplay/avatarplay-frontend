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
  cleanString,
  isFinishMessage,
  isUserNarration,
  parsedUserNarration,
  parseMessage,
  isAnotherSenderType,
  isSameSenderType,
  cleanStringFinal,
  timeParser,
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
import {TriggerSubDataType} from '@/types/apps/DataTypes';
import {checkChatSystemError, ESystemError} from '@/app/NetWork/ESystemError';

const ChatPage: React.FC = () => {
  const TempIdforSendQuestion: number = -222;
  const [parsedMessages, setParsedMessages] = useState<MessageGroup>({Messages: [], emoticonUrl: [], mediaData: []});
  const parsedMessagesRef = useRef(parsedMessages);
  const [hasFetchedPrevMessages, setHasFetchedPrevMessages] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [streamKey, setStreamKey] = useState<string>(''); // streamKey 상태 추가
  const [retryStreamKey, setRetryStreamKey] = useState<string>(''); // streamKey 상태 추가
  const [chatId, setChatId] = useState<number>(TempIdforSendQuestion);
  const [isNarrationActive, setIsNarrationActive] = useState<{active: boolean}>({active: false}); // 나레이션 활성화 상태
  const [currentParsingSender, setCurrentParsingSender] = useState<{current: SenderType}>({current: SenderType.User}); // 현재 파싱중인 sender 상태
  const [nextEpisodeId, setNextEpisodeId] = useState<number | null>(null); // 다음 에피소드 ID 상태 추가
  const [nextEpisodeName, setNextEpisodeName] = useState<string | null>(null); // 다음 에피소드 이름
  const [isHideChat, SetHideChat] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // 로딩 상태 추가
  const [isIdEnter, setIsIdEnter] = useState<boolean>(false); // 로딩 상태 추가
  const [chatBarCount, setChatBarCount] = useState<number>(1); // 로딩 상태 추가
  const [aiChatHeight, setAiChatHeight] = useState<number>(0); // 로딩 상태 추가
  const [nextPopupData, setNextPopupData] = useState<TriggerNextEpisodeInfo>();

  const [isTransitionEnable, setIsTransitionEnable] = useState<boolean>(false); // 로딩 상태 추가
  const [isReqPrevCheat, setReqPrevCheat] = useState<boolean>(false); // 치트키로 애피소드 초기화.
  const [isRenderComplete, setRenderComplete] = useState<boolean>(false);
  const [characterImageUrl, setCharacterImageUrl] = useState<string | undefined>('');
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
    sender: SenderType.System,
    createDate: '',
  });

  const handleBackClick = useBackHandler();
  const dispatch = useDispatch();
  // useEffect(() => {}, [isLoading]);
  const SetChatLoading = (bool: boolean) => {
    setIsLoading(bool);
  };

  const SetChatBarCount = (num: number) => {
    setChatBarCount(num);
  };

  const SetAiChatHeight = (num: number) => {
    setAiChatHeight(num);
  };

  // floatingArea
  const [floatingNextEpisode, setFloatingNextEpisode] = useState<boolean>(false);

  //#region 메세지 전송 로직
  const isRegeneratingQuestion = useSelector((state: RootState) => state.modifyQuestion.isRegeneratingQuestion);
  const regenerateQuestion = useSelector((state: RootState) => state.modifyQuestion.regeneratingQuestion);

  const getCurrentLocaleTime = (): string => {
    const currentDate = new Date();

    // 시간 포맷을 직접 생성
    const hours = currentDate.getHours(); // 시
    const minutes = currentDate.getMinutes(); // 분
    const isPM = hours >= 12; // 오후 여부 확인

    // 12시간 형식으로 변환
    const formattedHours = hours % 12 || 12; // 0을 12로 바꿔줌
    const formattedMinutes = minutes.toString().padStart(2, '0'); // 항상 2자리 숫자
    const period = isPM ? 'pm' : 'am'; // AM/PM 결정

    // 결과 문자열
    const timeString = `${formattedHours}:${formattedMinutes} ${period}`;

    console.log(timeString); // 예: "3:49 pm"

    return timeString;
  };
  const Send = async (reqSendChatMessage: SendChatMessageReq) => {
    try {
      // console.log('sendParsedMessageStartRef:', parsedMessagesRef);

      const currentMessages = parsedMessagesRef.current.Messages;
      const filteredMessages = currentMessages.filter(msg => !checkChatSystemError(msg.text));

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
      handleSendMessage(`${ESystemError.syserr_chatting_send_post}`, false, false, false);

      SetChatLoading(false);
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
        setIsLoading(false);
        if (!event.data) {
          throw new Error('Received null or empty data');
        }

        const newMessage = JSON.parse(event.data);
        handleSendMessage(newMessage, false, true, false);
        //console.log('stream new text====' + newMessage + '====');
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
      handleSendMessage(`${ESystemError.syserr_chat_stream_error}`, false, false, false);
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

  const handleSendMessage = async (
    message: string,
    isMyMessage: boolean,
    isClearString: boolean,
    isShowDate: boolean,
  ) => {
    if (!message || typeof message !== 'string') return;
    let currentTime: string = getCurrentLocaleTime();

    let isFinish = false;
    const currentSender = currentParsingSender.current;
    const mediaMessages: Message = {
      chatId: -1,
      text: '.',
      sender: SenderType.media,
      createDate: currentTime,
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
      createDate: currentTime,
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
          tempAllMessage[tempAllMessage.length - 1].createDate = currentTime;
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
            createDate: isPrintDate ? currentTime : '', // 시스템 메시지에는 시간을 출력하지 않는다.
          };

          resultSystemMessages.text = triggerInfo.systemText.replace(/^%|%$/g, '');
          allMessage.push(resultSystemMessages); // Media 관련 메시지 추가
          allEmoticon.push(''); // 빈 이모티콘 추가
          allMedia.push(noneMedia); // 새 미디어 추가

          switch (triggerInfo.type as TriggerSubDataType) {
            case TriggerSubDataType.EpisodeChange:
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
            case TriggerSubDataType.ChangePrompt:
              break;
            case TriggerSubDataType.GetIntimacyPoint:
              break;
            case TriggerSubDataType.ChangeCharacter:
              // 캐릭터 변경 처리
              if (
                triggerInfo.triggerActionInfo.changeCharacterInfo &&
                characterImageUrl !== triggerInfo.triggerActionInfo.changeCharacterInfo.imageUrl
              ) {
                setCharacterImageUrl(triggerInfo.triggerActionInfo.changeCharacterInfo.imageUrl);
              }
              break;
            case TriggerSubDataType.PlayMedia:
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

    const func = (prev: any) => {
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
        const newDateMessage: Message = parsedUserNarration(newMessage);
        newDateMessage.sender = SenderType.NewDate;
        newDateMessage.text = 'july 23';
        allMessages.push(newDateMessage);
        allEmoticon.push('');
        allMedia.push(mediaDataValue);

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
        console.log('newMessage.text :' + newMessage.text);
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
              createDate: currentTime,
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

    const updatedMessages = func(parsedMessagesRef.current);
    setParsedMessages(updatedMessages);
    parsedMessagesRef.current = updatedMessages;
  };

  //#endregion

  //#region 프론트에서 메시지 삭제 로직

  const removeParsedMessage = (removeId: number) => {
    const filteredMessages = parsedMessagesRef.current.Messages.filter(
      message => message.chatId !== removeId, // 해당 id만 삭제
    );

    const updatedParsedMessages = {
      ...parsedMessagesRef.current,
      Messages: filteredMessages,
    };

    setParsedMessages(updatedParsedMessages);
    parsedMessagesRef.current = updatedParsedMessages;
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
        console.log('stream new text====' + newMessage + '====');
        handleSendMessage(newMessage, false, true, false);
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
    setFloatingNextEpisode(false);
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
    setFloatingNextEpisode(true);
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
      const {parsedPrevMessages, emoticonUrl, mediaData} = enterData?.prevMessageInfoList.reduce<{
        parsedPrevMessages: Message[];
        emoticonUrl: string[];
        mediaData: MediaData[];
      }>(
        (acc, msg) => {
          // 메시지 파싱
          const parsedMessages = parseMessage(msg) || [];

          acc.parsedPrevMessages.push(...parsedMessages);

          // 이모티콘 URL 추가
          const emoticonValue = msg.emoticonUrl || '';
          acc.emoticonUrl.push(...Array(parsedMessages.length).fill(emoticonValue));

          // MediaData 구성
          let mediaType = TriggerMediaState.None;
          switch (msg.triggerMediaState) {
            case 1:
              mediaType = TriggerMediaState.TriggerImage;
              break;
            case 2:
              mediaType = TriggerMediaState.TriggerVideo;
              break;
            case 3:
              mediaType = TriggerMediaState.TriggerAudio;
              break;
            default:
              mediaType = TriggerMediaState.None;
          }

          const mediaDataValue = {
            mediaType: mediaType,
            mediaUrlList: msg.mediaUrlList || [],
          };

          if (parsedMessages.length > 0) {
            acc.mediaData.push(...Array(parsedMessages.length));
            acc.mediaData[acc.mediaData.length - 1] = mediaDataValue;
          } else if (mediaType != TriggerMediaState.None) {
            let createDate: string = timeParser(msg.createAt);
            const defaultMessages: Message = {
              chatId: -1,
              text: '.',
              sender: SenderType.media,
              createDate: createDate,
            };
            acc.parsedPrevMessages.push(defaultMessages);
            acc.emoticonUrl.push(emoticonValue);
            acc.mediaData.push(mediaDataValue); // 기본값 추가
          }

          return acc;
        },
        {parsedPrevMessages: [], emoticonUrl: [], mediaData: []},
      ) || {parsedPrevMessages: [], emoticonUrl: [], mediaData: []};

      const introPrompt2: Message = {
        chatId: chatId,
        text: enterData?.introPrompt || '애피소드 도입부가 설정되지 않았습니다',
        sender: SenderType.IntroPrompt,
        createDate: '',
      };

      // emoticonUrl.unshift('');
      // const defaultMediaData: MediaData = {
      //   mediaType: TriggerMediaState.None, // 미디어 타입이 없는 상태를 나타냄
      //   mediaUrlList: [], // 빈 배열로 초기화
      // };
      // mediaData.unshift(defaultMediaData);
      const messageInfo: MessageGroup = {
        Messages: parsedPrevMessages, // Message 배열
        emoticonUrl: emoticonUrl, // 이모티콘 URL
        mediaData: mediaData,
      };
      setParsedMessages(messageInfo);
      setHasFetchedPrevMessages(true);
      //에피소드 변경 상황
      if (nextEpisodeId != null && enterData?.episodeId === nextEpisodeId) {
        setNextEpisodeId(null);
        setIsIdEnter(false);
      }
      if (isReqPrevCheat === true) setReqPrevCheat(false);

      setCharacterImageUrl(enterData?.characterImageUrl);
      const loadEmoticons = async () => {
        try {
          const response = await fetchEmoticonGroups();
          setEmoticonGroupInfoList(response.data.emoticonGroupInfoList);
        } catch (error) {
          console.error('Error fetching emoticon groups:', error);
        }
      };
      // loadEmoticons();

      // enter 했을 때 에피소드 이동 트리거 발동기록 확인
      if (enterData?.nextEpisodeId && enterData.nextEpisodeId > 0) {
        setNextEpisodeId(enterData.nextEpisodeId);
        setNextEpisodeName(enterData.nextEpisodeName);
        setFloatingNextEpisode(true);
      }
    }
  }, [enterData, hasFetchedPrevMessages, isReqPrevCheat, isRenderComplete]);

  return (
    <main className={styles.chatmodal}>
      <div className={styles.overlayContainer}>
        <TopBar
          onBackClick={handleBackClick}
          onMoreClick={handleMoreClick}
          iconUrl={characterImageUrl ?? ''}
          isHideChat={isHideChat}
        />
        {floatingNextEpisode && !isHideChat && (
          <ChatFloatingArea episodeName={`${nextEpisodeName} 이동 버튼`} onNavigate={handlePopupYes} /> // TODO nextEpisodeId 대신 에피소드 이름으로 변경 (서버 작업 후)
        )}
        <ChatArea
          messages={parsedMessages!}
          bgUrl={enterData?.episodeBgImageUrl ?? ''}
          characterUrl={characterImageUrl ?? ''}
          iconUrl={characterImageUrl ?? ''}
          isHideChat={isHideChat}
          onToggleBackground={handleToggleBackground}
          isLoading={isLoading} // 로딩 상태를 ChatArea에 전달
          chatBarCount={chatBarCount}
          aiChatHeight={aiChatHeight}
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
        onUpdateAiChatBarCount={SetAiChatHeight}
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
