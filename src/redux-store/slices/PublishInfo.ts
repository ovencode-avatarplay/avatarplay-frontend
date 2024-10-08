// publishInfo.ts

import { PublishInfo } from '@/types/apps/content/chapter/publishInfo';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PublishInfo = {
    languageType: 0,
    contentName: "string",
    thumbnail: "string",
    contentDescription: "string",
    authorName: "string",
    authorComment: "string",
    // selectedTags: [],
    visibilityType: 0,
    monetization: true,
    nsfw: 0,
};

export const PublishInfoSlice = createSlice({
    name: 'PublishInfo',
    initialState,
    reducers: {
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
            // state.selectedTags = action.payload;
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