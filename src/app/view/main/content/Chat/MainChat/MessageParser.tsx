// messageParser.tsx
export interface Message {
  text: string;
  sender: 'user' | 'partner' | 'narration';
}

const parseAnswer = (answer: string): Message[] => {
  const result: Message[] = [];
  const narrationPattern = /\*(.*?)\*/g;
  let lastIndex = 0;
  let match;

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
