const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    opts.port = chrome.port;
    console.log('running');
    return lighthouse(url, opts, config).then(results => {
      // use results.lhr for the JS-consumeable output
      // https://github.com/GoogleChrome/lighthouse/blob/master/typings/lhr.d.ts
      // use results.report for the HTML/JSON/CSV output as a string
      // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
      return chrome.kill().then(() => results)
    });
  });
}

const opts = {
  chromeFlags: [
      '--show-paint-rects',
      '--window-size=412,732',
      '--disable-gpu',
     '--headless'
     ]
};

// Usage:
launchChromeAndRunLighthouse('https://www.firstcommand.com', opts).then(results => {
  // Use results!
  // var i = 0;
  // for(i; i++; i < results.length) {
  //   console.log('ran it', i);
  // }

  var json = JSON.stringify(results);

  const callback = function(err) {
    if (err) {
      console.log(err);
    }
    console.log('complete');
  };

  fs.writeFile('myjsonfile.json', json, 'utf8', callback);
  console.log('**********************', results.lighthouseVersion);
});