const { Command } = require('commander');
const create = require('./create');

const program = new Command();

// program.version('0.0.1');

// program
//  .option('-d, --debug', 'output extra debugging')
//  .option('-s, --small', 'small pizza size')
//  .option('-p, --pizza-type <type>', 'flavour of pizza');

// program.parse(process.argv);

// if (program.debug) console.log(program.opts());
//   console.log('pizza details:');
// if (program.small) console.log('- small pizza size');
// if (program.pizzaType) console.log(`- ${program.pizzaType}`);

program
  .command('create')
  .description('create project')
  .alias('c')
  .action(() => {
    create(...process.argv.slice(3));
  });

program
  .version(require('../package.json').version, '-v --version')
  .parse(process.argv);
