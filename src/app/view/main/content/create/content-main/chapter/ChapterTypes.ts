import {ChapterInfo} from '@/redux-store/slices/ContentInfo';
import {EpisodeInfo} from '@/redux-store/slices/EpisodeInfo';

export interface ChapterItemProps {
  canEdit: boolean;
  onCloseChapterBoard: () => void;
  chapter: ChapterInfo;
  chapterIdx: number; // 인덱스 추가
  chapterLength: number;
  onSelect: (chapterIdx: number) => void;
  onDelete: (chapterIdx: number) => void;
  onSelectEpisode: (chapterIdx: number, episodeIdx: number) => void;
  onRename: () => void;
  onDuplicate: () => void;
  isSelected: boolean; // 선택 여부
  selectedEpisodeIdx: number;
  hideSelectedEpisode: boolean;
  disableDelete: boolean;
}

export interface EpisodeItemProps {
  episode: EpisodeInfo;
  chapterIdx: number;
  episodeIdx: number;
  onSelectEpisode: (chapterIdx: number, episodeIdx: number) => void;
  hideSelected: boolean;
  isSelected: boolean;
}

export interface Episode {
  id: number;
  title: string;
}
