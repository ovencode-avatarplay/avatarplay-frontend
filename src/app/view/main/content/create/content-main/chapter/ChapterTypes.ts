export interface ChapterItemProps {
  onCloseChapterBoard: () => void;
  chapter: Chapter;
  chapterIdx: number; // 인덱스 추가
  chapterLength: number;
  onSelect: (chapterIdx: number) => void;
  onDelete: (chapterIdx: number) => void;
  onSelectEpisode: (chapterIdx: number, episodeIdx: number) => void;
  onRename: () => void;
  isSelected: boolean; // 선택 여부
  selectedEpisodeIdx: number;
  disableDelete: boolean;
}

export interface Chapter {
  id: number;
  title: string;
  episodes: Episode[];
}

export interface EpisodeItemProps {
  episode: Episode;
  onSelectEpisode: (chapterIdx: number, episodeIdx: number) => void;
  isSelected: boolean;
}

export interface Episode {
  id: number;
  title: string;
}
