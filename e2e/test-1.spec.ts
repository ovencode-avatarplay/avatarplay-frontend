import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://192.168.0.58:3000/en-US/main/homefeed");
  await page.getByRole("contentinfo").getByRole("button").nth(1).click();

  // "하데스422" 이런 텍스트 찾는 게 아니라,
  // 그냥 첫 번째 article을 바로 찾는다.
  const article = page.locator("article").first();
  await article.waitFor();

  // figure나 exploreMedia 안에 클릭 가능한 요소 찾기
  const figure = article.locator("figure");
  if ((await figure.count()) > 0) {
    await figure.first().click();
  } else {
    const exploreMedia = article.locator(".exploreMedia");
    await exploreMedia.first().click();
  }

  await page.getByRole("link", { name: "Chat" }).click();
  await page.getByRole("textbox", { name: "Type your message..." }).click();
  await page
    .getByRole("textbox", { name: "Type your message..." })
    .fill("안녕");
});
