const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstname:{
      type:String,
      required:true
     },
  middlename: {
    type: String,
   
  },
  lastname: {
    type: String,
  },
     email:{
      type:String,
      required:true
     },
     password:{
      type:String,
      required:true
     },
     userProfilePicture:{
      type:String,
      //optional
     },
  bio: {
    type: String,
    //optional
  },
   address: {
    type: String,
    //optional
  }, number: {
    type: String,
    //optional
  }

});
const userModel = mongoose.model.user || mongoose.model("user", userSchema);
module.exports = userModel;
