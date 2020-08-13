const child = require('child_process');
const symbol = require('log-symbols');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const { updateJsonFile, loadCmd } = require('./util');

async function init() {
  const promptList = [
    {
      type: 'input',
      name: 'username',
      message: 'Username:'
    },
    {
      type: 'input',
      name: 'token',
      message: 'Token:',
    }
  ];

  const { username, token } = await inquirer.prompt(promptList);

  if (!username || !token) {
    console.log(symbol.warning, chalk.yellow('Please enter github username and token.'));
    return;
  }

  try {
    const projectName = process.cwd().split('/').slice(-1)[0];

    await loadCmd(`git init`, 'git init', 'git init', process.cwd());
    await loadCmd(`curl -u "${username}:${token}" https://api.github.com/user/repos -d '{"name": "${projectName}"}'`, 'Generates git repositories')
    await loadCmd(`git remote add origin https://github.com/${username}/${projectName}.git`, 'Associate the remote git repository')
    await updateJsonFile('package.json', {
      "repository": {
        "type": "git",
        "url": `https://github.com/${username}/${projectName}.git`
      }
    });
    await loadCmd(`git add .`, 'git add .', 'git add .', process.cwd());
    await loadCmd(`git commit -m 'feat: init'`, 'git commit', 'git commit', process.cwd());
    await loadCmd(`git push --set-upstream origin master`, 'git push', 'git push', process.cwd());

  } catch (err) {
    console.log(symbol.error, chalk.red('Failed to initialize, Check to see if there is a repository with the same name in the remote Git repository.'));
    console.log(symbol.error, chalk.red(err));
    process.exit(1);
  }
}

module.exports = init;
