# BrowserStack Filter Tool

There's no dependency in this project. No need to install anything. But remember to set the `browserstack-helper.conf.js` file.

## Usage

### Build and Run

`node launcher-generator.js`

### Import into the configuration

In Karma for example, your configuration can be like this.

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