# BrowserStack Filter Tool

This is a filter tool to select the most recent browsers from BrowserStack API.

No dependency in this project.

But remember to add `browserstack-helper.conf.js` file into your root folder.

## Usage

In Karma, for example, three steps to use: `Set`, `Build`, and `Import`.

### Setting

Manually create a file `browserstack-helper.conf.js` like below:

```javascript
module.exports = {
  // Replace with your Browserstack account's username and accessKey
  username: BROWSERSTACK_USERNAME,
  accessKey: BROWSERSTACK_ACCESS_KEY,

  osList: {
    'OS X': ['Mojave'],
    'Windows': ['10']
  },

  browserList: [ 'edge', 'chrome', 'firefox', 'safari' ],

  excludeList: [
    { os: 'Windows', browser: 'safari' }
  ],

  browserVersionRange: 2,

  templateLauncher: {
    base: 'BrowserStack'
  },

  additionalLaunchers: {
    NameOfLauncher: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
    }
  }
}
```

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

## LICENSE

Please see in LICENSE file.

## NPM
https://www.npmjs.com/package/browserstack-filter-tool