const fs = require('fs');
const { stdin: input, stdout: output } = require('process');
const readline = require('readline');
const path = require('path');

const file = path.join(__dirname, '/file.txt');
const rl = readline.createInterface({ input, output });
const writableStream = fs.createWriteStream(file);

console.log('Привет студент, всё что ты запишешь в терминале, будет записано в файл `file.txt`');

rl.on('line', (input) => {
    if (input === 'exit') {
        return rl.close();
    }

    writableStream.write(input + '\n');
});

rl.on('close', () => {
    console.log('Прощай студент, всё что ты написал будет использовано против тебя!!!')
});