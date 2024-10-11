import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 초기 상태 타입 정의
export type ChattingState = {
    contentName: string;
    episodeName: string;
    episodeId: number;
  };

// 초기 상태
export const initialStateChatting: ChattingState = {
  contentName: '컨텐츠네임',
  episodeName: '에피소드네임',
  episodeId: 18,
};

export const chattingSlice = createSlice({
  name: 'chatting',
  initialState: initialStateChatting,
  reducers: {
        setContentName: (state, action: PayloadAction<string>) => {
        state.contentName = action.payload;  // action.payload에서 contentName을 업데이트
        },
        setEpisodeName: (state, action: PayloadAction<string>) => {
        state.episodeName = action.payload;  // episodeName을 업데이트하는 reducer
        },
        setEpisodeId: (state, action: PayloadAction<number>) => {
            state.episodeId = action.payload;  // episodeName을 업데이트하는 reducer
        },
        setStateChatting: (state, action: PayloadAction<ChattingState>) =>
        {
            // 전체 상태를 새롭게 업데이트
            state.contentName = action.payload.contentName;
            state.episodeName = action.payload.episodeName;
            state.episodeId = action.payload.episodeId;
            console.log( 'state ' , state );
        }
    }
});

// 액션과 리듀서 내보내기
export const { setContentName, setEpisodeName, setEpisodeId, setStateChatting } = chattingSlice.actions;
export default chattingSlice.reducer;
