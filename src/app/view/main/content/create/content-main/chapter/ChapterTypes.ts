export interface ChapterItemProps {
  chapter: Chapter;
  chapterIdx: number; // 인덱스 추가
  chapterLength: number;
  episodeLength: number;
  onDelete: (chapterIdx: number) => void;
  onToggle: (chapterIdx: number) => void;
  onDeleteEpisode: (chapterIdx: number, episodeIdx: number) => void;
  onSelect: (chapterIdx: number) => void;
  onSelectEpisode: (chapterIdx: number, episodeIdx: number) => void;
  onCloseChapterBoard: () => void;
  onEdit: (idx: number, type: 'chapter' | 'episode') => void;
  isSelected: boolean; // 선택 여부
  selectedEpisodeIdx: number;
  disableDelete: boolean;
  onDeleteChapterOpen: () => void;
  onDeleteChapterClose: () => void;
  onDeleteEpisodeOpen: () => void;
  onDeleteEpisodeClose: () => void;
}

export interface Chapter {
  id: number;
  title: string;
  episodes: Episode[];
  expanded: boolean; // 접기/펼치기 상태
}

export interface EpisodeItemProps {
  episode: Episode;
  chapterIdx: number;
  episodeIdx: number;
  onEditEpisode: (episodeIdx: number, type: 'episode') => void;
  onDeleteEpisode: (chapterIdx: number, episodeIdx: number) => void;
  onSelect: (chapterIdx: number, episodeIdx: number) => void; // 선택된 Episode 처리
  onClose: () => void;
  disableDelete: boolean;
  isSelected: boolean; // 선택 여부
}

export interface Episode {
  id: number;
  title: string;
}
