export interface ExploreCardProps {
  exploreItemType: number;
  updateExplorState: number;
  storyId: number;
  storyRank?: number;
  storyName: string;
  chatCount: number;
  episodeCount: number;
  followerCount: number;
  thumbnail: string;
  classType?: string;
}
