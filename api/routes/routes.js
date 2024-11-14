
/* * @description:import required ---------
----------- modules and functions -------
*/
const express=require("express")
const router=express.Router();
const user=require("../controllers/userController")
const books=require("../controllers/bookController")
const { userDataValidationMiddleWare, cookieCheckerMiddleWare } = require("../middlewares/userMiddleware");
const { bookDataValidationMiddleware }=require("../middlewares/bookMiddleware")
const bookFiles=require("../controllers/bookContentUpload")


/*
* @description: These are function and routes to handle the request for the URL.
*/ 


////-~~~~~~~~~~~~~~~~~~~~~~~~ <USER ROUTES>  ~~~~~~~~~~~~~~~~~~~~~~~~ ////
router.post("/userRagister",userDataValidationMiddleWare,user.userSignUp)
router.post("/userLogin",userDataValidationMiddleWare,user.userLogin)
router.get("/userProfileOwner",cookieCheckerMiddleWare,user.getUser);
router.get("/searchUser/profile", cookieCheckerMiddleWare, user.searchUserProfile)
router.get("/getUser/profile/:id", cookieCheckerMiddleWare, user.otherUserProfile)
router.get("/user/logout", cookieCheckerMiddleWare, user.userLogout);
router.get("/findUsers", cookieCheckerMiddleWare, user.getUsers)
router.post("/updateUser", user.updateUser)
//kj



////-~~~~~~~~~~~~~~~~~~~~~~~~ <BOOKS ROUTES>  ~~~~~~~~~~~~~~~~~~~~~~~~ ////
router.post("/uploadAnBook", cookieCheckerMiddleWare, bookDataValidationMiddleware,books.uploadBook)
router.get("/searchBook",cookieCheckerMiddleWare,books.searchBook)
router.get("/findBook/:id", cookieCheckerMiddleWare, books.getBook)
router.post('/uploadBookPdf',bookFiles.bookPdfUploader)
router.post('/uploadBookThumbnail', cookieCheckerMiddleWare, bookFiles.bookThumbnailImage)
router.get("/findBooks", cookieCheckerMiddleWare, books.getBooks)
router.delete("/deleteBook/:id", books.deleteAnBook)


/*
* exporting the module
*/

module.exports=router;