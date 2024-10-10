import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 초기 상태
const initialState = {
  contentName: '',
  episodeName: '',
  episodeId: 0,
};

export const chattingSlice = createSlice({
  name: 'chatting',
  initialState,
  reducers: {
        setContentName: (state, action: PayloadAction<string>) => {
        state.contentName = action.payload;  // action.payload에서 contentName을 업데이트
        },
        setEpisodeName: (state, action: PayloadAction<string>) => {
        state.episodeName = action.payload;  // episodeName을 업데이트하는 reducer
        },
        setEpisodeId: (state, action: PayloadAction<number>) => {
            state.episodeId = action.payload;  // episodeName을 업데이트하는 reducer
        }
    }
});

// 액션과 리듀서 내보내기
export const { setContentName, setEpisodeName, setEpisodeId } = chattingSlice.actions;
export default chattingSlice.reducer;
