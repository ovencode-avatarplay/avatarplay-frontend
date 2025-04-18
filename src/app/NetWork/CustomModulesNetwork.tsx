import api, {ResponseAPI} from './ApiInstance';

export interface CustomModulesPromptInfo {
  promptId: number;
  title: string;
  createdAt: Date;
}

export interface CustomModulePrompt {
  promptId: number;
  title: string;
  claude: string;
  chatGPT: string;
}

export interface CustomModulesLorebookInfo {
  lorebookId: number;
  title: string;
  createdAt: Date;
}

export interface CustomModuleLorebook {
  lorebookId: number;
  title: string;
  items: LorebookItem[];
}

export interface LorebookItem {
  lorebookItemId: number;
  keyword: string;
  content: string;
}

// Get CustomModules
export interface GetCustomModulesRes {
  prompts: CustomModulesPromptInfo[];
  lorebooks: CustomModulesLorebookInfo[];
}

export const sendGetCustomModules = async (): Promise<ResponseAPI<GetCustomModulesRes>> => {
  try {
    const response = await api.get<ResponseAPI<GetCustomModulesRes>>('CustomModules');

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`GetCustomModulesRes Error : ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error sending CustomModules : ', error);
    throw new Error('Failed to send Get CustomModules. Please try again');
  }
};

// Delete CustomModules
export interface DeleteCustomModulesReq {
  promptId: number;
  lorebookId: number;
}

export interface DeleteCustomModulesRes {
  //empty
}

export const sendDeleteCustomModules = async (
  payload: DeleteCustomModulesReq,
): Promise<ResponseAPI<DeleteCustomModulesRes>> => {
  try {
    const response = await api.post<ResponseAPI<DeleteCustomModulesRes>>('CustomModules/delete', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`DeleteCustomModuleRes Error : ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error sending Delete CustomModule. Please try again');
    throw new Error('Failed to send Delete CustomModules. Please try again');
  }
};

// Get Lorebook

export interface GetLorebookReq {
  lorebookId: number;
}

export interface GetLorebookRes extends Pick<CustomModuleLorebook, 'lorebookId' | 'title' | 'items'> {}

export const sendGetLorebook = async (payload: GetLorebookReq): Promise<ResponseAPI<GetLorebookRes>> => {
  try {
    const response = await api.get<ResponseAPI<GetLorebookRes>>('CustomModules/lorebook', {
      params: payload,
    });

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`GetLorebookRes Error : ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error sending Get Lorebook. Please try again');
    throw new Error('Failed to send Get Lorebook. Please try again');
  }
};

// Edit lorebook
export interface EditLorebookReq {
  lorebookId: number;
  title: string;
  removes: number[];
  editList: LorebookItem[];
}

export interface EditLorebookRes {
  //empty
}

export const sendLorebook = async (payload: EditLorebookReq): Promise<ResponseAPI<EditLorebookRes>> => {
  try {
    const response = await api.post<ResponseAPI<EditLorebookRes>>('CustomModules/lorebook', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`EditLorebookRes Error : ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error sending Lorebook. Please try again');
    throw new Error('Failed to send Lorebook. Please try again');
  }
};

// Get prompt

export interface GetPromptReq {
  promptId: number;
}

export interface GetPromptRes extends Pick<CustomModulePrompt, 'promptId' | 'title' | 'claude' | 'chatGPT'> {}

export const sendGetPrompt = async (payload: GetPromptReq): Promise<ResponseAPI<GetPromptRes>> => {
  try {
    const response = await api.get<ResponseAPI<GetPromptRes>>('CustomModules/prompt', {
      params: payload,
    });

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`GetPromptRes Error : ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error sending Get Prompt. Please try again');
    throw new Error('Failed to send Get Prompt. Please try again');
  }
};

// Edit prompt
export interface EditPromptReq extends Pick<CustomModulePrompt, 'promptId' | 'title' | 'claude' | 'chatGPT'> {}

export interface EditPromptRes {
  //empty
}

export const sendPrompt = async (payload: EditPromptReq): Promise<ResponseAPI<EditPromptRes>> => {
  try {
    const response = await api.post<ResponseAPI<EditPromptRes>>('CustomModules/prompt', payload);

    if (response.data.resultCode === 0) {
      return response.data;
    } else {
      throw new Error(`EditPromptRes Error : ${response.data.resultCode}`);
    }
  } catch (error) {
    console.error('Error sending Prompt. Please try again');
    throw new Error('Failed to send Prompt. Please try again');
  }
};
