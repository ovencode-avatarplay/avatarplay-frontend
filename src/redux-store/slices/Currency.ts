import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// CurrencyInfo 인터페이스에 각종 재화정보
export interface CurrencyInfo {
  star: number;
  ruby: number;
}

// 초기 상태 설정
const initialState: CurrencyInfo = {
  star: 0,
  ruby: 0,
};

// Redux slice 생성
const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setStar: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0) state.star = action.payload;
      else state.star = 0;
    },
    setRuby: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0) state.ruby = action.payload;
      else state.ruby = 0;
    },
  },
});

export const {setStar, setRuby} = currencySlice.actions;
export default currencySlice.reducer;
