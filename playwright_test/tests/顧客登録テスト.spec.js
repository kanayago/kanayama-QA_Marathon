import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://dev.marathon.rplearn.net/goki_kanayama/index.html');
  await page.getByRole('button', { name: '[顧客]情報入力画面へ' }).click();
  await page.getByLabel('会社名:').click();
  await page.getByLabel('会社名:').fill('test2');
  await page.getByLabel('業種:').click();
  await page.getByLabel('業種:').fill('test2');
  await page.getByLabel('連絡先:').click();
  await page.getByLabel('連絡先:').fill('test3');
  await page.getByLabel('所在地:').click();
  await page.getByLabel('所在地:').fill('test2');
  await page.getByRole('button', { name: '送信' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: '送信' }).click();

  page.on('dialog', async (dialog) => {
    if (dialog.type() === 'alert') {
      console.log('正常に保存されました', dialog.message());
      // ここにalertが表示されたときの処理を追加する
    }
    await dialog.accept(); // Alertを閉じる
  });
});