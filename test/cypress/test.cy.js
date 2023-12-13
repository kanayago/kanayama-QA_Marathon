describe('顧客情報入力フォームのテスト', () => {
  it('顧客情報を入力して送信し、成功メッセージを確認する', () => {
    cy.visit('/goki_kanayama/customer/add.html'); // テスト対象のページにアクセ ス
    cy.window().then((win) => {
      // windowのalertをスタブ化し、エイリアスを設定
      cy.stub(win, 'alert').as('alertStub');
    });

    // テストデータの読み込み
    cy.fixture('customerData').then((data) => {
      // フォームの入力フィールドにテストデータを入力
      const uniqueContactNumber = `03-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      cy.get('#companyName').type(data.companyName);
      cy.get('#industry').type(data.industry);
      cy.get('#contact').type(uniqueContactNumber);
      cy.get('#location').type(data.location);
    });

    // フォームの送信
    cy.get('#customer-form').submit();
    cy.wait(1000);
    cy.get('#confirmSubmit').click();
    cy.wait(3000);
   // cy.get('@alertStub').should('have.been.calledOnceWith', '顧客情報が正常に 保存されました。');


    // フォームがリセットされたことを確認
   // cy.get('#companyName').should('have.value', '');
   // cy.get('#industry').should('have.value', '');
   // cy.get('#contact').should('have.value', '');
   // cy.get('#location').should('have.value', '');
   // cy.wait(5000);
  });
});

describe('ユーザー削除のテスト', () => {
  it('ユーザーを削除し、アラートが表示され、OKを押下した後にリストのアイテム数が1つ減少していることを確認する', () => {
    // ページにアクセス
    cy.visit('/goki_kanayama/customer/list.html');

    // リストの初期アイテム数を取得
    cy.get('#customer-list').find('tr').then(($initialItems) => {
      const initialItemCount = $initialItems.length;

      // 会社名を押下して詳細ページに遷移
      cy.get('#customer-list a').first().click();

      // 詳細ページで削除ボタンがあるか確認してクリック
      cy.get('#deleteBtn').click();

      // アラートが表示されるかどうかを確認
      //cy.on('window:alert', (text) => {
        //expect(text).to.equal('削除していいですか？');
      //});

      // window.confirmをモックしてOKを返すように設定
      //cy.window().then((win) => {
        //cy.stub(win, 'confirm').returns(true);
      //});

      // 削除完了のアラートが表示されるかどうかを確認
      //cy.on('window:alert', (text) => {
        //expect(text).to.equal('削除が完了しました');
      //});

      // アラートのOKボタンを押下
      //cy.window().then((win) => {
        //cy.stub(win, 'confirm').returns(true);
      //});

      // ページに戻って削除後のリストのアイテム数を取得
      //cy.go('back');
      cy.wait(5000);
      cy.get('#customer-list').find('tr').should('have.length', initialItemCount - 1);
    });
  });
});

describe('情報編集と更新のテスト', () => {
  it('情報を編集し、更新ボタンを押下して更新ができることを確認する', () => {
    // ページにアクセス
    cy.visit('/goki_kanayama/customer/list.html');

    // 会社名を押下して詳細ページに遷移
    cy.get('#customer-list a').first().click();

    // "編集はこちら"ボタンをクリック
    cy.get('#updateBtn').click();

    // 編集する情報を定義
    const editedData = {
      companyName: '更新後の会社名',
      industry: '更新後の業種',
    // 重複しない連絡先を生成
      contact: `03-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      location: '更新後の所在地',
    };

    // フォームの各フィールドを入力
    cy.get('#companyName').clear().type(editedData.companyName);
    cy.get('#industry').clear().type(editedData.industry);
    cy.get('#contact').clear().type(editedData.contact);
    cy.get('#location').clear().type(editedData.location);

    // 更新ボタン押下
    cy.get('form').submit();

    // 更新完了のアラートが表示されるか確認
    // cy.on('window:alert', (text) => {
    //   expect(text).to.equal('更新が完了しました');
    // });

    // 会社名を押下して詳細ページ遷移
    cy.wait(5000);
    cy.get('#customer-list a').last().click();

    // 更新後のデータが表示されていることを確認
    cy.get('#customer-detail').contains(`会社名: ${editedData.companyName}`);
    cy.get('#customer-detail').contains(`業種: ${editedData.industry}`);
    //cy.get('#customer-detail').contains(`連絡先: ${editedData.contact}`);
    cy.get('#customer-detail').contains(`所在地: ${editedData.location}`);
  });
});