const symbol = require('log-symbols');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const ncp = require('ncp').ncp;
const { updateJsonFile } = require('./util');

function create(projectName) {
  if (projectName === undefined) {
    console.log(chalk.red('error'), 'Please enter the Project Name.');
    return;
  }

  if (fs.existsSync(projectName)) {
    console.log(chalk.red('error'), 'The folder name is already occupied, please change the Project Name to recreate.');
    return;
  }

  const promptList = [
    {
      type: 'list',
      name: 'frame',
      message: 'Template:',
      choices: ['React', 'React-Typescript'],
      default: 'react'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description:'
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author:',
    },
    {
      type: 'input',
      name: 'version',
      message: 'Version:',
      default: '1.0.0'
    }
  ];

  inquirer
    .prompt(promptList)
    .then(answer => {
      const {
        frame,
        description,
        author,
        version,
      } = answer;

      const templatePath = path.resolve(__dirname, `../template/${frame}`);
      const destinationPath = path.resolve(process.cwd(), projectName);

      ncp(templatePath, destinationPath, function (err) {
        if (err) {
          return console.error(err);
        }

        const fileName = path.resolve(destinationPath, 'package.json');
        const updateConfig = {
          description,
          author,
          version,
          name: projectName,
        };

        updateJsonFile(fileName, updateConfig)
          .then(() => {
            console.log(' \n');
            console.log(symbol.success, `Success! Created ${projectName} at `, chalk.green(`${destinationPath}.`));
            console.log(symbol.info, 'Inside that directory, you can run several commands:\n');
            console.log(`  ${chalk.cyan('cd')} ${projectName}`);
            console.log(`  ${chalk.cyan('faz-cli init')}\n`);
            console.log(`Happy hacking!`);
          })
      });

    });
}

module.exports = create;
