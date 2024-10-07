// src/app/Network/ApiInstance.tsx

import axios, { AxiosInstance } from 'axios';

// Axios 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/`, // 새로운 베이스 URL
  headers: {
    'Content-Type': 'application/json', // JSON 데이터 전송을 명시
  },
  httpsAgent: new (require('https').Agent)({
    rejectUnauthorized: false,
  }),
});

// 공통 응답 인터페이스
export interface ResponseAPI<T> {
  resultCode: number;        // 응답 코드
  resultMessage: string;     // 응답 메시지
  data: T;
}

export default api;
