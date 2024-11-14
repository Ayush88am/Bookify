/* import dotenv --------------
      ----------- and config with .env files -----
       in Project --------------
*/

require("dotenv").config({ path: ".env.local" });

/* import required modules --------------
      ----------- for Prooject --------------
*/
const express = require("express");
const path=require("path")
const cors = require('cors');
const routes=require("./routes/routes")
const mongoose=require("mongoose")
const cookieParser=require("cookie-parser")
/*    ---------------- 

---------------------
*/
const app = express();

/*  connect to database --------------

----------- for Project --------------
*/
mongoose.connect(process.env.MONGODB_URI);


/*  uses globel middlewares --------------

----------- for Project --------------
*/
app.use(cookieParser());
app.use(cors({
      origin: 'http://127.0.0.1:5500',  
      credentials: true  
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(express.static(path.join(__dirname,"../public")));
/* static files on localhost */
app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "../public", "signUp.html")); 
});
app.get("/login", (req, res) => {
      res.sendFile(path.join(__dirname, "../public", "login.html"));
});
app.get("/uploadBook", (req, res) => {
      res.sendFile(path.join(__dirname, "../public", "bookUploader.html"));
});
app.get("/home",(req,res)=>{
      res.sendFile(path.join(__dirname,"../public","home.html"))
})
app.get("/user", (req, res) => {
      res.sendFile(path.join(__dirname, "../public", "userProfile.html"))
}) 
app.get("/book", (req, res) => {
      res.sendFile(path.join(__dirname, "../public", "book.html"))
})
app.get("/yourProfile", (req, res) => {
      res.sendFile(path.join(__dirname, "../public", "profileOwner.html"))
})
/*
routes for Project --------------
*/
app.use("/api",routes)

/*   connecting to the server --------------

----------- listen  on port --------------

*/
const port = process.env.PORT || 3000;
app.listen(port)