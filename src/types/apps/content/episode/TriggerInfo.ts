import {Conversation} from './Conversation';

export interface TriggerInfo {
  id: number;
  name: string;
  triggerType: number;
  triggerValueIntimacy: number;
  triggerValueChatCount: number;
  triggerValueKeyword: string;
  triggerValueTimeMinute: number;
  triggerActionType: number;
  actionChangeEpisodeId: number;
  actionChangePrompt: ActionChangePrompt;
  actionIntimacyPoint: number;
  actionChangeBackground: string;
  maxIntimacyCount: number;
  actionConversationList: Conversation[];
}

export interface ActionChangePrompt {
  characterName: string;
  characterDescription: string;
  scenarioDescription: string;
  introDescription: string;
  secret: string;
}
