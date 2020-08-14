"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var symbol = require('log-symbols');

var chalk = require('chalk');

var fs = require('fs');

var path = require('path');

var inquirer = require('inquirer');

var ncp = require('ncp').ncp;

var {
  updateJsonFile,
  loadCmd
} = require('./util');

function create(projectName) {
  if (projectName === undefined) {
    console.log(chalk.red('error'), 'Please enter the Project Name.');
    return;
  }

  if (fs.existsSync(projectName)) {
    console.log(chalk.red('error'), 'The folder name is already occupied, please change the Project Name to recreate.');
    return;
  }

  var promptList = [{
    type: 'list',
    name: 'frame',
    message: 'Template:',
    choices: ['React', 'React-Typescript'],
    default: 'react'
  }, {
    type: 'input',
    name: 'description',
    message: 'Description:'
  }, {
    type: 'input',
    name: 'author',
    message: 'Author:'
  }, {
    type: 'input',
    name: 'version',
    message: 'Version:',
    default: '1.0.0'
  }];
  inquirer.prompt(promptList).then(answer => {
    var {
      frame,
      description,
      author,
      version
    } = answer;
    var templatePath = path.resolve(__dirname, "../template/".concat(frame));
    var destinationPath = path.resolve(process.cwd(), projectName);
    ncp(templatePath, destinationPath, function (err) {
      if (err) {
        return console.error(err);
      }

      var fileName = path.resolve(destinationPath, 'package.json');
      var updateConfig = {
        description,
        author,
        version,
        name: projectName
      };
      updateJsonFile(fileName, updateConfig).then( /*#__PURE__*/_asyncToGenerator(function* () {
        console.log('\nCreating a new React app in ', chalk.green("".concat(destinationPath, ".\n")));
        console.log("Installing packages. This might take a couple of minutes.\n");
        yield loadCmd("yarn", 'Installing packages...', 'Done.', destinationPath);
        console.log('\nInside that directory, you can run several commands:\n');
        console.log("  ".concat(chalk.cyan('faz-cli init')));
        console.log("     Initializes the git repository and automatically generates git repositories remotely.\n");
        console.log("  ".concat(chalk.cyan('faz-cli dev')));
        console.log("     Starts the development server.\n");
        console.log("  ".concat(chalk.cyan('faz-cli build')));
        console.log("     Bundles the app into static files for production.\n");
        console.log("We suggest that you begin by typing:\n");
        console.log("  ".concat(chalk.cyan('cd'), " ").concat(projectName));
        console.log("  ".concat(chalk.cyan('faz-cli dev'), "\n"));
        console.log("Happy hacking!");
      }));
    });
  });
}

module.exports = create;