export enum GalleryCategory {
  All = 0,
  Portrait = 1,
  Pose = 2,
  Expression = 3,
}

export const galleryCategoryText: Record<GalleryCategory, string> = {
  [GalleryCategory.All]: 'All',
  [GalleryCategory.Portrait]: 'Portrait',
  [GalleryCategory.Pose]: 'Pose',
  [GalleryCategory.Expression]: 'Expression',
};
