const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'files');
const copyDir = path.join(__dirname, 'files-copy');

readDir();

function readDir(_dir = dir, _copyDir = copyDir) {
    fs.readdir(_dir, { withFileTypes: true }, async (err, files) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Показать все процессы копирования: ");

            fs.mkdir(_copyDir, { recursive: true }, (err) => {
                if (err) {
                    console.log('boom', err);
                }
            });

            for (const file of files) {
                const filePath = path.join(_dir, file.name);
                const copyFilePath = path.join(_copyDir, file.name);

                if (file.isFile()) {
                    await copyFile(filePath, copyFilePath);

                    console.log(`${filePath} -> ${copyFilePath}`);
                } else {
                    readDir(filePath, copyFilePath)
                }
            }
        }
    });
}

async function copyFile(_dir, _copyDir) {
    try {
        await fs.promises.copyFile(_dir, _copyDir);
    } catch(err) {
        console.log('The file could not be copied', err);
    }
}