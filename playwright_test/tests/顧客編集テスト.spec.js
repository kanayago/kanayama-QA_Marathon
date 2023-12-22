import { test, expect } from '@playwright/test';

const generateRandomContact = () => {
  // 重複しないランダムな文字列を生成するロジックを追加する
  // 例: ユニークなランダム文字列を生成する関数を呼び出す
  return `Contact_${Math.random().toString(36).substr(2, 8)}`;
};

test('test', async ({ page }) => {
  await page.goto('http://dev.marathon.rplearn.net/goki_kanayama/index.html');
  await page.getByRole('button', { name: '[顧客]一覧表示画面へ' }).click();
  
  // 一番上の会社名のリンクをクリックする
  const firstLinkInCell = await page.locator('tbody tr:first-child td a');
  const companyName = await firstLinkInCell.textContent();
  await firstLinkInCell.click();

  // ここから先の操作で顧客情報が更新されるように変更
  await page.getByRole('button', { name: '編集はこちら' }).click();
  
  await page.waitForTimeout(3000);
  await page.getByLabel('会社名:').click();
  await page.getByLabel('会社名:').fill('更新後の会社名');
  await page.getByLabel('業種:').click();
  await page.getByLabel('業種:').fill('更新後の業種');
  
  // 他と重複しないランダムな連絡先を生成して入力
  const randomContact = generateRandomContact();
  await page.getByLabel('連絡先:').click();
  await page.getByLabel('連絡先:').fill(randomContact);
  
  await page.getByLabel('所在地:').click();
  await page.getByLabel('所在地:').fill('更新後の所在地');
  
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  
  await page.getByRole('button', { name: '更新' }).click();
});