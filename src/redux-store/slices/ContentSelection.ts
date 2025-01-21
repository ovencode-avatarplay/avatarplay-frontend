import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

interface ReduxState {}

const initialState: ReduxState = {};

export const ContentSelectionSlice = createSlice({
  name: 'ContentSelection',
  initialState,
  reducers: {},
});

export const {} = ContentSelectionSlice.actions;
export const ContentSelectionReducer = ContentSelectionSlice.reducer;
export default ContentSelectionSlice.reducer;
