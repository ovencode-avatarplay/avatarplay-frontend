import api, {ResponseAPI} from './ApiInstance';

export interface CreateLinkReq {
  userid: number;
  userName: string;
  email: string;
  itemName: string;
  amount: number;
}

export interface CreateLinkRes {
  //empty
}

export const sendCreateLinkReq = async (payload: CreateLinkReq) => {
  try {
    const res = await api.post<ResponseAPI<CreateLinkRes>>('Payment/create-link', payload);
    if (res.data.resultCode === 0) {
      return res.data;
    }
    return null;
  } catch (error) {
    console.error('CreateLink API 요청 실패:', error);
    return null;
  }
};

export interface GetNotifyReq {
  pcD_PAY_RST: string;
  pcD_PAY_MSG: string;
  pcD_PAY_OID: string;
  pcD_PAYER_ID: string;
  pcD_PAY_TYPE: string;
  pcD_PAYER_NAME: string;
  pcD_PAY_GOODS: string;
  pcD_PAY_TOTAL: number;
  pcD_CARD_VER: string;
  pcD_CARD_NUM: string;
  pcD_PAY_TIME: string;
}

export interface GetNotifyRes {
  //empty
}

export const sendGetNotifyReq = async (payload: GetNotifyReq) => {
  try {
    const res = await api.post<ResponseAPI<GetNotifyRes>>('Payment/notify', payload);
    if (res.data.resultCode === 0) {
      return res.data;
    }
  } catch (error) {
    console.error('GetNotify API 요청 실패:', error);
    return null;
  }
};

export interface GetVerifyReq {
  orderId: number;
}

export interface GetVerifyRes {
  status: string;
  message: string;
}

export const sendGetVerifyReq = async (payload: GetVerifyReq) => {
  try {
    const res = await api.get<ResponseAPI<GetVerifyRes>>('Payment/verify', {params: payload});
    if (res.data.resultCode === 0) {
      return res.data;
    }
  } catch (error) {
    console.error('GetVerify API 요청 실패:', error);
    return null;
  }
};
