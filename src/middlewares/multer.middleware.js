import multer from "multer";

const storage = multer.diskStorage({
  // we using the disk strorage rather than memeory storage to help in saving up the space

  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
});

export { upload };
