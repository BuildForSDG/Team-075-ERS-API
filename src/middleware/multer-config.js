const multer = require('multer');
const fs = require('fs');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const DIR = './images';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPES[file.mimetype];
    let error = new Error('Invalid mime type');

    if (isValid) {
      error = null;
    }

    // Create directory if it doesn't exist
    fs.mkdirSync(DIR, { recursive: true });

    callback(error, DIR);
  },
  filename: (req, file, callback) => {
    const name = file.fieldname
      .toLowerCase()
      .split(' ')
      .join('_');
    const extension = MIME_TYPES[file.mimetype];

    callback(null, `${name + Date.now()}.${extension}`);
  }
});

module.exports = multer({ storage }).single('image');
