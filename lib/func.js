const chalk = require("chalk");

exports.color = (text, color) => {
  return !color ? chalk.green(text) : chalk.keyword(color)(text);
};

exports.sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
