import { test, expect } from "@playwright/test";

test.describe("HamburgerBar E2E", () => {
  test("should open and close the hamburger sidebar menu", async ({ page }) => {
    // 1. 메인 페이지로 이동
    await page.goto("/");

    // 2. 햄버거 메뉴 버튼 클릭 (aria-label, role, class 등으로 탐색)
    // 아래 셀렉터는 실제 프로젝트에 맞게 수정 필요
    const hamburgerButton = await page
      .locator(
        'button[aria-label*="menu"], button[aria-label*="Menu"], .hamburger, .menu-button'
      )
      .first();
    await expect(hamburgerButton).toBeVisible();
    await hamburgerButton.click();

    // 3. 사이드바(드로어)가 나타나는지 확인 (MUI Drawer는 role="presentation" 또는 .MuiDrawer-root 사용)
    const drawer = page.locator('.MuiDrawer-root, [role="presentation"]');
    await expect(drawer).toBeVisible();

    // 4. 닫기 (드로어 바깥 클릭 또는 닫기 버튼)
    // 닫기 버튼이 있다면 클릭, 없으면 드로어 바깥 클릭
    const closeButton = drawer
      .locator('button[aria-label*="close"], .close, .drawer-close')
      .first();
    if ((await closeButton.count()) > 0) {
      await closeButton.click();
    } else {
      // 드로어 바깥 영역 클릭 (MUI Drawer는 overlay가 body에 추가됨)
      await page.mouse.click(10, 10); // 화면 좌상단 등 드로어 바깥 클릭
    }

    // 5. 드로어가 사라졌는지 확인
    await expect(drawer).not.toBeVisible();
  });
});
