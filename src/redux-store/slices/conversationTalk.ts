import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConversationTalkInfo } from '@/types/apps/dataTypes'; // 데이터 타입을 불러오기

// ReduxState 인터페이스
interface ConversationTalkInfoState {
    conversationList: ConversationTalkInfo[]; // 여러 개의 대화 정보를 저장하는 배열
}

// 초기 상태 정의
const initialState: ConversationTalkInfoState = {
    conversationList: [], // 빈 배열로 초기화
};

export const conversationTalkSlice = createSlice({
    name: 'conversationTalk',
    initialState,
    reducers: {
        // 대화 정보 추가
        addConversationTalk: (state, action: PayloadAction<ConversationTalkInfo>) => {
            state.conversationList.push(action.payload);
        },

        // 특정 대화 정보 수정
        updateConversationTalk: (state, action: PayloadAction<{ index: number, talkInfo: ConversationTalkInfo }>) => {
            const { index, talkInfo } = action.payload;
            if (state.conversationList[index]) {
                state.conversationList[index] = {
                    ...state.conversationList[index], // 기존 정보 유지
                    ...talkInfo, // 새로운 정보로 업데이트
                }; 
            }
        },

        // 특정 대화 정보 삭제
        removeConversationTalk: (state, action: PayloadAction<number>) => {
            state.conversationList.splice(action.payload, 1); // 해당 index의 대화 정보 삭제
        },
    },
});

// 액션 및 리듀서 내보내기
export const { addConversationTalk, updateConversationTalk, removeConversationTalk } = conversationTalkSlice.actions;
export const conversationTalkReducer = conversationTalkSlice.reducer;
export default conversationTalkSlice.reducer;
