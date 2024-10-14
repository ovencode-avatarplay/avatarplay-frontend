import { Conversation } from "./conversation";

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
    actionChangePrompt: string;
    actionIntimacyPoint: number;
    maxIntimacyCount: number,
    actionCoversationList: Conversation[];
}