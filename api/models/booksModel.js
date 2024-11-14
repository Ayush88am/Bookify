const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  booktype: {
    type:String,
    required:true
  },
  author: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  bookImageUrl: {
    type: String,
  },
  bookDescription: {
    type: String,
    required: true
  },
  bookRating: {
    type: Number,
  },
  bookPdfFileUrl:{
    type:String
  },
  bookContent:{
    type:String
  },
  uploadedBy:{
    type:String
  }
});
const bookModel=mongoose.model.book || mongoose.model("book", bookSchema);
module.exports=bookModel;
