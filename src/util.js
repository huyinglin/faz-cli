const fs = require('fs');
const ora = require('ora');
const util = require("util");
const exec = util.promisify(require("child_process").exec);

function updateJsonFile(fileName, obj) {
  return new Promise(resolve => {
    if (fs.existsSync(fileName)) {
      const data = fs.readFileSync(fileName).toString();
      let json = JSON.parse(data);
      Object.keys(obj).forEach(key => {
        if (obj[key]) {
          json[key] = obj[key];
        }
      });
      fs.writeFileSync(fileName, JSON.stringify(json, null, '\t'), 'utf-8');
      resolve();
    }
  });
}

async function loadCmd(cmd, startText, endText, path) {
  let loading = ora();
  loading.start(startText);
  await exec(cmd, { cwd: path });
  loading.succeed(endText);
}

module.exports = {
  updateJsonFile,
  loadCmd,
}
