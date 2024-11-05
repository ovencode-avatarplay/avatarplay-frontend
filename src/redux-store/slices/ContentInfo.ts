// Imports
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {EpisodeInfo} from './EpisodeInfo';

// JSON 파일
import emptyContent from '@/data/create/empty-content-info-data.json';

export interface ContentInfo {
  id: number;
  userId: number;
  urlLinkKey: string;
  chapterInfoList: ChapterInfo[];
  publishInfo: PublishInfo;
}

export interface PublishInfo {
  languageType: number;
  contentName: string;
  thumbnail: string;
  contentDescription: string;
  authorName: string;
  authorComment: string;
  tagList: string[];
  selectTagList: string[];
  visibilityType: number;
  monetization: boolean;
  nsfw: number;
}

// 현재 수정 중인 Content 정보
interface ContentInfoState {
  curEditingContentInfo: ContentInfo;
}

// 초기 상태
const initialState: ContentInfoState = {
  curEditingContentInfo: emptyContent.data.contentInfo,
};

export interface ChapterInfo {
  id: number;
  name: string;
  episodeInfoList: EpisodeInfo[];
}

// Slice 생성
export const curEditngContentInfoSlice = createSlice({
  name: 'contentInfo',
  initialState,
  reducers: {
    setEditingContentInfo: (state, action: PayloadAction<ContentInfo>) => {
      state.curEditingContentInfo = action.payload;
    },

    updateEditingContentInfo: (state, action: PayloadAction<Partial<ContentInfo>>) => {
      if (state.curEditingContentInfo) {
        state.curEditingContentInfo = {...state.curEditingContentInfo, ...action.payload};
      }
    },

    setContentInfoToEmpty: state => {
      state.curEditingContentInfo = emptyContent.data.contentInfo;
    },
  },
});

// 액션과 리듀서 export
export const {setEditingContentInfo, updateEditingContentInfo, setContentInfoToEmpty} =
  curEditngContentInfoSlice.actions;
export default curEditngContentInfoSlice.reducer;
