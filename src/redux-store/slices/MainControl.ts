// src/redux-store/slices/MainControl.ts

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface MainControlState {
  selectedIndex: number;
  bottomNavColor: number;
  homeFeedRecommendState: number;
}

const initialState: MainControlState = {
  selectedIndex: 0,
  bottomNavColor: 1,
  homeFeedRecommendState: 0,
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
    setRecommendState(state, action: PayloadAction<number>) {
      state.homeFeedRecommendState = action.payload;
    },
  },
});

export const {setSelectedIndex, setBottomNavColor, setRecommendState} = mainControlSlice.actions;
export default mainControlSlice.reducer;
