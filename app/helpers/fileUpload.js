module.exports = app => {
  let api = {};
  const multer = require('multer');

  // multer settings
  const multerStorage = multer.diskStorage({
    destination: function(req, file, next) {
      next(null, './public/files');
    },
    filename: function(req, file, next) {
      const sanitizedName = file.originalname
        .replace('/[^a-z0-9\./gi', '-')
        .replace('/-{2,}/g', '-')
        .toLowerCase();

      const name = Date.now() + '-' + sanitizedName;
      req.body.file = name;

      next(null, name);
    }
  });

  const multerFilter = function(req, file, cb) {

    if (!file.originalname.toLowerCase().match(/\.pdf$/)) cb(new Error('File must be a PDF'), false);
    else cb(undefined, true);
  }

  const fileLimits = {
    fileSize: 26214400,
    fieldNameSize: 255,
    files: 1,
  };

  // apply settings
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: fileLimits
  });

  api.upload = upload.single('file');

  api.handleError = (error, req, res, next) => {
    if (error) res.status(400).json({
      error: error.message
    });
    else next();
  };

  return api;

}

