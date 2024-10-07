// src/app/Network/apiInstance.ts
import axios, { AxiosInstance } from 'axios';

// Axios 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/`, // 새로운 베이스 URL
  headers: { 'Content-Type': 'application/json' },
  httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
});

export default api;
