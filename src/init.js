const child = require('child_process');
const symbol = require('log-symbols');
const chalk = require('chalk');
const ora = require('ora');
const util = require("util");

const { updateJsonFile } = require('./util');
const exec = util.promisify(require("child_process").exec);

let loadCmd = async (cmd, text) => {
  let loading = ora();
  loading.start(`${text}: 命令执行中...`);
  await exec(cmd);
  loading.succeed(`${text}: 命令执行完成`);
}

async function init(username, token) {
  await loadCmd(`git init`, 'git初始化');
  if (!username || !token) {
    console.log(symbol.warning, chalk.yellow('缺少入参无法创建远端仓库'));
  } else {
    const projectName = process.cwd().split('/').slice(-1)[0];
    await loadCmd(`curl -u "${username}:${token}" https://api.github.com/user/repos -d '{"name": "${projectName}"}'`, 'Github仓库创建')
    await loadCmd(`git remote add origin https://github.com/${username}/${projectName}.git`, '关联远端仓库')
    let loading = ora();
    loading.start(`package.json更新repository: 命令执行中...`);
    await updateJsonFile('package.json', {
      "repository": {
        "type": "git",
        "url": `https://github.com/${username}/${projectName}.git`
      }
    }).then(() => {
        loading.succeed(`package.json更新repository: 命令执行完成`);
    });
    await loadCmd(`git add .`, '执行git add')
    await loadCmd(`git commit -a -m 'init'`, '执行git commit')
    await loadCmd(`git push --set-upstream origin master`, '执行git push')
  }
  await loadCmd(`yarn`, '安装依赖')
}

module.exports = init;
