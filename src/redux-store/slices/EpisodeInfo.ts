// redux-store/slices/EpisodeInfoSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EpisodeInfo } from '@/types/apps/content/episode/episodeInfo';
import { EpisodeDescription } from "@/types/apps/content/episode/episodeDescription";
import { TriggerInfo } from '@/types/apps/content/episode/triggerInfo';
import { Conversation } from '@/types/apps/content/episode/conversation';
import { LLMSetupInfo } from '@/types/apps/content/episode/llmSetupInfo';

import defaultContent from '@/data/create/content-info-data.json';


interface EpisodeInfoState {
    currentEpisodeInfo: EpisodeInfo; // 현재 선택된 EpisodeInfo
}

const initialState: EpisodeInfoState = {
    currentEpisodeInfo : defaultContent.contentInfo[0].chapterInfoList[0].episodeInfoList[0],
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
        addTriggerInfo(state, action: PayloadAction<TriggerInfo>) {
            if (state.currentEpisodeInfo) {
                state.currentEpisodeInfo.triggerInfoList.push(action.payload); // 트리거 정보 추가
            }
        },
        updateTriggerInfo(state, action: PayloadAction<TriggerInfo>) {
            if (state.currentEpisodeInfo) {
                const index = state.currentEpisodeInfo.triggerInfoList.findIndex(trigger => trigger.id === action.payload.id);
                if (index !== -1) {
                    state.currentEpisodeInfo.triggerInfoList[index] = action.payload; // 트리거 정보 업데이트
                }
            }
        },
        deleteTriggerInfo(state, action: PayloadAction<number>) {
            if (state.currentEpisodeInfo) {
                state.currentEpisodeInfo.triggerInfoList = state.currentEpisodeInfo.triggerInfoList.filter(trigger => trigger.id !== action.payload); // 트리거 정보 삭제
            }
        },
        addConversationTemplate(state, action: PayloadAction<Conversation>) {
            if (state.currentEpisodeInfo) {
                state.currentEpisodeInfo.conversationTemplateList.push(action.payload); // 대화 템플릿 추가
            }
        },
        updateConversationTemplate(state, action: PayloadAction<Conversation>) {
            // if (state.currentEpisodeInfo) {
            //     const index = state.currentEpisodeInfo.conversationTemplateList.findIndex(template => template.id === action.payload.id);
            //     if (index !== -1) {
            //         state.currentEpisodeInfo.conversationTemplateList[index] = action.payload; // 대화 템플릿 업데이트
            //     }
            // }
        },
        deleteConversationTemplate(state, action: PayloadAction<number>) {
            // if (state.currentEpisodeInfo) {
            //     state.currentEpisodeInfo.conversationTemplateList = state.currentEpisodeInfo.conversationTemplateList.filter(template => template.id !== action.payload); // 대화 템플릿 삭제
            // }
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
    updateEpisodeDescription,
    addTriggerInfo,
    updateTriggerInfo,
    deleteTriggerInfo,
    addConversationTemplate,
    updateConversationTemplate,
    deleteConversationTemplate,
    setLlmSetupInfo,
} = episodeInfoSlice.actions;

export default episodeInfoSlice.reducer;
