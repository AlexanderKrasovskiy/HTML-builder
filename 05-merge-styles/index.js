const path = require('path');
const { readdir, readFile, writeFile } = require('fs/promises');

async function mergeStyles(fromFolder, toFolder, extName) {
  try {
    const files = await readdir(fromFolder, { withFileTypes: true });

    const filesContentsArr = [];

    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === extName) {
        const pathToFile = path.join(fromFolder, file.name);
        const fileContent = await readFile(pathToFile, { encoding: 'utf-8' });

        filesContentsArr.push(fileContent);
      }
    }

    const destFilePath = path.join(toFolder, `bundle${extName}`);
    const destFileContent = filesContentsArr.join('\n\n');

    await writeFile(destFilePath, destFileContent, 'utf-8');
  } catch (err) {
    console.error(err);
  }
}

const srcDir = path.join(__dirname, 'styles');
const destDir = path.join(__dirname, 'project-dist');

mergeStyles(srcDir, destDir, '.css');
