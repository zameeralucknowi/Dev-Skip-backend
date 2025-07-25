const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const Message = require('../models/message')
const Conversation = require('../models/conversation')
const USER_SAFE_DATA = ["firstName","lastName","photoUrl","about","age","gender","skills"];

router.get('/request/recieved',userAuth, async(req,res)=>{
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status : 'dope'
        }).populate('fromUserId', USER_SAFE_DATA);

        return res.status(200).json({message:`all requests recieved`,data :connectionRequests})
    } catch (error) {
        res.status(400).send('Error : ' + error.message)
    }
})

router.get('/request/connections',userAuth,async(req,res)=>{
    try {
        const loggedInUser = req.user;
        const allConnections = await ConnectionRequest.find({
            status : 'accepted',
            $or : [
                {fromUserId : loggedInUser._id},
                {toUserId:loggedInUser._id},
            ],
        })
        .populate('fromUserId',USER_SAFE_DATA)
        .populate('toUserId',USER_SAFE_DATA);

        const data = allConnections.map(ele=> {
            if(ele.fromUserId._id.toString() === loggedInUser._id.toString())
            return ele.toUserId;
            else
            return ele.fromUserId;
        });     
        return res.status(200).json({message:'all connections',data : data})
    } catch (error) {
        res.status(400).send('Error : ' + error.message)
    }
});

router.get('/feed', userAuth, async (req,res)=>{
    try {
        const loggedInUser = req.user;
        const {page} = req.query || 1;
        let {limit} = req.query  || 10;
        limit = limit>50 ? 50 : limit;
        const skip = (page-1)*limit;

        const connectionRequests = await ConnectionRequest.find({
            $or : [
                {fromUserId : loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select('fromUserId toUserId');

        const hideConnections = new Set();

        connectionRequests.forEach(obj=>{
            hideConnections.add(obj.fromUserId);
            hideConnections.add(obj.toUserId);
        })

        const users = await User.find({
            $and : [
            {_id : {$nin : Array.from(hideConnections)}},
            {_id : {$ne : loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);  
        res.status(200).json({message:'users feed ',data : users})
    } catch (error) {
        res.status(400).send('Error : ' + error.message)
    }
})

router.get('/messages/:senderId/:recieverId',async (req,res)=>{
    try {
        const {senderId,recieverId} = req.params;

        let conversation = await Conversation.findOne({
            participants: {$all:[senderId,recieverId]}
        }).populate('messages')

        if(!conversation){
          return res.status(200).json({data:[],message:'no messages yet'});
        }

        const allMessages = conversation?.messages;
        res.status(200).json({data:allMessages, message:'all messages'});     
    } catch (error) {
        console.log(error);
    }

})





module.exports = router;
