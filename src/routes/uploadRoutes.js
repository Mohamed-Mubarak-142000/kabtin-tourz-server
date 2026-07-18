const express = require('express');
const multer = require('multer');
const { requireAuth } = require('../middlewares/auth');
const uploadController = require('../controllers/uploadController');

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB per file

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (!file.mimetype || !file.mimetype.startsWith('image/')) {
    const err = new Error('Only image files are allowed');
    err.status = 400;
    return cb(err);
  }
  return cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE, files: 10 },
});

const router = express.Router();

router.post('/', requireAuth, upload.array('images', 10), uploadController.uploadImages);

module.exports = router;
