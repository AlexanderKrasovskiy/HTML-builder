const { readdir, stat } = require('fs/promises');
const path = require('path');
const pathToDir = path.join(__dirname, 'secret-folder');

const readFilesFromFolder = async (pathToDirectory) => {
  try {
    const files = await readdir(pathToDirectory, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const parsedPath = path.parse(path.join(pathToDirectory, file.name));
        const fileStats = await stat(path.join(pathToDirectory, file.name));

        const fileName = parsedPath.name;
        const fileExt = parsedPath.ext.slice(1);
        const fileSize = (fileStats.size / 1024).toFixed(3);

        console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

readFilesFromFolder(pathToDir);
