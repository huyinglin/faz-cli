"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _require = require("commander"),
    Command = _require.Command;

var create = require("./create");

var init = require("./init");

var program = new Command();
var actionMap = {
  create: {
    description: "Create project",
    alias: "c"
  },
  init: {
    description: "Init project",
    alias: "i"
  },
  dev: {
    description: "本地启动项目",
    options: [{
      flags: "-p --port <port>",
      description: "端口",
      defaultValue: 3000
    }],
    alias: "d"
  },
  build: {
    description: "服务端项目打包",
    usages: ["little-bird-cli build", "lb-cli build", "lbc build"],
    options: [{
      flags: "-u --username <port>",
      description: "github用户名",
      defaultValue: ""
    }, {
      flags: "-t --token <port>",
      description: "github创建的token",
      defaultValue: ""
    }],
    alias: "b"
  }
};
Object.keys(actionMap).forEach(function (action) {
  if (actionMap[action].options) {
    Object.keys(actionMap[action].options).forEach(function (option) {
      var obj = actionMap[action].options[option];
      program.option(obj.flags, obj.description, obj.defaultValue);
    });
  }

  program.command(action).description(actionMap[action].description).alias(actionMap[action].alias).action(function () {
    switch (action) {
      case "create":
        create.apply(void 0, _toConsumableArray(process.argv.slice(3)));
        break;

      case "init":
        init();
        break;
      // case "dev":
      //   dev(program.port);
      //   break;
      // case "build":
      //   build();
      //   break;

      default:
        break;
    }
  });
});
program.version(require("../package.json").version, "-v --version").parse(process.argv);
/**
 * little-bird-cli命令后不带参数的时候，输出帮助信息
 */

if (!process.argv.slice(2).length) {
  program.outputHelp();
}