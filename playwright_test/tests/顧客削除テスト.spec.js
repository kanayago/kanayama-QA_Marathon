import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://dev.marathon.rplearn.net/goki_kanayama/index.html');
  await page.getByRole('button', { name: '[顧客]一覧表示画面へ' }).click();
  // 一番上の会社名のリンクをクリックする
  const firstLinkInCell = await page.locator('tbody tr:first-child td a');
  const companyName = await firstLinkInCell.textContent();
  await firstLinkInCell.click();

  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });

  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: '削除' }).click();

// 「削除していいですか？」アラートが表示されたときの処理
const deleteConfirmationDialog = await page.waitForEvent('dialog', dialog => {
  return dialog.type() === 'alert' && dialog.message() === '削除していいですか？';
});

console.log('削除していいですか？', deleteConfirmationDialog.message());

// アラート内の「OK」を押下
await deleteConfirmationDialog.accept();

// アラートが閉じられた後、一定時間待機
await page.waitForTimeout(3000);

// 「削除が完了しました」アラートが表示されたときの処理
const deleteCompletionDialog = await page.waitForEvent('dialog', dialog => {
  return dialog.type() === 'alert' && dialog.message() === '削除が完了しました';
});

console.log('削除が完了しました', deleteCompletionDialog.message());

// アラート内の「OK」を押下
await deleteCompletionDialog.accept();
    
});