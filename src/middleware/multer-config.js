const multer = require('multer');
const fs = require('fs');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPES[file.mimetype];
    let error = new Error('Invalid mime type');

    if (isValid) {
      error = null;
    }
    callback(error, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname
      .toLowerCase()
      .split(' ')
      .join('_');
    const extension = MIME_TYPES[file.mimetype];
    const body = JSON.parse(req.body);

    fs.unlink(`images/${body.prevImage}`, () => {
      callback(null, body.prevImage ? `${body.prevImage}` : `${name + Date.now()}.${extension}`);
    });
  }
});

module.exports = multer({ storage }).single('image');
