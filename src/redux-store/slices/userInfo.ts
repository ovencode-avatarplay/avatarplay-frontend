import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import  episodeDesc   from "@content/episode/episodeDescription";

// UserState 인터페이스에 유저 이미지와 설명 추가
export interface UserState {
  userId: number;
  profileName: string;
  // userImage: string; // 유저 이미지 (URL 또는 경로)
  profileDescription: string; // 유저 설명
  episodeInfo: episodeDesc; 
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
  // ---- 추가 아이디는 범수님께 문의 ----`,  // 기본 유저 설명
  episodeInfo :
  {
    characterName : '',
    characterDescription : '',
    scenarioDescription : '',  // 기본 유저 설명
    introDescription : ' ',
    secret : ' '
  }
};

// Redux slice 생성
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      if( action.payload.length > 0 )
        state.userId = parseInt( action.payload, 10 );
      else
        state.userId = 0;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.episodeInfo.characterName = action.payload;
    },
    setUserDescription: (state, action: PayloadAction<string>) => {
      state.episodeInfo.characterDescription = action.payload;
    },
    setUserScenarioDescription: (state, action: PayloadAction<string>) => {
      state.episodeInfo.scenarioDescription = action.payload;
    },
    setUserIntroDescription: (state, action: PayloadAction<string>) => {
      state.episodeInfo.introDescription = action.payload;
    },
    setUserSecret: (state, action: PayloadAction<string>) => {
      state.episodeInfo.secret = action.payload;
    },
  },
});

export const { setUserId, setUserName, setUserDescription, setUserScenarioDescription, setUserIntroDescription, setUserSecret  } = userSlice.actions;
export default userSlice.reducer;
