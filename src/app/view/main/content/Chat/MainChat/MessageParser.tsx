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

const parseAnswer = (answer: string, id: number): Message[] => {
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
          chatId: id,
          text: partnerText,
          sender: SenderType.Partner,
        });
      }
    }
    result.push({
      chatId: id,
      text: match[1], // 매칭된 나레이션 내용
      sender: SenderType.PartnerNarration, // 메시지 발신자
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
          chatId: id,
          text: partnerText,
          sender: SenderType.Partner,
        });
      }
    }

    result.push({
      chatId: id,
      text: match[1], // 매칭된 시스템 메시지 내용
      sender: SenderType.System, // 메시지 발신자
    });

    lastIndex = systemPattern.lastIndex;
  }

  // 마지막으로 남아있는 텍스트를 partner 메시지로 처리
  if (lastIndex < answer.length) {
    const remainingText = answer.slice(lastIndex).trim();
    // 남아있는 텍스트가 비어있지 않을 경우에만 추가
    if (remainingText) {
      result.push({
        chatId: id,
        text: remainingText, // 남아있는 텍스트
        sender: SenderType.Partner, // 메시지 발신자
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

// newMessage 가 어떤 타입과 관련된 문자열이 포함되어 있는지 리턴해주는 함수
const checkSameSenderCommand = (isUserMessage: boolean, newMessage: string, currentSender: SenderType): boolean => {
  let isNewSenderCommand: boolean = false;

  // if (isUserMessage) {
  //   if (isUser(newMessage) || isUserNarration(newMessage)) isNewSenderCommand = true;
  // } else {
  //   if (isPartner(newMessage) || isPartnerNarration(newMessage) || isSystemMessage(newMessage))
  //     isNewSenderCommand = true;
  // }

  switch (currentSender) {
    case SenderType.User:
      {
        if (isUser(newMessage) === true) isNewSenderCommand = true;
      }
      break;
    case SenderType.UserNarration:
      {
        if (isUserNarration(newMessage) === true) isNewSenderCommand = true;
      }
      break;
    case SenderType.Partner:
      {
        if (isPartner(newMessage) === true) isNewSenderCommand = true;
      }
      break;
    case SenderType.PartnerNarration:
      {
        if (isPartnerNarration(newMessage) === true) isNewSenderCommand = true;
      }
      break;
    case SenderType.System:
      {
        if (isSystemMessage(newMessage) === true) isNewSenderCommand = true;
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
  if (currentSender === SenderType.User && isUserMessage === false) {
    isAnotherSender = true;
    newSender = SenderType.PartnerNarration;
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
