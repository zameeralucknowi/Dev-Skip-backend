const express = require('express')
const router = express.Router();
const {userAuth} = require('../middlewares/auth')


router.get('/profile', userAuth, async(req,res) =>{
    try {
        const user = req.user;
        res.status(200).send(user);
        
    } catch (error) {
        res.status(400).send('Error : ' + error.message)
    }
})

module.exports = router;