const {z}=require("zod")
const json=require("jsonwebtoken")
const userDataChecker=z.object({
  username:z.string().min(2).max(40).optional(),
  email:z.string().email(),
  password:z.string().min(5).max(20),
  userProfilePicture:z.string().url().optional(),
  bio:z.string().optional(),
  number:z.string().optional(),
  address:z.string().optional()

})

const userDataValidationMiddleWare=(req,res,next)=>{
  try{
  const validData=userDataChecker.safeParse(req.body)
    if (validData.success){
      next()
    }
    else{
    return res.status(400).json({
      "error":"please enter valid data"
    })
  }
}
catch(error){
  res.sendStatus(400);
}
}
const cookieCheckerMiddleWare=(req,res,next)=>{
  try{
    const isCookie=req.cookies.cookieToken;
    if(!isCookie){
      return res.status(401).json({message:"Unauthorized"})
      }
    const  decodedData=json.verify(isCookie,process.env.SECRET_KEY);
    if(!decodedData){
      return res.status(401).json({ message: "Unauthorized" })

      }
      else{
        next();
      }
    }
  catch(error){
    return res.status(401).json({ message: "Unauthorized" })

  }
}

module.exports={userDataValidationMiddleWare,cookieCheckerMiddleWare}