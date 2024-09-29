import { chapterInfo } from "./chapter/chapterInfo";
import { gimmickInfo } from "./chapter/gimmickInfo";
import { publishInfo } from "./chapter/publishInfo";

export interface contentInfo
{
    id: number;
    chapterInfoList? : chapterInfo[];   // TODO null 이면 안됨
    gimmickInfo? : gimmickInfo;
    publishInfo : publishInfo;
}