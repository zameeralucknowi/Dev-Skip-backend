const express = require('express')
const router = express.Router();
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');


router.post('/send/:status/:toUserId', userAuth, async (req,res)=>{
    try {
        const fromUser = req.user;
        const fromUserId = fromUser._id;
        const {status} = req.params;
        //adding validation for status
        const statusMap = new Map([
            ['nope',true],
            ['dope',true]
        ])
        if(!statusMap.has(status)){
            return res.status(400).json({message:`${status} status type is not valid`});
        }
        //validate for sending request for urself
        const {toUserId} = req.params;
        if(fromUserId.toString()===toUserId)
        return res.status(400).json({message:'Cannot send request to yourself'})

        const toUser = await User.findById(toUserId);
        if(!toUser)
        return res.status(404).json({message:`User does'nt exists`})
        // validate for already connection request exists and other user validation for request
        const isAlreadyConnected = await ConnectionRequest.findOne(
            {
                $or : [
                    {fromUserId,toUserId},
                    {fromUserId :toUserId,toUserId:fromUserId}
                ]
            }
        )
        if(isAlreadyConnected)
        return res.status(403).json({message :'Connection already exists'});
        const newConnectionRequest = new ConnectionRequest({fromUserId, toUserId, status});
        // while saving to db makes a call to pre schema validation - save event listener
        const data = await newConnectionRequest.save();
        res.status(201).json({
            message : `${fromUser.firstName} sent connection request to ${toUser.firstName} successfully`,
            data : data
        }) 
    } catch (error) {
        res.status(400).send('Error : ' + error.message)
    }
})

router.post('/review/:status/:requestId', userAuth,async(req,res) =>{
    try {
        // validate the dynamic status
        const loggedInUser = req.user;
        const {status,requestId} = req.params;
        const statusMap = new Map([
            ['accepted',true],
            ['rejected',true]
        ])
        if(!statusMap.has(status))
        return res.status(400).json({message:`${status} status type is not valid`});

        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : 'dope'
        })
        if(!connectionRequest)
        return res.status(404).json({message:`Connection request does'nt exists`});
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        return res.status(200).json({message:`Connection request ${status}`,data:data});
    } catch (error) {
        res.status(400).send('Error : ' + error.message)
    }
})


module.exports = router;