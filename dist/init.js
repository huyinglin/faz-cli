"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var child = require('child_process');

var symbol = require('log-symbols');

var chalk = require('chalk');

var inquirer = require('inquirer');

var ora = require('ora');

var _require = require('./util'),
    updateJsonFile = _require.updateJsonFile,
    loadCmd = _require.loadCmd;

function init() {
  return _init.apply(this, arguments);
}

function _init() {
  _init = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var promptList, _yield$inquirer$promp, username, token, projectName;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            promptList = [{
              type: 'input',
              name: 'username',
              message: 'Username:'
            }, {
              type: 'input',
              name: 'token',
              message: 'Token:'
            }];
            _context.next = 3;
            return inquirer.prompt(promptList);

          case 3:
            _yield$inquirer$promp = _context.sent;
            username = _yield$inquirer$promp.username;
            token = _yield$inquirer$promp.token;

            if (!(!username || !token)) {
              _context.next = 9;
              break;
            }

            console.log(symbol.warning, chalk.yellow('Please enter github username and token.'));
            return _context.abrupt("return");

          case 9:
            _context.prev = 9;
            projectName = process.cwd().split('/').slice(-1)[0];
            _context.next = 13;
            return loadCmd("git init", 'git init', 'git init', process.cwd());

          case 13:
            _context.next = 15;
            return loadCmd("curl -u \"".concat(username, ":").concat(token, "\" https://api.github.com/user/repos -d '{\"name\": \"").concat(projectName, "\"}'"), 'Generates git repositories');

          case 15:
            _context.next = 17;
            return loadCmd("git remote add origin https://github.com/".concat(username, "/").concat(projectName, ".git"), 'Associate the remote git repository');

          case 17:
            _context.next = 19;
            return updateJsonFile('package.json', {
              "repository": {
                "type": "git",
                "url": "https://github.com/".concat(username, "/").concat(projectName, ".git")
              }
            });

          case 19:
            _context.next = 21;
            return loadCmd("git add .", 'git add .', 'git add .', process.cwd());

          case 21:
            _context.next = 23;
            return loadCmd("git commit -m 'feat: init'", 'git commit', 'git commit', process.cwd());

          case 23:
            _context.next = 25;
            return loadCmd("git push --set-upstream origin master", 'git push', 'git push', process.cwd());

          case 25:
            _context.next = 32;
            break;

          case 27:
            _context.prev = 27;
            _context.t0 = _context["catch"](9);
            console.log(symbol.error, chalk.red('Failed to initialize, Check to see if there is a repository with the same name in the remote Git repository.'));
            console.log(symbol.error, chalk.red(_context.t0));
            process.exit(1);

          case 32:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[9, 27]]);
  }));
  return _init.apply(this, arguments);
}

module.exports = init;