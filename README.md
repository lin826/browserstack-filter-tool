# BrowserStack Filter Tool

> Not ready yet 🙀

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

## Settings and Default

## LICENSE

Please see in LICENSE file.

## NPM
https://www.npmjs.com/package/browserstack-filter-tool