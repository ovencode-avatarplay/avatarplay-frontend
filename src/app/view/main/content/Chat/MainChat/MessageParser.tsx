// messageParser.tsx
export interface Message {
  text: string;
  sender: 'user' | 'partner' | 'narration' | 'system';
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
      result.push({
        text: answer.slice(lastIndex, match.index).trim(),
        sender: 'partner',
      });
    }

    result.push({
      text: match[1],
      sender: 'narration',
    });

    lastIndex = narrationPattern.lastIndex;
  }

  // 나레이션 패턴 이후 남은 텍스트가 있으면 시스템 패턴 처리
  while ((match = systemPattern.exec(answer)) !== null) {
    if (match.index > lastIndex) {
      result.push({
        text: answer.slice(lastIndex, match.index).trim(),
        sender: 'partner',
      });
    }

    result.push({
      text: match[1],
      sender: 'system',
    });

    lastIndex = systemPattern.lastIndex;
  }

  // 마지막으로 남은 텍스트를 partner 메시지로 처리
  if (lastIndex < answer.length) {
    result.push({
      text: answer.slice(lastIndex).trim(),
      sender: 'partner',
    });
  }

  return result;
};

export const parseMessage = (message: string | null): Message[] | null => {
  if (!message) return null;

  try {
    const parsedMessage = JSON.parse(message);
    const result: Message[] = [];

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
