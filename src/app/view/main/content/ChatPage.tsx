import React, {useEffect, useState} from 'react';
import TopBar from '@chats/TopBar/HeaderChat';
import BottomBar from '@chats/BottomBar/FooterChat';
import ChatArea from '@chats/MainChat/ChatArea';
import styles from '@chats/Styles/StyleChat.module.css';
import {useBackHandler} from 'utils/util-1';
import usePrevChatting from '@chats/MainChat/PrevChatting';
import {RootState} from '@/redux-store/ReduxStore';
import {parseMessage} from '@chats/MainChat/MessageParser';
import PopUpYesOrNo from '@/components/popup/PopUpYesOrNo';
import {sendChattingResult, sendChattingEnter, EnterEpisodeChattingReq} from '@/app/NetWork/ChatNetwork';
import {setStateChatting, ChattingState} from '@/redux-store/slices/chatting';
import {useDispatch, useSelector} from 'react-redux';

interface Message {
  text: string;
  sender: 'user' | 'partner' | 'narration';
}

const ChatPage: React.FC = () => {
  const [parsedMessages, setParsedMessages] = useState<Message[]>([]);
  const [isParsing, setParsingState] = useState<boolean>(true);
  const [hasFetchedPrevMessages, setHasFetchedPrevMessages] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupTitle, setPopupTitle] = useState<string>('');
  const [popupQuestion, setPopupQuestion] = useState<string>('');
  const [streamKey, setStreamKey] = useState<string>(''); // streamKey 상태 추가
  const [isNarrationActive, setIsNarrationActive] = useState<{active: boolean}>({active: false}); // 나레이션 활성화 상태
  const [nextEpisodeId, setNextEpisodeId] = useState<number | null>(null); // 다음 에피소드 ID 상태 추가

  const userId = useSelector((state: RootState) => state.user.userId);
  const episodeId = useSelector((state: RootState) => state.chatting.episodeId);
  const handleBackClick = useBackHandler();
  const dispatch = useDispatch();
  const cleanString = (input: string): string => {
    // 1. 개행 문자 제거
    let cleaned = input.replace(/\n/g, '');

    // 2. 마지막 글자가 '#'이면 제거
    // if (cleaned.endsWith('#')) {
    //   cleaned = cleaned.slice(0, -1);
    // }

    return cleaned;
  };

  const handleSendMessage = async (message: string, isMyMessage: boolean, isParsing: boolean) => {
    console.log('new:', message);

    if (!message || typeof message !== 'string') return;

    // 메시지가 '$'을 포함할 경우 팝업 표시
    if (message.includes('$')) {
      const requestData = {
        streamKey: streamKey, // streamKey 상태에서 가져오기
      };

      try {
        const response = await sendChattingResult(requestData);
        console.log('Result API Response:', response);
        if (response.data.nextEpisodeId !== 0) {
          setNextEpisodeId(response.data.nextEpisodeId); // 다음 에피소드 ID 저장
          setPopupTitle('알림');
          setPopupQuestion('이 작업을 수행하시겠습니까?');
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
    const isIncludeAsterisk: boolean = message.includes('*');

    //if (isNewWordBallon) isNarrationActive.active = !isNarrationActive.active;

    // 나레이션 활성화 상태에 따라 sender 설정
    const newMessage: Message = {
      text: isParsing ? `파싱된 메시지: ${message}` : message,
      sender: isMyMessage ? 'user' : isNarrationActive.active ? 'narration' : 'partner',
    };

    setParsedMessages(prev => {
      // 유저의 메시지면 나레이션모드를 초기화 하자!!
      if (isMyMessage) isNarrationActive.active = false;

      const newMessages = [...prev];

      // 문자열을 split 해서 따로 처리해야 하는지 확인
      newMessage.text = cleanString(newMessage.text); // 없앨 부분 없애줌

      const splitMessage = splitByAsterisk(newMessage.text);
      const splitMessageLeft = splitMessage.beforeAsterisk;
      const splitMessageRight = splitMessage.afterAsterisk;

      console.log('전체====' + newMessage.text + '====' + '나레이션 상태: ' + isNarrationActive.active);
      console.log('좌====' + splitMessageLeft + '====');
      console.log('우====' + splitMessageRight + '====');

      // 내 메시지
      if (isMyMessage === true) {
        newMessages.push(newMessage);
      }
      // 상대 메시지
      else {
        // 기존 말풍선에 추가
        newMessages[newMessages.length - 1].text += `${splitMessageLeft}`;

        if (isIncludeAsterisk === true) {
          isNarrationActive.active = !isNarrationActive.active;
          const newMessage2: Message = {
            text: isParsing ? `파싱된 메시지: ${splitMessageRight}` : splitMessageRight,
            sender: isMyMessage ? 'user' : isNarrationActive.active ? 'narration' : 'partner',
          };

          newMessages.push(newMessage2);
        }
      }

      return newMessages; // 업데이트된 메시지 배열 반환
    });

    // 파싱 상태 설정
    setParsingState(isParsing);
  };

  const splitByAsterisk = (splitMessage: string) => {
    // '*'을 기준으로 문자열을 나누기
    const parts = splitMessage.split('*');

    // 나눈 부분에서 앞과 뒤의 문자열을 반환
    return {
      beforeAsterisk: parts[0], // '*' 앞의 문자열
      afterAsterisk: parts.slice(1).join('*'), // '*' 뒤의 문자열 (여러 개의 '*'이 있을 수 있음)
    };
  };
  const navigateToNextEpisode = async (episodeId: number) => {
    console.log(`Navigating to episode ID: ${episodeId}`);

    const requestData: EnterEpisodeChattingReq = {
      userId: userId,
      episodeId: episodeId,
    };

    try {
      const response = await sendChattingEnter(requestData);

      if (response.resultCode === 0 && response.data) {
        console.log('Successfully entered episode:', response.data);

        const parsedPrevMessages = response.data.prevMessageInfoList.flatMap(msg => parseMessage(msg.message) || []);
        setParsedMessages(parsedPrevMessages);
        setHasFetchedPrevMessages(true);

        const chattingState: ChattingState = {
          contentName: `content episode${episodeId}`,
          episodeName: `episode${episodeId}`,
          episodeId: Number(episodeId),
        };
        dispatch(setStateChatting(chattingState));
      } else {
        console.error('Failed to enter episode:', response.resultMessage);
        alert('에피소드 진입에 실패했습니다: ' + response.resultMessage);
      }
    } catch (error) {
      console.error('Error entering episode:', error);

      // error 타입 확인
      if (error instanceof Error) {
        alert('에피소드 진입 중 오류가 발생했습니다: ' + error.message);
      } else {
        alert('에피소드 진입 중 알 수 없는 오류가 발생했습니다.');
      }
    }
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

  const handleMoreClick = () => {
    console.log('더보기 버튼 클릭');
  };

  const handleToggleBackground = () => {
    console.log('배경 보기/숨기기 버튼 클릭');
  };

  const {prevMessages: enterData, error} = usePrevChatting(userId, episodeId);
  console.log('usePrevChatting ', {enterData, error});
  console.log('curEpId ', {episodeId});
  episodeId;
  useEffect(() => {
    if (
      !hasFetchedPrevMessages &&
      !error &&
      enterData?.prevMessageInfoList &&
      enterData.prevMessageInfoList.length > 0
    ) {
      const parsedPrevMessages = enterData.prevMessageInfoList.flatMap(msg => parseMessage(msg.message) || []);
      setParsedMessages(parsedPrevMessages);
      setHasFetchedPrevMessages(true);
    }
  }, [error, enterData, hasFetchedPrevMessages]);

  return (
    <main className={styles.chatmodal}>
      <TopBar
        onBackClick={handleBackClick}
        onMoreClick={handleMoreClick}
        onToggleBackground={handleToggleBackground}
        iconUrl={enterData?.iconImageUrl ?? ''}
      />
      <ChatArea messages={parsedMessages} isParsing={isParsing} bgUrl={enterData?.episodeBgImageUrl ?? ''} />
      <BottomBar onSend={handleSendMessage} streamKey={streamKey} setStreamKey={setStreamKey} />

      {showPopup && (
        <PopUpYesOrNo
          title={popupTitle}
          question={popupQuestion}
          onYes={handlePopupYes}
          onNo={handlePopupNo}
          open={showPopup}
        />
      )}
    </main>
  );
};

export default ChatPage;
