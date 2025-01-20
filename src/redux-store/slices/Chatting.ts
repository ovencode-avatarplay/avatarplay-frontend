import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// 초기 상태 타입 정의
export type ChattingState = {
  contentName: string;
  episodeName: string;
  contentId: number; // url enter방식일때 필수. 그 외에는 아무값이나 넣어도 됨 ( 24년-11-11 )
  episodeId: number;
  contentUrl: string;
  streamKey: string;
};

// 초기 상태
export const initialStateChatting: ChattingState = {
  contentName: '',
  episodeName: '',
  contentId: 0,
  episodeId: 0,
  contentUrl: '',
  streamKey: '',
};

export const chattingSlice = createSlice({
  name: 'chatting',
  initialState: initialStateChatting,
  reducers: {
    setContentName: (state, action: PayloadAction<string>) => {
      state.contentName = action.payload; // action.payload에서 contentName을 업데이트
    },
    setEpisodeName: (state, action: PayloadAction<string>) => {
      state.episodeName = action.payload; // episodeName을 업데이트하는 reducer
    },
    setEpisodeId: (state, action: PayloadAction<number>) => {
      state.episodeId = action.payload; // episodeId 업데이트하는 reducer
    },
    setContentId: (state, action: PayloadAction<number>) => {
      state.contentId = action.payload; // contentId 업데이트하는 reducer
    },
    setStreamKey: (state, action: PayloadAction<string>) => {
      state.streamKey = action.payload;
    },
    setStateChatting: (state, action: PayloadAction<ChattingState>) => {
      // 전체 상태를 새롭게 업데이트
      state.contentName = action.payload.contentName;
      state.episodeName = action.payload.episodeName;
      state.episodeId = action.payload.episodeId;
      state.contentId = action.payload.contentId;
      state.streamKey = action.payload.streamKey;
      console.log('state ', state);
    },
  },
});

// 액션과 리듀서 내보내기
export const {setContentName, setEpisodeName, setEpisodeId, setContentId, setStreamKey, setStateChatting} = chattingSlice.actions;
export default chattingSlice.reducer;
