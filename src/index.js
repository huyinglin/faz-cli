const { Command } = require("commander");

const create = require("./create");
const init = require("./init");

const program = new Command();

let actionMap = {
  create: {
    description: "Create project",
    alias: "c",
  },
  init: {
    description: "Init project",
    alias: "i",
  },
  dev: {
    description: "本地启动项目",
    options: [
      {
        flags: "-p --port <port>",
        description: "端口",
        defaultValue: 3000,
      },
    ],
    alias: "d",
  },
  build: {
    description: "服务端项目打包",
    usages: ["little-bird-cli build", "lb-cli build", "lbc build"],
    options: [
      {
        flags: "-u --username <port>",
        description: "github用户名",
        defaultValue: "",
      },
      {
        flags: "-t --token <port>",
        description: "github创建的token",
        defaultValue: "",
      },
    ],
    alias: "b",
  },
};

Object.keys(actionMap).forEach((action) => {
  if (actionMap[action].options) {
    Object.keys(actionMap[action].options).forEach((option) => {
      const obj = actionMap[action].options[option];
      program.option(obj.flags, obj.description, obj.defaultValue);
    });
  }

  program
    .command(action)
    .description(actionMap[action].description)
    .alias(actionMap[action].alias)
    .action(() => {
      switch (action) {
        case "create":
          create(...process.argv.slice(3));
          break;
        case "init":
          init(program.username, program.token);
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

program
  .version(require("../package.json").version, "-v --version")
  .parse(process.argv);

/**
 * little-bird-cli命令后不带参数的时候，输出帮助信息
 */
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
