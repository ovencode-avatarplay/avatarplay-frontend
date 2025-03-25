import Root from './Root';
import '@/app/globals.css';
import '@/app/reset.css';
import {Suspense} from 'react';
import GlobalPopupRenderer from './NetWork/networkPopup/GlobalPopupRenderer';

export default async function Layout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&family=Noto+Sans+JP&family=Noto+Sans+SC&family=Noto+Sans+TC&display=swap"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body>
        <Suspense>
          <Root>
            {children}
            <GlobalPopupRenderer /> {/* ✅ 전역 팝업 위치 여기! */}
          </Root>{' '}
          {/* 설정 정보를 Provider를 통해 자식 컴포넌트에 전달 */}
        </Suspense>
        {/* <div ref={paddingRef} style={{height: '0px', width: '100%'}}></div> */}
      </body>
    </html>
  );
}
