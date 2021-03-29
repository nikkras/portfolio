const exec = require('child_process').exec;
const sassdoc = require('sassdoc');
const chalk = require('chalk');

if (!process.env.GEN_DOC) {
  return;
}

const title = chalk.green('Generating documentation: ');

// Generate SASS Mixin documentation
console.log(`${title} Sass docs`);
sassdoc('./src/style', { verbose: true, dest: './public/styleguide' }).then(
  function() {
    console.log(`${chalk.green('Ok!')}, Sass documentation has been generated`);
  },
  function(err) {
    console.log(`${chalk.red('Failed!')}, Sass documentation generation failed`);
    console.error(err);
  }
);

