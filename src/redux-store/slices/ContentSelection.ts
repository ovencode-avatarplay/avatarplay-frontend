import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

interface ReduxState {
  selectedContentId: number;
  selectedChapterIdx: number;
  selectedEpisodeIdx: number;

  skipContentInit: boolean;
}

const initialState: ReduxState = {
  selectedContentId: 0,
  selectedChapterIdx: 0,
  selectedEpisodeIdx: 0,

  skipContentInit: false,
};

export const ContentSelectionSlice = createSlice({
  name: 'ContentSelection',
  initialState,
  reducers: {
    setSelectedContentId: (state, action: PayloadAction<number>) => {
      // console.log(action.payload);
      state.selectedContentId = action.payload;
    },
    setSelectedChapterIdx: (state, action: PayloadAction<number>) => {
      // console.log(action.payload);
      state.selectedChapterIdx = action.payload;
    },
    setSelectedEpisodeIdx: (state, action: PayloadAction<number>) => {
      // console.log(action.payload);
      state.selectedEpisodeIdx = action.payload;
    },
    setSkipContentInit: (state, action: PayloadAction<boolean>) => {
      state.skipContentInit = action.payload;
    },
  },
});

export const {setSelectedContentId, setSelectedChapterIdx, setSelectedEpisodeIdx, setSkipContentInit} =
  ContentSelectionSlice.actions;
export const ContentSelectionReducer = ContentSelectionSlice.reducer;
export default ContentSelectionSlice.reducer;
