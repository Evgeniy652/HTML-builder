
/*
Требования
 1. После завершения работы скрипта должна быть создана папка project-dist
 2. В папке project-dist должны находиться файлы index.html и style.css
 3. В папке project-dist должна находиться папка assets являющаяся точной копией папки assets находящейся в 06-build-page
 4. Запрещается использование fsPromises.cp()
 5. Файл index.html должен содержать разметку являющуюся результатом замены шаблонных тегов в файле template.html
 6. Файл style.css должен содержать стили собранные из файлов папки styles
 7. При добавлении компонента в папку и соответствующего тега в исходный файл template.html повторное выполнение скрипта приведёт файл index.html в папке project-dist в актуальное состояние перезаписав его. Файл style.css и папка assets так же должны поддерживать актуальное состояние
 8. Исходный файл template.html не должен быть изменён в ходе выполнения скрипта
 9. Запись в шаблон содержимого любых файлов кроме файлов с расширением .html является ошибкой
 */

const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
const stylesDir = path.join(__dirname, 'styles');
const htmlPath = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const resultDir = path.join(__dirname, 'project-dist');

removeBeforeAndStart();

function removeBeforeAndStart() {
    fs.rm(resultDir, {
        recursive: true,
    }, (error) => {
        startCreation();
    });
}

function startCreation() {
    fs.mkdir(resultDir, { recursive: true }, (err) => {
        if (err) {
            throw err;
        }

        console.log("Показать все процессы копирования assets, все склеенные файлы css и подсавленные файлы в HTML ");
        copyAssetDir();
        readStyles();
        readHtml();
    });
}

function readComponentFile(path) {
    return new Promise((res, rej) => {
        fs.readFile(path, "utf8",
            (error, data) => {
                if (error) {
                    throw error;
                    rej();
                }

                console.log(`[HTML]: Файл ${path} взят для HTML`);
                res(data);
            }
        );
    });
}

function readHtml() {
    const writableStream = fs.createWriteStream(path.join(resultDir, 'index.html'));
    const templateRegex = /{{.+?}}/g;
    let htmlData;

    fs.readFile(htmlPath, "utf8",
        async (error, data) => {
            if (error) {
                throw error;
            }

            htmlData = data;
            const matches = data.match(templateRegex);
            console.log(`[HTML]: Show all matches: ${matches}`);

            for (const match of matches) {
                const filePath = path.join(componentsDir, `${match.replace('{{', '').replace('}}', '')}.html`);
                const selectorData = await readComponentFile(filePath);

                htmlData = htmlData.replace(match, selectorData);
            }

            writableStream.write(htmlData);
        }
    );

}

function readStyles() {
    const writableStream = fs.createWriteStream(path.join(resultDir, 'style.css'));

    fs.readdir(stylesDir, { withFileTypes: true }, async (err, files) => {
        if (err) {
            console.log(err);
        } else {
            for (const file of files) {
                const ext = path.extname(file.name)
                const filePath = path.join(stylesDir, file.name);

                if (file.isFile() && ext === '.css') {
                    await new Promise((res, rej) => {
                        fs.readFile(filePath, "utf8",
                            (error, data) => {
                                if (error) {
                                    throw error;
                                    rej();
                                }


                                writableStream.write(data);
                                console.log(`[STYLES]: Файл ${file.name} взят для склейки`);
                                res();
                            }
                        );
                    });
                }
            }
        }
    });
}

function copyAssetDir(_dir = assetsDir, _copyDir = path.join(resultDir, 'assets')) {
    fs.readdir(_dir, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.log(err);
        } else {
            fs.mkdir(_copyDir, { recursive: true }, async (err) => {
                if (err) {
                    console.log(err);
                    throw err;
                }

                for (const file of files) {
                    const filePath = path.join(_dir, file.name);
                    const copyFilePath = path.join(_copyDir, file.name);

                    if (file.isFile()) {
                        await copyFile(filePath, copyFilePath);

                        console.log(`[ASSETS]: COPY: ${filePath} -> ${copyFilePath}`);
                    } else {
                        copyAssetDir(filePath, copyFilePath)
                    }
                }
            });
        }
    });
}

async function copyFile(_dir, _copyDir) {
    try {
        await fs.promises.copyFile(_dir, _copyDir);
    } catch(err) {
        console.log('[ASSETS]: The file could not be copied', err);
    }
}