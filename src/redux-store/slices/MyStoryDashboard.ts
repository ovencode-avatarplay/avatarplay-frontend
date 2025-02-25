// myContentDashboardSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// 인터페이스 정의
export interface StoryDashboardItem {
  id: number;
  name: string;
  thumbnail: string;
  episodeCount: number;
  mediaCount: number;
  messageCount: number;
  followCount: number;
  urlLinkKey: string;
  visibilityType: number;
  createAt: string;
  updateAt: string;
}

interface MyStoryDashboardState {
  storyDashBoardList: StoryDashboardItem[];
  loading: boolean;
  error: string | null;
}

// 초기 상태
const initialState: MyStoryDashboardState = {
  storyDashBoardList: [],
  loading: false,
  error: null,
};

// Slice 생성
export const myContentDashboardSlice = createSlice({
  name: 'myContentDashboard',
  initialState,
  reducers: {
    setContentDashboardList: (state, action: PayloadAction<StoryDashboardItem[]>) => {
      state.storyDashBoardList = action.payload;
    },
  },
});

export const {setContentDashboardList: setStoryDashboardList} = myContentDashboardSlice.actions;
export default myContentDashboardSlice.reducer;
