import Root from './Root';
import '@/app/globals.css';
import '@/app/reset.css';

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
        <Root>{children} </Root> {/* 설정 정보를 Provider를 통해 자식 컴포넌트에 전달 */}
        {/* <div ref={paddingRef} style={{height: '0px', width: '100%'}}></div> */}
      </body>
    </html>
  );
}
