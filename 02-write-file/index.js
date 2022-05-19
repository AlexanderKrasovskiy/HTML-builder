const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout, exit } = process;
const pathToFile = path.join(__dirname, 'text.txt');

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

fs.writeFile(pathToFile, '', (err) => {
  if (err) throw err;

  stdout.write('Hello! Please Enter some text...\n');
});

rl.on('line', (line) => {
  if (line.trim() !== 'exit') {
    fs.appendFile(pathToFile, `${line}\n`, (err) => {
      if (err) throw err;
    });
  } else {
    exitScript();
  }
});

rl.on('SIGINT', exitScript);

function exitScript() {
  stdout.write('Goodbye forever!');
  exit();
}
