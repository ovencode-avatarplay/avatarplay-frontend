// publishInfo.ts

import {LLMSetupInfo, PublishInfo} from './ContentInfo';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import emptyContent from '@/data/create/empty-content-info-data.json';

const initialState: PublishInfo = emptyContent.data.contentInfo.publishInfo;

export const PublishInfoSlice = createSlice({
  name: 'PublishInfo',
  initialState,
  reducers: {
    setPublishInfo: (state, action: PayloadAction<PublishInfo>) => {
      state.languageType = action.payload.languageType;
      state.thumbnail = action.payload.thumbnail;
      state.contentName = action.payload.contentName;
      state.contentDescription = action.payload.contentDescription;
      state.authorComment = action.payload.authorComment;
      state.selectTagList = action.payload.selectTagList;
      state.visibilityType = action.payload.visibilityType;
      state.monetization = action.payload.monetization;
      state.nsfw = action.payload.nsfw;
    },

    setLanguageType: (state, action: PayloadAction<number>) => {
      state.languageType = action.payload;
    },
    setThumbnail: (state, action: PayloadAction<string>) => {
      state.thumbnail = action.payload;
    },
    setContentName: (state, action: PayloadAction<string>) => {
      state.contentName = action.payload;
    },
    setContentDescription: (state, action: PayloadAction<string>) => {
      state.contentDescription = action.payload;
    },
    setAuthorName: (state, action: PayloadAction<string>) => {
      state.authorName = action.payload;
    },
    setAuthorComment: (state, action: PayloadAction<string>) => {
      state.authorComment = action.payload;
    },
    setSelectedTags: (state, action: PayloadAction<string[]>) => {
      state.selectTagList = action.payload;
    },
    setVisibility: (state, action: PayloadAction<number>) => {
      state.visibilityType = action.payload;
    },
    setMonetization: (state, action: PayloadAction<boolean>) => {
      state.monetization = action.payload;
    },
    setNSFW: (state, action: PayloadAction<number>) => {
      state.nsfw = action.payload;
    },
    setLlmSetupInfo(state, action: PayloadAction<LLMSetupInfo>) {
      state.llmSetupInfo = action.payload; // LLM 설정 정보 업데이트
    },
  },
});

export const {
  setPublishInfo,
  setLanguageType,
  setThumbnail,
  setContentName,
  setContentDescription,
  setAuthorName,
  setAuthorComment,
  setSelectedTags,
  setVisibility,
  setMonetization,
  setNSFW,
  setLlmSetupInfo,
} = PublishInfoSlice.actions;
export const PublishInfoSliceReducer = PublishInfoSlice.reducer;
export default PublishInfoSlice.reducer;
