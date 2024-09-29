import { Episode } from "./episodeCardType";

export interface Chapter {
    id: number;
    title: string;
    episodes: Episode[];
    expanded: boolean; // 접기/펼치기 상태
}
