// drawerContentDescSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DrawerCharacterDescState {
  open: boolean;
  contentId: number;
  episodeId: number;
  characterId: number;
}

const initialState: DrawerCharacterDescState = {
  open: false,
  contentId: 0,
  episodeId: 0,
  characterId: 0,
};

const DrawerCharacterDescSlice = createSlice({
  name: 'drawerCharacterDesc',
  initialState,
  reducers: {
    openDrawerContentId(state, action: PayloadAction<number>) {
      state.open = true;
      state.contentId = action.payload;
    },
    openDrawerCharacterId(state, action: PayloadAction<number>) {
      state.open = true;
      state.characterId = action.payload;
    },
    setDrawerEpisodeId(state, action: PayloadAction<number>) {
      state.episodeId = action.payload;
    },
    closeDrawerContentDesc(state) {
      state.open = false;
      state.contentId = 0;
      state.episodeId = 0;
    },
  },
});

export const { openDrawerContentId, setDrawerEpisodeId, closeDrawerContentDesc, openDrawerCharacterId } = DrawerCharacterDescSlice.actions;
export default DrawerCharacterDescSlice.reducer;
