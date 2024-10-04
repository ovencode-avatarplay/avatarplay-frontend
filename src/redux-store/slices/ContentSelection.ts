import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ReduxState {
    selectedChapter: number;
    selectedEpisode: number;
    contentID: number;
}

const initialState: ReduxState = {
    selectedChapter: 0,
    selectedEpisode: 0,
    contentID: 0,
};

export const ContentSelectionSlice = createSlice({
    name: 'ContentSelection',
    initialState,
    reducers: {
        setSelectedChapter: (state, action: PayloadAction<number>) => {
            state.selectedChapter = action.payload;
        },
        setSelectedEpisode: (state, action: PayloadAction<number>) => {
            state.selectedEpisode = action.payload;
        },
        setContentID: (state, action: PayloadAction<number>) => { 
            state.contentID = action.payload;
        },
    },
});

export const { setSelectedChapter, setSelectedEpisode, setContentID } = ContentSelectionSlice.actions;
export const ContentSelectionReducer = ContentSelectionSlice.reducer;
export default ContentSelectionSlice.reducer;
