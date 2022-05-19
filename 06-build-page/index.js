const path = require('path');
const {
  readFile,
  readdir,
  mkdir,
  writeFile,
  copyFile,
  rm,
} = require('fs/promises');

// ======================= HTML =======================

async function buildHtml(htmlLink, componentsDir, destDir) {
  try {
    let htmlTemplate = await readFile(htmlLink, { encoding: 'utf-8' });
    const components = await readdir(componentsDir, { withFileTypes: true });

    for (const file of components) {
      if (file.isFile() && path.extname(file.name) === '.html') {
        const pathToFile = path.join(componentsDir, file.name);
        const fileContent = await readFile(pathToFile, { encoding: 'utf-8' });
        const fileName = path.parse(pathToFile).name;

        htmlTemplate = htmlTemplate.replace(`{{${fileName}}}`, fileContent);
      }
    }

    await mkdir(destDir, { recursive: true });

    const destFilePath = path.join(destDir, 'index.html');
    await writeFile(destFilePath, htmlTemplate, 'utf-8');
  } catch (err) {
    console.error(err);
  }
}

const templateHtmlLink = path.join(__dirname, 'template.html');
const componentsHtmlFolder = path.join(__dirname, 'components');
const destFolder = path.join(__dirname, 'project-dist');

buildHtml(templateHtmlLink, componentsHtmlFolder, destFolder);

// ======================= CSS =======================

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

    const destFilePath = path.join(toFolder, `style${extName}`);
    const destFileContent = filesContentsArr.join('\n\n');

    await writeFile(destFilePath, destFileContent, 'utf-8');
  } catch (err) {
    console.error(err);
  }
}

const srcCssDir = path.join(__dirname, 'styles');

mergeStyles(srcCssDir, destFolder, '.css');

// ======================= ASSETS =======================

async function copyDir(from, to) {
  async function delayedFileCopy(file) {
    const srcPath = path.join(from, file.name);
    const destPath = path.join(to, file.name);

    if (file.isFile()) {
      await copyFile(srcPath, destPath);
    } else {
      await copyDir(srcPath, destPath);
    }
  }

  try {
    await rm(to, { force: true, recursive: true });
    await mkdir(to, { recursive: true });

    const folderContent = await readdir(from, { withFileTypes: true });

    const promises = folderContent.map(delayedFileCopy);
    await Promise.all(promises);
  } catch (err) {
    console.error(err);
  }
}

const inputDirPath = path.join(__dirname, 'assets');
const outputDirPath = path.join(__dirname, 'project-dist', 'assets');

copyDir(inputDirPath, outputDirPath);
