import {CharacterInfo} from '@/redux-store/slices/EpisodeInfo';
import {Conversation} from './Conversation';

export interface TriggerInfo {
  episodeId: number;
  id: number;
  name: string;
  triggerType: number;
  triggerValueIntimacy: number;
  triggerValueChatCount: number;
  triggerValueKeyword: string;
  triggerValueTimeMinute: number;
  triggerActionType: number;
  actionChangeEpisodeId: number;
  actionPromptScenarioDescription: string;
  actionIntimacyPoint: number;
  maxIntimacyCount: number;
  actionCharacterInfo: CharacterInfo;
  actionMediaState: TriggerMediaState;
  actionMediaUrl: string;
  actionConversationList: Conversation[];
}
export interface ActionChangePrompt {
  characterName: string;
  characterDescription: string;
  scenarioDescription: string;
  introDescription: string;
  secret: string;
}

export enum TriggerMediaState {
  None = 0,
  TriggerImage = 1,
  TriggerVideo = 2,
  TriggerAudio = 3,
}
