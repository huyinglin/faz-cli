const symbol = require('log-symbols');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const ncp = require('ncp').ncp;
const { updateJsonFile, loadCmd } = require('./util');

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
          .then(async () => {
            console.log('\nCreating a new React app in ', chalk.green(`${destinationPath}.\n`));
            console.log(`Installing packages. This might take a couple of minutes.\n`);

            await loadCmd(`yarn`, 'Installing packages...', 'Done.', destinationPath);

            console.log('\nInside that directory, you can run several commands:\n');

            console.log(`  ${chalk.cyan('faz-cli init')}`);
            console.log(`     Initializes the git repository and automatically generates git repositories remotely.\n`);

            console.log(`  ${chalk.cyan('faz-cli dev')}`);
            console.log(`     Starts the development server.\n`);

            console.log(`  ${chalk.cyan('faz-cli build')}`);
            console.log(`     Bundles the app into static files for production.\n`);

            console.log(`We suggest that you begin by typing:\n`);
            console.log(`  ${chalk.cyan('cd')} ${projectName}`);
            console.log(`  ${chalk.cyan('faz-cli dev')}\n`);
            console.log(`Happy hacking!`);
          })
      });

    });
}

module.exports = create;
