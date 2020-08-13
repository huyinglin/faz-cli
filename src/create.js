const symbol = require('log-symbols');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const ncp = require('ncp').ncp;

async function create(projectName) {
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
      const destinationPath = path.resolve(__dirname, `../${projectName}`);

      ncp(templatePath, destinationPath, function (err) {
        if (err) {
          return console.error(err);
        }

        const fileName = path.resolve(__dirname, `../${projectName}/package.json`);
        const updateConfig = {
          description,
          author,
          version,
          name: projectName,
        };

        updateJsonFile(fileName, updateConfig)
          .then(() => {
            console.log(symbol.success, chalk.green(`Success! Created ${projectName} at ${path.resolve(__dirname, `../${projectName}`)}.`));
          })
      });

    });
}

function updateJsonFile(fileName, obj) {
  return new Promise(resolve => {
      if (fs.existsSync(fileName)) {
          const data = fs.readFileSync(fileName).toString();
          let json = JSON.parse(data);
          Object.keys(obj).forEach(key => {
            json[key] = obj[key];
          });
          fs.writeFileSync(fileName, JSON.stringify(json, null, '\t'), 'utf-8');
          resolve();
      }
  });
}

module.exports = create;
