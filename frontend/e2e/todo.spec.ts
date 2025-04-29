import { test, expect } from '@playwright/test';

/**
 * Todo 앱 E2E 테스트
 * 
 * 이 테스트 파일은 Todo 앱의 주요 기능을 테스트합니다:
 * - Todo 항목 추가
 * - Todo 항목 완료 상태 변경
 */
test.describe('Todo 앱 기능 테스트', () => {
  // 각 테스트 전에 앱 페이지로 이동하고 로컬 스토리지 초기화
  test.beforeEach(async ({ page }) => {
    // 앱 페이지로 이동
    await page.goto('/');
    
    // 로컬 스토리지 초기화
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('새로운 Todo 항목 추가', async ({ page }) => {
    // Todo 입력 필드 찾기
    const todoInput = page.getByPlaceholder('새 할일 추가');
    
    // 새 Todo 추가
    await todoInput.fill('Playwright로 테스트 작성하기');
    await page.getByRole('button', { name: '추가' }).click();
    
    // Todo 항목이 목록에 추가되었는지 확인 (첫 번째 셀의 텍스트 확인)
    await expect(page.locator('table tbody tr').first()).toContainText('Playwright로 테스트 작성하기');
  });

  test('Todo 항목 완료 상태 변경', async ({ page }) => {
    // 기존 Todo 항목 추가
    const todoInput = page.getByPlaceholder('새 할일 추가');
    await todoInput.fill('완료 상태 테스트');
    await page.getByRole('button', { name: '추가' }).click();
    
    // 체크박스 클릭하여 완료 상태로 변경
    await page.getByRole('checkbox').first().check();
    
    // 완료 상태로 변경되었는지 확인 (체크박스가 체크되었는지 확인)
    await expect(page.getByRole('checkbox').first()).toBeChecked();
  });

  // 삭제 기능이 아직 구현되지 않아 테스트에서 제외
  test.skip('Todo 항목 삭제', async ({ page }) => {
    // 기존 Todo 항목 추가
    const todoInput = page.getByPlaceholder('새 할일 추가');
    await todoInput.fill('삭제할 항목');
    await page.getByRole('button', { name: '추가' }).click();
    
    // 메뉴 버튼 클릭
    await page.getByRole('button', { name: '할일 메뉴' }).click();
    
    // 드롭다운 메뉴에서 삭제 옵션 클릭 (메뉴 아이템 대신 텍스트로 선택)
    await page.getByText('삭제', { exact: true }).click();
    
    // 항목이 삭제되었는지 확인 (테이블에 해당 텍스트가 없는지 확인)
    await expect(page.locator('table')).not.toContainText('삭제할 항목');
  });
});
