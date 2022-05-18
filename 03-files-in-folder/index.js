const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'secret-folder');

fs.readdir(dir, { withFileTypes: true }, async (err, files) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Показать все файлы в папке 'secret-folder': ");

        for (const file of files) {
            const filePath = path.join(dir, file.name);

            await checkFileOrFolder(filePath, file.name);
        }
    }
});

async function checkFileOrFolder(dir, fileName) {
    let filehandle, stats = null;

    try {
        filehandle = await fs
            .promises.open(dir, mode = 'r+');

        // Stats of directory
        stats = await filehandle.stat();
    } finally {
        if (filehandle) {
            // Close the file if it is opened.
            await filehandle.close();
        }
    }
    // File or Folder
    if (stats.isFile()) {
        //example - txt - 128.369kb
        const size = (stats.size / 1000);
        console.log(`${fileName.replace(/\..+/, '')} - ${path.extname(fileName).replace('.', '')} - ${size}kb`);
    }
}