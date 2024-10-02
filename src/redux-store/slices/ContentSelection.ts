import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SelectedEpisode {
    chapterId: number;
    episodeId: number;
}

interface ReduxState {
    selectedChapter: number | null;
    selectedEpisode: SelectedEpisode | null;
    contentID: number | null;
}

const initialState: ReduxState = {
    selectedChapter: null,
    selectedEpisode: null,
    contentID: null,
};

export const ContentSelectionSlice = createSlice({
    name: 'ContentSelection',
    initialState,
    reducers: {
        setSelectedChapter: (state, action: PayloadAction<number | null>) => {
            state.selectedChapter = action.payload;
        },
        setSelectedEpisode: (state, action: PayloadAction<SelectedEpisode | null>) => {
            state.selectedEpisode = action.payload;
        },
        setContentID: (state, action: PayloadAction<number | null>) => { 
            state.contentID = action.payload;
        },
    },
});

export const { setSelectedChapter, setSelectedEpisode, setContentID } = ContentSelectionSlice.actions;
export const ContentSelectionReducer = ContentSelectionSlice.reducer;
export default ContentSelectionSlice.reducer;
