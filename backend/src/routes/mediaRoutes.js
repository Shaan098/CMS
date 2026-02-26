const express = require('express');
const multer = require('multer');
const path = require('path');
const { listMedia, uploadMedia } = require('../controllers/mediaController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname}`);
  }
});

const upload = multer({ storage });
const router = express.Router();

router.use(auth);

router.get('/', listMedia);
router.post('/', roleCheck('editor'), upload.single('file'), uploadMedia);

module.exports = router;
