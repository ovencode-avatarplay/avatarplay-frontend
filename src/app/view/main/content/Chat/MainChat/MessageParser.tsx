// messageParser.tsx

import {COMMAND_END, COMMAND_NARRATION, COMMAND_SYSTEM, Message} from './ChatTypes';

const parseAnswer = (answer: string): Message[] => {
  const result: Message[] = [];
  const narrationPattern = /\*(.*?)\*/g;
  const systemPattern = /%(.*?)%/g; // 시스템 패턴 추가
  let lastIndex = 0;
  let match;

  // 먼저 나레이션 패턴 처리
  while ((match = narrationPattern.exec(answer)) !== null) {
    if (match.index > lastIndex) {
      const partnerText = answer.slice(lastIndex, match.index).trim();
      // partnerText가 비어있지 않을 경우에만 추가
      if (partnerText) {
        result.push({
          text: partnerText,
          sender: 'partner',
        });
      }
    }
    result.push({
      text: match[1], // 매칭된 나레이션 내용
      sender: 'narration', // 메시지 발신자
    });

    lastIndex = narrationPattern.lastIndex;
  }

  // 나레이션 패턴 이후 남아있는 텍스트가 있는 경우 시스템 패턴 처리
  while ((match = systemPattern.exec(answer)) !== null) {
    if (match.index > lastIndex) {
      const partnerText = answer.slice(lastIndex, match.index).trim();
      // partnerText가 비어있지 않을 경우에만 추가
      if (partnerText) {
        result.push({
          text: partnerText,
          sender: 'partner',
        });
      }
    }

    result.push({
      text: match[1], // 매칭된 시스템 메시지 내용
      sender: 'system', // 메시지 발신자
    });

    lastIndex = systemPattern.lastIndex;
  }

  // 마지막으로 남아있는 텍스트를 partner 메시지로 처리
  if (lastIndex < answer.length) {
    const remainingText = answer.slice(lastIndex).trim();
    // 남아있는 텍스트가 비어있지 않을 경우에만 추가
    if (remainingText) {
      result.push({
        text: remainingText, // 남아있는 텍스트
        sender: 'partner', // 메시지 발신자
      });
    }
  }

  return result;
};

export const parseMessage = (message: string | null): Message[] | null => {
  if (!message) return null;

  try {
    const parsedMessage = JSON.parse(message);
    const result: Message[] = [];

    if (parsedMessage.episodeInfo) {
      result.push(...parseAnswer(parsedMessage.episodeInfo));
    }

    if (parsedMessage.Question) {
      const parts: string[] = parsedMessage.Question.split('⦿SYSTEM_CHAT⦿');

      parts.forEach((part: string) => {
        if (part.trim()) {
          const sender = part.startsWith('*') && part.endsWith('*') ? 'userNarration' : 'user';
          const newMessage: Message = {
            // newMessage를 여기서 정의
            text: part.replace(/^\*|\*$/g, ''), // 양쪽의 '*'를 제거
            sender: sender,
          };
          result.push(newMessage); // 새로 정의된 메시지를 결과에 추가
        }
      });
    }

    if (parsedMessage.Answer) {
      result.push(...parseAnswer(parsedMessage.Answer));
    }

    return result;
  } catch (error) {
    console.error('Failed to parse message:', error);
    return null;
  }
};

export const convertPrevMessages = (prevMessages: (string | null)[]): Message[] => {
  return prevMessages.filter(msg => msg !== null && msg !== '').flatMap(msg => parseMessage(msg) || []);
};

export const convertStringMessagesToMessages = (messages: string[]): Message[] => {
  return messages.map(msg => ({
    text: msg,
    sender: 'partner',
  }));
};

export const cleanString = (input: string): string => {
  // 1. 개행 문자 제거
  let cleaned = input.replace(/\n/g, '');

  return cleaned;
};

export const splitByNarration = (splitMessage: string) => {
  // '*'을 기준으로 문자열을 나누기
  const parts = splitMessage.split(COMMAND_NARRATION);

  // 나눈 부분에서 앞과 뒤의 문자열을 반환
  return {
    leftAsterisk: parts[0], // '*' 앞의 문자열
    rightAsterisk: parts.slice(1).join(COMMAND_NARRATION), // '*' 뒤의 문자열 (여러 개의 '*'이 있을 수 있음)
  };
};

// 메시지가 '$'이면 메시지의 끝이라는 의미
export const isFinishMessage = (isMyMessage: boolean, message: string): boolean => {
  if (isMyMessage === false && message.includes(COMMAND_END)) {
    return true;
  } else return false;
};

export const isNarrationMessage = (message: string): boolean => {
  if (message.includes(COMMAND_NARRATION)) {
    return true;
  } else return false;
};

export const isSystemMessage = (message: string): boolean => {
  const count = (message.match(new RegExp(`\\${COMMAND_SYSTEM}`, 'g')) || []).length;
  if (count >= 2) {
    return true;
  } else return false;
};

export const isUserNarration = (message: string): boolean => {
  if (message.startsWith(COMMAND_NARRATION) && message.endsWith(COMMAND_NARRATION)) {
    return true;
  } else return false;
};

export const parsedUserNarration = (messageData: Message): Message => {
  const parsedMessage: Message = {
    sender: 'userNarration',
    text: messageData.text.slice(1, -1), // 양 옆의 *를 제거
  };
  return parsedMessage;
};

export const setSenderType = (message: string, isMyMessage: boolean, isNarrationActive: boolean): Message => {
  const resultMessage: Message = {
    sender: isMyMessage ? 'user' : isNarrationActive ? 'narration' : 'partner',
    text: message,
  };
  return resultMessage;
};
