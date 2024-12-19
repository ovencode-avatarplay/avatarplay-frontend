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
  llmSetupInfo: LLMSetupInfo;
}

export interface LLMSetupInfo {
  llmModel: number;
  customApi: string;
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

    removeEpisode: (state, action: PayloadAction<number>) => {
      const targetId = action.payload; // 제거할 에피소드 ID
      state.curEditingContentInfo.chapterInfoList.forEach(chapter => {
        chapter.episodeInfoList = chapter.episodeInfoList.filter(
          episode => episode.id !== targetId, // ID가 일치하지 않는 에피소드만 유지
        );
      });
    },

    updateEditingContentInfo: (state, action: PayloadAction<Partial<ContentInfo>>) => {
      if (state.curEditingContentInfo) {
        state.curEditingContentInfo = {...state.curEditingContentInfo, ...action.payload};
      }
    },

    setContentInfoToEmpty: state => {
      state.curEditingContentInfo = emptyContent.data.contentInfo;
    },
    updateEpisodeInfoInContent: (state, action: PayloadAction<EpisodeInfo>) => {
      const updatedEpisode = action.payload;

      // 모든 챕터를 순회하면서 에피소드 ID를 기준으로 업데이트
      state.curEditingContentInfo.chapterInfoList.forEach(chapter => {
        chapter.episodeInfoList = chapter.episodeInfoList.map(episode =>
          episode.id === updatedEpisode.id ? {...episode, ...updatedEpisode} : episode,
        );
      });
    },
  },
});

// 액션과 리듀서 export
export const {
  setEditingContentInfo,
  updateEditingContentInfo,
  setContentInfoToEmpty,
  removeEpisode,
  updateEpisodeInfoInContent,
} = curEditngContentInfoSlice.actions;
export default curEditngContentInfoSlice.reducer;
