const userModel = require('../models/user.models');
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');

async function registerUser(req, res) {
   const { fullname: { firstname, lastname }, email, password } = req.body;

   const isUserAlreadyexists = await userModel.findOne({ email });

   if (isUserAlreadyexists) {
      return res.status(400).json({
         message: "User already exist"
      });
   }

   const hashpassword = await bcrypt.hash(password, 10);

   const user = await userModel.create({
      fullname: {
         firstname,
         lastname
      },
      email,
      password: hashpassword
   });

   const token = jwt.sign({ id: user._id }, process.env.Jwt_Secret);

   res.cookie('token', token);

   return res.status(201).json({
      message: "User registered Successfully",
      user: {
         email: user.email,
         _id: user._id,
         fullname: user.fullname
      }
   });
}

async function loginController(req, res) {
   const { email, password } = req.body;

   const user = await userModel.findOne({ email });

   if (!user) {
      return res.status(400).json({
         message: "Not registered",
      });
   }

   const isPasswordvalid = await bcrypt.compare(password, user.password);

   if (!isPasswordvalid) {
      return res.status(400).json({
         message: "Invalid email or password",
      });
   }

   const token = jwt.sign({ id: user._id }, process.env.Jwt_Secret);

   res.cookie('token', token);

   return res.status(200).json({
      message: "User loggedIn successfully",
      user: {
         email: user.email,
         _id: user._id,
         fullname: user.fullname
      }
   });
}

module.exports = { registerUser, loginController };
