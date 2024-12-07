const multer = require("multer");
const path = require("path");

// multer middleware
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "rishon" + path.extname(file.originalname));
  },
});
// multer configuration
const upload = multer({ storage });

module.exports = {
  upload,
};
