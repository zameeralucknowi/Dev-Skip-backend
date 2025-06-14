require('dotenv').config();
const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {validateSignupData} = require('../utils/validation');


router.post('/signup', async (req, res) => {
    try {
        //validate the request
        validateSignupData(req);
        const { firstName, lastName, emailId, password } = req.body;
        //encrpyt passwords
        const hashedPassword = await bcrypt.hash(password, 10);
        //creating a new instance of user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password : hashedPassword
        });
        const savedUser =  await user.save();

        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'3d'});
        res.cookie('token',token,
            {expires:new Date(Date.now() + 24 * 3600000),
                  httpOnly: true,
                  sameSite: 'None',    // IMPORTANT for cross-site requests
                  secure: true         // IMPORTANT for HTTPS-only (Render uses HTTPS)
            }         
        );
        res.status(201).json({message:'user created successfully',data:savedUser})

    } catch (error) {
        res.status(400).send('Error : ' + error.message)
    }
})

router.post('/login', async(req,res)=>{
    try {
        const {emailId,password} = req.body;
        const user = await User.findOne({emailId:emailId});
        if(!user)
        throw new Error('User does not exist');
        const isValidPassword = await bcrypt.compare(password,user.password);
        if(!isValidPassword)
        throw new Error('Invalid credentials');
        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'3d'});
        res.cookie('token',token,
            {expires:new Date(Date.now() + 24 * 3600000),
                  httpOnly: true,
                  sameSite: 'None',    // IMPORTANT for cross-site requests
                  secure: true         // IMPORTANT for HTTPS-only (Render uses HTTPS)
            }         
        );
        res.status(200).json({message:'login successfully', data:user})
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.post('/logout',(req,res) =>{
    res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'None'
  });
    res.status(200).send('logout was successfull')
})


module.exports = router;