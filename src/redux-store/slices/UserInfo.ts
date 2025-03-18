import {LanguageType} from '@/app/NetWork/network-interface/CommonEnums';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// UserState 인터페이스에 유저 이미지와 설명 추가
export interface UserState {
  userId: number;
  profileName: string;
  // userImage: string; // 유저 이미지 (URL 또는 경로)
  profileDescription: string; // 유저 설명
  language: LanguageType;
}

// 초기 상태 설정
const initialState: UserState = {
  userId: 1,
  profileName: '이름은몇글자',
  // userImage: '/path/to/default/image.jpg', // 기본 유저 이미지
  profileDescription: `  사용자 ID 1 : 범수
  // 사용자 ID 2 : 득천
  // 사용자 ID 3 : 종법
  // 사용자 ID 4 : 병욱
  // 사용자 ID 5 : 원석
  // 사용자 ID 6 : 지현
  // 사용자 ID 7 : 범쑤
  // ---- 추가 아이디는 범수님께 문의 ----`, // 기본 유저 설명
  language: LanguageType.한국어,
};

// Redux slice 생성
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      if (action.payload.length > 0) state.userId = parseInt(action.payload, 10);
      else state.userId = 0;
    },
    setLanguage: (state, action: PayloadAction<LanguageType>) => {
      state.language = action.payload; // 언어 설정
    },
  },
});

export const {setUserId, setLanguage} = userSlice.actions;
export default userSlice.reducer;
