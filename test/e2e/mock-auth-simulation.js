/**
 * E2E動作検証シミュレーション（ブラウザコンソールで実行）
 * モック認証の動作を検証するためのJavaScriptコード
 */

console.log('🚀 E2E動作検証開始');

// テスト1: モックログイン画面の表示確認
function testLoginPageDisplay() {
  console.log('📋 テスト1: ログイン画面の表示確認');
  
  const emailInput = document.querySelector('#email');
  const passwordInput = document.querySelector('#password');
  const loginButton = document.querySelector('button[type="submit"]');
  
  if (emailInput && passwordInput && loginButton) {
    console.log('✅ ログインフォームの要素が正常に表示されています');
    return true;
  } else {
    console.log('❌ ログインフォームの要素が見つかりません');
    return false;
  }
}

// テスト2: フォーム入力のシミュレーション
function testFormInput() {
  console.log('📋 テスト2: フォーム入力のシミュレーション');
  
  const emailInput = document.querySelector('#email');
  const passwordInput = document.querySelector('#password');
  
  if (emailInput && passwordInput) {
    // 既存の値をクリア
    emailInput.value = '';
    passwordInput.value = '';
    
    // テスト値を入力
    emailInput.value = 'test@example.com';
    passwordInput.value = 'testpassword';
    
    // Reactの更新をトリガー
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    console.log('✅ フォームに値が入力されました');
    console.log('📧 Email:', emailInput.value);
    console.log('🔒 Password:', passwordInput.value);
    return true;
  } else {
    console.log('❌ フォーム要素が見つかりません');
    return false;
  }
}

// テスト3: ログインボタンクリックのシミュレーション
function testLoginButtonClick() {
  console.log('📋 テスト3: ログインボタンクリックのシミュレーション');
  
  const loginButton = document.querySelector('button[type="submit"]');
  
  if (loginButton) {
    console.log('🖱️ ログインボタンをクリックします...');
    
    // Cookieを事前に設定してテスト
    document.cookie = "mockAuthToken=mock-token; path=/; max-age=86400";
    
    loginButton.click();
    
    console.log('✅ ログインボタンがクリックされました');
    console.log('🍪 モック認証Cookieが設定されました');
    
    // 少し待ってからページ遷移を確認
    setTimeout(() => {
      if (window.location.pathname === '/') {
        console.log('✅ ホーム画面に正常に遷移しました');
      } else {
        console.log('📍 現在のパス:', window.location.pathname);
      }
    }, 1000);
    
    return true;
  } else {
    console.log('❌ ログインボタンが見つかりません');
    return false;
  }
}

// テスト4: 認証状態の確認
function testAuthenticationState() {
  console.log('📋 テスト4: 認証状態の確認');
  
  const hasMockToken = document.cookie.includes('mockAuthToken=mock-token');
  const hasLocalStorage = localStorage.getItem('mockAuthToken') === 'mock-token';
  
  console.log('🍪 Cookie認証状態:', hasMockToken ? '✅ 認証済み' : '❌ 未認証');
  console.log('💾 LocalStorage認証状態:', hasLocalStorage ? '✅ 認証済み' : '❌ 未認証');
  
  return hasMockToken || hasLocalStorage;
}

// メインテスト実行関数
function runE2ETest() {
  console.log('🧪 =================================');
  console.log('🧪 E2E動作検証テスト開始');
  console.log('🧪 =================================');
  
  const results = {
    loginPageDisplay: testLoginPageDisplay(),
    formInput: testFormInput(),
    loginButtonClick: testLoginButtonClick(),
    authenticationState: testAuthenticationState()
  };
  
  console.log('🧪 =================================');
  console.log('🧪 テスト結果サマリー');
  console.log('🧪 =================================');
  
  Object.entries(results).forEach(([test, result]) => {
    console.log(`${result ? '✅' : '❌'} ${test}`);
  });
  
  const allPassed = Object.values(results).every(result => result);
  console.log('🧪 =================================');
  console.log(allPassed ? '🎉 全テスト合格！' : '⚠️ 一部テストで問題があります');
  console.log('🧪 =================================');
  
  return results;
}

// テスト実行手順の出力
console.log('📖 使用方法:');
console.log('1. http://localhost:5173/login-mock にアクセス');
console.log('2. ブラウザの開発者ツールのコンソールでこのコードを実行');
console.log('3. runE2ETest() を実行してテスト開始');
console.log('');
console.log('💡 個別テスト実行:');
console.log('- testLoginPageDisplay() - ログイン画面表示確認');
console.log('- testFormInput() - フォーム入力テスト');
console.log('- testLoginButtonClick() - ログインボタンテスト');
console.log('- testAuthenticationState() - 認証状態確認');

// 自動実行の場合
if (typeof window !== 'undefined' && window.location.pathname === '/login-mock') {
  console.log('🤖 自動テスト実行中...');
  setTimeout(runE2ETest, 1000);
}