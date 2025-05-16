// src/app/Network/ApiInstance.tsx

import {getLocalizedLink} from '@/utils/UrlMove';
import axios, {AxiosInstance} from 'axios';
import {showPopup} from './networkPopup/popupManager';
import getLocalizedText from '@/utils/getLocalizedText';

const pendingRequests = new Set<string>(); // 동일한 패킷이 처리되기 전에 또 호출되었는지 체크하기 위한 용도

// Axios 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/`, // 새로운 베이스 URL
  headers: {
    'Content-Type': 'application/json', // JSON 데이터 전송을 명시
  },
  withCredentials: true, // 쿠키 자동 관리 활성화
  httpsAgent: new (require('https').Agent)({
    rejectUnauthorized: false,
  }),
});

// Axios 인터셉터로 Bearer JWT 토큰 자동 추가
api.interceptors.request.use(
  config => {
    document.body.style.pointerEvents = 'none';
    const requestKey = config.url ?? '';

    if (pendingRequests.has(requestKey)) {
      console.warn('Busy processing an existing API request.');
      return Promise.reject({message: 'Busy processing an existing API request.'});
    }
    // 로컬 스토리지 또는 세션 스토리지에서 JWT 토큰을 가져옴
    const token = localStorage?.getItem('jwt');

    // 토큰이 존재하면 Authorization 헤더에 Bearer 토큰을 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('request packet add: ' + requestKey);
    pendingRequests.add(requestKey);

    return config;
  },
  error => {
    document.body.style.pointerEvents = 'auto';
    // 요청 전 오류 처리
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  async response => {
    document.body.style.pointerEvents = 'auto';
    const requestKey = response.config.url ?? '';
    console.log('request packet delete: ' + requestKey);
    pendingRequests.delete(requestKey);

    // 정상 응답인 경우 그대로 반환
    if (response.data.errorCode !== null) {
      const errorDescription = getLocalizedText(response.data.errorCode) || response.data.errorCode;
      console.error('네트워크 애러:   ' + errorDescription);

      // await showPopup({
      //   title: 'Error',
      //   description: errorDescription,
      // });
    }
    return response;
  },
  error => {
    document.body.style.pointerEvents = 'auto';
    // 401 에러가 발생했을 때 처리
    if (error.response && error.response.status === 401) {
      // 여기서 auth 페이지로 리다이렉트
      window.location.href = getLocalizedLink('/auth');
    }
    const requestKey = error?.config?.url ?? '';
    console.log('request packet delete: ' + requestKey);
    pendingRequests.delete(requestKey);
    return Promise.reject(error);
  },
);

// 공통 응답 인터페이스
export interface ResponseAPI<T> {
  resultCode: number; // 응답 코드
  resultMessage?: string; // 응답 메시지
  data?: T;
}

export const STATUS_CODE = {
  UNAUTHORIZED: 401,
  SUCCESS: 200,
  // 필요에 따라 다른 상태 코드를 추가
};

export const RESULT_CODE = {
  OK: 0,
  UNAUTHORIZED: 1,
};

export class ResponseError {
  ResponseError(code: number) {
    this.resultCode = code;
  }

  resultCode: number = 0; // 응답 코드
  resultMessage?: string; // 응답 메시지
}

export default api;
