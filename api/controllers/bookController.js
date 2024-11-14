const bookmodel = require("../models/booksModel");

const uploadBook = async (req, res) => {
  try {
    const isBookExists = await bookmodel.findOne({
      title: req.body.title,
      booktype: req.body.booktype,
      author: req.body.author
    });

    if (isBookExists) {
      return res.status(400).json({ message: "Book already exists" });
    }

    const bookData = new bookmodel(req.body);
    const book = await bookData.save();
    if (!book) {
      return res.status(400).json({ message: "book not created" });
    }
    res.status(201).json({ message: "book created successfully", book });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const searchBook = async (req, res) => {
  try {
    const aboutbook = req.query.bookName.trim();
    const book = await bookmodel.find({
      $or: [
        {
          title: {
            $regex: aboutbook,
            $options: "i",
          },
        },
      ],
    });
    if(book.length===0){
      return res.status(200).json({
        status: "success",
        message: "book not found",
      })
    }
    if(book){
     return res.status(200).json(book)
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
const  getBook = async (req, res) => {
  try {
        
    const bookid = req.params.id.trim();
    const book = await bookmodel.findById(bookid);
    if(book){
      res.status(200).json(book)
      }
      else{
        res.status(404).json({
          status: "error",
          message:err.message
        })
  }
  
}
  catch(err){
    res.status(500).json({
      status:"error",
      message:err.message
  });
}
}
const getBooks=async(req,res)=>{
  try{
    const book=await bookmodel.find()
    if(!book){
      return res.status(404).json({
        status: "error",
        message: "Something went wrong"
      })
    }
    res.status(200).json(book)
  }
  catch(err){
    res.status(500).json({
      status:"error",
      message:err.message
  })
}
}
const deleteAnBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await bookmodel.findByIdAndDelete(id);
    if (book) {
      res.status(200).json({
        message: "Book deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "Book not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


module.exports={
  uploadBook,
  searchBook,
  getBook,
  getBooks,
  deleteAnBook
}
