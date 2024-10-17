import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

interface ReduxState {
  selectedChapterId: number;
  selectedEpisodeId: number;
  selectedContentId: number;
}

const initialState: ReduxState = {
  selectedChapterId: 0,
  selectedEpisodeId: 0,
  selectedContentId: 0,
};

export const ContentSelectionSlice = createSlice({
  name: 'ContentSelection',
  initialState,
  reducers: {
    setSelectedChapter: (state, action: PayloadAction<number>) => {
      console.log(action.payload);
      state.selectedChapterId = action.payload;
    },
    setSelectedEpisode: (state, action: PayloadAction<number>) => {
      console.log(action.payload);
      state.selectedEpisodeId = action.payload;
    },
    setSelectedContentID: (state, action: PayloadAction<number>) => {
      console.log(action.payload);
      state.selectedContentId = action.payload;
    },
  },
});

export const {setSelectedChapter, setSelectedEpisode, setSelectedContentID} = ContentSelectionSlice.actions;
export const ContentSelectionReducer = ContentSelectionSlice.reducer;
export default ContentSelectionSlice.reducer;
