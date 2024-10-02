import { EpisodeInfo } from "../episode/episodeInfo";

export interface ChapterInfo {
    id: number;
    name: string;
    episodeInfoList: EpisodeInfo[];
}