import React, {useEffect, useState} from 'react';
import TopBar from '@chats/TopBar/HeaderChat';
import BottomBar from '@chats/BottomBar/FooterChat';
import ChatArea from '@chats/MainChat/ChatArea';
import styles from '@chats/Styles/StyleChat.module.css';
import {useBackHandler} from 'utils/util-1';
import usePrevChatting from '@chats/MainChat/PrevChatting';
import {RootState} from '@/redux-store/ReduxStore';
import {
  cleanString,
  isFinishMessage,
  isNarrationMessage,
  isSystemMessage,
  parseMessage,
  splitByAsterisk,
} from '@chats/MainChat/MessageParser';
import PopUpYesOrNo from '@/components/popup/PopUpYesOrNo';
import {
  sendChattingResult,
  sendChattingEnter,
  EnterEpisodeChattingReq,
  fetchEmoticonGroups,
  EmoticonGroupInfo,
  UrlEnterEpisodeChattingReq,
  sendChattingEnterUrl,
} from '@/app/NetWork/ChatNetwork';

import {setStateChatting, ChattingState} from '@/redux-store/slices/Chatting';
import {useDispatch, useSelector} from 'react-redux';
import {QueryParams, getWebBrowserUrl} from '@/utils/browserInfo';
import BottomNavData from 'data/navigation/bottom-nav.json';

interface Message {
  text: string;
  sender: 'user' | 'partner' | 'narration' | 'system' | 'introPrompt' | 'userNarration';
}

interface MessageGroup {
  Messages: Message[];
  emoticonUrl: string[];
}

const ChatPage: React.FC = () => {
  const [parsedMessages, setParsedMessages] = useState<MessageGroup>({Messages: [], emoticonUrl: []});
  const [hasFetchedPrevMessages, setHasFetchedPrevMessages] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupTitle, setPopupTitle] = useState<string>('');
  const [popupQuestion, setPopupQuestion] = useState<string>('');
  const [streamKey, setStreamKey] = useState<string>(''); // streamKey 상태 추가
  const [isNarrationActive, setIsNarrationActive] = useState<{active: boolean}>({active: false}); // 나레이션 활성화 상태
  const [nextEpisodeId, setNextEpisodeId] = useState<number | null>(null); // 다음 에피소드 ID 상태 추가
  const [isHideChat, SetHideChat] = useState<boolean>(false);

  const QueryKey = QueryParams.ChattingInfo;
  const key = getWebBrowserUrl(QueryKey) || null;
  console.log('getWebBrowserUrl', key);

  //const userId = useSelector((state: RootState) => state.user.userId);
  const episodeId = useSelector((state: RootState) => state.chatting.episodeId);
  const shortsId = useSelector((state: RootState) => state.chatting.contentUrl);
  const handleBackClick = useBackHandler();
  const dispatch = useDispatch();

  //#region Message send handler
  const handleSendMessage = async (message: string, isMyMessage: boolean) => {
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
    const isIncludeAsterisk: boolean = isNarrationMessage(message);

    //if (isNewWordBallon) isNarrationActive.active = !isNarrationActive.active;

    // 나레이션 활성화 상태에 따라 sender 설정
    const newMessage: Message = {
      text: message,
      sender: isMyMessage ? 'user' : isNarrationActive.active ? 'narration' : 'partner',
    };

    setParsedMessages(prev => {
      // 유저의 메시지면 나레이션모드를 초기화
      if (isMyMessage) isNarrationActive.active = false;

      // 이전 메시지 정보를 복사하고 메시지만 가져와 배열 업데이트 준비
      const allMessages = [...(prev?.Messages || [])];

      // 메시지가 비어있으면 반환
      if (newMessage.text.length === 0) return {Messages: allMessages, emoticonUrl: prev?.emoticonUrl || []};

      // 메시지 정리
      newMessage.text = cleanString(newMessage.text);

      const splitMessage = splitByAsterisk(newMessage.text);
      const splitMessageLeft = splitMessage.leftAsterisk;
      const splitMessageRight = splitMessage.rightAsterisk;

      // 시스템 메시지 처리
      if (isMyMessage === false && isSystemMessage(newMessage.text)) {
        const newMessageSystem: Message = {
          text: newMessage.text.replace(/%/g, ''),
          sender: 'system',
        };
        allMessages.push(newMessageSystem);
        return {Messages: allMessages, emoticonUrl: prev?.emoticonUrl || []};
      }

      // 내 메시지
      if (isMyMessage === true) {
        // newMessage.text가 *로 시작하고 끝나는 경우
        if (newMessage.text.startsWith('*') && newMessage.text.endsWith('*')) {
          newMessage.sender = 'userNarration';
          newMessage.text = newMessage.text.slice(1, -1); // 양 옆의 *를 제거
        } else {
          newMessage.sender = 'user'; // 일반 유저 메시지
        }

        allMessages.push(newMessage); // 메시지를 배열에 추가
      }

      // 상대 메시지 처리
      else {
        if (isIncludeAsterisk === true) {
          // 먼저 왼쪽을 기존 말풍선에 출력시킨다
          if (splitMessageLeft.length > 0) allMessages[allMessages.length - 1].text += `${splitMessageLeft}`;

          if (splitMessageRight.includes('*')) {
            const splitMessage2 = splitByAsterisk(splitMessageRight);
            const splitMessageLeft2 = splitMessage2.leftAsterisk;
            const splitMessageRight2 = splitMessage2.rightAsterisk;

            isNarrationActive.active = !isNarrationActive.active;
            const newMessage2: Message = {
              text: splitMessageLeft2,
              sender: isMyMessage ? 'user' : isNarrationActive.active ? 'narration' : 'partner',
            };

            if (splitMessageLeft2.length > 0) {
              if (allMessages[allMessages.length - 1].sender !== newMessage2.sender) {
                allMessages.push(newMessage);
              }
            }

            isNarrationActive.active = !isNarrationActive.active;

            if (splitMessageRight2.length > 0) {
              const newMessage3: Message = {
                text: splitMessageLeft2,
                sender: isMyMessage ? 'user' : isNarrationActive.active ? 'narration' : 'partner',
              };
              allMessages.push(newMessage3);
            }
          } else {
            isNarrationActive.active = !isNarrationActive.active;

            const newMessage4: Message = {
              text: splitMessageRight,
              sender: isMyMessage ? 'user' : isNarrationActive.active ? 'narration' : 'partner',
            };

            if (newMessage4.text.length > 0) allMessages.push(newMessage4);
          }
        } else {
          const newMessage5: Message = {
            text: newMessage.text,
            sender: isMyMessage ? 'user' : isNarrationActive.active ? 'narration' : 'partner',
          };
          if (newMessage5.text !== ' ') {
            if (allMessages[allMessages.length - 1].sender !== newMessage5.sender) {
              if (newMessage5.text.length > 0) {
                allMessages.push(newMessage5);
              }
            }
            // 같은 sender면 같은 말풍선에 출력
            else if (newMessage5.text.length > 0) {
              allMessages[allMessages.length - 1].text += `${newMessage5.text}`;
            }
          }
          // 빈문자가 왔을때 기존 sender가 user였으면 무시하자 ( 자꾸 빈말풍선 찍히는 원인 )
          else if (allMessages[allMessages.length - 1].sender === 'user') {
            return prev;
          }
        }
      }

      // 업데이트된 Messages 배열을 MessageInfo 객체로 반환
      return {Messages: allMessages, emoticonUrl: prev?.emoticonUrl || []};
    });
  };
  //#endregion

  //#region  다음 에피소드 넘어가기
  const navigateToNextEpisode = async (episodeId: number) => {
    console.log(`Navigating to episode ID: ${episodeId}`);

    const requestData: EnterEpisodeChattingReq = {
      episodeId: episodeId,
    };

    try {
      const response = await sendChattingEnter(requestData);

      if (response.resultCode === 0 && response.data) {
        console.log('Successfully entered episode:', response.data);

        // parsedPrevMessages와 emoticonUrl을 동시에 생성하여 위치와 길이를 맞춤
        // parsedPrevMessages와 emoticonUrl을 함께 생성, emoticonUrl이 없는 경우 ""로 채움
        const {parsedPrevMessages, emoticonUrl} = response.data.prevMessageInfoList.reduce<{
          parsedPrevMessages: Message[];
          emoticonUrl: string[];
        }>(
          (acc, msg) => {
            const parsedMessages = parseMessage(msg.message) || [];
            acc.parsedPrevMessages.push(...parsedMessages);

            // parseMessage 결과 수에 맞춰 emoticonUrl 배열에 값을 추가 (없으면 ""로 채움)
            const emoticonValue = msg.emoticonUrl || '';
            acc.emoticonUrl.push(...Array(parsedMessages.length).fill(emoticonValue));

            return acc;
          },
          {parsedPrevMessages: [], emoticonUrl: []},
        );

        const messageInfo: MessageGroup = {
          Messages: parsedPrevMessages, // Message 배열
          emoticonUrl: emoticonUrl, // 이모티콘 URL
        };

        setParsedMessages(messageInfo);
        setHasFetchedPrevMessages(true);

        const chattingState: ChattingState = {
          contentName: `content episode${episodeId}`,
          episodeName: `episode${episodeId}`,
          episodeId: Number(episodeId),
          contentUrl: shortsId,
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
  //#endregion

  //#region HeaderChat handler
  const handleMoreClick = () => {
    console.log('더보기 버튼 클릭');
  };

  const handleToggleBackground = () => {
    console.log('배경 보기/숨기기 버튼 클릭');
    SetHideChat(!isHideChat);
  };
  //#endregion

  const {prevMessages: enterData} = usePrevChatting(episodeId);

  useEffect(() => {
    if (
      !hasFetchedPrevMessages &&
      enterData?.prevMessageInfoList //&&
      //enterData.prevMessageInfoList.length > 0
    ) {
      // flatMap을 통해 parsedPrevMessages를 생성
      // parsedPrevMessages와 emoticonUrl을 동시에 생성하여 위치와 길이를 맞춤
      const {parsedPrevMessages, emoticonUrl} = enterData?.prevMessageInfoList.reduce<{
        parsedPrevMessages: Message[];
        emoticonUrl: string[];
      }>(
        (acc, msg) => {
          const parsedMessages = parseMessage(msg.message) || [];
          acc.parsedPrevMessages.push(...parsedMessages);

          // parseMessage 결과 수에 맞춰 emoticonUrl 배열에 값을 추가
          const emoticonValue = msg.emoticonUrl || '';
          acc.emoticonUrl.push(...Array(parsedMessages.length).fill(emoticonValue));

          return acc;
        },
        {parsedPrevMessages: [], emoticonUrl: []},
      ) || {parsedPrevMessages: [], emoticonUrl: []}; // 기본값 설정

      const introPrompt2: Message = {
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
  }, [enterData, hasFetchedPrevMessages]);
  const [emoticonGroupInfoList, setEmoticonGroupInfoList] = useState<EmoticonGroupInfo[]>([]);
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
        />
      </div>
      <BottomBar
        onSend={handleSendMessage}
        streamKey={streamKey}
        setStreamKey={setStreamKey}
        EmoticonData={emoticonGroupInfoList || []} // EmoticonData에 emoticonGroupInfoList 전달
        isHideChat={isHideChat}
        onToggleBackground={handleToggleBackground}
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
