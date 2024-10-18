// ChapterBoard.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ChapterInfo} from '@/types/apps/content/chapter/chapterInfo';
import {EpisodeInfo} from '@/types/apps/content/episode/episodeInfo';
import {RootState} from '@/redux-store/ReduxStore';
import {updateEditingContentInfo} from '@/redux-store/slices/ContentInfo';

interface ChapterBoardState {
  chapterBoard: ChapterInfo[];
}

const initialState: ChapterBoardState = {
  chapterBoard: [],
};

const chapterBoardSlice = createSlice({
  name: 'chapterBoard',
  initialState,
  reducers: {
    setChapterBoard(state, action: PayloadAction<ChapterInfo[]>) {
      state.chapterBoard = action.payload;
    },
    addChapter(state, action: PayloadAction<ChapterInfo>) {
      state.chapterBoard.push(action.payload);
    },
    deleteChapter(state, action: PayloadAction<number>) {
      state.chapterBoard = state.chapterBoard.filter(chapter => chapter.id !== action.payload);
    },
    addEpisode(state, action: PayloadAction<{chapterId: number; episode: EpisodeInfo}>) {
      const chapter = state.chapterBoard.find(chapter => chapter.id === action.payload.chapterId);
      if (chapter) {
        chapter.episodeInfoList = [...chapter.episodeInfoList, action.payload.episode]; // 불변성 유지
      }
    },
    deleteEpisode(state, action: PayloadAction<{chapterId: number; episodeId: number}>) {
      const chapter = state.chapterBoard.find(chapter => chapter.id === action.payload.chapterId);
      if (chapter) {
        chapter.episodeInfoList = chapter.episodeInfoList.filter(episode => episode.id !== action.payload.episodeId);
      }
    },
  },
});

export const {
  setChapterBoard,
  addChapter,
  deleteChapter,

  addEpisode,
  deleteEpisode,
} = chapterBoardSlice.actions;

export default chapterBoardSlice.reducer;
