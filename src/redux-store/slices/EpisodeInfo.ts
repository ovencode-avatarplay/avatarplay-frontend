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
        // 페어 추가 (name도 입력받도록 수정)
        addTriggerInfo: (state, action: PayloadAction<Omit<TriggerInfo, 'id'>>) => {
            const newDataPair: TriggerInfo = { 
                ...action.payload, 
                id: state.currentEpisodeInfo.triggerInfoList.length // 배열의 인덱스를 id로 사용
            };
            state.currentEpisodeInfo.triggerInfoList.push(newDataPair);
        },

        // 특정 페어 수정
        updateTriggerInfo: (state, action: PayloadAction<{ id: number, info: Omit<TriggerInfo, 'id'> }>) => {
            const { id, info } = action.payload;
            const triggerIndex = state.currentEpisodeInfo.triggerInfoList.findIndex(trigger => trigger.id === id);
        
            if (triggerIndex !== -1) {
                state.currentEpisodeInfo.triggerInfoList[triggerIndex] = { ...info, id }; // id 유지하면서 정보 업데이트
            }
        },

        // 특정 페어 이름만 수정
        updateTriggerInfoName: (state, action: PayloadAction<{ id: number, name: string }>) => {
            const { id, name } = action.payload;
            const pair = state.currentEpisodeInfo.triggerInfoList.find(pair => pair.id === id); // id로 페어 찾기
            if (pair) {
                pair.name = name; // name 필드 업데이트
            }
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
    addTriggerInfo: addTriggerInfo, updateTriggerInfo: updateTriggerInfo, updateTriggerInfoName: updateTriggerInfoName, removeTriggerInfo: removeTriggerInfo,
    addConversationTemplate,
    updateConversationTemplate,
    deleteConversationTemplate,
    setLlmSetupInfo,
} = episodeInfoSlice.actions;

export default episodeInfoSlice.reducer;
