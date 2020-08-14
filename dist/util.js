"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var fs = require('fs');

var ora = require('ora');

var util = require("util");

var exec = util.promisify(require("child_process").exec);

function updateJsonFile(fileName, obj) {
  return new Promise(resolve => {
    if (fs.existsSync(fileName)) {
      var data = fs.readFileSync(fileName).toString();
      var json = JSON.parse(data);
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

function loadCmd(_x, _x2, _x3, _x4) {
  return _loadCmd.apply(this, arguments);
}

function _loadCmd() {
  _loadCmd = _asyncToGenerator(function* (cmd, startText, endText, path) {
    var loading = ora();
    loading.start(startText);
    yield exec(cmd, path ? {
      cwd: path
    } : undefined);
    loading.succeed(endText || startText);
  });
  return _loadCmd.apply(this, arguments);
}

module.exports = {
  updateJsonFile,
  loadCmd
};