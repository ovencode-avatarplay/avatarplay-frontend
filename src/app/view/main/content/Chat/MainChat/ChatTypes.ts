//export type SenderType = 'user' | 'partner' | 'partnerNarration' | 'system' | 'introPrompt' | 'userNarration';

export enum SenderType {
  User = 'user',
  UserNarration = 'userNarration',
  Partner = 'partner',
  PartnerNarration = 'partnerNarration',
  System = 'system',
  IntroPrompt = 'introPrompt',
  media = 'media',
}

export enum TriggerMediaState {
  None = 'none',
  TriggerImage = 'triggerImage',
  TriggerVideo = 'triggerVideo',
  TriggerAudio = 'triggerAudio',
}

export interface Message {
  chatId: number;
  text: string;
  sender: SenderType;
  createDate: Date;
}

export interface MediaData {
  mediaType: TriggerMediaState;
  mediaUrlList: string[];
}

export interface MessageGroup {
  Messages: Message[];
  emoticonUrl: string[];
  mediaData?: MediaData[];
}

export const COMMAND_NARRATION = '*';

export const COMMAND_END = '$';

export const COMMAND_SYSTEM = '%';

export const COMMAND_USER = '"';

export const COMMAND_ANSWER = '"';
