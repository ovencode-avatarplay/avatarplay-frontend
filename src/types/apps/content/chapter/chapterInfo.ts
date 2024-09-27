import { episodeInfo } from "../episode/episodeInfo";

export interface chapterInfo
{
    id : number;
    name : string;
    episodeInfoList : episodeInfo[];
}