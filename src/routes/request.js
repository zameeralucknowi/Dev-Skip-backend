const express = require('express')
const router = express.Router();
const {userAuth} = require('../middlewares/auth')




router.post('/sendConnectionRequest', userAuth, async (req,res)=>{
    const loggedInUser = req.user;
    res.send('request sent by :'+ loggedInUser.firstName )
})


module.exports = router;