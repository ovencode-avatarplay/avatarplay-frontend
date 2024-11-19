import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface SendRegenerateQuestionReq {
  id: number;
  text: string;
  emoticonId?: number;
}
// 초기 상태 타입 정의
export type ModifyQuestionState = {
  // 질문 재생성
  isRegeneratingQuestion: boolean; // 수정 중 여부를 나타내는 상태
  regeneratingQuestion: SendRegenerateQuestionReq; // 질문 재생성을 위한 마지막 질문
};

// 초기 상태
export const initialStateModifyQuestion: ModifyQuestionState = {
  isRegeneratingQuestion: false,

  regeneratingQuestion: {id: -333, text: 'regenerating question message', emoticonId: 0},
};

export const modifyQuestionSlice = createSlice({
  name: 'modifyQuestion',
  initialState: initialStateModifyQuestion,
  reducers: {
    setIsRegeneratingQuestion: (state, action: PayloadAction<boolean>) => {
      state.isRegeneratingQuestion = action.payload;
    },
    setRegeneratingQuestion: (state, action: PayloadAction<{lastMessageId: number; lastMessageQuestion: string}>) => {
      state.regeneratingQuestion.id = action.payload.lastMessageId;
      state.regeneratingQuestion.text = action.payload.lastMessageQuestion;
      state.regeneratingQuestion.emoticonId = 0;
    },
  },
});

// 액션과 리듀서 내보내기
export const {setIsRegeneratingQuestion, setRegeneratingQuestion} = modifyQuestionSlice.actions;

export default modifyQuestionSlice.reducer;
