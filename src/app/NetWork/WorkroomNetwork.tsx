import api, {ResponseAPI} from './ApiInstance';

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
    const response = await api.post<ResponseAPI<CreateFolderRes>>('/workroom/createFolder', req);
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
    const response = await api.post<ResponseAPI<MoveFolderRes>>('/workroom/moveFolder', req);
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
