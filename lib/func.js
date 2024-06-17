const chalk = require("chalk");

exports.color = (text, color) => {
  return !color ? chalk.green(text) : chalk.keyword(color)(text);
};
