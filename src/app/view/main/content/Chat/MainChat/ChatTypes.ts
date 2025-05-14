//export type SenderType = 'user' | 'partner' | 'partnerNarration' | 'system' | 'introPrompt' | 'userNarration';

export enum SenderType {
  User = 'user',
  UserNarration = 'userNarration',
  Partner = 'partner',
  PartnerNarration = 'partnerNarration',
  System = 'system',
  IntroPrompt = 'introPrompt',
  media = 'media',
  NewDate = 'newDate',
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
  createDateString: string;
  createDateLocale: Date | null; // 서버는 UTC로 주지만 프론트에서는 로컬타임으로 변환해서 쓴다.
  isLike: boolean; // true 면 좋아요.
  bubbleIndex: number; // 순차적으로 내 말풍선 포함 0부터 시작
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
