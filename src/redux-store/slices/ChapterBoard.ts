// ChapterBoard.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChapterInfo } from '@/types/apps/content/chapter/chapterInfo';
import { EpisodeInfo } from '@/types/apps/content/episode/episodeInfo';

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
        updateChapterName(state, action: PayloadAction<{ chapterId: number; newName: string }>) {
            const chapter = state.chapterBoard.find(chapter => chapter.id === action.payload.chapterId);
            if (chapter) {
                chapter.name = action.payload.newName;
            }
        },
        addEpisode(state, action: PayloadAction<{ chapterId: number; episode: EpisodeInfo }>) {
            const chapter = state.chapterBoard.find(chapter => chapter.id === action.payload.chapterId);
            if (chapter) {
                chapter.episodeInfoList.push(action.payload.episode);
            }
        },
        deleteEpisode(state, action: PayloadAction<{ chapterId: number; episodeId: number }>) {
            const chapter = state.chapterBoard.find(chapter => chapter.id === action.payload.chapterId);
            if (chapter) {
                chapter.episodeInfoList = chapter.episodeInfoList.filter(episode => episode.id !== action.payload.episodeId);
            }
        },
        updateEpisodeName(state, action: PayloadAction<{ chapterId: number; episodeId: number; newName: string }>) {
            const chapter = state.chapterBoard.find(chapter => chapter.id === action.payload.chapterId);
            if (chapter) {
                const episode = chapter.episodeInfoList.find(episode => episode.id === action.payload.episodeId);
                if (episode) {
                    episode.name = action.payload.newName;
                }
            }
        },    },
});

export const {
    setChapterBoard,
    addChapter,
    deleteChapter,
    updateChapterName,
    addEpisode,
    deleteEpisode,
    updateEpisodeName,
} = chapterBoardSlice.actions;

export default chapterBoardSlice.reducer;
