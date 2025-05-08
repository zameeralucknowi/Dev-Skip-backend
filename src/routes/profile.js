const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt')
const {userAuth} = require('../middlewares/auth');
const {validateEditData} = require('../utils/validation')


router.get('/view', userAuth, async(req,res) =>{
    try {
        const user = req.user;
        res.status(200).send(user);
        
    } catch (error) {
        res.status(400).send('Error : ' + error.message)
    }
})

router.patch('/edit', userAuth ,async (req,res) =>{
    try {
        validateEditData(req);
        const loggedInUser = req.user;
       
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key])
     
        await loggedInUser.save();
        res.status(200).json({
        message:`${loggedInUser.firstName} Your profile was updated`,
        data:loggedInUser})
    } catch (error) {
        res.status(400).send('Error : ' + error.message)
    }
})

router.patch('/password', userAuth,  async(req,res) =>{

    try {
        const { password } = req.body;
        const loggedInUser = req.user;
        const hashedPassword = await bcrypt.hash(password,10);
        loggedInUser.password = hashedPassword;
        await loggedInUser.save();
        res.status(200).json({
            message : `${loggedInUser.firstName} Your Password is updated`,
            data : loggedInUser
        })
        
    } catch (error) {
        res.status(400).send('Error : ' + error.message)
    }
})

module.exports = router;