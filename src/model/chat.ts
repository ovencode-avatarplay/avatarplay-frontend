import { ShortsInfo } from "./shortsInfo";
import { ExploreInfo } from "./exploreInfo";
import { CharacterData } from "./characterData";
import { CharacterInfo } from "./characterInfo";
import { MessageInfo } from "./messageInfo";
import { ContentInfo } from "./contentInfo";
import { ContentDashBoardInfo } from "./contentDashBoardInfo";
import { PublishInfo } from "./publishInfo";
import { ChapterSimpleInfo } from "./chapterSimpleInfo";

export interface GetShortsListRes {
    shortsInfoList: ShortsInfo[];
}

export interface GetExploreListRes {
    searchOptionList: string[];
    playingList: ExploreInfo[];
    recommendationList: ExploreInfo[];
}

export interface SetCharacterReq {
    userId: number;
    characterName: string;
    characterDescription: string;
    worldScenario: string;
    introduction: string;
    secret: string;
    thumbnail: string;
}

export interface SetCharacterRes {
    characterId: number;
}

export interface GetCharacterReq {
    characterId: number;
}

export interface GetCharacterRes {
    characterId: number;
    characterData: CharacterData;
    thumbnail: string;
}

export interface GetCharactersReq {

}

export interface GetCharactersRes {
    characterInfoList: CharacterInfo[];
}

export interface UpdateCharacterReq {
    userId: number;
    characterId: number;
    characterName: string;
    characterDescription: string;
    worldScenario: string;
    introduction: string;
    secret: string;
    thumbnail: string;
}

export interface UpdateCharacterRes {
    characterId: number;
    characterName: string;
    characterDescription: string;
    worldScenario: string;
    introduction: string;
    secret: string;
    thumbnail: string;
}

export interface DeleteCharacterReq {
    characterId: number;
}

export interface DeleteCharacterRes {
    characterInfoList: CharacterInfo[];
}

export interface GetPrevChatMessageReq {
    userId: number;
    episodeId: number;
}

export interface GetPrevChatMessageRes {
    messageInfoList: MessageInfo[];
}

export interface SendChatMessageReq {
    userId: number;
    episodeId: number;
    text: string;
}

export interface SendChatMessageRes {
    streamKey: string;
    chatId: number;
}

export interface GetChatPromptReq {
    chatId: number;
}

export interface GetChatPromptRes {
    question: string;
    answer: string;
    prompt: string;
}

export interface GetPromptTemplateReq {

}

export interface GetPromptTemplateRes {
    prevQuestionTemplate: string;
    prevAnswerTemplate: string;
    ragQuestionTemplate: string;
    ragAnswerTemplate: string;
    expressionTemplate: string;
}

export interface UpdatePromptTemplateReq {
    prevQuestionTemplate: string;
    prevAnswerTemplate: string;
    ragQuestionTemplate: string;
    ragAnswerTemplate: string;
    expressionTemplate: string;
}

export interface UpdatePromptTemplateRes {

}

export interface GenerateTtsReq {
    userId: number;
    voiceId: string;
    text: string;
}

export interface GenerateTtsRes {
    streamKey: string;
}

export interface ElasticCreateReq {

}

export interface ElasticCreateRes {

}

export interface ElasticSearchReq {
    userId: number;
    characterId: number;
    threshold: number;
    queryString: string;
}

export interface ElasticSearchRes {
    result: string;
}

export interface ElasticSelectReq {

}

export interface ElasticSelectRes {

}

export interface ElasticClearReq {

}

export interface ElasticClearRes {

}

export interface SaveContentReq {
    contentInfo: ContentInfo;
}

export interface SaveContentRes {
    contentId: number;
}

export interface GetContentDashBoardReq {
    userId: number;
}

export interface GetContentDashBoardRes {
    contentDashBoardList: ContentDashBoardInfo[];
}

export interface GetContentReq {
    contentId: number;
}

export interface GetContentRes {
    chatCount: number;
    chatUserCount: number;
    publishInfo: PublishInfo;
    chapterInfoList: ChapterSimpleInfo[];
}

export interface EnterEpisodeChttingReq {
    userId: number;
    episodeId: number;
}

export interface EnterEpisodeChttingRes {
    prevMessageInfoList: MessageInfo[];
}

export interface RequestAiQuestionReq {
    userId: number;
    episodeId: number;
}

export interface RequestAiQuestionRes {
    questionList: string[];
}