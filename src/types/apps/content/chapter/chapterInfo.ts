import {EpisodeInfo, EpisodeInfoForContentGet} from '../episode/episodeInfo';

export interface ChapterInfo {
  id: number;
  name: string;
  episodeInfoList: EpisodeInfo[];
}

export interface ChapterInfoForContentGet {
  id: number;
  name: string;
  episodeInfoList: EpisodeInfoForContentGet[];
}
