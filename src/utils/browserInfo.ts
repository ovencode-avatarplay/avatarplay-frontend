import {Episode} from './../app/view/main/content/create/content-main/chapter/ChapterTypes';
// 쿼리 파라미터 키들을 정의하는 enum 타입
// 브라우저에서 파싱해서 추출할 key를 추가하면 됩니다
export enum QueryParams {
  ChattingInfo = 'v',
  Episode = 'episode',
}

// enum 값을 인자로 받아 해당하는 쿼리 파라미터를 반환하는 함수
export const getWebBrowserUrl = (param: QueryParams): string | null => {
  const url = window.location.href;
  const urlObj = new URL(url);
  const paramValue = urlObj.searchParams.get(param); // enum에서 지정한 키 값 가져오기
  console.log(`getWebBrowserUrl (${param}) :`, paramValue);
  return paramValue; // 해당하는 쿼리 파라미터 값 반환, 없으면 null 반환
};
