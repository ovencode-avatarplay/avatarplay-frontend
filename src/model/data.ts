import { LanguageType } from "./languageType";
import { VisibilityType } from "./visibilityType";
import { ConversationInfo } from "./conversationInfo";
import { TriggerType } from "./triggerType";
import { TriggerActionType } from "./triggerActionType";
import { ChatContentInfo } from "./chatContentInfo";
import { BedrockModel } from "./bedrockModel";

export interface ShortsInfo {
    characterId: number;
    shortsId: string;
    thumbnailList: string[];
    summary: string;
}

export interface ExploreInfo {
    characterId: number;
    shortsId: string;
    thumbnail: string;
}

export interface ContentInfo {
    id: number;
    userId: number;
    chapterInfoList: ChapterInfo[];
    publishInfo: PublishInfo;
}

export interface PublishInfo {
    languageType: LanguageType;
    contentName: string;
    thumbnail: string;
    contentDescription: string;
    authorName: string;
    authorComment: string;
    contentTag: string[];
    selectContentTag: string[];
    visibilityType: VisibilityType;
    monetization: boolean;
    nSFW: number;
}

export interface ChapterInfo {
    id: number;
    name: string;
    episodeInfoList: EpisodeInfo[];
}

export interface EpisodeInfo {
    id: number;
    name: string;
    thumbnail: string;
    episodeDescription: EpisodeDescription;
    triggerInfoList: TriggerInfo[];
    conversationTemplateList: ConversationInfo[];
    lLMSetupInfo: LLMSetupInfo;
}

export interface EpisodeDescription {
    characterName: string;
    characterDescription: string;
    scenarioDescription: string;
    introDescription: string;
    secret: string;
}

export interface TriggerInfo {
    id: number;
    triggerType2: TriggerType;
    triggerValueIntimacy: number;
    triggerValueChatCount: number;
    triggerValueKeyword: string;
    triggerValueTimeMinute: number;
    triggerActionType: TriggerActionType;
    actionChangeEpisodeId: number;
    actionChangePrompt: string;
    actionIntimacyPoint: number;
    maxIntimacyCount: number;
    actionCoversationList: ConversationInfo[];
}

export interface ConversationTemplate {
    conversationList: ChatContentInfo[];
}

export interface LLMSetupInfo {
    lLMModel: BedrockModel;
    customApi: string;
}

export interface ContentDashBoardInfo {
    id: number;
    name: string;
    thumbnail: string;
    messageCount: number;
    followCount: number;
    thumbnailCount: number;
    videoCount: number;
    createAt: string;
}

export interface ChapterSimpleInfo {
    id: number;
    name: string;
    episodeInfoList: EpisodeSimpleInfo[];
}

export interface EpisodeSimpleInfo {
    id: number;
    name: string;
    description: string;
    thumbnailList: string[];
    intimacyProgress: number;
}