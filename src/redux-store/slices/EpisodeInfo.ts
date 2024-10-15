// redux-store/slices/EpisodeInfoSlice.ts

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
    // 페어 추가 (name도 입력받도록 수정)
    addTriggerInfo: (state, action: PayloadAction<Omit<TriggerInfo, 'id'>>) => {
      const newDataPair: TriggerInfo = {
        ...action.payload,
        id: state.currentEpisodeInfo.triggerInfoList.length, // 배열의 인덱스를 id로 사용
      };
      state.currentEpisodeInfo.triggerInfoList.push(newDataPair);
    },

    // 특정 페어 수정
    updateTriggerInfo: (state, action: PayloadAction<{id: number; info: Omit<TriggerInfo, 'id'>}>) => {
      const {id, info} = action.payload;
      const triggerIndex = state.currentEpisodeInfo.triggerInfoList.findIndex(trigger => trigger.id === id);

      if (triggerIndex !== -1) {
        state.currentEpisodeInfo.triggerInfoList[triggerIndex] = {...info, id}; // id 유지하면서 정보 업데이트
      }
    },

    // 특정 페어 이름만 수정
    updateTriggerInfoName: (state, action: PayloadAction<{id: number; name: string}>) => {
      const {id, name} = action.payload;
      const pair = state.currentEpisodeInfo.triggerInfoList.find(pair => pair.id === id); // id로 페어 찾기
      //if (pair) {
      //  pair.name = name; // name 필드 업데이트
      //}
    },

    // 특정 페어 삭제 후 id 업데이트
    removeTriggerInfo: (state, action: PayloadAction<number>) => {
      state.currentEpisodeInfo.triggerInfoList.splice(action.payload, 1); // 해당 index의 페어 삭제

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
      const {conversationIndex, type, newTalk} = action.payload;
      const conversation = state.currentEpisodeInfo.conversationTemplateList[conversationIndex];

      if (conversation) {
        const newTalkItem: ConversationTalkInfo = {
          type: type === 'user' ? ConversationTalkType.Speech : ConversationTalkType.Action,
          talk: newTalk,
        };

        if (type === 'user') {
          const userArray = JSON.parse(conversation.user) as ConversationTalkInfo[]; // 역직렬화
          userArray.push(newTalkItem);
          conversation.user = JSON.stringify(userArray); // 다시 직렬화하여 저장
        } else if (type === 'character') {
          const characterArray = JSON.parse(conversation.character) as ConversationTalkInfo[]; // 역직렬화
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
      const {conversationIndex, itemIndex, type, newTalk} = action.payload;
      const conversation = state.currentEpisodeInfo.conversationTemplateList[conversationIndex];

      if (conversation) {
        if (type === 'user') {
          const userArray = JSON.parse(conversation.user) as ConversationTalkInfo[]; // 역직렬화
          if (userArray[itemIndex]) {
            userArray[itemIndex].talk = newTalk;
            conversation.user = JSON.stringify(userArray); // 다시 직렬화하여 저장
          }
        } else if (type === 'character') {
          const characterArray = JSON.parse(conversation.character) as ConversationTalkInfo[]; // 역직렬화
          if (characterArray[itemIndex]) {
            characterArray[itemIndex].talk = newTalk;
            conversation.character = JSON.stringify(characterArray); // 다시 직렬화하여 저장
          }
        }
      }
    },

    removeConversationItem: (
      state,
      action: PayloadAction<{conversationIndex: number; itemIndex: number; type: 'user' | 'character'}>,
    ) => {
      const {conversationIndex, itemIndex, type} = action.payload;
      const conversation = state.currentEpisodeInfo.conversationTemplateList[conversationIndex];

      if (conversation) {
        if (type === 'user') {
          const userArray = JSON.parse(conversation.user) as ConversationTalkInfo[]; // 역직렬화
          userArray.splice(itemIndex, 1); // 해당 인덱스를 제거
          conversation.user = JSON.stringify(userArray); // 다시 직렬화하여 저장
        } else if (type === 'character') {
          const characterArray = JSON.parse(conversation.character) as ConversationTalkInfo[]; // 역직렬화
          characterArray.splice(itemIndex, 1); // 해당 인덱스를 제거
          conversation.character = JSON.stringify(characterArray); // 다시 직렬화하여 저장
        }
      }
    },

    removeConversationTalk: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.currentEpisodeInfo.conversationTemplateList.splice(index, 1);
      state.currentEpisodeInfo.conversationTemplateList.forEach((conversation, idx) => {
        conversation.id = idx;
      });
    },
  },
});

export const {
  setCurrentEpisodeInfo,
  updateEpisodeDescription,
  addTriggerInfo: addTriggerInfo,
  updateTriggerInfo: updateTriggerInfo,
  updateTriggerInfoName: updateTriggerInfoName,
  removeTriggerInfo: removeTriggerInfo,
  addConversationTalk,
  addConversationTalkItem,
  updateConversationTalk,
  removeConversationItem,
  removeConversationTalk,
  setLlmSetupInfo,
} = episodeInfoSlice.actions;

export default episodeInfoSlice.reducer;
