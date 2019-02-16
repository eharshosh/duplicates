const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const util = require('util');

// turn asynchronous functions to promises to work with async/await
const readdirAsync = util.promisify(fs.readdir);
const statAsync = util.promisify(fs.stat);

const isHiddenFile = item => /(^|\/)\.[^\/\.]/g.test(item);

/**
 * read file as stream and hash its contents
 * @param item
 * @returns {Promise<*>}
 */
const computeFileHash = async (item) => {
  const hash = crypto.createHash('sha1');
  const input = fs.createReadStream(item);
  return new Promise((resolve) => {
    input.on('readable', () => {
      const data = input.read();
      if (data) {
        hash.update(data);
      } else {
        resolve(hash.digest('hex'));
      }
    });
  });
};

/**
 * recursive function to map all file paths by file name in given root
 * @param {string} dir
 * @param {object} filesMap
 * @returns {Promise<void>}
 */
const createFilesMap = async (dir, filesMap) => {
  const list = await readdirAsync(dir);
  // mapFilesByName
  for (const item of list) {
    if (!isHiddenFile(item)) {
      const fullPath = path.resolve(dir, item);
      const stat = await statAsync(fullPath);
      if (stat && stat.isDirectory()) {
        await createFilesMap(fullPath, filesMap);
      } else {
        if (!filesMap[item]) {
          filesMap[item] = [];
        }
        filesMap[item].push({ path: fullPath });
      }
    }
  }
};

/**
 * add hash to files that have the same name
 * @param {object} filesMap
 * @returns {Promise<void>}
 */
const addHashesToDuplicateFiles = async (filesMap) => {
  for (const entries of Object.values(filesMap)) {
    if (entries.length > 1) {
      for (const entry of entries) {
        entry.hash = await computeFileHash(entry.path);
      }
    }
  }
};

/**
 * go over file names and compare their hashes if more than 1 file with the same name exists
 * group paths by hashes
 * return groups of duplicate files by name and content
 * @param {object} filesMap
 * @returns {{}}
 */
const getDuplicatesByNameAndContent = filesMap => Object
  .keys(filesMap)
  .reduce((acc, fileName) => {
    if (filesMap[fileName].length > 1) {
      const groupedByHash = filesMap[fileName].reduce((hashesSet, entry) => {
        hashesSet[entry.hash] = hashesSet[entry.hash] || [];
        hashesSet[entry.hash].push(entry.path);
        return hashesSet;
      }, {});
      const duplicateFiles = Object.values(groupedByHash).filter(paths => paths.length > 1);
      if (duplicateFiles.length > 0) {
        acc[fileName] = duplicateFiles;
      }
    }
    return acc;
  }, {});

const getDuplicateFiles = async (dir) => {
  const filesMap = {};
  await createFilesMap(dir, filesMap);
  await addHashesToDuplicateFiles(filesMap);
  return getDuplicatesByNameAndContent(filesMap);
};

const duplicatesService = {
  getDuplicateFiles,
  isHiddenFile,
  createFilesMap,
  getDuplicatesByNameAndContent,
};

module.exports = duplicatesService;
