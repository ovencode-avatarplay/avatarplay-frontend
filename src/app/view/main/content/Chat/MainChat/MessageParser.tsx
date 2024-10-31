// messageParser.tsx
export interface Message {
  text: string;
  sender: 'user' | 'partner' | 'narration' | 'system' | 'introPrompt';
}

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
      //console.log('answeransweranswer', partnerText);
      if (partnerText) {
        //console.log('answeransweranswer2', partnerText);
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
      result.push({
        text: parsedMessage.Question,
        sender: 'user',
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
