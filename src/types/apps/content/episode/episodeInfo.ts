import {ImageData} from './imageData';
import {EpisodeDescription} from './episodeDescription';
import {LLMSetupInfo} from './llmSetupInfo';
import {TriggerInfo} from './triggerInfo';
import {Conversation} from './conversation';

export interface EpisodeInfo {
  id: number;
  name: string;
  thumbnail: string;
  episodeDescription: EpisodeDescription;
  triggerInfoList: TriggerInfo[];
  conversationTemplateList: Conversation[];
  llmSetupInfo: LLMSetupInfo;
}

export interface EpisodeInfoForContentGet {
  id: number;
  name: string;
  shortId: string;
  description: string;
  thumbnailList: string[];
  isLock: boolean;
  intimacyProgress: number;
}
