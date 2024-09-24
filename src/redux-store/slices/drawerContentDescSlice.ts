// drawerContentDescSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DrawerContentDescState {
  open: boolean;
  id: string | null;
}

const initialState: DrawerContentDescState = {
  open: false,
  id: null,
};

const drawerContentDescSlice = createSlice({
  name: 'drawerContentDesc',
  initialState,
  reducers: {
    openDrawerContentDesc(state, action: PayloadAction<string>) {
      state.open = true;
      state.id = action.payload;
    },
    closeDrawerContentDesc(state) {
      state.open = false;
      state.id = null;
    },
  },
});

export const { openDrawerContentDesc, closeDrawerContentDesc } = drawerContentDescSlice.actions;
export default drawerContentDescSlice.reducer;
