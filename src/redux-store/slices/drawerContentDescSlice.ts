// drawerContentDescSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface DrawerContentDescState {
  open: boolean;
  contentId: number;
  episodeId: number;
}

const initialState: DrawerContentDescState = {
  open: false,
  contentId: 0,
  episodeId: 0,
};

const drawerContentDescSlice = createSlice({
  name: 'drawerContentDesc',
  initialState,
  reducers: {
    openDrawerContentId(state, action: PayloadAction<number>) {
      state.open = true;
      state.contentId = action.payload;
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

export const {openDrawerContentId, setDrawerEpisodeId, closeDrawerContentDesc} = drawerContentDescSlice.actions;
export default drawerContentDescSlice.reducer;
