import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TriggerInfo} from '@/types/apps/content/episode/TriggerInfo';
import {Conversation} from '@/types/apps/content/episode/Conversation';

import emptyContent from '@/data/create/empty-content-info-data.json';

import {ConversationTalkInfo, ConversationPriortyType, ConversationTalkType} from '@/types/apps/DataTypes';

export interface EpisodeInfo {
  id: number;
  name: string;
  backgroundImageUrl: string;
  characterInfo: CharacterInfo;
  episodeDescription: EpisodeDescription;
  triggerInfoList: TriggerInfo[];
  conversationTemplateList: Conversation[];
}

export interface CharacterInfo {
  id: number;
  name: string;
  introduction: string;
  description: string;
  genderType: number;
  mainImageUrl: string;
  portraitGalleryImageUrl: GalleryImageInfo[];
  poseGalleryImageUrl: GalleryImageInfo[];
  expressionGalleryImageUrl: GalleryImageInfo[];
  visibilityType: number;
  isMonetization: boolean;
  state: number;
}

export interface GalleryImageInfo {
  galleryImageId: number;
  isGenerate: boolean;
  promptParameter: string;
  imageUrl: string;
}

export interface EpisodeDescription {
  scenarioDescription: string;
  introDescription: string;
  secret: string;
}

interface EpisodeInfoState {
  currentEpisodeInfo: EpisodeInfo; // 현재 선택된 EpisodeInfo
}

const initialState: EpisodeInfoState = {
  currentEpisodeInfo: emptyContent.data.contentInfo.chapterInfoList[0].episodeInfoList[0],
};

const episodeInfoSlice = createSlice({
  name: 'introPrompt',
  initialState,
  reducers: {
    setCurrentEpisodeInfo(state, action: PayloadAction<EpisodeInfo>) {
      state.currentEpisodeInfo = action.payload; // 현재 에피소드 정보 설정
    },
    updateEpisodeInfo: (state, action: PayloadAction<Partial<EpisodeInfo>>) => {
      const updatedInfo = action.payload;
      const targetEpisode = state.currentEpisodeInfo;
      console.log('asdsadasdas');
      {
        state.currentEpisodeInfo = {...targetEpisode, ...updatedInfo};
      }
    },

    updateEpisodeDescription(state, action: PayloadAction<EpisodeDescription>) {
      if (state.currentEpisodeInfo) {
        state.currentEpisodeInfo.episodeDescription = action.payload; // 에피소드 설명 업데이트
      }
    },

    setEpisodeInfoEmpty(state) {
      state.currentEpisodeInfo = emptyContent.data.contentInfo.chapterInfoList[0].episodeInfoList[0];
    },

    setCurrentEpisodeBackgroundImage(state, action: PayloadAction<string>) {
      state.currentEpisodeInfo.backgroundImageUrl = action.payload;
    },

    //#region Character

    //사용법: dispatch(setCharacterInfo({ name: "New Name", state: 1 }));
    setCharacterInfo: (state, action: PayloadAction<Partial<CharacterInfo>>) => {
      state.currentEpisodeInfo.characterInfo = {
        ...state.currentEpisodeInfo.characterInfo,
        ...action.payload, // 전달된 속성만 덮어쓰기
      };
    },
    //#endregion

    //#region Trigger
    // 새로운 TriggerInfo를 추가
    addTriggerInfo: (state, action: PayloadAction<Omit<TriggerInfo, 'id'>>) => {
      // 트리거 리스트의 현재 id 중 최소값을 구함
      const triggerList = state.currentEpisodeInfo.triggerInfoList;
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
      const triggerIndex = state.currentEpisodeInfo.triggerInfoList.findIndex(trigger => trigger.id === id);

      if (triggerIndex !== -1) {
        state.currentEpisodeInfo.triggerInfoList[triggerIndex] = {
          ...state.currentEpisodeInfo.triggerInfoList[triggerIndex],
          ...info, // Partial로 인해 누락된 필드는 기존 값 유지
        };
      }
    },

    duplicateTriggerInfo: (state, action: PayloadAction<number>) => {
      const triggerList = state.currentEpisodeInfo.triggerInfoList;
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
      const triggerIndex = state.currentEpisodeInfo.triggerInfoList.findIndex(trigger => trigger.id === id);

      if (triggerIndex !== -1) {
        // id에 해당하는 항목이 존재하는 경우
        state.currentEpisodeInfo.triggerInfoList[triggerIndex] = {
          ...state.currentEpisodeInfo.triggerInfoList[triggerIndex],
          name,
        };
      }
    },

    removeTriggerInfo: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const triggerIndex = state.currentEpisodeInfo.triggerInfoList.findIndex(trigger => trigger.id === id);

      if (triggerIndex !== -1) {
        // id에 해당하는 항목이 존재하는 경우
        state.currentEpisodeInfo.triggerInfoList.splice(triggerIndex, 1);
      }
    },

    // TriggerInfo 업데이트 (index 기반)
    updateTriggerInfoByIndex: (state, action: PayloadAction<{index: number; info: Omit<TriggerInfo, 'id'>}>) => {
      const {index, info} = action.payload;

      if (index >= 0 && index < state.currentEpisodeInfo.triggerInfoList.length) {
        state.currentEpisodeInfo.triggerInfoList[index] = {
          ...info,
          id: state.currentEpisodeInfo.triggerInfoList[index].id, // 기존 id 유지
        };
      }
    },

    // Trigger 이름 업데이트 (index 기반)
    updateTriggerInfoNameByIndex: (state, action: PayloadAction<{index: number; name: string}>) => {
      const {index, name} = action.payload;

      if (index >= 0 && index < state.currentEpisodeInfo.triggerInfoList.length) {
        state.currentEpisodeInfo.triggerInfoList[index] = {
          ...state.currentEpisodeInfo.triggerInfoList[index],
          name,
        };
      }
    },

    // Trigger 삭제 (index 기반)
    removeTriggerInfoByIndex: (state, action: PayloadAction<number>) => {
      const index = action.payload;

      if (index >= 0 && index < state.currentEpisodeInfo.triggerInfoList.length) {
        state.currentEpisodeInfo.triggerInfoList.splice(index, 1);
      }
    },

    //#endregion

    //#region conversation
    // 기존 기능 - conversationTemplateList 관련 액션들
    saveConversationTemplateList: (state, action: PayloadAction<Conversation[]>) => {
      state.currentEpisodeInfo.conversationTemplateList = action.payload;
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
      state.currentEpisodeInfo.conversationTemplateList.push(newConversation);
    },

    addConversationTalkItem: (
      state,
      action: PayloadAction<{conversationIndex: number; type: 'user' | 'character'; newTalk: string}>,
    ) => {
      const conversation = state.currentEpisodeInfo.conversationTemplateList[action.payload.conversationIndex];
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
      const conversation = state.currentEpisodeInfo.conversationTemplateList[action.payload.conversationIndex];
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
      const conversation = state.currentEpisodeInfo.conversationTemplateList[action.payload.conversationIndex];
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
      if (index >= 0 && index < state.currentEpisodeInfo.conversationTemplateList.length) {
        state.currentEpisodeInfo.conversationTemplateList.splice(index, 1);
      }
    },

    removeAllConversationTalk: state => {
      state.currentEpisodeInfo.conversationTemplateList = [];
    },
    //#endregion
  },
});

export const {
  setCurrentEpisodeInfo,
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
} = episodeInfoSlice.actions;

export default episodeInfoSlice.reducer;
