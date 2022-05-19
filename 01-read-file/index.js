const path = require('path');
const fs = require('fs');
const { stdout } = process;

const input = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

input.on('data', (chunk) => stdout.write(chunk));

input.on('error', (err) => stdout.write(`\nERROR event: ${err.message}`));
