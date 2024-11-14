import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// 초기 상태 타입 정의
export type ModifyQuestionState = {
  isModifying: boolean; // 수정 중 여부를 나타내는 상태
  modifyingText: string; // 수정 중인 텍스트
};

// 초기 상태
export const initialStateModifyQuestion: ModifyQuestionState = {
  isModifying: false, // 초기 상태는 false로 설정
  modifyingText: '', // 초기 텍스트는 빈 문자열
};

export const modifyQuestionSlice = createSlice({
  name: 'modifyQuestion',
  initialState: initialStateModifyQuestion,
  reducers: {
    setIsModifying: (state, action: PayloadAction<boolean>) => {
      state.isModifying = action.payload;
    },
    setModifyingText: (state, action: PayloadAction<string>) => {
      state.modifyingText = action.payload;
    },
  },
});

// 액션과 리듀서 내보내기
export const {setIsModifying, setModifyingText} = modifyQuestionSlice.actions;

export default modifyQuestionSlice.reducer;
