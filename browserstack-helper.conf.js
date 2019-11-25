module.exports = {
  // Browserstack 帳號的 username 與 accessKey
  username: BROWSERSTACK_USERNAME,
  accessKey: BROWSERSTACK_ACCESS_KEY,

  // 共測兩種作業系統，Key 為作業系統名稱，Value 為要測的版本名稱
  osList: {
    'OS X': ['Mojave'],
    'Windows': ['10']
  },

  // 每種 OS 下要測這五種瀏覽器
  browserList: [ 'edge', 'chrome', 'opera', 'firefox', 'safari'],

  // 除了 Windows 下的 Safari 瀏覽器
  excludeList: [
    { os: 'Windows', browser: 'safari'}
  ],

  // 最新的兩個瀏覽器版本都要測
  browserVersionRange: 2,

  // 自動產出的 launcher，
  // 除 os, os_version, browser, browser_version 之外，
  // 應該要附加的其他項目
  templateLauncher: {
    base: 'BrowserStack',
    project: 'browserstack-filter-tool-example',
    video: false
  },

  // 手動加入的額外 launcher
  additionalLaunchers: {
    ChromeHeadlessNoSandbox: {
      base: 'ChromeHeadless',
      flags: ['--no-sandbox']
    }
  }
}
