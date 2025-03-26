// src/app/Network/ApiInstance.tsx

import {getLocalizedLink} from '@/utils/UrlMove';
import axios, {AxiosInstance} from 'axios';
import {showPopup} from './networkPopup/popupManager';
import getLocalizedText from '@/utils/getLocalizedText';
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
    // 로컬 스토리지 또는 세션 스토리지에서 JWT 토큰을 가져옴
    const token = localStorage.getItem('jwt');

    // 토큰이 존재하면 Authorization 헤더에 Bearer 토큰을 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    // 요청 전 오류 처리
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  async response => {
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
    // 401 에러가 발생했을 때 처리
    if (error.response && error.response.status === 401) {
      // 여기서 auth 페이지로 리다이렉트
      window.location.href = getLocalizedLink('/auth');
    }
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
