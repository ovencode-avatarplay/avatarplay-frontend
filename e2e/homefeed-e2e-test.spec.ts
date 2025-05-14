import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  // 홈피드 페이지 이동
  await page.goto("http://192.168.0.58:3000/en-US/main/homefeed");

  // 탐섹 페이지 이동
  const exportButton = page.getByRole("contentinfo").getByRole("button").nth(1);
  if (await exportButton.isVisible()) {
    await exportButton.click();
  }
  await page.waitForTimeout(3000); // 그냥 5초 무조건 대기
  //await page.pause(); // 이 줄에서 중단 + Inspector 창 열림

  // 3가지 카테고리별 세션 찾기 ( 캐릭터랭킹, 스토리랭킹, 콘텐츠랭킹 )
  const sections = page.locator(
    "section.SearchBoardHorizonScroll_containerBox__WLUZQ"
  );
  const count = await sections.count();

  console.log(await sections.count()); // 몇 개 찾았는지 확인

  // 캐릭터랭킹
  const section = sections.nth(0);
  // 2. 이 섹션 안에서 첫 번째 카드 요소를 찾음 (예: figure, article, div 중 하나로 바꿔야 함)
  if (await section.isVisible()) {
    const firstCard = section.locator("figure").first(); // 여기서 'figure'는 네 구조에 맞게 조정
    const exists = await firstCard.count();

    // 스토리랭킹
    if (exists > 0) {
      console.log(`✅ 섹션 ${0}: 첫 번째 카드 클릭`);
      await firstCard.click();
    } else {
      console.warn(`⚠️ 섹션 ${0}: 카드 없음 → 건너뜀`);
    }
  }

  await page.waitForTimeout(3000); // 그냥 5초 무조건 대기

  // chat 버튼 클릭
  const chatButton = page.getByRole("link", { name: "Chat" });
  if (await chatButton.isVisible()) {
    await chatButton.click();
  }
  await page.waitForTimeout(3000); // 그냥 5초 무조건 대기
  // 채팅 메시지 입력
  const chatInput = page.getByRole("textbox", { name: "Type your message..." });
  if (await chatInput.isVisible()) {
    await chatInput.fill("하이");
  }
  await page.waitForTimeout(3000); // 그냥 5초 무조건 대기
  // 채팅 메시지 전송 버튼 클릭
  const sendButton = page.getByAltText("Send Chat");
  if (await sendButton.isVisible()) {
    await sendButton.click();
  }
  await page.waitForTimeout(3000); // 그냥 5초 무조건 대기
  // 뒤로가기 버튼 클릭
  const backButton = page.getByAltText("Left Back");
  if (await backButton.isVisible()) {
    await backButton.click();
  }
  await page.waitForTimeout(3000); // 그냥 5초 무조건 대기
  // 뒤로가기 버튼 클릭
  const backButton3 = page.getByTestId("left-back-btn");
  if (await backButton3.isVisible()) {
    await backButton3.click();
  }

  //await page.pause();
});
