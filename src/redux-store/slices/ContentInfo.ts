// Imports
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {EpisodeInfo} from './EpisodeInfo';

// JSON 파일
import emptyContent from '@/data/create/empty-content-info-data.json';
import {TriggerInfo} from '@/types/apps/content/episode/TriggerInfo';

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
    duplicateEpisode: (state, action: PayloadAction<number>) => {
      const targetId = action.payload; // 복제할 에피소드 ID

      // 모든 에피소드의 ID를 수집하여 가장 낮은 ID를 계산
      let minId = Infinity;
      state.curEditingContentInfo.chapterInfoList.forEach(chapter => {
        chapter.episodeInfoList.forEach(episode => {
          if (episode.id < minId) {
            minId = episode.id;
          }
        });
      });

      // 새로운 ID는 가장 낮은 ID에서 -1을 뺌
      const newId = minId - 1;

      // 각 챕터를 순회하며 타겟 에피소드를 찾음
      state.curEditingContentInfo.chapterInfoList.forEach(chapter => {
        const targetIndex = chapter.episodeInfoList.findIndex(episode => episode.id === targetId);

        // 타겟 에피소드가 존재하면 복제
        if (targetIndex !== -1) {
          const targetEpisode = chapter.episodeInfoList[targetIndex];

          // 복제된 에피소드 생성
          const duplicatedEpisode = {
            ...targetEpisode,
            id: newId, // 새로운 고유 ID
            name: `${targetEpisode.name} copy`, // 이름에 ' copy' 추가
          };

          // 타겟 에피소드 다음 인덱스에 삽입
          chapter.episodeInfoList.splice(targetIndex + 1, 0, duplicatedEpisode);
        }
      });
    },
    adjustEpisodeIndex: (state, action: PayloadAction<{targetId: number; direction: 'up' | 'down'}>) => {
      const {targetId, direction} = action.payload;

      console.log('dada');
      state.curEditingContentInfo.chapterInfoList.forEach(chapter => {
        const targetIndex = chapter.episodeInfoList.findIndex(episode => episode.id === targetId);

        // 타겟 에피소드가 존재하고 방향에 따른 이동 가능 여부 확인
        if (targetIndex !== -1) {
          if (direction === 'up' && targetIndex > 0) {
            // 위로 이동: 현재 인덱스와 이전 인덱스의 위치를 교체
            const temp = chapter.episodeInfoList[targetIndex - 1];
            chapter.episodeInfoList[targetIndex - 1] = chapter.episodeInfoList[targetIndex];
            chapter.episodeInfoList[targetIndex] = temp;
          } else if (direction === 'down' && targetIndex < chapter.episodeInfoList.length - 1) {
            // 아래로 이동: 현재 인덱스와 다음 인덱스의 위치를 교체
            const temp = chapter.episodeInfoList[targetIndex + 1];
            chapter.episodeInfoList[targetIndex + 1] = chapter.episodeInfoList[targetIndex];
            chapter.episodeInfoList[targetIndex] = temp;
          }
        }
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

    moveTriggerToEpisode: (
      state,
      action: PayloadAction<{sourceEpisodeId: number; triggerId: number; targetEpisodeId: number}>,
    ) => {
      const {sourceEpisodeId, triggerId, targetEpisodeId} = action.payload;

      let triggerToMove: TriggerInfo | null = null;

      // 1. 소스 에피소드에서 트리거 제거
      state.curEditingContentInfo.chapterInfoList.forEach(chapter => {
        const sourceEpisode = chapter.episodeInfoList.find(episode => episode.id === sourceEpisodeId);

        if (sourceEpisode) {
          const triggerIndex = sourceEpisode.triggerInfoList.findIndex(trigger => trigger.id === triggerId);

          if (triggerIndex !== -1) {
            triggerToMove = sourceEpisode.triggerInfoList[triggerIndex];
            sourceEpisode.triggerInfoList.splice(triggerIndex, 1); // 트리거 제거
          }
        }
      });

      if (!triggerToMove) {
        console.error('Trigger not found in the source episode.');
        return;
      }

      // 2. 타겟 에피소드에 트리거 추가
      state.curEditingContentInfo.chapterInfoList.forEach(chapter => {
        const targetEpisode = chapter.episodeInfoList.find(episode => episode.id === targetEpisodeId);

        if (targetEpisode) {
          const minId =
            targetEpisode.triggerInfoList.length > 0
              ? Math.min(...targetEpisode.triggerInfoList.map(trigger => trigger.id))
              : 0;

          const newId = minId > 0 ? -1 : minId - 1; // 새로운 음수 ID 생성

          const newTrigger = {
            ...triggerToMove,
            id: newId, // 새로운 ID 할당
          };

          targetEpisode.triggerInfoList.push(newTrigger as TriggerInfo);
        }
      });
    },
  },
});

// 액션과 리듀서 export
export const {
  moveTriggerToEpisode,
  setEditingContentInfo,
  updateEditingContentInfo,
  duplicateEpisode,
  setContentInfoToEmpty,
  removeEpisode,
  updateEpisodeInfoInContent,
  adjustEpisodeIndex,
} = curEditngContentInfoSlice.actions;
export default curEditngContentInfoSlice.reducer;
