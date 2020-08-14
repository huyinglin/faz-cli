"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var child = require('child_process');

var symbol = require('log-symbols');

var chalk = require('chalk');

var inquirer = require('inquirer');

var ora = require('ora');

var {
  updateJsonFile,
  loadCmd
} = require('./util');

function init() {
  return _init.apply(this, arguments);
}

function _init() {
  _init = _asyncToGenerator(function* () {
    var promptList = [{
      type: 'input',
      name: 'username',
      message: 'Username:'
    }, {
      type: 'input',
      name: 'token',
      message: 'Token:'
    }];
    var {
      username,
      token
    } = yield inquirer.prompt(promptList);

    if (!username || !token) {
      console.log(symbol.warning, chalk.yellow('Please enter github username and token.'));
      return;
    }

    try {
      var projectName = process.cwd().split('/').slice(-1)[0];
      yield loadCmd("git init", 'git init', 'git init', process.cwd());
      yield loadCmd("curl -u \"".concat(username, ":").concat(token, "\" https://api.github.com/user/repos -d '{\"name\": \"").concat(projectName, "\"}'"), 'Generates git repositories');
      yield loadCmd("git remote add origin https://github.com/".concat(username, "/").concat(projectName, ".git"), 'Associate the remote git repository');
      yield updateJsonFile('package.json', {
        "repository": {
          "type": "git",
          "url": "https://github.com/".concat(username, "/").concat(projectName, ".git")
        }
      });
      yield loadCmd("git add .", 'git add .', 'git add .', process.cwd());
      yield loadCmd("git commit -m 'feat: init'", 'git commit', 'git commit', process.cwd());
      yield loadCmd("git push --set-upstream origin master", 'git push', 'git push', process.cwd());
    } catch (err) {
      console.log(symbol.error, chalk.red('Failed to initialize, Check to see if there is a repository with the same name in the remote Git repository.'));
      console.log(symbol.error, chalk.red(err));
      process.exit(1);
    }
  });
  return _init.apply(this, arguments);
}

module.exports = init;