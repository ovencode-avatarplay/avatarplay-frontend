import {LanguageType} from '@/app/NetWork/network-interface/CommonEnums';
import {ProfileSimpleInfo} from '@/app/NetWork/ProfileNetwork';
import {RestaurantRounded} from '@mui/icons-material';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// UserState 인터페이스에 유저 이미지와 설명 추가
export interface ProfileState {
  currentProfile: ProfileSimpleInfo | null;
}

// 초기 상태 설정
const initialState: ProfileState = {
  currentProfile: null,
};

// Redux slice 생성
const profileSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<ProfileSimpleInfo | null>) => {
      state.currentProfile = action.payload;
    },
  },
});

export const {updateProfile} = profileSlice.actions;
export default profileSlice.reducer;
