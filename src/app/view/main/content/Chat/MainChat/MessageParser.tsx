// messageParser.tsx

import {
  COMMAND_END,
  COMMAND_NARRATION,
  COMMAND_SYSTEM,
  COMMAND_ANSWER,
  Message,
  SenderType,
  COMMAND_USER,
} from './ChatTypes';

// ㅋㅋㅋㅋㅋㅋㅋㅋ

//const patternParsing( pattern : RegExp, )

const parseAnswer = (answer: string, id: number): Message[] => {
  const result: Message[] = [];

  // 패턴과 해당 발신자 타입을 객체 배열로 정의
  const patterns: {type: SenderType; regex: RegExp; clean: (text: string) => string}[] = [
    {
      type: SenderType.Partner,
      regex: /"(.*?)"/g,
      clean: text => text, // "" 제거
    },
    {
      type: SenderType.System,
      regex: /%(.*?)%/g,
      clean: text => text, // %% 제거
    },
    {
      type: SenderType.PartnerNarration,
      regex: /\*\*(.*?)\*\*/g,
      clean: text => text, // ** 제거
    },
  ];

  // 모든 패턴을 하나의 정규식으로 통합
  const combinedPattern = new RegExp(patterns.map(p => p.regex.source).join('|'), 'g');

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = combinedPattern.exec(answer)) !== null) {
    // 매칭된 텍스트 이전의 일반 텍스트 처리
    if (match.index > lastIndex) {
      const plainText = answer.slice(lastIndex, match.index).trim();
      if (plainText) {
        result.push({
          chatId: id,
          text: plainText.replace(/[%"*]/g, ''), // 특수 문자 제거
          sender: SenderType.PartnerNarration,
        });
      }
    }

    // 매칭된 패턴 처리
    for (let i = 1; i < match.length; i++) {
      if (match[i] !== undefined) {
        const pattern = patterns[i - 1];
        const cleanedText = pattern.clean(match[i]).replace(/[%"*]/g, ''); // 특수 문자 제거
        result.push({
          chatId: id,
          text: cleanedText,
          sender: pattern.type,
        });
        break; // 첫 번째 매칭된 그룹만 처리
      }
    }

    // 마지막 매칭 위치 업데이트
    lastIndex = combinedPattern.lastIndex;
  }

  // 남아있는 일반 텍스트 처리 (패턴이 없는 경우도 포함)
  if (lastIndex < answer.length) {
    const remainingText = answer.slice(lastIndex).trim();
    if (remainingText) {
      result.push({
        chatId: id,
        text: remainingText.replace(/[%"*]/g, ''), // 특수 문자 제거
        sender: SenderType.PartnerNarration,
      });
    }
  }

  return result;
};

export const parseMessage = (message: string | null, id: number): Message[] | null => {
  if (!message) return null;

  try {
    const parsedMessage = JSON.parse(message);
    const result: Message[] = [];

    if (parsedMessage.episodeInfo) {
      result.push(...parseAnswer(parsedMessage.episodeInfo, id));
    }

    if (parsedMessage.Question) {
      const parts: string[] = parsedMessage.Question.split('⦿SYSTEM_CHAT⦿');

      parts.forEach((part: string) => {
        if (part.trim()) {
          const sender = part.startsWith('*') && part.endsWith('*') ? SenderType.UserNarration : SenderType.User;
          const newMessage: Message = {
            // newMessage를 여기서 정의
            chatId: id,
            text: part.replace(/^\*|\*$/g, ''), // 양쪽의 '*'를 제거
            sender: sender,
          };

          if (newMessage.text !== '...') result.push(newMessage); // 새로 정의된 메시지를 결과에 추가
        }
      });
    }

    if (parsedMessage.Answer) {
      result.push(...parseAnswer(parsedMessage.Answer, id));
    }

    return result;
  } catch (error) {
    console.error('Failed to parse message:', error);
    return null;
  }
};

export const convertPrevMessages = (prevMessages: (string | null)[], id: number): Message[] => {
  return prevMessages.filter(msg => msg !== null && msg !== '').flatMap(msg => parseMessage(msg, id) || []);
};

export const convertStringMessagesToMessages = (messages: string[], id: number): Message[] => {
  return messages.map(msg => ({
    chatId: id,
    text: msg,
    sender: SenderType.Partner,
  }));
};

export const cleanString = (input: string): string => {
  // 1. 개행 문자 제거
  //let cleaned = input.replace(/\n/g, '');
  let cleaned = input.replace(/[\n*]/g, '');

  return cleaned;
};

export const cleanStringFinal = (input: string): string => {
  // 1. 개행 문자 제거
  //let cleaned = input.replace(/\n/g, '');
  let cleaned = input.replace(/[\n*"%]/g, '');

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

export const isPartnerNarration = (message: string): boolean => {
  if (message.includes(COMMAND_NARRATION)) {
    return true;
  } else return false;
};

export const isSystemMessage = (message: string): boolean => {
  /*const count = (message.match(new RegExp(`\\${COMMAND_SYSTEM}`, 'g')) || []).length;
  if (count >= 2) {
    return true;
  } else return false;*/
  if (message.includes(COMMAND_SYSTEM)) {
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
    chatId: messageData.chatId,
    sender: SenderType.UserNarration,
    text: messageData.text.slice(1, -1), // 양 옆의 *를 제거
  };
  return parsedMessage;
};

export const isUser = (message: string): boolean => {
  if (message.includes(COMMAND_USER)) {
    return true;
  } else return false;
};

export const isPartner = (message: string): boolean => {
  if (message.includes(COMMAND_ANSWER)) {
    return true;
  } else return false;
};

// newMessage 가 어떤 타입과 관련된 문자열이 포함되어 있는지 리턴해주는 함수
const checkNewSender = (isUserMessage: boolean, newMessage: string, currentSender: SenderType): SenderType => {
  let newSender: SenderType = currentSender;

  if (isUserMessage) {
    if (isUser(newMessage)) newSender = SenderType.User;
    else if (isUserNarration(newMessage)) newSender = SenderType.UserNarration;
  } else {
    if (isPartner(newMessage)) newSender = SenderType.Partner;
    else if (isPartnerNarration(newMessage)) newSender = SenderType.PartnerNarration;
    else if (isSystemMessage(newMessage)) newSender = SenderType.System;
  }

  return newSender;
};

// newMessage 가 어떤 기존 Sender타입과 같은 문자열이 포함되어 있는지 리턴해주는 함수
const checkSameSenderCommand = (isUserMessage: boolean, newMessage: string, currentSender: SenderType): boolean => {
  let isNewSenderCommand: boolean = false;
  switch (currentSender) {
    case SenderType.User:
      {
        if (isUserMessage === true && isUser(newMessage) === true) isNewSenderCommand = true;
      }
      break;
    case SenderType.UserNarration:
      {
        if (isUserMessage === true && isUserNarration(newMessage) === true) isNewSenderCommand = true;
      }
      break;
    case SenderType.Partner:
      {
        if (isUserMessage === false && isPartner(newMessage) === true) isNewSenderCommand = true;
      }
      break;
    case SenderType.PartnerNarration:
      {
        if (isUserMessage === false && isPartnerNarration(newMessage) === true) isNewSenderCommand = true;
      }
      break;
    case SenderType.System:
      {
        if (isUserMessage === false && isSystemMessage(newMessage) === true) isNewSenderCommand = true;
      }
      break;
  }

  return isNewSenderCommand;
};

// 다른 senderType이 들어왔는지 검사
export const isAnotherSenderType = (
  isUserMessage: boolean,
  newMessage: string,
  currentSender: SenderType,
): {isAnotherSender: boolean; newSender: SenderType} => {
  let isAnotherSender = false;
  let newSender: SenderType = currentSender;

  newSender = checkNewSender(isUserMessage, newMessage, currentSender);

  if (newSender !== currentSender) isAnotherSender = true;

  // 서버에서 보내줄때 * 가 없이 오는 시작되는 나레이션일때가 있어서 예외처리 해준다.
  if ((currentSender === SenderType.User || currentSender == SenderType.UserNarration) && isUserMessage === false) {
    isAnotherSender = true;
    // 같다라는건 새로운 Sender Command가 없었다는 이야기다.
    if (newSender === currentSender) newSender = SenderType.PartnerNarration;
  }

  return {isAnotherSender, newSender};
};

// 같은 senderType이 들어왔는지 검사( 해당 말풍선 타입을 종료하기 위해 사용하는 함수)
export const isSameSenderType = (
  isUserMessage: boolean,
  newMessage: string,
  currentSender: SenderType,
): {isSameSenderCommand: boolean} => {
  let isSameSenderCommand: boolean = false;

  isSameSenderCommand = checkSameSenderCommand(isUserMessage, newMessage, currentSender);

  return {isSameSenderCommand};
};

// export const isInitNarraition = (
//   isUserMessage: boolean,
//   newMessage: string,
//   currentSender: SenderType,
// ): {isInit: boolean} => {

//   const isInit = false;
//   if( isUserMessage === false && currentSender !== SenderType.PartnerNarration &&
//   return {isInit};
// }

export const setSenderType = (
  message: string,
  isMyMessage: boolean,
  isNarrationActive: boolean,
  id: number,
): Message => {
  const resultMessage: Message = {
    chatId: id,
    sender: isMyMessage ? SenderType.User : isNarrationActive ? SenderType.PartnerNarration : SenderType.Partner,
    text: message,
  };
  return resultMessage;
};
