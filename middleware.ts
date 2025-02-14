// middleware.mjs
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // 언어 코드가 없는 경로로 접근할 경우
  if (
    !pathname.startsWith("/en-US") &&
    !pathname.startsWith("/ko") &&
    !pathname.startsWith("/ja")
  ) {
    const browserLang =
      req.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
      "en-US";
    // 리다이렉트 경로를 생성하여 리다이렉트 처리
    const url = new URL(`/${browserLang}/main/homefeed`, req.url);
    console.log("다음 주소로 리디렉션 됩니다. : " + url);
    return NextResponse.redirect(url, 308);
  }

  // 언어 코드가 있는 경로는 그대로 처리
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", // 루트 경로만 있을 경우 처리
    "/:lang", // 언어 코드만 있을 경우 처리
    "/:lang/", // 언어 코드만 있을 경우 처리2
  ],
};
