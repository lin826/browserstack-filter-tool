const fs = require('fs');
const https = require('https');

const configHelper = require('../../browserstack-helper.conf');

let browserstackCapability = '';
if (configHelper.username === undefined || configHelper.accessKey === undefined) {
  let result = generateLaunchers();
  writeJavaScriptFile(result);
  return 0;
}

const httpsURL = 'https://'+ configHelper.username + ':' + configHelper.accessKey + '@api.browserstack.com/5/browsers?flat=true';
try {
  https.get( httpsURL, (httpsResponse) => {
    httpsResponse.setEncoding('utf8');
    httpsResponse.on('data', (chunk) => {
      browserstackCapability += chunk;
    });
    httpsResponse.on('end', () => {
      let result = generateLaunchers();
      writeJavaScriptFile(result);
    });
  });
} catch {
  // Save as a JS file.
  const JScontent = 'module.exports = ' + JSON.stringify(result);
  fs.writeFile('browserstack-launchers.js', JScontent, (err) => {});
}

function writeJavaScriptFile(result) {
  // Save as a JS file.
  const JScontent = 'module.exports = ' + JSON.stringify(result) + ';';
  fs.writeFile('browserstack-launchers.js', JScontent, (err) => {});
}

function generateLaunchers() {
  let requiredLaunchers = getRequiredLaunchers();
  // Add on additional launchers.
  return Object.assign(requiredLaunchers, configHelper.additionalLaunchers);
}

function getRequiredLaunchers() {
  let candidateContainer = {};

  try {
    browserstackCapability = JSON.parse(browserstackCapability);
    for (let launcher of browserstackCapability) {
      if ( validLauncher(launcher) ) {
        const launcherIndexName = `BrowserStack${launcher.os}${launcher.os_version}${launcher.browser}`.replace(/ /g,'');
        updateCandidateLauncher(launcherIndexName, launcher);
      }
    }
  } catch {
    // Do Nothing.
  }
  return formalizeCandidateLauncher();

  function validLauncher(launcher) {
    const isIncluded = configHelper.excludeList.reduce((result, eachExclude) => {
      if (eachExclude.os == launcher.os && eachExclude.browser == launcher.browser) {
        return false;
      } else {
        return result;
      }
    }, true);
    return isIncluded
      && configHelper.osList[launcher.os]
      && configHelper.osList[launcher.os].includes(launcher.os_version)
      && configHelper.browserList.includes(launcher.browser);
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
