# BrowserStack Filter Tool

> Not ready yet 🙀

This is a filter tool to select the most recent browsers from BrowserStack API.

No dependency in this project.

But remember to add `browserstack-helper.conf.js` file into your root folder.

## Usage

### Build and Run

`node launcher-generator.js`

### Import into the configuration

In Karma, for example, your configuration can be like this.

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