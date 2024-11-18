export interface Message {
  chatId: number;
  text: string;
  sender: 'user' | 'partner' | 'narration' | 'system' | 'introPrompt' | 'userNarration';
}

export interface MessageGroup {
  Messages: Message[];
  emoticonUrl: string[];
}

export const COMMAND_NARRATION = '*';

export const COMMAND_END = '$';

export const COMMAND_SYSTEM = '%';
