const https = require('https');
const fs = require('fs');

const configHelper = require('browserstack-helper.conf');

const httpsURL = 'https://'+ configHelper.username + ':' + configHelper.accessKey + '@api.browserstack.com/5/browsers?flat=true';

https.get( httpsURL, (httpsResponse) => {
  httpsResponse.setEncoding('utf8');
  httpsResponse.on('data', (chunk) => {
    browserstackCapability += chunk;
  });
  httpsResponse.on('end', () => {
    initBrowserstackCapability();
    let result = generateLaunchers();

    // Save as a JS file.
    const JScontent = 'module.exports = ' + JSON.stringify(result);
    fs.writeFile('._launchers.js', JScontent, (err) => {});
  });
});

let browserstackCapability = '';
function initBrowserstackCapability() {
  browserstackCapability = JSON.parse(browserstackCapability);
}

function getRequiredLaunchers() {

  let candidateContainer = {};
  for (let launcher of browserstackCapability) {
    if ( validLauncher(launcher) ) {
      const launcherIndexName = `BrowserStack${launcher.os}${launcher.os_version}${launcher.browser}`.replace(/ /g,'');
      updateCandidateLauncher(launcherIndexName, launcher);
    }
  }
  return formalizeCandidateLauncher();

  function validLauncher(launcher) {
    const notExcluded = configHelper.excludeList.reduce((result, eachExclude) => {
      if (eachExclude.os == launcher.os && eachExclude.browser == launcher.browser) {
        return false;
      } else {
        return result;
      }
    }, true);
    return notExcluded && configHelper.osList[launcher.os]
      && configHelper.browserList.includes(launcher.browser)
      && ( configHelper.osList[launcher.os].length == 0 || configHelper.osList[launcher.os].includes(launcher.os_version));
  }

  function updateCandidateLauncher(launcherName, newLauncher) {
    if (candidateContainer[launcherName] === undefined) {
      candidateContainer[launcherName] = [ newLauncher ];
    } else if (!newLauncher.browser_version.includes('beta')) {
      selectNewestInRange(launcherName, newLauncher);
    }
  }

  function selectNewestInRange(launcherName, comingLauncher) {
    const sourceList = candidateContainer[launcherName];
    if (sourceList.length < configHelper.browserVersionRange) {
      sourceList.push(comingLauncher);
    }
    const oldestLauncher = getOldestLauncher(launcherName);
    const comingVersion = parseFloat(comingLauncher.browser_version);
    if (parseFloat(oldestLauncher.browser_version) < comingVersion) {
      const targetIndex = sourceList.indexOf(oldestLauncher);
      sourceList[targetIndex] = comingLauncher;
    }
    candidateContainer[launcherName] = sourceList;
  }

  function getOldestLauncher(launcherName) {
    return candidateContainer[launcherName].reduce( (result, candidate) => {
      const resultVer = parseFloat(result.browser_version);
      const candidateVer = parseFloat(candidate.browser_version);
      if (candidateVer < resultVer) {
        return candidate;
      } else {
        return result;
      }
    }, { browser_version: Infinity });
  }

  function formalizeCandidateLauncher() {
    let result = {};
    for (let launchersName of Object.keys(candidateContainer)) {
      for (let launcher of candidateContainer[launchersName]) {
        const browserVersionName = parseInt(launcher.browser_version);
        const uniqueName = `${launchersName}${browserVersionName}`;
        result[uniqueName] = {
          os: launcher.os,
          os_version: launcher.os_version,
          browser: launcher.browser,
          browser_version: launcher.browser_version,
          ...configHelper.templateLauncher
        };
      }
    }
    return result;
  }
}

function generateLaunchers() {
  let requiredLaunchers = getRequiredLaunchers();
  // Add on additional launchers.
  return Object.assign(requiredLaunchers, configHelper.additionalLaunchers);
}
