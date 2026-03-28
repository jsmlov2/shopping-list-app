const { test, expect } = require('@playwright/test');
const path = require('path');

const HTML_FILE = 'file://' + path.resolve(__dirname, 'shopping-list.html');

test.describe('쇼핑 리스트 앱 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 로컬 스토리지 초기화
    await page.goto(HTML_FILE);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('빈 리스트 상태 확인', async ({ page }) => {
    await page.goto(HTML_FILE);
    await expect(page.locator('.empty-state')).toContainText('리스트가 비어있어요');
  });

  test('아이템 추가 기능', async ({ page }) => {
    await page.goto(HTML_FILE);

    // 첫 번째 아이템 추가
    await page.fill('#itemInput', '사과');
    await page.click('.add-btn');

    // 아이템이 추가되었는지 확인
    await expect(page.locator('.list-item')).toHaveCount(1);
    await expect(page.locator('.list-item').first()).toContainText('사과');

    // 두 번째 아이템 추가 (엔터키)
    await page.fill('#itemInput', '우유');
    await page.press('#itemInput', 'Enter');

    await expect(page.locator('.list-item')).toHaveCount(2);
    await expect(page.locator('.list-item').nth(1)).toContainText('우유');

    // 카운트 확인
    await expect(page.locator('#itemCount')).toContainText('총 2개 중 2개 미완료');
  });

  test('완료 체크 기능', async ({ page }) => {
    await page.goto(HTML_FILE);

    // 아이템 추가
    await page.fill('#itemInput', '빵');
    await page.click('.add-btn');

    // 체크박스 클릭
    await page.click('.checkbox');

    // 완료 상태 확인
    await expect(page.locator('.list-item').first()).toHaveClass(/completed/);
    await expect(page.locator('.checkbox').first()).toHaveClass(/checked/);

    // 카운트 변경 확인
    await expect(page.locator('#itemCount')).toContainText('총 1개 중 0개 미완료');

    // 체크 해제
    await page.click('.checkbox');
    await expect(page.locator('.list-item').first()).not.toHaveClass(/completed/);
  });

  test('아이템 삭제 기능', async ({ page }) => {
    await page.goto(HTML_FILE);

    // 여러 아이템 추가
    await page.fill('#itemInput', '치즈');
    await page.click('.add-btn');
    await page.fill('#itemInput', '계란');
    await page.click('.add-btn');
    await page.fill('#itemInput', '토마토');
    await page.click('.add-btn');

    await expect(page.locator('.list-item')).toHaveCount(3);

    // 중간 아이템 삭제
    await page.locator('.delete-btn').nth(1).click();

    await expect(page.locator('.list-item')).toHaveCount(2);
    await expect(page.locator('.list-item').nth(0)).toContainText('치즈');
    await expect(page.locator('.list-item').nth(1)).toContainText('토마토');

    // 첫 번째 아이템 삭제
    await page.locator('.delete-btn').first().click();
    await expect(page.locator('.list-item')).toHaveCount(1);
    await expect(page.locator('.list-item').first()).toContainText('토마토');

    // 마지막 아이템 삭제
    await page.locator('.delete-btn').first().click();
    await expect(page.locator('.empty-state')).toBeVisible();
  });

  test('빈 입력으로 추가 시도', async ({ page }) => {
    await page.goto(HTML_FILE);

    // 빈 입력으로 추가 버튼 클릭
    await page.click('.add-btn');

    // 아이템이 추가되지 않아야 함
    await expect(page.locator('.list-item')).toHaveCount(0);
    await expect(page.locator('.empty-state')).toBeVisible();
  });

  test('로컬 스토리지 저장 확인', async ({ page }) => {
    await page.goto(HTML_FILE);

    // 아이템 추가 및 완료 표시
    await page.fill('#itemInput', '저장테스트');
    await page.click('.add-btn');
    await page.click('.checkbox');

    // 페이지 새로고침
    await page.reload();

    // 데이터가 유지되는지 확인
    await expect(page.locator('.list-item')).toHaveCount(1);
    await expect(page.locator('.list-item').first()).toContainText('저장테스트');
    await expect(page.locator('.list-item').first()).toHaveClass(/completed/);
  });

  test('전체 사용자 시나리오', async ({ page }) => {
    await page.goto(HTML_FILE);

    // 쇼핑 리스트 작성
    const items = ['사과', '우유', '빵', '계란', '치즈'];
    for (const item of items) {
      await page.fill('#itemInput', item);
      await page.press('#itemInput', 'Enter');
    }

    await expect(page.locator('.list-item')).toHaveCount(5);

    // 일부 아이템 구매 완료 표시
    await page.locator('.checkbox').nth(0).click(); // 사과
    await page.locator('.checkbox').nth(2).click(); // 빵

    await expect(page.locator('#itemCount')).toContainText('총 5개 중 3개 미완료');

    // 구매한 아이템 삭제
    await page.locator('.list-item').filter({ hasText: '사과' }).locator('.delete-btn').click();
    await page.locator('.list-item').filter({ hasText: '빵' }).locator('.delete-btn').click();

    await expect(page.locator('.list-item')).toHaveCount(3);
    await expect(page.locator('#itemCount')).toContainText('총 3개 중 3개 미완료');

    // 남은 아이템 확인
    const remainingItems = await page.locator('.item-text').allTextContents();
    expect(remainingItems).toEqual(['우유', '계란', '치즈']);
  });
});
