# BrowserStack Filter Tool

This is a filter tool to select the most recent browsers from BrowserStack API.

No dependency in this project.

But remember to add `browserstack-helper.conf.js` file into your root folder.

## Usage

In Karma, for example, two steps to use: `Build` and `Import`.

### Build and Run

Please add a script wherever before `karma start karma.conf.js` (usually in `package.json`).

That is, use

```shell
node ./node_modules/browserstack-filter-tool/launcher-generator.js && karma start karma.conf.js
```

instead of

```shell
karma start karma.conf.js
```

### Import into the configuration

Your configuration can be set like this.

```javascript
// karma.conf.js
const browserstackLaunchers = require('./._launchers');

module.exports = (config) => {
  config.set({
    ...
    browsers: Object.keys(browserstackLaunchers),
    customLaunchers: browserstackLaunchers,
    ...
  });
};
```

## Settings

Currently, all the following settings are necessary in `browserstack-helper.conf.js`.

```javascript
{
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
    project: '@vip3/js-auth-sdk',
    video: false
  },

  // 手動加入的額外 launcher
  additionalLaunchers: {
    ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
    }
}
```

## LICENSE

Please see in LICENSE file.

## NPM
https://www.npmjs.com/package/browserstack-filter-tool