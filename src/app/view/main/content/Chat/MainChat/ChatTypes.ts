//export type SenderType = 'user' | 'partner' | 'partnerNarration' | 'system' | 'introPrompt' | 'userNarration';

export enum SenderType {
  User = 'user',
  UserNarration = 'userNarration',
  Partner = 'partner',
  PartnerNarration = 'partnerNarration',
  System = 'system',
  IntroPrompt = 'introPrompt',
}

export interface Message {
  chatId: number;
  text: string;
  sender: SenderType;
}

export interface MessageGroup {
  Messages: Message[];
  emoticonUrl: string[];
}

export const COMMAND_NARRATION = '*';

export const COMMAND_END = '$';

export const COMMAND_SYSTEM = '%';

export const COMMAND_USER = '"';

export const COMMAND_ANSWER = '"';
