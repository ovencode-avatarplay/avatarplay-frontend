import {Message} from '@/app/view/main/content/Chat/MainChat/ChatTypes';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// 초기 상태 타입 정의
export type ModifyQuestionState = {
  isModifyingQuestion: boolean; // 수정 중 여부를 나타내는 상태
  modifyingQuestion: string; // 수정 중인 텍스트

  isRegenerateAnswer: boolean; // 답변 재생성 요청 상태

  lastMessageId: number;
  lastMessageQuestion: string;
};

// 초기 상태
export const initialStateModifyQuestion: ModifyQuestionState = {
  isModifyingQuestion: false,
  modifyingQuestion: '',

  isRegenerateAnswer: false,

  lastMessageId: -3,
  lastMessageQuestion: '',
};

export const modifyQuestionSlice = createSlice({
  name: 'modifyQuestion',
  initialState: initialStateModifyQuestion,
  reducers: {
    setIsModifyingQuestion: (state, action: PayloadAction<boolean>) => {
      state.isModifyingQuestion = action.payload;
    },
    setModifyingQuestion: (state, action: PayloadAction<string>) => {
      state.modifyingQuestion = action.payload;
    },
    setIsRegenerateAnswer: (state, action: PayloadAction<boolean>) => {
      state.isRegenerateAnswer = action.payload;
    },
    setLastMessageId: (state, action: PayloadAction<number>) => {
      state.lastMessageId = action.payload;
    },
    setLastMessageQuestion: (state, action: PayloadAction<{lastMessageId: number; lastMessageQuestion: string}>) => {
      state.lastMessageId = action.payload.lastMessageId;
      state.lastMessageQuestion = action.payload.lastMessageQuestion;
    },
  },
});

// 액션과 리듀서 내보내기
export const {
  setIsModifyingQuestion,
  setModifyingQuestion,
  setIsRegenerateAnswer,
  setLastMessageId,
  setLastMessageQuestion,
} = modifyQuestionSlice.actions;

export default modifyQuestionSlice.reducer;
