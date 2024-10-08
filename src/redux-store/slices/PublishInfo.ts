// publishInfo.ts

import { PublishInfo } from '@/types/apps/content/chapter/publishInfo';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { number } from 'valibot';

const initialState: PublishInfo = {
    languageType: 0,
    contentName: "string",
    thumbnail: "string",
    contentDescription: "string",
    authorName: "string",
    authorComment: "string",
    contentTag : ["string"],
    selectContentTag: ["string"],
    visibilityType: 0,
    monetization: true,
    nsfw: 0,
};

export const PublishInfoSlice = createSlice({
    name: 'PublishInfo',
    initialState,
    reducers: {

        setContentInfo: (state, action: PayloadAction<PublishInfo>) => {            
            state.languageType = action.payload.languageType;
            state.contentName = action.payload.contentName;
            state.contentDescription = action.payload.contentDescription;
            state.authorComment = action.payload.authorComment;
            state.selectContentTag = action.payload.selectContentTag;
            state.visibilityType = action.payload.visibilityType;
            state.monetization = action.payload.monetization;
            state.nsfw = action.payload.nsfw;
        },

        setLanguageType: (state, action: PayloadAction<number>) => {
            state.languageType = action.payload;
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
            state.selectContentTag = action.payload;
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
    },
});

export const {
    setContentInfo,
    setLanguageType,
    setContentName,
    setContentDescription,
    setAuthorName,
    setAuthorComment,
    setSelectedTags,
    setVisibility,
    setMonetization,
    setNSFW
} = PublishInfoSlice.actions;
export const PublishInfoSliceReducer = PublishInfoSlice.reducer;
export default PublishInfoSlice.reducer;