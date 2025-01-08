// src/redux-store/slices/MainControl.ts

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface MainControlState {
  selectedIndex: number;
}

const initialState: MainControlState = {
  selectedIndex: 0,
};

const mainControlSlice = createSlice({
  name: 'mainControl',
  initialState,
  reducers: {
    setSelectedIndex(state, action: PayloadAction<number>) {
      state.selectedIndex = action.payload;
    },
  },
});

export const {setSelectedIndex} = mainControlSlice.actions;
export default mainControlSlice.reducer;
