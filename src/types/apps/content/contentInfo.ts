import { ChapterInfo } from "./chapter/chapterInfo";
import { gimmickInfo } from "./chapter/gimmickInfo";
import { PublishInfo } from "./chapter/publishInfo";

export interface ContentInfo {
    id: number;
    userId: number;    
    chapterInfoList: ChapterInfo[];
    publishInfo: PublishInfo;
}