'use client';
import {ChattingCheatReq, ChattingCheatRes, sendMessageCheat} from '@/app/NetWork/CheatNetwork';
import CheatMessageType, {CheatResult} from './cheat_type';
import usePrevChatting from '@/app/view/main/content/Chat/MainChat/PrevChatting';
import {pushLocalizedRoute} from '@/utils/UrlMove';
import {useRouter} from 'next/navigation';

const cheatMessage = async (contentId: number, episodeId: number, cheatText: string) => {
  const requestData: ChattingCheatReq = {
    storyId: contentId,
    episodeId,
    text: cheatText,
  };

  try {
    const response = await sendMessageCheat(requestData);
    return response.data; // Return the result from the API call
  } catch (error) {
    console.error('Message send failed:', error);
    throw new Error('Failed to send cheat message'); // Propagate the error
  }
};

const isAnyCheatMessageType = (message: string): boolean => {
  // 배열에 대해 'some'을 사용하여 각 문자열이 'message'에 포함되는지 확인
  return CheatMessageType.some((type: string) => message.includes(type));
};

// 테스트 예시
console.log(isAnyCheatMessageType('⦿EPISODE_INIT⦿')); // true를 예상

const cheatManager = (response: ChattingCheatRes, router: ReturnType<typeof useRouter>): CheatResult => {
  // 기본 result 객체 설정
  const result: CheatResult = {
    text: '',
    reqEnter: false,
  };

  // 채팅창 초기화 (현재 애피소드에서 Enter를 재요청한다.)
  if (response.isStoryInit === true) {
    // 채팅창 좌상단 back 버튼 클릭했을때랑 동일하게 처리
    pushLocalizedRoute('/main/explore', router);
  } else if (response.isEpisodeInit === true) {
    result.reqEnter = true;
  }
  // 말풍선에 치트키에 대한 응답정보를 출력해준다.
  else if (response.resultText.length > 0) {
    result.text = response.resultText;
  }

  return result;
};

export {cheatMessage, isAnyCheatMessageType, cheatManager};
