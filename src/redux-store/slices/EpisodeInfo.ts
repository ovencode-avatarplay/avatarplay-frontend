import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {EpisodeInfo} from '@/types/apps/content/episode/episodeInfo';
import {EpisodeDescription} from '@/types/apps/content/episode/episodeDescription';
import {TriggerInfo} from '@/types/apps/content/episode/triggerInfo';
import {Conversation} from '@/types/apps/content/episode/conversation';
import {LLMSetupInfo} from '@/types/apps/content/episode/llmSetupInfo';
import defaultContent from '@/data/create/content-info-data.json';
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
  currentEpisodeInfo: defaultContent.data.contentInfo.chapterInfoList[0].episodeInfoList[0],
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

    // Trigger 관련 액션들 복구
    addTriggerInfo: (state, action: PayloadAction<Omit<TriggerInfo, 'id'>>) => {
      const newDataPair: TriggerInfo = {
        ...action.payload,
        id: state.currentEpisodeInfo.triggerInfoList.length, // 배열의 인덱스를 id로 사용
      };
      state.currentEpisodeInfo.triggerInfoList.push(newDataPair);
    },

    updateTriggerInfo: (state, action: PayloadAction<{id: number; info: Omit<TriggerInfo, 'id'>}>) => {
      const {id, info} = action.payload;
      const triggerIndex = state.currentEpisodeInfo.triggerInfoList.findIndex(trigger => trigger.id === id);

      if (triggerIndex !== -1) {
        state.currentEpisodeInfo.triggerInfoList[triggerIndex] = {...info, id}; // id 유지하면서 정보 업데이트
      }
    },

    updateTriggerInfoName: (state, action: PayloadAction<{id: number; name: string}>) => {
      const {id, name} = action.payload;
      const pair = state.currentEpisodeInfo.triggerInfoList.find(pair => pair.id === id);
      if (pair) {
        pair.name = name; // name 필드 업데이트
      }
    },

    removeTriggerInfo: (state, action: PayloadAction<number>) => {
      state.currentEpisodeInfo.triggerInfoList.splice(action.payload, 1); // 해당 index의 트리거 삭제

      // 삭제 이후 모든 항목의 id를 배열 인덱스와 맞춰서 재할당
      state.currentEpisodeInfo.triggerInfoList = state.currentEpisodeInfo.triggerInfoList.map((pair, index) => ({
        ...pair,
        id: index, // 배열의 새로운 인덱스를 id로 재할당
      }));
    },

    setLlmSetupInfo(state, action: PayloadAction<LLMSetupInfo>) {
      if (state.currentEpisodeInfo) {
        state.currentEpisodeInfo.llmSetupInfo = action.payload; // LLM 설정 정보 업데이트
      }
    },

    // 기존 기능 - conversationTemplateList 관련 액션들
    addConversationTalk: (
      state,
      action: PayloadAction<{
        user: ConversationTalkInfo[];
        character: ConversationTalkInfo[];
        conversationTpye: ConversationPriortyType;
      }>,
    ) => {
      const newId = state.currentEpisodeInfo.conversationTemplateList.length;
      const newConversation: Conversation = {
        id: newId,
        conversationType: action.payload.conversationTpye,
        user: JSON.stringify(action.payload.user), // 직렬화
        character: JSON.stringify(action.payload.character), // 직렬화
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

        // 안전하게 JSON.parse 호출
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
          conversation.user = JSON.stringify(userArray); // 다시 직렬화하여 저장
        } else if (action.payload.type === 'character') {
          characterArray.push(newTalkItem);
          conversation.character = JSON.stringify(characterArray); // 다시 직렬화하여 저장
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
            conversation.user = JSON.stringify(userArray); // 다시 직렬화하여 저장
          }
        } else if (action.payload.type === 'character') {
          if (characterArray[action.payload.itemIndex]) {
            characterArray[action.payload.itemIndex].talk = action.payload.newTalk;
            conversation.character = JSON.stringify(characterArray); // 다시 직렬화하여 저장
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
          userArray.splice(action.payload.itemIndex, 1); // 해당 인덱스를 제거
          conversation.user = JSON.stringify(userArray); // 다시 직렬화하여 저장
        } else if (action.payload.type === 'character') {
          characterArray.splice(action.payload.itemIndex, 1); // 해당 인덱스를 제거
          conversation.character = JSON.stringify(characterArray); // 다시 직렬화하여 저장
        }
      }
    },

    removeConversationTalk: (state, action: PayloadAction<number>) => {
      state.currentEpisodeInfo.conversationTemplateList.splice(action.payload, 1);
      state.currentEpisodeInfo.conversationTemplateList.forEach((conversation, idx) => {
        conversation.id = idx;
      });
    },

    // 새로운 기능 - actionConversationList 관련 액션들 추가
    addActionConversationTalk: (
      state,
      action: PayloadAction<{
        triggerId: number;
        user: ConversationTalkInfo[];
        character: ConversationTalkInfo[];
        conversationTpye: ConversationPriortyType;
      }>,
    ) => {
      const trigger = state.currentEpisodeInfo.triggerInfoList.find(trigger => trigger.id === action.payload.triggerId);
      if (trigger) {
        const newId = trigger.actionConversationList.length;
        const newConversation: Conversation = {
          id: newId,
          conversationType: action.payload.conversationTpye,
          user: JSON.stringify(action.payload.user), // 직렬화
          character: JSON.stringify(action.payload.character), // 직렬화
        };
        trigger.actionConversationList.push(newConversation);
      }
    },

    addActionConversationTalkItem: (
      state,
      action: PayloadAction<{
        triggerId: number;
        conversationIndex: number;
        type: 'user' | 'character';
        newTalk: string;
      }>,
    ) => {
      const trigger = state.currentEpisodeInfo.triggerInfoList.find(trigger => trigger.id === action.payload.triggerId);
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
            conversation.user = JSON.stringify(userArray); // 다시 직렬화하여 저장
          } else if (action.payload.type === 'character') {
            characterArray.push(newTalkItem);
            conversation.character = JSON.stringify(characterArray); // 다시 직렬화하여 저장
          }
        }
      }
    },

    updateActionConversationTalk: (
      state,
      action: PayloadAction<{
        triggerId: number;
        conversationIndex: number;
        itemIndex: number;
        type: 'user' | 'character';
        newTalk: string;
      }>,
    ) => {
      const trigger = state.currentEpisodeInfo.triggerInfoList.find(trigger => trigger.id === action.payload.triggerId);
      if (trigger) {
        const conversation = trigger.actionConversationList[action.payload.conversationIndex];
        if (conversation) {
          // JSON 데이터가 올바른지 확인하고 기본값을 설정
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
              conversation.user = JSON.stringify(userArray); // 다시 직렬화하여 저장
            }
          } else if (action.payload.type === 'character') {
            if (characterArray[action.payload.itemIndex]) {
              characterArray[action.payload.itemIndex].talk = action.payload.newTalk;
              conversation.character = JSON.stringify(characterArray); // 다시 직렬화하여 저장
            }
          }
        }
      }
    },

    removeActionConversationItem: (
      state,
      action: PayloadAction<{
        triggerId: number;
        conversationIndex: number;
        itemIndex: number;
        type: 'user' | 'character';
      }>,
    ) => {
      const trigger = state.currentEpisodeInfo.triggerInfoList.find(trigger => trigger.id === action.payload.triggerId);
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
            userArray.splice(action.payload.itemIndex, 1); // 해당 인덱스를 제거
            conversation.user = JSON.stringify(userArray); // 다시 직렬화하여 저장
          } else if (action.payload.type === 'character') {
            characterArray.splice(action.payload.itemIndex, 1); // 해당 인덱스를 제거
            conversation.character = JSON.stringify(characterArray); // 다시 직렬화하여 저장
          }
        }
      }
    },

    removeActionConversationTalk: (state, action: PayloadAction<{triggerId: number; conversationIndex: number}>) => {
      const trigger = state.currentEpisodeInfo.triggerInfoList.find(trigger => trigger.id === action.payload.triggerId);
      if (trigger) {
        trigger.actionConversationList.splice(action.payload.conversationIndex, 1);
        trigger.actionConversationList.forEach((conversation, idx) => {
          conversation.id = idx;
        });
      }
    },
  },
});

export const {
  setCurrentEpisodeInfo,
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
} = episodeInfoSlice.actions;

export default episodeInfoSlice.reducer;
