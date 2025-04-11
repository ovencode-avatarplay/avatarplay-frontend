import {
  ChatResultInfo,
  EmoticonGroupInfo,
  fetchEmoticonGroups,
  retryStream,
  SendChatMessageReq,
  SendChatMessageResError,
  SendChatMessageResSuccess,
  sendChattingResult,
  sendMessageStream,
  TriggerNextEpisodeInfo,
} from '@/app/NetWork/ChatNetwork';
import {checkChatSystemError, ESystemError} from '@/app/NetWork/ESystemError';
import {useEffect, useRef, useState} from 'react';
import {MediaData, Message, MessageGroup, SenderType, TriggerMediaState} from '../MainChat/ChatTypes';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {setRegeneratingQuestion} from '@/redux-store/slices/ModifyQuestion';
import {
  cleanString,
  cleanStringFinal,
  getCurrentLocaleTime,
  isAnotherSenderType,
  isFinishMessage,
  isSameSenderType,
  isUserNarration,
  parsedUserNarration,
  parseMessage,
  timeParser,
} from '../MainChat/MessageParser';
import {TriggerActionType} from '@/redux-store/slices/StoryInfo';
import {addNewDateMessage, compareDates, NewDateType, refreshNewDateAll, shiftDates} from '../MainChat/NewDate';
import {getWebBrowserUrl, QueryParams} from '@/utils/browserInfo';
import {preventZoom, useBackHandler} from '@/utils/util-1';
import {ChattingState, setStateChatting} from '@/redux-store/slices/Chatting';
import usePrevChatting from '../MainChat/PrevChatting';

const useChat = () => {
  const TempIdforSendQuestion: number = -222; // sendQuestion 할때 할당되지 않은 기본 값.
  const [parsedMessages, setParsedMessages] = useState<MessageGroup>({
    Messages: [],
    emoticonUrl: [],
    mediaData: [],
  });
  const parsedMessagesRef = useRef(parsedMessages);
  const [hasFetchedPrevMessages, setHasFetchedPrevMessages] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  //const [streamKey, setStreamKey] = useState<string>(''); // streamKey 상태 추가
  //const [retryStreamKey, setRetryStreamKey] = useState<string>(''); // streamKey 상태 추가
  const [chatId, setChatId] = useState<number>(TempIdforSendQuestion);
  const [isNarrationActive, setIsNarrationActive] = useState<{active: boolean}>({active: false}); // 나레이션 활성화 상태
  const [currentParsingSender, setCurrentParsingSender] = useState<{current: SenderType}>({current: SenderType.User}); // 현재 파싱중인 sender 상태
  const [nextEpisodeId, setNextEpisodeId] = useState<number | null>(null); // 다음 에피소드 ID 상태 추가
  const [nextEpisodeName, setNextEpisodeName] = useState<string | null>(null); // 다음 에피소드 이름
  const [isBlurOn, SetIsBlurOn] = useState<boolean>(false);
  const [isIdEnter, setIsIdEnter] = useState<boolean>(false);
  const [chatBarCount, setChatBarCount] = useState<number>(1);
  const [aiChatHeight, setAiChatHeight] = useState<number>(0);
  const [nextPopupData, setNextPopupData] = useState<TriggerNextEpisodeInfo>();

  const [isTransitionEnable, setIsTransitionEnable] = useState<boolean>(false);
  const [isReqPrevCheat, setReqPrevCheat] = useState<boolean>(false); // 치트키로 애피소드 초기화.
  const [isRenderComplete, setRenderComplete] = useState<boolean>(false);
  const [characterImageUrl, setCharacterImageUrl] = useState<string | undefined>('');
  const QueryKey = QueryParams.ChattingInfo;
  const key = getWebBrowserUrl(QueryKey) || null;
  // console.log('getWebBrowserUrl', key);

  const episodeId = useSelector((state: RootState) => state.chatting.episodeId);
  const StoryId = useSelector((state: RootState) => state.chatting.storyId);
  const characterId = useSelector((state: RootState) => state.chatting.characterId);
  const shortsId = useSelector((state: RootState) => state.chatting.StoryUrl);
  const [isNotEnoughRubyPopupOpen, setNotEnoughRubyPopupOpen] = useState(false); // 팝업 상태 추가
  //const [isSendingMessage, setIsSendingMessage] = useState({state: false}); // 메시지 전송 상태 (렌더링과 관계 없을때 사용가능한 useState 형태)
  const isSendingMessage = useRef<boolean>(false); // useRef로 메시지 전송 상태 관리

  const [lastMessage, setLastMessage] = useState<Message>({
    chatId: TempIdforSendQuestion,
    text: '',
    sender: SenderType.System,
    createDateString: '',
    createDateLocale: new Date('2024-12-17T10:30:00Z'),
    isLike: false, // 말풍선 like
    bubbleIndex: 0,
  });

  const handleBackClick = useBackHandler();
  const dispatch = useDispatch();
  // useEffect(() => {}, [isLoading]);

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
  const handleRerender = (isComplete: boolean) => {
    setRenderComplete(isComplete);
  };
  const {prevMessages: enterData} = usePrevChatting(episodeId, isReqPrevCheat, handleRerender, isIdEnter);

  useEffect(() => {
    if (parsedMessages.Messages.length > 0) {
      const lastMsg = parsedMessages.Messages[parsedMessages.Messages.length - 1];
      setLastMessage(lastMsg);
    }
    parsedMessagesRef.current = parsedMessages;
  }, [parsedMessages]);

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

  const handleChangeNewDate = (cheat: string) => {
    switch (cheat) {
      case '⦿YEAR⦿':
        const messageGroupYear = shiftDates(NewDateType.YEAR, parsedMessages);
        setParsedMessages(messageGroupYear);
        break;
      case '⦿MONTH⦿':
        const messageGroupMonth = shiftDates(NewDateType.MONTH, parsedMessages);
        setParsedMessages(messageGroupMonth);
        break;
      case '⦿DAY⦿':
        const messageGroupDay = shiftDates(NewDateType.DAY, parsedMessages);
        setParsedMessages(messageGroupDay);
        break;
      case '⦿REFRESH_NEW_DAY⦿': // 현재상태에서 모든 시간 말풍선을 갱신한다.
        const messageGroupRefresh = refreshNewDateAll(parsedMessages);
        setParsedMessages(messageGroupRefresh);
        break;
    }
  };

  //#endregion

  //#region  다음 에피소드 넘어가기
  const navigateToNextEpisode = async (episodeId: number) => {
    console.log(`Navigating to episode ID: ${episodeId}`);

    const chattingState: ChattingState = {
      storyName: `content episode${episodeId}`,
      episodeName: `episode${episodeId}`,
      storyId: Number(StoryId),
      characterId: Number(characterId),
      episodeId: Number(episodeId),
      StoryUrl: shortsId,
    };
    dispatch(setStateChatting(chattingState));
    setIsTransitionEnable(true);
    setIsIdEnter(true);
    setFloatingNextEpisode(false);
  };

  const handlePopupYes = () => {
    if (isSendingMessage.current) {
      console.log('메세지 중에는 넘어가지 않습니다');
      return;
    }
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

  //#endregion

  useEffect(() => {
    if (
      (!hasFetchedPrevMessages && enterData && (enterData?.prevMessageInfoList || enterData?.introPrompt.length > 0)) ||
      (nextEpisodeId != null && enterData?.episodeId === nextEpisodeId) ||
      isReqPrevCheat === true ||
      isRenderComplete === true
    ) {
      let arrayIndex: number = 0;
      // flatMap을 통해 parsedPrevMessages를 생성
      // parsedPrevMessages와 emoticonUrl을 동시에 생성하여 위치와 길이를 맞춤
      const {parsedPrevMessages, emoticonUrl, mediaData} = enterData?.prevMessageInfoList.reduce<{
        parsedPrevMessages: Message[];
        emoticonUrl: string[];
        mediaData: MediaData[];
      }>(
        (acc, msg, indexCurrent, array) => {
          let prevDate: Date | null = null;
          if (indexCurrent > 0) prevDate = array[indexCurrent - 1].createAt;

          // 메시지 파싱
          const parsedMessages = parseMessage(msg, prevDate) || [];

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
              createDateString: createDate,
              createDateLocale: new Date(),
              isLike: false, // 말풍선 like
              bubbleIndex: arrayIndex,
            };
            acc.parsedPrevMessages.push(defaultMessages);
            acc.emoticonUrl.push(emoticonValue);
            acc.mediaData.push(mediaDataValue); // 기본값 추가
          }

          arrayIndex++;
          return acc;
        },
        {parsedPrevMessages: [], emoticonUrl: [], mediaData: []},
      ) || {parsedPrevMessages: [], emoticonUrl: [], mediaData: []};

      const introPrompt2: Message = {
        chatId: chatId,
        text: enterData?.introPrompt || '애피소드 도입부가 설정되지 않았습니다',
        sender: SenderType.IntroPrompt,
        createDateString: '',
        createDateLocale: new Date(),
        isLike: false, // 말풍선 like
        bubbleIndex: 0,
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

      // enter 했을 때 에피소드 이동 트리거 발동기록 확인
      if (enterData?.nextEpisodeId && enterData.nextEpisodeId > 0) {
        setNextEpisodeId(enterData.nextEpisodeId);
        setNextEpisodeName(enterData.nextEpisodeName);
        setFloatingNextEpisode(true);
      }
    }
  }, [enterData, hasFetchedPrevMessages, isReqPrevCheat, isRenderComplete]);

  const sendMessageAsync = async (reqSendChatMessage: SendChatMessageReq) => {
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
    return response;
  };

  return {
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
    //setIsSendingMessage,

    setChatId,
    isRegeneratingQuestion,
    regenerateQuestion,

    //setRetryStreamKey,

    episodeId,
    sendMessageAsync,
    //saveChatStreamInfo,
  };
};

export default useChat;
