const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const isHiddenFile = item => /(^|\/)\.[^\/\.]/g.test(item);

const isDirectory = item => fs.statSync(item).isDirectory();

const createFileHash = (item, callback) => {
  const hash = crypto.createHash('sha1');
  const input = fs.createReadStream(item);
  input.on('readable', () => {
    const data = input.read();
    if(data) {
      hash.update(data);
    } else {
      console.log('hash in'.toUpperCase(), hash.digest('hex'));
      callback(hash);
    }
  });
};

const isDuplicate = (fileName, list) => list.has(fileName);

const isDuplicateName = (fileName, namesList) => namesList.has(fileName);

const isDuplicateContent = (fileHash, hashList) => hashList.has(fileHash);

/**
 * synchronously traverse over files in specified directory
 * recursive function
 * @param {string} dir
 * @param {object} namesList
 * @param {object} duplicates
 * @returns {object}
 */
const getDuplicateFiles = (dir, namesList = new Set(), duplicates = new Set()) => {
  const items = fs.readdirSync(dir);
  items.forEach((item) => {
    if (!isHiddenFile(item)) {
      const fullPath = path.resolve(dir, item);
      if (isDirectory(fullPath)) {
        getDuplicateFiles(fullPath, namesList, duplicates);
      } else {
        console.log('item'.toUpperCase(), item);
        const fileHash = createFileHash(fullPath, (hash) => {
          if (isDuplicate(hash, namesList)) {
            duplicates.add(hash);
          }
          namesList.add(hash);
        });
      }
    }
  });
  return duplicates;
};

const duplicatesService = {
  getDuplicateFiles,
  isHiddenFile,
  isDirectory,
  isDuplicate,
};

module.exports = duplicatesService;
