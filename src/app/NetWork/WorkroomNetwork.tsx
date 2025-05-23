import api, {ResponseAPI} from './ApiInstance';
import {MediaState, PaginationRequest} from './ProfileNetwork';

export enum WorkroomSortType {
  Newest = 0,
  Name = 1,
  Size = 2,
}

export interface WorkroomFileInfo {
  id: number;
  name: string;
  fileType: MediaState;
  parentFolderId: number;
  url: string;
  isBookmark: boolean;
  createdAt: Date;
}
export interface GetWorkroomDashBoardReq {}

export interface GetWorkroomDashBoardRes {
  latestFiles: WorkroomFileInfo[];
  latestFolders: WorkroomFileInfo[];
  latestImages: WorkroomFileInfo[];
  latestVideos: WorkroomFileInfo[];
  latestAudios: WorkroomFileInfo[];
}

export const sendGetWorkroomDashBoard = async (
  req: GetWorkroomDashBoardReq,
): Promise<ResponseAPI<GetWorkroomDashBoardRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetWorkroomDashBoardRes>>('/WorkRoom/getWorkroomDashBoard', req);
    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`GetWorkroomDashBoardRes Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error getting workroom dashboard:', error);
    throw new Error('Failed to get workroom dashboard. Please try again.');
  }
};

export interface GetWorkroomFilesReq {
  fileType: MediaState;
  page: PaginationRequest;
  sortType: WorkroomSortType;
}

export interface GetWorkroomFilesRes {
  items: WorkroomFileInfo[];
}

export const sendGetWorkroomFiles = async (req: GetWorkroomFilesReq): Promise<ResponseAPI<GetWorkroomFilesRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetWorkroomFilesRes>>('/WorkRoom/getWorkroomFilesByType', req);
    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`GetWorkroomFilesRes Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error getting workroom files:', error);
    throw new Error('Failed to get workroom files. Please try again.');
  }
};

export interface CreateFolderReq {
  Name: string;
  /// <summary>
  /// 부모 폴더 ID (null이면 루트)
  /// </summary>
  ParentFolderId: number | null;
}

export interface CreateFolderRes {
  folderId: number;
}

export const SendCreateFolder = async (req: CreateFolderReq): Promise<ResponseAPI<CreateFolderRes>> => {
  try {
    const response = await api.post<ResponseAPI<CreateFolderRes>>('/WorkRoom/createFolder', req);
    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`CreateFolderRes Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error sending create folder data:', error);
    throw new Error('Failed to send create folder data. Please try again.');
  }
};

export interface MoveFolderReq {
  /// <summary>
  /// 이동된 폴더 ID
  /// </summary>
  FolderId: number;
  /// <summary>
  /// 새 부모 폴더 ID (null이면 루트)
  /// </summary>
  NewParentFolderId: number | null;
}

export interface MoveFolderRes {
  folderId: number;
  NewParentFolderId: number | null;
}

export const SendMoveFolder = async (req: MoveFolderReq): Promise<ResponseAPI<MoveFolderRes>> => {
  try {
    const response = await api.post<ResponseAPI<MoveFolderRes>>('/WorkRoom/moveFolder', req);
    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`MoveFolderRes Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error sending move folder data:', error);
    throw new Error('Failed to send move folder data. Please try again.');
  }
};

export interface GetFavoriteWorkroomDashboardReq {}

export interface GetFavoriteWorkroomDashboardRes {
  latestFiles: WorkroomFileInfo[];
  latestFolders: WorkroomFileInfo[];
  latestImages: WorkroomFileInfo[];
  latestVideos: WorkroomFileInfo[];
  latestAudios: WorkroomFileInfo[];
}

export const sendGetFavoriteWorkroomDashboard = async (
  req: GetFavoriteWorkroomDashboardReq,
): Promise<ResponseAPI<GetFavoriteWorkroomDashboardRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetFavoriteWorkroomDashboardRes>>(
      '/WorkRoom/getFavoriteWorkroomDashboard',
      req,
    );
    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`GetFavoriteWorkroomDashboardRes Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error getting favorite workroom dashboard:', error);
    throw new Error('Failed to get favorite workroom dashboard. Please try again.');
  }
};

export interface GetFavoriteWorkroomFilesReq {
  fileType: MediaState;
  page: PaginationRequest;
  sortType: WorkroomSortType;
}

export interface GetFavoriteWorkroomFilesRes {
  items: WorkroomFileInfo[];
}

export const sendGetFavoriteWorkroomFiles = async (
  req: GetFavoriteWorkroomFilesReq,
): Promise<ResponseAPI<GetFavoriteWorkroomFilesRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetFavoriteWorkroomFilesRes>>('/WorkRoom/getFavoriteFilesByType', req);
    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`GetFavoriteWorkroomFilesRes Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error getting favorite workroom files:', error);
    throw new Error('Failed to get favorite workroom files. Please try again.');
  }
};

export interface AiImageInfo {
  characterId: number;
  imageUrl: string;
  imageUrllNoBackground: string;
  createAt: Date;
}

export interface GetMyCharacterAiImagesReq {
  page: PaginationRequest;
}

export interface GetMyCharacterAiImagesRes {
  characterAiImageList: AiImageInfo[];
}

export const sendGetMyCharacterAiImages = async (
  req: GetMyCharacterAiImagesReq,
): Promise<ResponseAPI<GetMyCharacterAiImagesRes>> => {
  try {
    const response = await api.post<ResponseAPI<GetMyCharacterAiImagesRes>>('/WorkRoom/getMyCharacterAiImages', req);
    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`GetMyCharacterAiImagesRes Error: ${response.data.resultCode}`);
    }
  } catch (error: any) {
    console.error('Error getting my character ai images:', error);
    throw new Error('Failed to get my character ai images. Please try again.');
  }
};
