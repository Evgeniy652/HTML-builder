const fs = require('fs');
const path = require('path');

const fileName = 'bundle.css';
const dir = path.join(__dirname, 'styles');
const copyDir = path.join(__dirname, 'project-dist', fileName);

removeBeforeAndStart();

function removeBeforeAndStart() {
    fs.rm(copyDir, {
        recursive: true,
    }, (error) => {
        readDir();
    });
}

function readDir() {
    const writableStream = fs.createWriteStream(copyDir);

    fs.readdir(dir, { withFileTypes: true }, async (err, files) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Показать все склеенные файлы: ");

            for (const file of files) {
                const ext = path.extname(file.name)
                const filePath = path.join(dir, file.name);

                if (file.isFile() && ext === '.css') {
                    await new Promise((res, rej) => {
                        fs.readFile(filePath, "utf8",
                            (error, data) => {
                                if (error) {
                                    throw error;
                                    rej();
                                }

                                writableStream.write(data);
                                console.log(file.name);
                                res();
                            }
                        );
                    });
                }
            }
        }
    });
}