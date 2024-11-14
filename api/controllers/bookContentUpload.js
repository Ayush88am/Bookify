const path = require("path");
const multer = require("multer");
const bookmodel = require("../models/booksModel");
const { uploadImage } = require("./profileImageupload");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/bookPdfs"));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const filetype = /pdf/;
  const extname = filetype.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetype.test(file.mimetype);
  if (extname && mimetype) cb(null, true);
  else cb("Error: Only PDF files are allowed!");
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter
}).single("bookPdfDocument");

const bookPdfUploader = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err });

    const { bookId, bookContent } = req.body;
    try {
      const book = await bookmodel.findById(bookId);
      if (!book) return res.status(404).json({ message: "Book not found" });

      if (req.file) {
        const pdfLink = `/uploads/bookPdfs/${req.file.filename}`;
        book.bookPdfFileUrl = pdfLink;
      }

      if (bookContent) {
        book.bookContent = bookContent;
      }

      await book.save();

      res.status(200).json({
        message: "Book updated successfully",
        bookPdfFileUrl: book.bookPdfFileUrl || null,
        bookContent: book.bookContent || null
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
};

const bookThumbnailImage = async (req, res) => {
  uploadImage(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err });
    if (!req.file) return res.status(400).json({ message: "No file uploaded!" });

    const { bookId } = req.body;
    try {
      const profileLink = `/uploads/userProfilePictures/${req.file.filename}`;
      const book = await bookmodel.findById(bookId);
      if (!book) return res.status(404).json({ message: "Book not found" });

      book.bookImageUrl = profileLink;
      await book.save();

      res.status(200).json({
        message: "Thumbnail uploaded successfully",
        profileLink
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
};

const deleteAnBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await bookmodel.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    await book.remove();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { bookPdfUploader, bookThumbnailImage, deleteAnBook };
