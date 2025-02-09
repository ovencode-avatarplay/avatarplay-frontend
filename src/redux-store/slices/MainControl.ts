// src/redux-store/slices/MainControl.ts

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface MainControlState {
  selectedIndex: number;
  bottomNavColor: number;
}

const initialState: MainControlState = {
  selectedIndex: 0,
  bottomNavColor: 1,
};

const mainControlSlice = createSlice({
  name: 'mainControl',
  initialState,
  reducers: {
    setSelectedIndex(state, action: PayloadAction<number>) {
      state.selectedIndex = action.payload;
    },
    setBottomNavColor(state, action: PayloadAction<number>) {
      state.bottomNavColor = action.payload;
    },
  },
});

export const {setSelectedIndex, setBottomNavColor} = mainControlSlice.actions;
export default mainControlSlice.reducer;
