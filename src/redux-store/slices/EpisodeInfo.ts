import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {EpisodeInfo} from '@/types/apps/content/episode/episodeInfo';
import {EpisodeDescription} from '@/types/apps/content/episode/episodeDescription';
import {TriggerInfo} from '@/types/apps/content/episode/triggerInfo';
import {Conversation} from '@/types/apps/content/episode/conversation';
import {LLMSetupInfo} from '@/types/apps/content/episode/llmSetupInfo';
import defaultContent from '@/data/create/content-info-data.json';
import emptyContent from '@/data/create/empty-content-info-data.json';

import {
  ConversationTalkInfoList,
  ConversationTalkInfo,
  ConversationPriortyType,
  ConversationTalkType,
} from '@/types/apps/dataTypes';

interface EpisodeInfoState {
  currentEpisodeInfo: EpisodeInfo; // 현재 선택된 EpisodeInfo
}

const initialState: EpisodeInfoState = {
  currentEpisodeInfo: emptyContent.data.contentInfo.chapterInfoList[0].episodeInfoList[0],
};

const episodeInfoSlice = createSlice({
  name: 'episodeInfo',
  initialState,
  reducers: {
    setCurrentEpisodeInfo(state, action: PayloadAction<EpisodeInfo>) {
      state.currentEpisodeInfo = action.payload; // 현재 에피소드 정보 설정
    },
    updateEpisodeDescription(state, action: PayloadAction<EpisodeDescription>) {
      if (state.currentEpisodeInfo) {
        state.currentEpisodeInfo.episodeDescription = action.payload; // 에피소드 설명 업데이트
      }
    },

    setCurrentEpisodeThumbnail(state, action: PayloadAction<string>) {
      state.currentEpisodeInfo.thumbnail = action.payload;
    },

    // 새로운 TriggerInfo를 추가
    addTriggerInfo: (state, action: PayloadAction<Omit<TriggerInfo, 'id'>>) => {
      const newDataPair: TriggerInfo = {
        ...action.payload,
        id: 0, // id를 설정하지 않음
      };
      state.currentEpisodeInfo.triggerInfoList.push(newDataPair);
    },

    // TriggerInfo 업데이트
    updateTriggerInfo: (state, action: PayloadAction<{index: number; info: Omit<TriggerInfo, 'id'>}>) => {
      const {index, info} = action.payload;
      if (index >= 0 && index < state.currentEpisodeInfo.triggerInfoList.length) {
        state.currentEpisodeInfo.triggerInfoList[index] = {
          ...info,
          id: state.currentEpisodeInfo.triggerInfoList[index].id, // 기존 id 유지
        };
      }
    },

    // Trigger 이름 업데이트
    updateTriggerInfoName: (state, action: PayloadAction<{index: number; name: string}>) => {
      const {index, name} = action.payload;
      if (index >= 0 && index < state.currentEpisodeInfo.triggerInfoList.length) {
        state.currentEpisodeInfo.triggerInfoList[index] = {
          ...state.currentEpisodeInfo.triggerInfoList[index],
          name,
        };
      }
    },

    // Trigger 삭제
    removeTriggerInfo: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.currentEpisodeInfo.triggerInfoList.length) {
        state.currentEpisodeInfo.triggerInfoList.splice(index, 1);
      }
    },

    // 기존 기능 - conversationTemplateList 관련 액션들
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
            userArray[action.payload.itemIndex].talk = action.payload.newTalk;
            conversation.user = JSON.stringify(userArray);
          }
        } else if (action.payload.type === 'character') {
          if (characterArray[action.payload.itemIndex]) {
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

    // 새로운 기능 - actionConversationList 관련 액션들 추가
    addActionConversationTalk: (
      state,
      action: PayloadAction<{
        triggerIndex: number;
        user: ConversationTalkInfo[];
        character: ConversationTalkInfo[];
        conversationType: ConversationPriortyType;
      }>,
    ) => {
      const trigger = state.currentEpisodeInfo.triggerInfoList[action.payload.triggerIndex];
      if (trigger) {
        const newConversation: Conversation = {
          id: 0,
          conversationType: action.payload.conversationType,
          user: JSON.stringify(action.payload.user),
          character: JSON.stringify(action.payload.character),
        };
        trigger.actionConversationList.push(newConversation);
      }
    },

    addActionConversationTalkItem: (
      state,
      action: PayloadAction<{
        triggerIndex: number;
        conversationIndex: number;
        type: 'user' | 'character';
        newTalk: string;
      }>,
    ) => {
      const trigger = state.currentEpisodeInfo.triggerInfoList[action.payload.triggerIndex];
      if (trigger) {
        const conversation = trigger.actionConversationList[action.payload.conversationIndex];
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
      }
    },

    updateActionConversationTalk: (
      state,
      action: PayloadAction<{
        triggerIndex: number;
        conversationIndex: number;
        itemIndex: number;
        type: 'user' | 'character';
        newTalk: string;
      }>,
    ) => {
      const trigger = state.currentEpisodeInfo.triggerInfoList[action.payload.triggerIndex];
      if (trigger) {
        const conversation = trigger.actionConversationList[action.payload.conversationIndex];
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
              userArray[action.payload.itemIndex].talk = action.payload.newTalk;
              conversation.user = JSON.stringify(userArray);
            }
          } else if (action.payload.type === 'character') {
            if (characterArray[action.payload.itemIndex]) {
              characterArray[action.payload.itemIndex].talk = action.payload.newTalk;
              conversation.character = JSON.stringify(characterArray);
            }
          }
        }
      }
    },

    removeActionConversationItem: (
      state,
      action: PayloadAction<{
        triggerIndex: number;
        conversationIndex: number;
        itemIndex: number;
        type: 'user' | 'character';
      }>,
    ) => {
      const trigger = state.currentEpisodeInfo.triggerInfoList[action.payload.triggerIndex];
      if (trigger) {
        const conversation = trigger.actionConversationList[action.payload.conversationIndex];
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
      }
    },

    removeActionConversationTalk: (state, action: PayloadAction<{triggerIndex: number; conversationIndex: number}>) => {
      const trigger = state.currentEpisodeInfo.triggerInfoList[action.payload.triggerIndex];
      if (trigger) {
        trigger.actionConversationList.splice(action.payload.conversationIndex, 1);
      }
    },

    removeAllActionConversationTalk: (state, action: PayloadAction<{triggerIndex: number}>) => {
      const trigger = state.currentEpisodeInfo.triggerInfoList[action.payload.triggerIndex];
      if (trigger) {
        trigger.actionConversationList = [];
      }
    },

    setLlmSetupInfo(state, action: PayloadAction<LLMSetupInfo>) {
      if (state.currentEpisodeInfo) {
        state.currentEpisodeInfo.llmSetupInfo = action.payload; // LLM 설정 정보 업데이트
      }
    },
  },
});

export const {
  setCurrentEpisodeInfo,
  setCurrentEpisodeThumbnail,
  updateEpisodeDescription,
  addTriggerInfo,
  updateTriggerInfo,
  updateTriggerInfoName,
  removeTriggerInfo,
  setLlmSetupInfo,
  addConversationTalk,
  addConversationTalkItem,
  updateConversationTalk,
  removeConversationItem,
  removeConversationTalk,
  addActionConversationTalk,
  addActionConversationTalkItem,
  updateActionConversationTalk,
  removeActionConversationItem,
  removeActionConversationTalk,
  removeAllConversationTalk,
  removeAllActionConversationTalk,
} = episodeInfoSlice.actions;

export default episodeInfoSlice.reducer;
