import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@/redux-store/ReduxStore'; // store.ts에서 정의한 RootState를 import

export type CommonRedux = {
  lastUrlLink: string;
};

export const initialCommonRedux: CommonRedux = {
  lastUrlLink: '',
};

export const getLastUrlLink = (state: RootState) => state.commonRedux.lastUrlLink;
export const commonReduxSlice = createSlice({
  name: 'commonRedux',
  initialState: initialCommonRedux,
  reducers: {
    setLastUrlLink: (state, action: PayloadAction<string>) => {
      state.lastUrlLink = action.payload;
      console.log('setLastUrlLink', action.payload);
    },
  },
});

// 액션과 리듀서 내보내기
export const {setLastUrlLink} = commonReduxSlice.actions;
export default commonReduxSlice.reducer;
