const z = require("zod");

const bookDataChecker = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  price: z.number().positive("Price must be a positive number"),
  booktype:z.string().min(1,"type of book required"),
  bookImageUrl: z.string().url("Invalid URL for book image").optional(),
  bookDescription: z.string().min(1, "Description is required"),
  bookRating:z.number().optional(),
  uploadedBy:z.string(),
  bookPdfFileUrl:z.string().url().optional(),
  bookContent:z.string().optional()
});

const bookDataValidationMiddleware = (req, res, next) => {
  try {
    const validData = bookDataChecker.safeParse(req.body)
    if (validData.success) {
      next()
    }
    else {
      return res.status(400).json({
        "error": "please enter valid data"
      })
    }
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = {bookDataValidationMiddleware};
