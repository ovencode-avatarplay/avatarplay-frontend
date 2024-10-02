import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// UserState 인터페이스에 유저 이미지와 설명 추가
export interface UserState {
  userId: string;
  name: string;
  userImage: string; // 유저 이미지 (URL 또는 경로)
  userDescription: string; // 유저 설명
}

// 초기 상태 설정
const initialState: UserState = {
  userId: '1',
  name: '이름은몇글자',
  userImage: '/path/to/default/image.jpg', // 기본 유저 이미지
  userDescription: `  사용자 ID 1 : 범수
  사용자 ID 2 : 득천
  사용자 ID 3 : 종법
  사용자 ID 4 : 병욱
  사용자 ID 5 : 원석
  사용자 ID 6 : 지현
  사용자 ID 7 : 범쑤
  ---- 추가 아이디는 범수님께 문의 ----`  // 기본 유저 설명
};

// Redux slice 생성
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setUserImage: (state, action: PayloadAction<string>) => {
      state.userImage = action.payload;
    },
    setUserDescription: (state, action: PayloadAction<string>) => {
      state.userDescription = action.payload;
    },
  },
});

export const { setUserId, setUserName, setUserImage, setUserDescription } = userSlice.actions;
export default userSlice.reducer;
