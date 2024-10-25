// Third-party Imports
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

// Type Imports
// import type {Type} from '@/loc/loc/Type'

// 다른 컴포넌트에서도 사용 가능하게 외부에서 선언한 Type을 받아서 쓰는것을 권장하지만, 일단은 인터페이스를 여기서 선언
export interface ReduxSampleData {
  key: number;
  data: string;
}
// ReduxState 인터페이스
interface ReduxSampleState {
  redux: Record<number, ReduxSampleData>; // C#의 Dictionary처럼 key-value 형태
}

// Data Imports
// import {db} from '@/loc/loc/db'

// 받아온 데이터를 넣어주거나 초기값을 지정해주기.
const initialState: ReduxSampleState = {
  redux: {}, // 빈 객체로 초기화
};

export const reduxSampleSlice = createSlice({
  name: 'sample',
  initialState: /*db*/ initialState, // 받아온 데이터를 넣어주거나 아예 초기값을 넣어주기.
  reducers: {
    // Data 추가
    AddSampleData: (state, action: PayloadAction<ReduxSampleData>) => {
      const sampleData = action.payload;
      state.redux[sampleData.key] = sampleData; // key를 기준으로 데이터 추가
    },

    // Data 수정
    SetSampleData: (state, action: PayloadAction<ReduxSampleData>) => {
      const sampleData = action.payload;
      if (state.redux[sampleData.key]) {
        state.redux[sampleData.key] = sampleData; // 해당 key에 있는 데이터 수정
      }
    },

    // Data 삭제 (key 타입은 number)
    RemoveSampleData: (state, action: PayloadAction<number>) => {
      const key = action.payload;
      if (state.redux[key]) {
        delete state.redux[key]; // 해당 key의 데이터 삭제
      }
    },

    // reducer는 필요에 따라 구현
  },
});

export const {AddSampleData, SetSampleData, RemoveSampleData} = reduxSampleSlice.actions;
export const reduxSampleReducer = reduxSampleSlice.reducer;
export default reduxSampleSlice.reducer;
