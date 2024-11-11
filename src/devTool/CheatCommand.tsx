'use client';
import {ChattingCheatReq, ChattingCheatRes, sendMessageCheat} from '@/app/NetWork/CheatNetwork';
import CheatMessageType from './cheat_type';

const cheatMessage = async (contentId: number, episodeId: number, cheatText: string) => {
  const requestData: ChattingCheatReq = {
    contentId,
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

// 문자열에 enum 값이 포함되어 있는지 확인하는 함수
const isAnyCheatMessageType = (message: string): boolean => {
  return Object.values(CheatMessageType).some(type => message.includes(type));
};

const cheatManager = (response: ChattingCheatRes): string => {
  // 채팅창 초기화 ( 현재 애피소드에서 Enter를 재요청한다.)
  if (response.isEpisodeInit === true) {
    // 기존 채팅창 닫고 Enter를 다시 시도한다.

    return '';
  }
  // 말풍선에 치트키에 대한 응답정보를 출력해준다.
  else if (response.resultText.length > 0) {
    return response.resultText;
  }
  return '';
};
export {cheatMessage, isAnyCheatMessageType, cheatManager};
