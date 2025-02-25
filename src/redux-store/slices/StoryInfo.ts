// Imports
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {useSelector} from 'react-redux';
import {RootState} from '../ReduxStore';

// JSON 파일
import emptyStory from '@/data/create/empty-story-info-data.json';
import {ProfileInfo, ProfileSimpleInfo} from '@/app/NetWork/ProfileNetwork';

//#region export Interface

/*
// 컨텐츠 (ContentInfo)
//   ㄴ 챕터 (ChapterInfo)
//        ㄴ 에피소드 (EpisodeInfo)
//            ㄴ 캐릭터 (CharacterInfo)
//                ㄴ 갤러리이미지 (GalleryImageInfo)
//            ㄴ 설명 (EpisodeDescription)
//            ㄴ 트리거 (TriggerInfo)
//            ㄴ 대화템플릿 (ConversationTemplateInfo)
//   ㄴ 퍼블리시 (PublishInfo)
//        ㄴ LLM (LLMSetupInfo)
// */

// 1 Level
// 1 Level
export interface StoryInfo {
  id: number;
  userId: number;
  profileId: number;
  urlLinkKey: string;
  chapterInfoList: ChapterInfo[];
  publishInfo: PublishInfo;
}

// 2 Level
export interface PublishInfo {
  languageType: number;
  storyName: string;
  thumbnail: string;
  storyDescription: string;
  authorName: string;
  authorComment: string;
  tagList: string[];
  selectTagList: string[];
  visibilityType: number;
  monetization: boolean;
  nsfw: number;
  llmSetupInfo: LLMSetupInfo;
}

export interface ChapterInfo {
  id: number;
  name: string;
  episodeInfoList: EpisodeInfo[];
}

// 3 Level
export interface LLMSetupInfo {
  llmModel: number;
  customApi: string;
}

export interface EpisodeInfo {
  id: number;
  name: string;
  backgroundImageUrl: string;
  characterInfo: CharacterInfo;
  episodeDescription: EpisodeDescription;
  triggerInfoList: TriggerInfo[];
  conversationTemplateList: Conversation[];
}

// 4 Level
export interface EpisodeDescription {
  scenarioDescription: string;
  introDescription: string;
  secret: string;
  greeting: string;
  worldScenario: string;
}

export interface CharacterInfo {
  id: number;
  languageType: LanguageType;
  name: string;
  characterDescription: string;
  urlLinkKey: string | null;
  genderType: GenderType;
  introduction: string;
  description: string;
  worldScenario: string;
  greeting: string;
  secret: string;
  chatCount: number;
  chatUserCount: number;
  mainImageUrl: string;
  portraitGalleryImageUrl: GalleryImageInfo[];
  poseGalleryImageUrl: GalleryImageInfo[];
  expressionGalleryImageUrl: GalleryImageInfo[];
  mediaTemplateList: CharacterMediaInfo[];
  conversationTemplateList: ConversationInfo[];
  visibilityType: VisibilityType;
  llmModel: LLMModel;
  customApi: string;
  tag: string;
  positionCountryList: LanguageType[];
  characterIP: CharacterIP;
  connectCharacterInfo: ProfileSimpleInfo;
  connectCharacterId: number;
  recruitedProfileId: number; // TODO : 추후 추가 계획
  operatorProfileIdList: ProfileSimpleInfo[];
  isMonetization: boolean;
  nSFW: boolean;
  membershipSetting: MembershipSetting;
  customModulesInfo: CustomModulesInfo;
  pdProfileSimpleInfo: ProfileSimpleInfo;
  state: CharacterState;
  createAt: string;
  updateAt: string;
}

export interface CustomModulesInfo {
  promptInfoList: PromptInfo[];
  selectPromptIndex: number;
  lorebookInfoList: LorebookInfo[];
  selectLorebookIndex: number;
}

export interface PromptInfo {
  id: number;
  name: string;
}

export interface LorebookInfo {
  id: number;
  name: string;
}

export enum LanguageType {
  Korean = 0,
  English = 1,
  Japanese = 2,
  French = 3,
  Spanish = 4,
  ChineseSimplified = 5,
  ChineseTraditional = 6,
  Portuguese = 7,
  German = 8,
}

export enum GenderType {
  Female = 0,
  Male = 1,
  None = 2,
}

export interface ConversationInfo {
  id: number;
  conversationType: ConversationType;
  user: string;
  character: string;
}

export enum ConversationType {
  Important,
  AlwaysImportant,
}

export enum VisibilityType {
  Private = 0,
  Unlisted = 1,
  Public = 2,
  Create = 3,
}

export enum UploadMediaState {
  None = 0,
  CharacterImage = 1,
  GalleryImage = 2,
  BackgroundImage = 3,
  ContentImage = 4,
  TtsVoice = 5,
  TriggerImage = 6,
  TriggerVideo = 7,
  TriggerAudio = 8,
  FeedVideo = 9,
  FeedImage = 10,
  CompressFeedVideo = 11,
  CompressFeedImage = 12,
  ContentVideo = 13,
  ContentSubtitle = 14,
  ContentDubbing = 15,
  ContentWebtoonImage = 16,
  ContentWebtoonSubtitle = 17,
}

export enum CharacterIP {
  Original,
  Fan,
}

export interface MembershipSetting {
  subscription: Subscription;
  paymentType: PaymentType;
  paymentAmount: number;
  benefits: string;
}

export enum Subscription {
  IP,
  Contents,
}

export enum PaymentType {
  USA,
  Korea,
}

export enum CharacterState {
  None = 0,
  Create = 1,
  Delete = 2,
}

export enum LLMModel {
  GPT_4o = 0,
  GPT_4 = 1,
  GPT_3_5 = 2,
  Claude_V2 = 3,
  Claude_3_Opus = 4,
  Claude_3_Sonnet = 5,
  Claude_3_5_Sonnet = 6,
  Claude_3_5_Sonnet_V2 = 7,
  Claude_3_Haiku = 8,
}

export interface GalleryImageInfo {
  galleryImageId: number;
  isGenerate: boolean;
  debugParameter: string;
  imageUrl: string;
}

export interface CharacterMediaInfo {
  id: number;
  imageUrl: string;
  activationCondition: string;
  isSpoiler: boolean;
}

export interface TriggerInfo {
  episodeId: number;
  id: number;
  name: string;
  triggerType: number;
  triggerValueIntimacy: number;
  triggerValueChatCount: number;
  triggerValueKeyword: string;
  triggerValueTimeMinute: number;
  emotionState: EmotionState;
  triggerActionType: number;
  actionChangeEpisodeId: number;
  actionPromptScenarioDescription: string;
  actionIntimacyPoint: number;
  maxIntimacyCount: number;
  actionCharacterInfo: CharacterInfo;
  actionMediaState: TriggerMediaState;
  actionMediaUrlList: string[];
  actionConversationList: Conversation[];
}

export interface Conversation {
  id: number;
  conversationType: number;
  user: string;
  character: string;
}

// 5 Level

//#endregion

//#region  Trigger State
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

export enum EmotionState {
  Happy = 0,
  Angry = 1,
  Sad = 2,
  Excited = 3,
  Scared = 4,
  Bored = 5,
}
export enum TriggerMainDataType {
  triggerValueIntimacy = 0,
  triggerValueKeyword = 1,
  triggerValueChatCount = 2,
  triggerValueTimeMinute = 3,
  triggerValueEmotionStatus = 4,
  triggerValueEpisodeStart = 5,
}

export enum TriggerTypeNames {
  Intimacy,
  Keyword,
  ChatCount,
  TimeMinute,
  EmotionStatus,
  EpisodeStart,
}

export enum TriggerActionType {
  EpisodeChange,
  ChangePrompt,
  GetIntimacyPoint,
  ChangeCharacter,
  PlayMedia,
}
//#endregion

//#region  Conversation State

export interface ConversationTalkInfo {
  type: ConversationTalkType;
  talk: string;
}

export enum ConversationTalkType {
  Action,
  Speech,
}

export enum ConversationPriortyType {
  Mandatory,
  DependsOn,
}
//#endregion

//#region Slice 변수

// 현재 수정 중인 story 정보
interface StoryInfoState {
  selectedStoryId: number;
  selectedChapterIdx: number;
  selectedEpisodeIdx: number;

  skipStoryInit: boolean;
  curEditingStoryInfo: StoryInfo;
}

// 초기 상태
const initialState: StoryInfoState = {
  selectedStoryId: 0,
  selectedChapterIdx: 0,
  selectedEpisodeIdx: 0,

  skipStoryInit: false,
  curEditingStoryInfo: emptyStory.data.storyInfo,
};

//#endregion

//#region Function

const getMinEpisodeId = (chapters: ChapterInfo[]): number => {
  const episodeIds = chapters.flatMap(chapter => chapter.episodeInfoList.map(episode => episode.id));

  if (episodeIds.length === 0) {
    return 0; // 에피소드가 없는 경우 null 반환 (버그)
  }

  const minId = Math.min(...episodeIds);
  return minId > 0 ? 0 : minId;
};

//#endregion

export const curEditngStoryInfoSlice = createSlice({
  name: 'storyInfo',
  initialState,
  reducers: {
    //#region  편집할 Content, Chapter, Episode 선택
    setSelectedStoryId: (state, action: PayloadAction<number>) => {
      state.selectedStoryId = action.payload;
    },
    setSelectedChapterIdx: (state, action: PayloadAction<number>) => {
      state.selectedChapterIdx = action.payload;
    },
    setSelectedEpisodeIdx: (state, action: PayloadAction<number>) => {
      state.selectedEpisodeIdx = action.payload;
    },
    setSkipStoryInit: (state, action: PayloadAction<boolean>) => {
      state.skipStoryInit = action.payload;
    },
    //#endregion

    //#region Story 자체 수정
    setEditingStoryInfo: (state, action: PayloadAction<StoryInfo>) => {
      state.curEditingStoryInfo = action.payload;
    },

    updateEditingStoryInfo: (state, action: PayloadAction<Partial<StoryInfo>>) => {
      if (state.curEditingStoryInfo) {
        state.curEditingStoryInfo = {...state.curEditingStoryInfo, ...action.payload};
      }
    },

    setStoryInfoToEmpty: state => {
      state.curEditingStoryInfo = emptyStory.data.storyInfo;
    },
    updateEpisodeInfoInStory: (state, action: PayloadAction<EpisodeInfo>) => {
      const updatedEpisode = action.payload;

      // 모든 챕터를 순회하면서 에피소드 ID를 기준으로 업데이트
      state.curEditingStoryInfo.chapterInfoList.forEach(chapter => {
        chapter.episodeInfoList = chapter.episodeInfoList.map(episode =>
          episode.id === updatedEpisode.id ? {...episode, ...updatedEpisode} : episode,
        );
      });
    },
    //#endregion

    //#region Chapter에서의 Episode 수정
    removeEpisode: (state, action: PayloadAction<number>) => {
      const targetId = action.payload; // 제거할 에피소드 ID
      state.curEditingStoryInfo.chapterInfoList.forEach(chapter => {
        chapter.episodeInfoList = chapter.episodeInfoList.filter(
          episode => episode.id !== targetId, // ID가 일치하지 않는 에피소드만 유지
        );
      });
    },

    // Episode 복제
    duplicateEpisode: (state, action: PayloadAction<number>) => {
      const targetId = action.payload;

      // 새로운 ID는 가장 낮은 음수 ID에서 -1을 뺌
      const newId = getMinEpisodeId(state.curEditingStoryInfo.chapterInfoList) - 1;

      state.curEditingStoryInfo.chapterInfoList.forEach(chapter => {
        const targetIndex = chapter.episodeInfoList.findIndex(episode => episode.id === targetId);

        if (targetIndex !== -1) {
          const targetEpisode = chapter.episodeInfoList[targetIndex];

          const duplicatedEpisode = {
            ...targetEpisode,
            id: newId,
            name: `${targetEpisode.name} copy`, // 이름에 ' copy' 추가
          };

          chapter.episodeInfoList.splice(targetIndex + 1, 0, duplicatedEpisode);
        }
      });
    },

    // Episode 순서 변경
    adjustEpisodeIndex: (state, action: PayloadAction<{targetId: number; direction: 'up' | 'down'}>) => {
      const {targetId, direction} = action.payload;

      state.curEditingStoryInfo.chapterInfoList.forEach(chapter => {
        const targetIndex = chapter.episodeInfoList.findIndex(episode => episode.id === targetId);

        if (targetIndex !== -1) {
          // 위의 아이템과 순서 변경
          if (direction === 'up' && targetIndex > 0) {
            const temp = chapter.episodeInfoList[targetIndex - 1];
            chapter.episodeInfoList[targetIndex - 1] = chapter.episodeInfoList[targetIndex];
            chapter.episodeInfoList[targetIndex] = temp;
          }
          // 아래의 아이템과 순서 변경
          else if (direction === 'down' && targetIndex < chapter.episodeInfoList.length - 1) {
            const temp = chapter.episodeInfoList[targetIndex + 1];
            chapter.episodeInfoList[targetIndex + 1] = chapter.episodeInfoList[targetIndex];
            chapter.episodeInfoList[targetIndex] = temp;
          }
        }
      });
    },
    //#endregion

    moveTriggerToEpisode: (
      state,
      action: PayloadAction<{sourceEpisodeId: number; triggerId: number; targetEpisodeId: number}>,
    ) => {
      const {sourceEpisodeId, triggerId, targetEpisodeId} = action.payload;

      let triggerToMove: TriggerInfo | null = null;

      // 1. 소스 에피소드에서 트리거 제거
      state.curEditingStoryInfo.chapterInfoList.forEach(chapter => {
        const sourceEpisode = chapter.episodeInfoList.find(episode => episode.id === sourceEpisodeId);

        if (sourceEpisode) {
          const triggerIndex = sourceEpisode.triggerInfoList.findIndex(trigger => trigger.id === triggerId);

          if (triggerIndex !== -1) {
            triggerToMove = sourceEpisode.triggerInfoList[triggerIndex];
            sourceEpisode.triggerInfoList.splice(triggerIndex, 1); // 트리거 제거
          }
        }
      });

      if (!triggerToMove) {
        console.error('Trigger not found in the source episode.');
        return;
      }

      // 2. 타겟 에피소드에 트리거 추가
      state.curEditingStoryInfo.chapterInfoList.forEach(chapter => {
        const targetEpisode = chapter.episodeInfoList.find(episode => episode.id === targetEpisodeId);

        if (targetEpisode) {
          const minId =
            targetEpisode.triggerInfoList.length > 0
              ? Math.min(...targetEpisode.triggerInfoList.map(trigger => trigger.id))
              : 0;

          const newId = minId > 0 ? -1 : minId - 1; // 새로운 음수 ID 생성

          const newTrigger = {
            ...triggerToMove,
            id: newId,
          };

          targetEpisode.triggerInfoList.push(newTrigger as TriggerInfo);
        }
      });
    },

    updateEpisodeInfo: (state, action: PayloadAction<Partial<EpisodeInfo>>) => {
      const updatedInfo = action.payload;
      const targetEpisode =
        state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[state.selectedEpisodeIdx];
      {
        state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[state.selectedEpisodeIdx] =
          {
            ...targetEpisode,
            ...updatedInfo,
          };
      }
    },

    updateEpisodeDescription(state, action: PayloadAction<EpisodeDescription>) {
      state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[
        state.selectedEpisodeIdx
      ].episodeDescription = action.payload; // 에피소드 설명 업데이트
    },

    setEpisodeInfoEmpty(state) {
      state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[state.selectedEpisodeIdx] =
        emptyStory.data.storyInfo.chapterInfoList[0].episodeInfoList[0];
    },

    setCurrentEpisodeBackgroundImage(state, action: PayloadAction<string>) {
      state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[
        state.selectedEpisodeIdx
      ].backgroundImageUrl = action.payload;
    },

    //#region Character

    //사용법: dispatch(setCharacterInfo({ name: "New Name", state: 1 }));
    setCharacterInfo: (state, action: PayloadAction<Partial<CharacterInfo>>) => {
      state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[
        state.selectedEpisodeIdx
      ].characterInfo = {
        ...state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[state.selectedEpisodeIdx]
          .characterInfo,
        ...action.payload, // 전달된 속성만 덮어쓰기
      };
    },
    //#endregion

    //#region Trigger
    // 새로운 TriggerInfo를 추가
    addTriggerInfo: (state, action: PayloadAction<Omit<TriggerInfo, 'id'>>) => {
      // 트리거 리스트의 현재 id 중 최소값을 구함
      const triggerList =
        state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[state.selectedEpisodeIdx]
          .triggerInfoList;
      const minId = triggerList.length > 0 ? Math.min(...triggerList.map(trigger => trigger.id)) : 0;

      const newId = minId > 0 ? -1 : minId - 1; // 음수 id 생성

      const newDataPair: TriggerInfo = {
        ...action.payload,
        id: newId, // 자동 생성된 id
      };

      triggerList.push(newDataPair);
    },

    // TriggerInfo 업데이트
    updateTriggerInfo: (state, action: PayloadAction<{id: number; info: Partial<Omit<TriggerInfo, 'id'>>}>) => {
      const {id, info} = action.payload;
      const triggerIndex = state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[
        state.selectedEpisodeIdx
      ].triggerInfoList.findIndex(trigger => trigger.id === id);

      if (triggerIndex !== -1) {
        state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[
          state.selectedEpisodeIdx
        ].triggerInfoList[triggerIndex] = {
          ...state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[
            state.selectedEpisodeIdx
          ].triggerInfoList[triggerIndex],
          ...info, // Partial로 인해 누락된 필드는 기존 값 유지
        };
      }
    },

    duplicateTriggerInfo: (state, action: PayloadAction<number>) => {
      const triggerList =
        state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[state.selectedEpisodeIdx]
          .triggerInfoList;
      const sourceTriggerInfo = triggerList.find(trigger => trigger.id === action.payload);

      if (!sourceTriggerInfo) {
        console.error('Invalid source id for copying TriggerInfo');
        return;
      }

      const minId = triggerList.length > 0 ? Math.min(...triggerList.map(trigger => trigger.id)) : 0;
      const newId = minId > 0 ? -1 : minId - 1; // 새로운 음수 id 생성

      const newTriggerInfo: TriggerInfo = {
        ...sourceTriggerInfo,
        id: newId, // 새로운 id 할당
      };

      // 원본 항목 바로 다음에 삽입
      const sourceIndex = triggerList.findIndex(trigger => trigger.id === action.payload);
      triggerList.splice(sourceIndex + 1, 0, newTriggerInfo);
    },

    // Trigger 이름 업데이트
    updateTriggerInfoName: (state, action: PayloadAction<{id: number; name: string}>) => {
      const {id, name} = action.payload;
      const triggerIndex = state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[
        state.selectedEpisodeIdx
      ].triggerInfoList.findIndex(trigger => trigger.id === id);

      if (triggerIndex !== -1) {
        // id에 해당하는 항목이 존재하는 경우
        state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[
          state.selectedEpisodeIdx
        ].triggerInfoList[triggerIndex] = {
          ...state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[
            state.selectedEpisodeIdx
          ].triggerInfoList[triggerIndex],
          name,
        };
      }
    },

    removeTriggerInfo: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const triggerIndex = state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[
        state.selectedEpisodeIdx
      ].triggerInfoList.findIndex(trigger => trigger.id === id);

      if (triggerIndex !== -1) {
        // id에 해당하는 항목이 존재하는 경우
        state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[
          state.selectedEpisodeIdx
        ].triggerInfoList.splice(triggerIndex, 1);
      }
    },

    // TriggerInfo 업데이트 (index 기반)
    updateTriggerInfoByIndex: (state, action: PayloadAction<{index: number; info: Omit<TriggerInfo, 'id'>}>) => {
      const {index, info} = action.payload;

      if (
        index >= 0 &&
        index <
          state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[state.selectedEpisodeIdx]
            .triggerInfoList.length
      ) {
        state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[
          state.selectedEpisodeIdx
        ].triggerInfoList[index] = {
          ...info,
          id: state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[
            state.selectedEpisodeIdx
          ].triggerInfoList[index].id, // 기존 id 유지
        };
      }
    },

    // Trigger 이름 업데이트 (index 기반)
    updateTriggerInfoNameByIndex: (state, action: PayloadAction<{index: number; name: string}>) => {
      const {index, name} = action.payload;

      if (
        index >= 0 &&
        index <
          state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[state.selectedEpisodeIdx]
            .triggerInfoList.length
      ) {
        state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[
          state.selectedEpisodeIdx
        ].triggerInfoList[index] = {
          ...state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[
            state.selectedEpisodeIdx
          ].triggerInfoList[index],
          name,
        };
      }
    },

    // Trigger 삭제 (index 기반)
    removeTriggerInfoByIndex: (state, action: PayloadAction<number>) => {
      const index = action.payload;

      if (
        index >= 0 &&
        index <
          state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[state.selectedEpisodeIdx]
            .triggerInfoList.length
      ) {
        state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[
          state.selectedEpisodeIdx
        ].triggerInfoList.splice(index, 1);
      }
    },

    //#endregion

    //#region conversation
    // 기존 기능 - conversationTemplateList 관련 액션들
    saveConversationTemplateList: (state, action: PayloadAction<Conversation[]>) => {
      state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[
        state.selectedEpisodeIdx
      ].conversationTemplateList = action.payload;
    },
    addConversationTalk: (
      state,
      action: PayloadAction<{
        user: ConversationTalkInfo[];
        character: ConversationTalkInfo[];
        conversationType: ConversationPriortyType;
      }>,
    ) => {
      const newConversation: Conversation = {
        id: 0, // id는 초기값 그대로 유지
        conversationType: action.payload.conversationType,
        user: JSON.stringify(action.payload.user),
        character: JSON.stringify(action.payload.character),
      };
      state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[
        state.selectedEpisodeIdx
      ].conversationTemplateList.push(newConversation);
    },

    addConversationTalkItem: (
      state,
      action: PayloadAction<{conversationIndex: number; type: 'user' | 'character'; newTalk: string}>,
    ) => {
      const conversation =
        state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[state.selectedEpisodeIdx]
          .conversationTemplateList[action.payload.conversationIndex];
      if (conversation) {
        const newTalkItem: ConversationTalkInfo = {
          type: action.payload.type === 'user' ? ConversationTalkType.Speech : ConversationTalkType.Action,
          talk: action.payload.newTalk,
        };

        let userArray: ConversationTalkInfo[] = [];
        let characterArray: ConversationTalkInfo[] = [];

        try {
          userArray = conversation.user ? JSON.parse(conversation.user) : [];
        } catch (error) {
          console.error('Failed to parse user conversation:', error);
        }

        try {
          characterArray = conversation.character ? JSON.parse(conversation.character) : [];
        } catch (error) {
          console.error('Failed to parse character conversation:', error);
        }

        if (action.payload.type === 'user') {
          userArray.push(newTalkItem);
          conversation.user = JSON.stringify(userArray);
        } else if (action.payload.type === 'character') {
          characterArray.push(newTalkItem);
          conversation.character = JSON.stringify(characterArray);
        }
      }
    },

    updateConversationTalk: (
      state,
      action: PayloadAction<{
        conversationIndex: number;
        itemIndex: number;
        type: 'user' | 'character';
        newType: ConversationTalkType;
        newTalk: string;
      }>,
    ) => {
      const conversation =
        state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[state.selectedEpisodeIdx]
          .conversationTemplateList[action.payload.conversationIndex];
      if (conversation) {
        let userArray: ConversationTalkInfo[] = [];
        let characterArray: ConversationTalkInfo[] = [];

        try {
          userArray = conversation.user ? JSON.parse(conversation.user) : [];
        } catch (error) {
          console.error('Failed to parse user conversation:', error);
        }

        try {
          characterArray = conversation.character ? JSON.parse(conversation.character) : [];
        } catch (error) {
          console.error('Failed to parse character conversation:', error);
        }

        if (action.payload.type === 'user') {
          if (userArray[action.payload.itemIndex]) {
            userArray[action.payload.itemIndex].type = action.payload.newType;
            userArray[action.payload.itemIndex].talk = action.payload.newTalk;
            conversation.user = JSON.stringify(userArray);
          }
        } else if (action.payload.type === 'character') {
          if (characterArray[action.payload.itemIndex]) {
            characterArray[action.payload.itemIndex].type = action.payload.newType;
            characterArray[action.payload.itemIndex].talk = action.payload.newTalk;
            conversation.character = JSON.stringify(characterArray);
          }
        }
      }
    },

    removeConversationItem: (
      state,
      action: PayloadAction<{conversationIndex: number; itemIndex: number; type: 'user' | 'character'}>,
    ) => {
      const conversation =
        state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[state.selectedEpisodeIdx]
          .conversationTemplateList[action.payload.conversationIndex];
      if (conversation) {
        let userArray: ConversationTalkInfo[] = [];
        let characterArray: ConversationTalkInfo[] = [];

        try {
          userArray = conversation.user ? JSON.parse(conversation.user) : [];
        } catch (error) {
          console.error('Failed to parse user conversation:', error);
        }

        try {
          characterArray = conversation.character ? JSON.parse(conversation.character) : [];
        } catch (error) {
          console.error('Failed to parse character conversation:', error);
        }

        if (action.payload.type === 'user') {
          userArray.splice(action.payload.itemIndex, 1);
          conversation.user = JSON.stringify(userArray);
        } else if (action.payload.type === 'character') {
          characterArray.splice(action.payload.itemIndex, 1);
          conversation.character = JSON.stringify(characterArray);
        }
      }
    },

    removeConversationTalk: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (
        index >= 0 &&
        index <
          state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[state.selectedEpisodeIdx]
            .conversationTemplateList.length
      ) {
        state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[
          state.selectedEpisodeIdx
        ].conversationTemplateList.splice(index, 1);
      }
    },

    removeAllConversationTalk: state => {
      state.curEditingStoryInfo.chapterInfoList[state.selectedChapterIdx].episodeInfoList[
        state.selectedEpisodeIdx
      ].conversationTemplateList = [];
    },
    //#endregion
  },
});

// 액션과 리듀서 export
export const {
  setSelectedStoryId,
  setSelectedChapterIdx,
  setSelectedEpisodeIdx,
  setSkipStoryInit,

  moveTriggerToEpisode,
  setEditingStoryInfo,
  updateEditingStoryInfo,
  duplicateEpisode,
  setStoryInfoToEmpty,
  removeEpisode,
  updateEpisodeInfoInStory,
  adjustEpisodeIndex,

  updateEpisodeInfo,
  setCurrentEpisodeBackgroundImage,
  setEpisodeInfoEmpty,
  updateEpisodeDescription,
  addTriggerInfo,
  updateTriggerInfo,
  updateTriggerInfoName,
  removeTriggerInfo,
  updateTriggerInfoByIndex,
  updateTriggerInfoNameByIndex,
  removeTriggerInfoByIndex,
  duplicateTriggerInfo,
  addConversationTalk,
  addConversationTalkItem,
  updateConversationTalk,
  removeConversationItem,
  removeConversationTalk,
  removeAllConversationTalk,
  setCharacterInfo,
  saveConversationTemplateList,
} = curEditngStoryInfoSlice.actions;
export default curEditngStoryInfoSlice.reducer;
