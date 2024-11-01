import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {boolean} from 'valibot';

export type ChattingEnter = {
  isUsedUrlLink: boolean; // true : url  Link를 통해서 채팅창에 입장했다.
};

export const initialChattingEnter: ChattingEnter = {
  isUsedUrlLink: true,
};

export const chattingEnterSlice = createSlice({
  name: 'chattingEnter',
  initialState: initialChattingEnter,
  reducers: {
    setUrlLinkUse: (state, action: PayloadAction<boolean>) => {
      state.isUsedUrlLink = action.payload; // true면 링크를 통해 채팅창을 연 것,  false 면 정상적인 페이지 루트를 통해 채팅창을 연 것
      console.log('setUrlLinkUse', action.payload);
    },
  },
});

// 액션과 리듀서 내보내기
export const {setUrlLinkUse} = chattingEnterSlice.actions;
export default chattingEnterSlice.reducer;
