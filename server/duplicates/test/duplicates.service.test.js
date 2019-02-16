const assert = require('assert');
const duplicatesService = require('../duplicates.service');

describe('duplicatesService', async () => {
  describe('isHiddenFile', () => {
    it('should return true for hidden files (name starts with a dot char)', () => {
      // prepare
      const item = '.git';
      // act
      const isHiddenFile = duplicatesService.isHiddenFile(item);
      // assert
      assert.strictEqual(isHiddenFile, true);
    });

    it('should return false for regular files (name does not start with a dot char)', () => {
      // prepare
      const item = 'index.html';
      // act
      const isHiddenFile = duplicatesService.isHiddenFile(item);
      // assert
      assert.strictEqual(isHiddenFile, false);
    });
  });

  describe('createFilesMap', async () => {
    it('should display 3 entries for mockDirWithoutDups', async () => {
      // prepare
      const dirName = `${__dirname}/mockDirWithoutDups`;
      const filesMap = {};
      // act
      await duplicatesService.createFilesMap(dirName, filesMap);
      // assert
      assert.strictEqual(Object.keys(filesMap).length, 3);
    });

    it('should display both paths of mock.js', async () => {
      // prepare
      const dirName = `${__dirname}/mockDirWithDups`;
      const fileName = 'mock.js';
      const filesMap = {};
      // act
      await duplicatesService.createFilesMap(dirName, filesMap);
      // assert
      assert.strictEqual(filesMap[fileName].length, 2);
    });
  });

  describe('getDuplicateFiles', async () => {
    it('should return an empty object when there are no duplicate files', async () => {
      // prepare
      const dirName = `${__dirname}/mockDirWithoutDups`;
      // act
      const duplicates = await duplicatesService.getDuplicateFiles(dirName);
      // assert
      assert.strictEqual(Object.keys(duplicates).length, 0);
    });

    it('should return one entry when there is one duplicate file', async () => {
      // prepare
      const dirName = `${__dirname}/mockDirWithDups`;
      // act
      const duplicates = await duplicatesService.getDuplicateFiles(dirName);
      // assert
      assert.strictEqual(Object.keys(duplicates).length, 1);
    });
  });
});
