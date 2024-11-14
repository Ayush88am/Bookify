const path = require("path");
const multer = require("multer");
const usermodel = require("../models/userModel");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/userProfilePictures')); 
  },
  filename: (req, file, cb) => {
    console.log(file)
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const filetype = /jpg|jpeg|png|jfif|webp/;
  const extname = filetype.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetype.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Only images are allowed!');
  }
};

const uploadImage = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, 
  fileFilter: fileFilter
}).single('profileImage');


module.exports = { uploadImage };
