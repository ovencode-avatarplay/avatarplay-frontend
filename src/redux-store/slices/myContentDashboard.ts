// myContentDashboardSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// 인터페이스 정의
export interface ContentDashboardItem {
  id: number;
  name: string;
  thumbnail: string;
  messageCount: number;
  followCount: number;
  thumbnailCount: number;
  videoCount: number;
  createAt: string;
}

interface MyContentDashboardState {
  contentDashBoardList: ContentDashboardItem[];
  loading: boolean;
  error: string | null;
}

// 초기 상태
const initialState: MyContentDashboardState = {
  contentDashBoardList: [],
  loading: false,
  error: null,
};

// Slice 생성
export const myContentDashboardSlice = createSlice({
  name: 'myContentDashboard',
  initialState,
  reducers: {
    setContentDashboardList: (state, action: PayloadAction<ContentDashboardItem[]>) => {
      state.contentDashBoardList = action.payload;
    },
  },
});

export const {setContentDashboardList} = myContentDashboardSlice.actions;
export default myContentDashboardSlice.reducer;
