const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const JWT_SECRET = "MehakisaGoodboy";
var jwt = require('jsonwebtoken');
const { isElementOfType } = require("react-dom/test-utils");
const { findOne } = require("../models/User");
const fetchuser = require("../middleware/fetchuser");

//ROUTE 1 : Create a User Using Post "/api/auth/createuser". No login required

router.post(
  "/createuser",
  //This is addded as a validation check for every variable .
  [
    body("name", "Enter a Valid Name").isLength({ min: 3 }),
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({ min: 5 }),
  ],
  //This is what should happen if we give this endpoint in our routes in express
  async (req, res) => {
    let success = false ;
    //If there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success , errors: errors.array() });
    }
    //Check whether the user with same email already exists
    try {
      let user = await User.findOne({ email: req.body.email }); // Checking the input of the body 
      if (user) {
        return res
          .status(400)
          .json({ success , error: "Sorry the user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10) ;
      const secPass = await bcrypt.hash(req.body.password , salt)
      //Create a new user
      user = await User.create({ // await for creating the data entry via the mongo model
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
          user:{
              id:user.id
          }
      }

      const authtoken = jwt.sign(data , JWT_SECRET) ;
      success = true ;
      res.json({success , authtoken : authtoken});
       
    } catch (error) { // If there is any error .
      console.error(error.message);
      res.status(00).send("Some error occured");
    }
  }
);

//ROUTE 2 : Authenticate a User Using Post "/api/auth/login". No login required
router.post('/login' ,[
    body('email' , "Enter a Valid email").isEmail() ,
    body("password", "Password cannot be Blank").exists()
] ,async (req , res)=>{
    let success = false ;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success , errors: errors.array() });
    }
    const {email , password} = req.body ;
    try {
        let user = await User.findOne({email}) ;
        if(!user) {
            return res.status(400).send({success , message:'Please Enter the correct login credentials'});
        }
        const passwordCompare = await bcrypt.compare(password , user.password);
        if(!passwordCompare) {
            return res.status(400).send({success , message:'Please Enter the correct Password'});
        }
        const data = {
            user:{
                id:user.id 
            }
        }
        const authtoken = jwt.sign(data , JWT_SECRET) ;
        success = true ;
        res.json({success , authtoken : authtoken});
      
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured");
    }

})

//ROUTE 3 : Get logged in user details using POST "api/auth/getuser" , Login Required
router.post("/getuser" ,fetchuser, async(req , res) => {
     //If there are errors return bad request and the errors
    //  const errors = validationResult(req);
    //  if (!errors.isEmpty()) {
    //    return res.status(400).json({ errors: errors.array() });
    //  }
     try {
         const userId = req.user.id ;
         const user = await User.findById(userId).select("-password");
         res.send(user)
     } catch (error) {
        console.error(error.message);
        res.status(400).send("Internal Server error occured");
    }
})

module.exports = router;
