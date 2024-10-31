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
import {useEmojiCache} from './Chat/BottomBar/EmojiCacheContext';

interface Message {
  text: string;
  sender: 'user' | 'partner' | 'narration' | 'system' | 'introPrompt';
}

const ChatPage: React.FC = () => {
  const [parsedMessages, setParsedMessages] = useState<Message[]>([]);
  const [hasFetchedPrevMessages, setHasFetchedPrevMessages] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupTitle, setPopupTitle] = useState<string>('');
  const [popupQuestion, setPopupQuestion] = useState<string>('');
  const [streamKey, setStreamKey] = useState<string>(''); // streamKey 상태 추가
  const [isNarrationActive, setIsNarrationActive] = useState<{active: boolean}>({active: false}); // 나레이션 활성화 상태
  const [nextEpisodeId, setNextEpisodeId] = useState<number | null>(null); // 다음 에피소드 ID 상태 추가

  const userId = useSelector((state: RootState) => state.user.userId);
  const episodeId = useSelector((state: RootState) => state.chatting.episodeId);
  const shortsId = useSelector((state: RootState) => state.chatting.shortsId);
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

  const handleSendMessage = async (message: string, isMyMessage: boolean) => {
    if (!message || typeof message !== 'string') return;

    // 메시지가 '$'을 포함할 경우 팝업 표시
    if (isMyMessage === false && message.includes('$')) {
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
      text: message,
      sender: isMyMessage ? 'user' : isNarrationActive.active ? 'narration' : 'partner',
    };

    setParsedMessages(prev => {
      // 유저의 메시지면 나레이션모드를 초기화 하자!!
      if (isMyMessage) isNarrationActive.active = false;

      const newMessages = [...prev];

      if (newMessage.text.length === 0) return newMessages;

      // 문자열을 split 해서 따로 처리해야 하는지 확인
      newMessage.text = cleanString(newMessage.text); // 없앨 부분 없애줌

      const splitMessage = splitByAsterisk(newMessage.text);
      const splitMessageLeft = splitMessage.beforeAsterisk;
      const splitMessageRight = splitMessage.afterAsterisk;

      // 시스템 메시지
      const systemMessageSignCount = (newMessage.text.match(/%/g) || []).length;

      if (isMyMessage === false && systemMessageSignCount && systemMessageSignCount >= 2) {
        // % 문자는 제거하고 시스템 메시지로 출력해주고 빠져나가자.
        const newMessageSystem: Message = {
          text: newMessage.text,
          sender: 'system',
        };
        newMessageSystem.text = newMessageSystem.text.replace(/%/g, '');
        newMessages.push(newMessageSystem);
        return newMessages; // 업데이트된 메시지 배열 반환
      }
      // 내 메시지
      if (isMyMessage === true) {
        newMessages.push(newMessage);
      }
      // 상대 메시지
      else {
        if (isIncludeAsterisk === true) {
          // 먼저 왼쪽을 기존 말풍선에 출력시킨다
          if (splitMessageLeft.length > 0) newMessages[newMessages.length - 1].text += `${splitMessageLeft}`;

          // 오른쪽에서 또 *가 포함되어 있는지 검사한다.
          if (splitMessageRight.includes('*')) {
            const splitMessage2 = splitByAsterisk(splitMessageRight);
            const splitMessageLeft2 = splitMessage2.beforeAsterisk;
            const splitMessageRight2 = splitMessage2.afterAsterisk;

            // 나레이션 상태를 바꿔준다
            isNarrationActive.active = !isNarrationActive.active;
            const newMessage2: Message = {
              text: splitMessageLeft2,
              sender: isMyMessage ? 'user' : isNarrationActive.active ? 'narration' : 'partner',
            };

            // 또 왼쪽을 출력시킨다.
            if (splitMessageLeft2.length > 0) {
              if (newMessages[newMessages.length - 1].sender !== newMessage2.sender) {
                newMessages.push(newMessage);
              }
            }

            // 나레이션 상태를 바꿔준다
            isNarrationActive.active = !isNarrationActive.active;

            // 오른쪽을 출력한다.
            if (splitMessageRight2.length > 0) {
              const newMessage3: Message = {
                text: splitMessageLeft2,
                sender: isMyMessage ? 'user' : isNarrationActive.active ? 'narration' : 'partner',
              };
              newMessages.push(newMessage3);
            }
          } else {
            // 나레이션 상태를 바꿔준다
            isNarrationActive.active = !isNarrationActive.active;

            const newMessage4: Message = {
              text: splitMessageRight,
              sender: isMyMessage ? 'user' : isNarrationActive.active ? 'narration' : 'partner',
            };

            if (newMessage4.text.length > 0) newMessages.push(newMessage4);
            // 기존 말풍선에 내용 출력을 출력해준다
            //if (splitMessageRight.length > 0) newMessages[newMessages.length - 1].text += `${splitMessageRight}`;
          }
        } else {
          // Asterisk가 포함되지 않았을 때.
          const newMessage5: Message = {
            text: newMessage.text,
            sender: isMyMessage ? 'user' : isNarrationActive.active ? 'narration' : 'partner',
          };
          if (newMessage5.text !== ' ') {
            // 기존 sender와 다르면 새 말풍선으로..
            if (newMessages[newMessages.length - 1].sender !== newMessage5.sender) {
              if (newMessage5.text.length > 0) {
                newMessages.push(newMessage5);
              }
            }
            // 같은 sender면 같은 말풍선에 출력
            else if (newMessage5.text.length > 0) {
              newMessages[newMessages.length - 1].text += `${newMessage5.text}`;
            }
          }
        }
      }

      return newMessages; // 업데이트된 메시지 배열 반환
    });
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
  const {resetCache} = useEmojiCache();
  const navigateToNextEpisode = async (episodeId: number) => {
    console.log(`Navigating to episode ID: ${episodeId}`);

    const requestData: EnterEpisodeChattingReq = {
      userId: userId,
      episodeId: episodeId,
    };

    try {
      resetCache(); // 캐시 초기화
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
          shortsId: shortsId,
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
  //console.log('usePrevChatting ', {enterData, error});
  //console.log('curEpId ', {episodeId});
  episodeId;
  useEffect(() => {
    if (
      !hasFetchedPrevMessages &&
      !error &&
      enterData?.prevMessageInfoList //&&
      //enterData.prevMessageInfoList.length > 0
    ) {
      const parsedPrevMessages = enterData.prevMessageInfoList.flatMap(msg => parseMessage(msg.message) || []);

      const introPrompt2: Message = {
        text: enterData?.introPrompt || '애피소드 도입부가 설정되지 않았습니다',
        sender: 'introPrompt',
      };

      parsedPrevMessages.unshift(introPrompt2);

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
      <ChatArea
        messages={parsedMessages}
        bgUrl={enterData?.episodeBgImageUrl ?? ''}
        iconUrl={enterData?.iconImageUrl ?? ''}
      />
      <BottomBar
        onSend={handleSendMessage}
        streamKey={streamKey}
        setStreamKey={setStreamKey}
        EmoticonData={enterData?.emoticonGroupInfoList || []}
      />

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
