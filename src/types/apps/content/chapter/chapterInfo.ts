import {EpisodeInfoForContentGet} from '../episode/episodeInfo';

export interface ChapterInfoForContentGet {
  id: number;
  name: string;
  episodeInfoList: EpisodeInfoForContentGet[];
}
