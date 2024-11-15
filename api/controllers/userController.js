const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken")
const usermodel=require("../models/userModel")
const {uploadImage}=require("./profileImageupload")

const saltRounds = 10;
const userSignUp=async (req,res)=>{
  try{
    const isUserExists=await usermodel.findOne({
      email:req.body.email
    })
    if (isUserExists){
      return res.status(409).json({
        "message":"user already exists login please"

      })
    }
    const hashedPassword = await bcrypt.hash(req.body.password.trim(), saltRounds);
    const usernames = req.body.username.split(' ');
    const userProfileImage ="/uploads/userProfilePictures/unknownUser.jfif";
    const user = new usermodel({
      firstname: usernames[0],
      middlename:usernames[1],
      lastname: usernames[2],
      email:req.body.email.trim(),
      password:hashedPassword,
      userProfilePicture:userProfileImage
      });
    const  result = await user.save();
    if(result){
      const token = jwt.sign({ userId: result._id }, process.env.SECRET_KEY, {
        expiresIn: '1h'
    })
      // Set the token cookie with secure settings in production
      return res.status(200).json({
        "result":"User Signup Successfully",
        "token":token
      })
    }
    else{
      return res.status(400).json({
        "result":"User Signup Failed"
      })
  }
}
catch(err){
  return res.status(500).json({
    "result": "Internal Server Error"
    })
}
}
const userLogin=async(req,res)=>{
  try{
    const user = await usermodel.findOne({email:req.body.email});
    if(!user){
      return res.status(404).json({
        "result":"creat your account please"
        })
        }
        const isValidPassword = await bcrypt.compare(req.body.password.trim(),user.password);
        if(!isValidPassword){
          return res.status(400).json({
            "result":"Invalid Password"
            })
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn:'1h'
        })
    // Set the token cookie with secure settings in production


          return res.status(200).json({
            "result":"User Login Successfully",
            "token":token
            })
            }
            catch(error){
              return res.status(500).json({
                "result": "Internal Server Error"
                })
            }
          
}
const getUser=async(req,res)=>{

  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ result: "Please login to access this resource" });
  }
  try {
  const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    if (!decodedData) {
      return res.status(401).send({ error: "Unauthorized" })
    }
  const user = await usermodel.findById(decodedData.userId).select("-password");
      if(!user){
        return res.status(404).json({
          "result":"User Not Found"
          })
          }
    res.status(200).json(user);
  }
  catch(err){
    return res.status(500).json({
      "result": "Internal Server Error"
      })

  }
}
const searchUserProfile = async (req, res) => {
  try {
    let query = req.query.username.trim();
    if (!query) {
      return res.status(400).json({ result: "Please provide a username" });
    }

    // Split the query into individual words
    const queryParts = query.split(" ");

    // Build a dynamic query to search each part of the name in first, middle, or last name
    const searchConditions = queryParts.map(part => ({
      $or: [
        { firstname: { $regex: part, $options: 'i' } },
        { middlename: { $regex: part, $options: 'i' } },
        { lastname: { $regex: part, $options: 'i' } }
      ]
    }));

    const users = await usermodel.find({
      $and: searchConditions
    }).select('-password');

    if (users.length === 0) {
      return res.status(404).json({
        result: "No Users Found"
      });
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({
      result: "Server Error",
      error: error.message
    });
  }
};

const otherUserProfile=async (req,res)=>{
  try{
  const id=req.params.id.trim();
    const user = await usermodel.findById(id).select('-password');
  if(!user){
    return res.status(404).json({
      "result":"User Not Found"
      })
      }
      res.json(user);
      }
catch(err){
  res.status(500).json({
    "result":"Server Error",
    "error":err.message
    })
}
}
 const userLogout=async(req,res)=>{
  try{
   
    res.clearCookie('token');
    res.json({result:"Logged Out Successfully"})
    }
    catch(err){
      res.status(500).json({
        "result":"Server Error",
        "error":err.message
        })
        }
 }
const getUsers = async (req, res) => {
  try {
    const user = await usermodel.find()
    res.status(200).json(user)
  }
  catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    })
  }
}
const updateUser = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ result: "Please login to access this resource" });
  }

  try {
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    if (!decodedData) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    const user = await usermodel.findById(decodedData.userId).select("-password");
    if (!user) {
      return res.status(404).json({ result: "User Not Found" });
    }

    // Handle profile picture upload separately
    uploadImage(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message,
          result:"Oops Error! Check formate of Image ( .jpg , .png, .jpeg )"
         });
      }

      if (req.file) {
        const profileLink = `/uploads/userProfilePictures/${req.file.filename}`;
        user.userProfilePicture = profileLink;
      }

      // Update other fields if they are present
      const { username, phone, address, bio } = req.body;
      console.log(req.body);
      if (username) {
        const arry = username.split(" ");
        user.firstname=arry[0];
        user.middlename = arry[1];
        user.lastname = arry[2];

      }
      if (phone) user.number = phone;
      if (address) user.address = address;
      if (bio) user.bio = bio;

      const isOKay = await user.save();
      if (isOKay) {
        return res.status(200).json({
          message: "Profile updated successfully",
        });
      }
      else{
        return res.status(400).json({ message: "Failed to update profile" });
      }
    });
  } catch (err) {
    return res.status(500).json({ result: "Internal Server Error" });
  }
};

module.exports = { userSignUp, userLogin, getUser, searchUserProfile, otherUserProfile, userLogout, getUsers, updateUser }