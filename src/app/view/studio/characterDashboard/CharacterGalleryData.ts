export enum GalleryCategory {
  All = 0, // None 지정 용도로도 사용
  Portrait = 1,
  Pose = 2,
  Expression = 3,
  Video = 4,
}

export const galleryCategoryText: Record<GalleryCategory, string> = {
  [GalleryCategory.All]: 'All',
  [GalleryCategory.Portrait]: 'Portrait',
  [GalleryCategory.Pose]: 'Pose',
  [GalleryCategory.Expression]: 'Expression',
  [GalleryCategory.Video]: 'Video',
};
