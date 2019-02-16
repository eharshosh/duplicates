const duplicatesService = require('./duplicates.service');

const duplicatesController = (express) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (!req.query.dir) {
      res
        .status(400)
        .json({ message: 'dir not specified' });
      return;
    }
    try {
      const duplicates = await duplicatesService.getDuplicateFiles(req.query.dir);
      res
        .status(200)
        .json({
          message: 'ok',
          initialDir: req.query.dir,
          duplicates,
        });
    } catch (err) {
      console.error(err);
      res
        .status(400)
        .json({
          message: err,
        });
    }
  });
  return router;
};

module.exports = duplicatesController;
