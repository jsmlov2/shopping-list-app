const { test } = require('@playwright/test');
const path = require('path');

const HTML_FILE = 'file://' + path.resolve(__dirname, 'shopping-list.html');
const SCREENSHOT_DIR = path.resolve(__dirname, 'screenshots');

test.describe('쇼핑 리스트 스크린샷', () => {
  test('모든 화면 스크린샷 저장', async ({ page }) => {
    // 스크린샷 디렉토리 생성
    await page.goto(HTML_FILE);
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // 1. 빈 리스트 상태
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-empty-list.png'), fullPage: false });

    // 2. 첫 번째 아이템 입력 중
    await page.fill('#itemInput', '사과');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-typing-apple.png'), fullPage: false });

    // 3. 첫 번째 아이템 추가 완료
    await page.click('.add-btn');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-apple-added.png'), fullPage: false });

    // 4. 두 번째 아이템 추가 (엔터키)
    await page.fill('#itemInput', '우유');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-typing-milk.png'), fullPage: false });
    await page.press('#itemInput', 'Enter');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-milk-added.png'), fullPage: false });

    // 5. 세 번째 아이템 추가
    await page.fill('#itemInput', '빵');
    await page.click('.add-btn');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-three-items.png'), fullPage: false });

    // 6. 첫 번째 아이템 체크 (완료)
    await page.locator('.checkbox').nth(0).click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-apple-checked.png'), fullPage: false });

    // 7. 두 번째 아이템도 체크
    await page.locator('.checkbox').nth(1).click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-two-checked.png'), fullPage: false });

    // 8. 체크 해제
    await page.locator('.checkbox').nth(0).click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09-one-unchecked.png'), fullPage: false });

    // 9. 첫 번째 아이템 삭제
    await page.locator('.delete-btn').nth(0).click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10-apple-deleted.png'), fullPage: false });

    // 10. 더 많은 아이템 추가
    await page.fill('#itemInput', '계란');
    await page.click('.add-btn');
    await page.fill('#itemInput', '치즈');
    await page.click('.add-btn');
    await page.fill('#itemInput', '토마토');
    await page.click('.add-btn');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11-many-items.png'), fullPage: false });

    // 11. 여러 아이템 체크
    await page.locator('.checkbox').nth(0).click();
    await page.locator('.checkbox').nth(2).click();
    await page.locator('.checkbox').nth(4).click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12-multiple-checked.png'), fullPage: false });

    // 12. 중간 아이템 삭제
    await page.locator('.delete-btn').nth(2).click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13-middle-deleted.png'), fullPage: false });

    // 13. 모두 삭제
    await page.locator('.delete-btn').first().click();
    await page.locator('.delete-btn').first().click();
    await page.locator('.delete-btn').first().click();
    await page.locator('.delete-btn').first().click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14-back-to-empty.png'), fullPage: false });

    // 14. 로컬 스토리지 테스트 - 데이터 추가 후 새로고침
    await page.fill('#itemInput', '저장되는아이템');
    await page.click('.add-btn');
    await page.locator('.checkbox').nth(0).click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '15-before-reload.png'), fullPage: false });

    // 15. 새로고침 후 데이터 유지 확인
    await page.reload();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '16-after-reload-persistent.png'), fullPage: false });
  });
});
